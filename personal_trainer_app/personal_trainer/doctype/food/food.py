import frappe
import requests
from frappe.model.document import Document

class Food(Document):
    def before_insert(self):
        fdc_api = frappe.db.get_single_value('PT Settings', 'fdc_api')
        auto_image = frappe.db.get_single_value('PT Settings', 'auto_image')
        unsplash_api = frappe.db.get_single_value('PT Settings', 'unsplash_api')

        if not fdc_api:
            frappe.throw("API key for FDC is missing. Please configure it in the PT Settings.")

        try:
            url = f"https://api.nal.usda.gov/fdc/v1/food/{self.fdcid}?api_key={fdc_api}"
            response = requests.get(url)
            response.raise_for_status()
            data = response.json()

            if 'fdcId' not in data:
                frappe.throw("Invalid API response: Missing fdcId")

            # Set basic fields
            self.title = data['description'].split(',')[0].strip()
            self.description = data.get('description', '')
            if 'foodCategory' in data and 'description' in data['foodCategory']:
                self.category = data['foodCategory']['description']

            # Clear and update nutritional facts
            self.nutritional_facts = []
            for nutrient in data.get('foodNutrients', []):
                # Skip nutrient labels and categories
                if (nutrient.get('type') == 'FoodNutrient' and 
                    'amount' in nutrient and 
                    'nutrient' in nutrient and 
                    'name' in nutrient['nutrient'] and
                    'unitName' in nutrient['nutrient'] and
                    not nutrient['nutrient'].get('isNutrientLabel', False)):
                    
                    self.append('nutritional_facts', {
                        'nutrient': nutrient['nutrient']['name'][:140],  # Truncate to avoid field length issues
                        'value': nutrient['amount'],
                        'unit': nutrient['nutrient']['unitName']
                    })

            # Handle image fetching
            if auto_image and unsplash_api and not self.image:
                image_url = self.fetch_unsplash_image(self.title, unsplash_api)
                if image_url:
                    self.image = image_url

        except requests.exceptions.HTTPError as http_err:
            frappe.log_error(f"HTTP error occurred: {http_err}", "API Error")
            frappe.throw(f"Failed to retrieve food data: {http_err}")
        except Exception as err:
            frappe.log_error(f"An error occurred: {err}", "API Error")
            frappe.throw(f"An unexpected error occurred while fetching food data: {err}")

    def fetch_unsplash_image(self, title, unsplash_api):
        try:
            url = f"https://api.unsplash.com/search/photos?query={title}&client_id={unsplash_api}"
            response = requests.get(url)
            response.raise_for_status()
            data = response.json()
            
            if data.get('results'):
                return data['results'][0]['urls']['small']
            return None

        except Exception as err:
            frappe.log_error(f"Image fetch error: {err}", "Unsplash Error")
            return None