# Copyright (c) 2024, YZ and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class Client(Document):
    def calculate_targets(self):
        settings = frappe.get_single("PT Settings")

        # Default fallback values if settings are empty
        defaults = {
            'height': 175,
            'weight': 80,
            'gender': 'Male',
            'goal': 'Weight Loss',
            'age': 30,
            'activity_factor_sedentary': 1.2,
            'activity_factor_light': 1.375,
            'activity_factor_moderate': 1.55,
            'activity_factor_very': 1.725,
            'activity_factor_extra': 1.9
        }

        # Get client values or defaults
        gender = self.gender if self.gender else settings.default_gender or defaults[
            'gender']
        goal = self.goal if self.goal else settings.default_goal or defaults['goal']
        height = self.height if self.height else settings.default_height or defaults[
            'height']
        weight = self.weight[-1].weight if self.weight else settings.default_weight or defaults['weight']
        age = self.age if self.age else settings.default_age or defaults['age']

        # Get activity factor based on activity level
        activity_factors = {
            'Sedentary': settings.activity_factor_sedentary or defaults['activity_factor_sedentary'],
            'Light': settings.activity_factor_light or defaults['activity_factor_light'],
            'Moderate': settings.activity_factor_moderate or defaults['activity_factor_moderate'],
            'Very Active': settings.activity_factor_very or defaults['activity_factor_very'],
            'Extra Active': settings.activity_factor_extra or defaults['activity_factor_extra']
        }
        activity_factor = activity_factors.get(
            self.activity_level, defaults['activity_factor_sedentary'])

        # Calculate BMI
        height_in_meters = int(height) / 100
        bmi = weight / (height_in_meters ** 2)

        # Calculate BMR using Mifflin-St Jeor Equation
        if gender == 'Male':
            bmr = (settings.bmr_weight_multiplier or 10) * weight + \
                  (settings.bmr_height_multiplier or 6.25) * int(height) - \
                  (settings.bmr_age_multiplier or 5) * int(age) + \
                  (settings.bmr_male_constant or 5)
        else:  # Female
            bmr = (settings.bmr_weight_multiplier or 10) * weight + \
                  (settings.bmr_height_multiplier or 6.25) * int(height) - \
                  (settings.bmr_age_multiplier or 5) * int(age) - \
                  (settings.bmr_female_constant or 161)

        # Calculate TDEE
        tdee = bmr * activity_factor

        # Get goal-based multipliers and adjustments
        goal_adjustments = {
            'Weight Loss': {
                'calorie_adjustment': settings.weight_loss_calorie_deficit or -500,
                'protein_multiplier': settings.protein_multiplier_loss or 2.2,
                'carb_multiplier': settings.carb_multiplier_loss or 2.5,
                'fat_multiplier': settings.fat_multiplier_loss or 0.8
            },
            'Muscle Building': {
                'calorie_adjustment': settings.muscle_gain_calorie_surplus or 300,
                'protein_multiplier': settings.protein_multiplier_building or 2.2,
                'carb_multiplier': settings.carb_multiplier_building or 4.0,
                'fat_multiplier': settings.fat_multiplier_building or 0.9
            },
            'Weight Gain': {
                'calorie_adjustment': settings.weight_gain_calorie_surplus or 500,
                'protein_multiplier': settings.protein_multiplier_gain or 2.0,
                'carb_multiplier': settings.carb_multiplier_gain or 4.5,
                'fat_multiplier': settings.fat_multiplier_gain or 1.0
            },
            'Maintenance': {
                'calorie_adjustment': 0,
                'protein_multiplier': settings.protein_multiplier_maintenance or 1.8,
                'carb_multiplier': settings.carb_multiplier_maintenance or 3.5,
                'fat_multiplier': settings.fat_multiplier_maintenance or 0.9
            }
        }

        # Apply goal-specific adjustments
        adjustments = goal_adjustments.get(
            goal, goal_adjustments['Maintenance'])
        target_calories = tdee + adjustments['calorie_adjustment']

        # Calculate macronutrients
        proteins = weight * adjustments['protein_multiplier']
        fats = weight * adjustments['fat_multiplier']

        # Calculate remaining calories for carbs
        protein_calories = proteins * (settings.protein_calories_per_gram or 4)
        fat_calories = fats * (settings.fat_calories_per_gram or 9)
        remaining_calories = target_calories - protein_calories - fat_calories
        carbs = remaining_calories / (settings.carb_calories_per_gram or 4)

        # Water calculation
        base_water = weight * (settings.water_multiplier or 35)
        activity_water_adjustments = {
            'Very Active': settings.water_bonus_very_active or 500,
            'Extra Active': settings.water_bonus_extra_active or 750,
            'Moderate': settings.water_bonus_moderate or 250,
            'Light': settings.water_bonus_light or 0,
            'Sedentary': 0
        }
        water = base_water + \
            activity_water_adjustments.get(self.activity_level, 0)

        # Store results
        self.bmi = round(bmi, 1)
        self.bmr = round(bmr)
        self.tdee = round(tdee)
        adjustment_factor = self.factor if self.factor and self.factor > 0 else 1.0
        self.target_energy = round(target_calories * adjustment_factor)
        self.target_proteins = round(proteins * adjustment_factor)
        self.target_carbs = round(carbs * adjustment_factor)
        self.target_fats = round(fats * adjustment_factor)
        self.target_water = round(water * adjustment_factor)

    def validate(self):
        # Default image based on gender
        if not self.image:
            if self.gender == "Male":
                self.image = '/assets/personal_trainer_app/images/male_default.png'
            elif self.gender == "Female":
                self.image = '/assets/personal_trainer_app/images/female_default.png'

        # Calculate age based on date_of_birth
        if self.date_of_birth:
            self.age = frappe.utils.getdate().year - frappe.utils.getdate(self.date_of_birth).year
            if (frappe.utils.getdate().month, frappe.utils.getdate().day) < (frappe.utils.getdate(self.date_of_birth).month, frappe.utils.getdate(self.date_of_birth).day):
                self.age -= 1

        # Call the target calculation if adjust is not set
        if not self.adjust:
            self.calculate_targets()

        # Referral Validation Logic
        if self.referred_by and self.has_value_changed("referred_by"):
            # Proceed with referral logic only if `referred_by` has changed
            if self.referred_by:
                # Prevent referring oneself
                if self.referred_by == self.name:
                    frappe.response["error"] = "You cannot refer yourself."
                    raise frappe.ValidationError("You cannot refer yourself.")

                # Check if the referred user exists
                if not frappe.db.exists("Client", self.referred_by):
                    raise frappe.ValidationError("Referral code does not exist.")

                # Check for circular referrals (i.e., Friend A refers Friend B, and Friend B refers back to Friend A)
                if frappe.db.exists("Client", {"name": self.referred_by, "referred_by": self.name}):
                    raise frappe.ValidationError("Circular referral detected.")