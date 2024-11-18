# Copyright (c) 2024, YZ and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import format_date, getdate, add_days, nowdate, get_first_day_of_week, get_last_day_of_week
from personal_trainer_app.config.nutrition import get_nutrient_mappings
import json

class Plan(Document):
    def before_save(self):
        self.old_food_hash = self.get('__food_hash')
    def before_insert(self):
        # Fetch membership details
        membership = frappe.get_doc('Membership', self.membership)
        membership_start = getdate(membership.start)

        # Fetch existing plan docs for the same client and membership
        existing_plans = frappe.get_all('Plan', filters={
            'client': self.client,
            'membership': self.membership
        }, fields=['start', 'end'], order_by='end desc')

        # Determine the start date for the new plan
        if existing_plans:
            # Get the plan with the latest 'end' date
            last_plan = existing_plans[0]
            last_end_date = getdate(last_plan['end'])
            # Nearest Monday after the last plan end date
            self.start = get_first_day_of_week(add_days(last_end_date, 1))
        else:
            # Set the start date to the nearest Monday AFTER the membership start
            first_monday = get_first_day_of_week(membership_start)

            # If membership start is not a Monday, move to the next Monday
            if first_monday < membership_start:
                self.start = add_days(first_monday, 7)
            else:
                self.start = first_monday

        # Set the end date to the following Sunday
        self.end = get_last_day_of_week(self.start)

        # Set the status based on the current date
        current_date = getdate(nowdate())
        if self.start <= current_date <= self.end:
            self.status = 'Active'
        elif current_date > self.end:
            self.status = 'Completed'
        else:
            self.status = 'Scheduled'

        # Generate the title field
        client = frappe.get_doc('Client', self.client)

        # Initialize the first and last name parts
        first_name = ""
        last_name_part = ""

        # Check if the client has a name
        if client.client_name:
            client_name = client.client_name.split()
            
            # Set full first name
            if len(client_name) > 0:
                first_name = client_name[0]  # Full first name
            
            # Set first two letters of last name if available
            if len(client_name) > 1:
                last_name_part = client_name[-1][:2].upper()  # First two letters of last name

        # Format date components
        start_dd_mm = format_date(self.start, "dd/MM")
        end_dd_mm = format_date(self.end, "dd/MM")
        year = format_date(self.start, "YY")

        # Construct the title in the desired format
        self.title = f"{first_name}{last_name_part}@{start_dd_mm}-{end_dd_mm}#{year}"

        # Set rest days based on weekly_workouts count
        if 6 >= self.weekly_workouts >= 3:
            self.d7_rest = 1
            if self.weekly_workouts < 6:
                self.d6_rest = 1
            if self.weekly_workouts < 5:
                self.d5_rest = 1
            if self.weekly_workouts < 4:
                self.d4_rest = 1

@frappe.whitelist()
def update_plan_statuses():
    """
    Update status of all plans based on current date
    """
    current_date = getdate(nowdate())
    plans = frappe.get_all('Plan', filters={'status': ['!=', 'Completed']})
    for plan in plans:
        plan_doc = frappe.get_doc('Plan', plan.name)
        if plan_doc.start <= current_date <= plan_doc.end:
            plan_doc.status = 'Active'
        elif current_date > plan_doc.end:
            plan_doc.status = 'Completed'
        else:
            plan_doc.status = 'Scheduled'
        plan_doc.save()
    frappe.db.commit()


@frappe.whitelist()
def calculate_all_nutritional_totals(all_food_data):
    """
    Calculate nutritional totals for plan doctype food tables based on macros
    Args:
        all_food_data (dict): Dictionary with table_ids (d1_f, d2_f, etc) as keys and list of food items as values
    Returns:
        dict: Nutritional totals for each table
    """
    if isinstance(all_food_data, str):
        all_food_data = json.loads(all_food_data)

    # Get nutrient mappings from config
    NUTRIENT_MAPPING = get_nutrient_mappings()

    # Collect all unique food docnames
    all_food_docnames = {
        item['food_docname'] 
        for table_data in all_food_data.values() 
        for item in table_data
    }

    # Bulk fetch all food documents
    food_docs = {}
    if all_food_docnames:
        food_list = frappe.get_all(
            'Food',
            filters={'name': ['in', list(all_food_docnames)]},
            fields=['name']
        )
        
        food_docs = {
            doc.name: frappe.get_doc('Food', doc.name) 
            for doc in food_list
        }

    def find_nutrient_value(facts, nutrient_type):
        """
        Helper function to find nutrient value using the mapping
        Args:
            facts (list): List of nutritional facts
            nutrient_type (str): Type of nutrient to find
        Returns:
            float: Nutrient value or 0 if not found
        """
        for fact in facts:
            if any(variation in fact.nutrient for variation in NUTRIENT_MAPPING[nutrient_type]):
                return fact.value
        return 0

    # Pre-process nutritional facts for each food
    food_nutrients = {}
    for food_name, food_doc in food_docs.items():
        nutrients = {}
        if food_doc.nutritional_facts:
            # Find values for each nutrient type using the mapping
            for nutrient_type in ['carbs', 'protein', 'fat']:
                nutrients[nutrient_type] = find_nutrient_value(food_doc.nutritional_facts, nutrient_type)
        
        # Calculate energy based on macros
        nutrients['energy'] = (
            nutrients.get('carbs', 0) * 4 + 
            nutrients.get('protein', 0) * 4 + 
            nutrients.get('fat', 0) * 9
        )

        food_nutrients[food_name] = nutrients

    # Calculate totals for each table
    results = {}
    for table_id, food_data in all_food_data.items():
        totals = {'energy': 0, 'carbs': 0, 'protein': 0, 'fat': 0}
        
        for item in food_data:
            food_name = item['food_docname']
            if food_name in food_nutrients:
                amount_multiplier = float(item['amount_in_grams']) / 100
                nutrients = food_nutrients[food_name]
                
                for nutrient_key in totals:
                    if nutrient_key in nutrients:
                        totals[nutrient_key] += nutrients[nutrient_key] * amount_multiplier
        
        results[table_id] = totals

    return results