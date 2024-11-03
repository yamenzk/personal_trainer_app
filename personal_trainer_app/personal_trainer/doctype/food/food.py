# Copyright (c) 2024, YZ and contributors
# For license information, please see license.txt

import frappe
import requests
from frappe.model.document import Document

class Food(Document):
    def truncate_text(self, text, max_length=138):
        """Helper function to truncate text to specified length"""
        return (text[:max_length-3] + '...') if text and len(text) > max_length else text

    def before_insert(self):
        fdc_api = frappe.db.get_single_value('PT Settings', 'fdc_api')
        auto_image = frappe.db.get_single_value('PT Settings', 'auto_image')
        unsplash_api = frappe.db.get_single_value('PT Settings', 'unsplash_api')

        if fdc_api:
            try:
                url = f"https://api.nal.usda.gov/fdc/v1/food/{self.fdcid}?api_key={fdc_api}"
                response = requests.get(url)
                response.raise_for_status()

                data = response.json()

                if 'fdcId' in data:
                    # Truncate title and description to 140 characters
                    raw_title = data['description'].split(',')[0].strip()
                    self.title = self.truncate_text(raw_title)
                    self.description = self.truncate_text(data.get('description', ''))

                    # Truncate category if present
                    if 'foodCategory' in data and 'description' in data['foodCategory']:
                        self.category = self.truncate_text(data['foodCategory']['description'])

                    self.nutritional_facts = []

                    for nutrient in data.get('foodNutrients', []):
                        if nutrient.get('type') == 'FoodNutrient':
                            nutrient_data = nutrient.get('nutrient', {})
                            if nutrient_data and 'name' in nutrient_data and 'amount' in nutrient:
                                # Truncate nutrient name and unit
                                nutrient_name = self.truncate_text(nutrient_data['name'])
                                unit_name = self.truncate_text(nutrient_data.get('unitName', ''))
                                
                                self.append('nutritional_facts', {
                                    'nutrient': nutrient_name,
                                    'value': nutrient['amount'],
                                    'unit': unit_name
                                })
                            else:
                                frappe.log_error(
                                    f"Incomplete nutrient data: {nutrient}", "Nutrient Error")

                    if auto_image and unsplash_api and not self.image:
                        image_url = self.fetch_unsplash_image(self.title, unsplash_api)
                        if image_url:
                            self.image = self.truncate_text(image_url)

                else:
                    frappe.log_error(
                        f"Invalid API response structure: {data}", "API Error")
                    frappe.throw("Failed to retrieve food data from the API.")

            except requests.exceptions.HTTPError as http_err:
                frappe.log_error(
                    f"HTTP error occurred: {http_err}", "API Error")
                frappe.throw(f"Failed to retrieve food data: {http_err}")

            except Exception as err:
                frappe.log_error(f"An error occurred: {err}", "API Error")
                frappe.throw(
                    f"An unexpected error occurred while fetching food data: {err}")
        else:
            frappe.throw(
                "API key for FDC is missing. Please configure it in the PT Settings.")

    def fetch_unsplash_image(self, title, unsplash_api):
        try:
            url = f"https://api.unsplash.com/search/photos?query={title}&client_id={unsplash_api}"
            response = requests.get(url)
            response.raise_for_status()
            
            data = response.json()
            
            if data.get('results'):
                return data['results'][0]['urls']['small']
            else:
                frappe.log_error("No images found for the query.", "Unsplash Error")
                return None

        except requests.exceptions.HTTPError as http_err:
            frappe.log_error(
                f"HTTP error occurred while fetching image: {http_err}", "Unsplash Error")
            return None

        except Exception as err:
            frappe.log_error(f"An error occurred while fetching image: {err}", "Unsplash Error")
            return None