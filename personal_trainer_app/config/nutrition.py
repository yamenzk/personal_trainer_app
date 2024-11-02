# personal_trainer_app/personal_trainer_app/config/nutrition.py

from __future__ import unicode_literals
import frappe

NUTRIENT_MAPPING = {
    'energy': [
        'Energy (Atwater Specific Factors)',
        'Energy (Atwater General Factors)',
        'Energy',
        'energy',
        'ENERGY',
        'Calories',
        'calories',
        'kcal'
    ],
    'carbs': [
        'Carbohydrate, by difference',
        'Carbohydrates',
        'carbohydrates',
        'Carbs',
        'carbs'
    ],
    'protein': [
        'Protein',
        'protein',
        'PROTEIN'
    ],
    'fat': [
        'Total lipid (fat)',
        'Fat',
        'fat',
        'Lipids',
        'lipids'
    ]
}

# Function to get nutrient mappings with possibility to override from Custom Settings
def get_nutrient_mappings():
    """
    Get nutrient mappings with possible customizations from settings
    Returns:
        dict: Nutrient name mappings
    """
    return NUTRIENT_MAPPING