from __future__ import unicode_literals
from typing import Dict, List, Optional, Any, TypedDict, Tuple, Set
import hashlib
import frappe
from personal_trainer_app.config.nutrition import get_nutrient_mappings

# Type definitions
class NutritionFact(TypedDict):
    value: float
    unit: str

class DailyTotals(TypedDict):
    energy: NutritionFact
    protein: NutritionFact
    carbs: NutritionFact
    fat: NutritionFact

# Constants
NUTRIENTS = ('energy', 'protein', 'carbs', 'fat')
DEFAULT_UNITS = {'energy': 'kcal', 'protein': 'g', 'carbs': 'g', 'fat': 'g'}
KCAL_TO_KJ = 4.184

class MembershipCache:
    def __init__(self):
        self.LIBRARY_CACHE_TIMEOUT = 86400 * 7  # 7 days for foods and exercises
        self.MEMBERSHIP_CACHE_TIMEOUT = 3600 * 24  # 24 hours for membership data
        
    def get_cache_key(self, prefix: str, *args) -> str:
        """Generate a consistent cache key"""
        key_parts = [str(arg) for arg in args]
        key_string = f"{prefix}:{':'.join(key_parts)}"
        return hashlib.md5(key_string.encode()).hexdigest()

    def get_membership_cache_key(self, membership_id: str) -> str:
        """Get cache key for membership data"""
        return f"membership_data:{membership_id}"

    def get_plans_version_key(self, membership_id: str) -> str:
        """Get version key for membership's plans"""
        return f"plans_version:{membership_id}"

    def get_library_cache_key(self, item_type: str, item_id: str) -> str:
        """Get cache key for library items (foods/exercises)"""
        return f"library:{item_type}:{item_id}"

    def get_membership_version(self, membership_id: str) -> str:
        """Get version hash based on membership, client, and plans data"""
        try:
            CODE_VERSION = "1.1"
            membership_doc = frappe.get_doc("Membership", membership_id)
            client_doc = frappe.get_doc("Client", membership_doc.client)
            
            plans = frappe.get_all(
                "Plan",
                filters={"membership": membership_id},
                fields=["name", "modified", "modified_by"]
            )
            
            version_parts = [
                f"v:{CODE_VERSION}",
                f"m:{membership_doc.modified}:{membership_doc.modified_by}",
                f"c:{client_doc.modified}:{client_doc.modified_by}",
                f"p:{len(plans)}",
                f"l:{max(p.modified for p in plans) if plans else 'none'}"
            ]
            
            return hashlib.md5(":".join(version_parts).encode()).hexdigest()
        except Exception as e:
            frappe.log_error(f"Error generating membership version: {str(e)}")
            return None

    def get_cached_membership_data(self, membership_id: str) -> Optional[Dict[str, Any]]:
        """Get cached membership data if valid"""
        cache_key = self.get_membership_cache_key(membership_id)
        version_key = self.get_plans_version_key(membership_id)
        
        cached_data = frappe.cache().get_value(cache_key)
        cached_version = frappe.cache().get_value(version_key)
        current_version = self.get_membership_version(membership_id)
        
        if cached_data and cached_version and cached_version == current_version:
            return cached_data
        return None

    def set_cached_membership_data(self, membership_id: str, data: Dict[str, Any]) -> None:
        """Cache membership data with version"""
        cache_key = self.get_membership_cache_key(membership_id)
        version_key = self.get_plans_version_key(membership_id)
        current_version = self.get_membership_version(membership_id)
        
        if current_version:
            frappe.cache().set_value(
                cache_key, 
                data, 
                expires_in_sec=self.MEMBERSHIP_CACHE_TIMEOUT
            )
            frappe.cache().set_value(
                version_key, 
                current_version, 
                expires_in_sec=self.MEMBERSHIP_CACHE_TIMEOUT
            )

    def get_cached_library_item(self, item_type: str, item_id: str) -> Optional[Dict[str, Any]]:
        """Get cached library item (food/exercise)"""
        cache_key = self.get_library_cache_key(item_type, item_id)
        return frappe.cache().get_value(cache_key)

    def set_cached_library_item(self, item_type: str, item_id: str, data: Dict[str, Any]) -> None:
        """Cache library item with longer timeout"""
        cache_key = self.get_library_cache_key(item_type, item_id)
        frappe.cache().set_value(
            cache_key,
            data,
            expires_in_sec=self.LIBRARY_CACHE_TIMEOUT
        )

    def invalidate_membership_cache(self, membership_id: str) -> None:
        """Invalidate membership related cache"""
        cache_key = self.get_membership_cache_key(membership_id)
        version_key = self.get_plans_version_key(membership_id)
        frappe.cache().delete_value([cache_key, version_key])

    def invalidate_client_caches(self, client_id: str) -> None:
        """Invalidate all membership caches for a client"""
        memberships = frappe.get_all(
            "Membership",
            filters={"client": client_id},
            fields=["name"]
        )
        for membership in memberships:
            self.invalidate_membership_cache(membership.name)

def extract_base_nutrition(food_doc: Any, nutrient_mappings: Dict[str, List[str]]) -> Optional[Dict[str, NutritionFact]]:
    """Extract base nutrition facts (per 100g) from food document"""
    try:
        facts = food_doc.get('nutritional_facts')
        if not facts:
            return None

        facts_lookup = {fact.nutrient: fact for fact in facts}
        base_facts = {}

        for macro_name, variations in nutrient_mappings.items():
            for nutrient in variations:
                if fact := facts_lookup.get(nutrient):
                    value = fact.value
                    if macro_name == 'energy' and fact.unit.lower() != 'kcal':
                        value /= KCAL_TO_KJ
                    base_facts[macro_name] = {
                        'value': round(value, 1),
                        'unit': 'kcal' if macro_name == 'energy' else fact.unit
                    }
                    break

        return base_facts
    except Exception as e:
        frappe.log_error(f"Error extracting base nutrition for food {food_doc.name}: {str(e)}")
        return None

def calculate_nutrition_for_amount(base_nutrition: Dict[str, NutritionFact], amount: float) -> Dict[str, NutritionFact]:
    """Calculate nutrition facts for a specific amount based on base nutrition (per 100g)"""
    amount_ratio = amount / 100
    return {
        nutrient: {
            'value': round(facts['value'] * amount_ratio, 1),
            'unit': facts['unit']
        }
        for nutrient, facts in base_nutrition.items()
    }


def process_exercise_data(exercise_doc: Any) -> Dict[str, Any]:
    """Process exercise data for reference"""
    return {
        'category': exercise_doc.category,
        'equipment': exercise_doc.equipment,
        'force': exercise_doc.force,
        'mechanic': exercise_doc.mechanic,
        'level': exercise_doc.level,
        'primary_muscle': exercise_doc.primary_muscle,
        'thumbnail': exercise_doc.thumbnail,
        'starting': exercise_doc.starting,
        'ending': exercise_doc.ending,
        'video': exercise_doc.video,
        'instructions': exercise_doc.instructions,
        'secondary_muscles': [{'muscle': m.muscle} for m in exercise_doc.secondary_muscles]
    }

def process_exercise_data_cached(exercise_name: str) -> Dict[str, Any]:
    """Cached version of exercise data processing"""
    cache = MembershipCache()
    
    cached_data = cache.get_cached_library_item("Exercise", exercise_name)
    if cached_data:
        return cached_data

    exercise_doc = frappe.get_doc("Exercise", exercise_name)
    processed_data = process_exercise_data(exercise_doc)
    cache.set_cached_library_item("Exercise", exercise_name, processed_data)
    
    return processed_data

def process_food_reference_data_cached(food_id: str) -> Dict[str, Any]:
    """Cached version of food reference data processing"""
    cache = MembershipCache()
    
    cached_data = cache.get_cached_library_item("Food", food_id)
    if cached_data:
        return cached_data

    food_doc = frappe.get_doc("Food", food_id)
    base_nutrition = extract_base_nutrition(food_doc, get_nutrient_mappings())
    processed_data = {
        'title': food_doc.title,
        'image': food_doc.image,
        'category': food_doc.category,
        'description': food_doc.description
    }
    if base_nutrition:
        processed_data['nutrition_per_100g'] = base_nutrition
    cache.set_cached_library_item("Food", food_id, processed_data)
    
    return processed_data

def process_food_instance(food_item: Any, food_reference_data: Dict[str, Any]) -> Dict[str, Any]:
    """Process food instance with calculated nutrition"""
    base_nutrition = food_reference_data.get('nutrition_per_100g')
    nutrition = (calculate_nutrition_for_amount(base_nutrition, float(food_item.amount))
                if base_nutrition else None)
    
    return {
        'meal': food_item.meal,
        'ref': food_item.food,
        'amount': food_item.amount,
        'nutrition': nutrition
    }

def process_exercise_performance(performance_docs: List[Any]) -> Dict[str, List[Dict[str, Any]]]:
    """Process exercise performance data into a dictionary"""
    performance_data = {}
    
    for doc in performance_docs:
        entry = {
            'weight': doc.weight,
            'reps': doc.reps,
            'date': doc.date
        }
        
        if doc.exercise not in performance_data:
            performance_data[doc.exercise] = []
        
        performance_data[doc.exercise].append(entry)
    
    return performance_data

def process_exercise_instance(exercise_item: Any, performance_data: Dict[str, List[Dict[str, Any]]]) -> Dict[str, Any]:
    """Process exercise instance data with performance references"""
    return {
        'ref': exercise_item.exercise,
        'sets': exercise_item.sets,
        'reps': exercise_item.reps,
        'rest': exercise_item.rest,
    }

def process_day_exercises(exercises: List[Any], performance_data: Dict[str, List[Dict[str, Any]]]) -> List[Dict[str, Any]]:
    """Process exercises for a day with supersets handling and performance data"""
    processed_exercises = []
    current_superset = []

    for exercise in exercises:
        exercise_data = process_exercise_instance(exercise, performance_data)
        
        if exercise.super == 1:
            current_superset.append(exercise_data)
        else:
            if current_superset:
                processed_exercises.append({
                    'type': 'superset',
                    'exercises': current_superset.copy()
                })
                current_superset = []
            processed_exercises.append({
                'type': 'regular',
                'exercise': exercise_data
            })

    if current_superset:
        processed_exercises.append({
            'type': 'superset',
            'exercises': current_superset
        })

    return processed_exercises

def calculate_daily_totals(foods: List[Dict[str, Any]]) -> DailyTotals:
    """Calculate nutrition totals for a day"""
    totals = {nutrient: {'value': 0, 'unit': DEFAULT_UNITS[nutrient]} for nutrient in NUTRIENTS}
    
    for food in foods:
        if nutrition := food.get('nutrition'):
            for nutrient in NUTRIENTS:
                if nutrient in nutrition:
                    totals[nutrient]['value'] += nutrition[nutrient]['value']
    
    return {n: {'value': round(t['value'], 1), 'unit': t['unit']} for n, t in totals.items()}

def process_plan_data(plan_doc: Any) -> Dict[str, Any]:
    """Process plan data with optimized structure"""
    return {
        'plan_name': plan_doc.name,
        'start': plan_doc.start,
        'end': plan_doc.end,
        'targets': {
            'proteins': plan_doc.target_proteins,
            'carbs': plan_doc.target_carbs,
            'fats': plan_doc.target_fats,
            'energy': plan_doc.target_energy,
            'water': plan_doc.target_water
        },
        'config': {
            'equipment': plan_doc.equipment,
            'goal': plan_doc.goal,
            'weekly_workouts': plan_doc.weekly_workouts,
            'daily_meals': plan_doc.daily_meals
        },
        'status': plan_doc.status
    }

def process_plan_day(
    plan_doc: Any,
    day: int,
    food_references: Dict[str, Any],
    exercise_references: Dict[str, Any],
    performance_data: Dict[str, List[Dict[str, Any]]]
) -> Dict[str, Any]:
    """Process a single day of a plan efficiently with performance data"""
    day_exercises = plan_doc.get(f"d{day}_e", [])
    day_foods = plan_doc.get(f"d{day}_f", [])

    processed_foods = [
        process_food_instance(food, food_references[food.food])
        for food in day_foods
    ]

    return {
        'exercises': process_day_exercises(day_exercises, performance_data),
        'foods': processed_foods,
        'totals': calculate_daily_totals(processed_foods)
    }

def process_plans_batch(plan_docs: List[Any]) -> Tuple[Dict[str, Any], List[Dict[str, Any]]]:
    """Process multiple plans efficiently in batch"""
    reference_data = {'exercises': {}, 'foods': {}, 'performance': {}}
    processed_plans = []
    
    # Collect unique items efficiently
    all_exercises = {
        exercise.exercise 
        for plan in plan_docs 
        for day in range(1, 8)
        for exercise in plan.get(f"d{day}_e", [])
    }
    
    all_foods = {
        food.food 
        for plan in plan_docs 
        for day in range(1, 8)
        for food in plan.get(f"d{day}_f", [])
    }

    # Process reference data with caching
    for exercise_name in all_exercises:
        reference_data['exercises'][exercise_name] = process_exercise_data_cached(exercise_name)
    
    for food_id in all_foods:
        reference_data['foods'][food_id] = process_food_reference_data_cached(food_id)

    # Process exercise performance data
    performance_docs = frappe.get_all(
        "Performance Log",
        filters={"exercise": ["in", list(all_exercises)]},
        fields=["exercise", "weight", "reps", "date"]
    )
    for doc in performance_docs:
        if doc.exercise not in reference_data['performance']:
            reference_data['performance'][doc.exercise] = []
        reference_data['performance'][doc.exercise].append({
            'weight': doc.weight,
            'reps': doc.reps,
            'date': doc.date
        })

    # Process plans efficiently
    for plan_doc in plan_docs:
        plan_data = process_plan_data(plan_doc)
        plan_data['days'] = {
            f"day_{day}": process_plan_day(
                plan_doc, 
                day, 
                reference_data['foods'],
                reference_data['exercises'],
                reference_data['performance']
            )
            for day in range(1, 8)
        }
        processed_plans.append(plan_data)

    return reference_data, processed_plans

@frappe.whitelist(allow_guest=True)
def get_membership(membership: str) -> Dict[str, Any]:
    """Get comprehensive membership information with optimized data structure"""
    try:
        cache = MembershipCache()
        
        # Try to get cached membership data
        cached_data = cache.get_cached_membership_data(membership)
        if cached_data:
            return cached_data

        # Fetch and validate core documents
        membership_doc = frappe.get_doc("Membership", membership)
        if not membership_doc.active:
            return {"message": "Membership is not active."}

        client_doc = frappe.get_doc("Client", membership_doc.client)
        if not client_doc.enabled:
            return {"message": "Client is disabled."}

        # Get all plans
        plans = frappe.get_all(
            "Plan",
            filters={"membership": membership, "status": ["!=", "Scheduledx"]},
            fields=["*"]
        )
        plan_docs = [frappe.get_doc("Plan", plan.name) for plan in plans]

        # Process plans in batch
        reference_data, processed_plans = process_plans_batch(plan_docs)

        # Build response
        response_data = {
            'membership': {
                'name': membership_doc.name,
                'package': membership_doc.package,
                'client': membership_doc.client,
                'start': membership_doc.start,
                'end': membership_doc.end,
                'active': membership_doc.active,
            },
            'client': {
                **{k: v for k, v in client_doc.as_dict().items() if k not in {'exercise_performance', 'target_proteins', 'target_carbs', 'target_fats', 'target_energy', 'target_water'}},
                'current_weight': client_doc.weight[-1].weight if client_doc.weight else None,
                'weight': [{'weight': w.weight, 'date': w.date} for w in client_doc.weight]
            },
            'plans': processed_plans,
            'references': reference_data
        }

        # Cache the response
        cache.set_cached_membership_data(membership, response_data)
        
        return response_data
    except Exception as e:
        frappe.log_error(f"Error in get_membership: {str(e)}")
        return {"message": f"An error occurred: {str(e)}"}