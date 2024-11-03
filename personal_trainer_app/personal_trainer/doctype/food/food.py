# Copyright (c) 2024, YZ and contributors
# For license information, please see license.txt

import frappe
import requests
from frappe.model.document import Document

class Food(Document):
    def before_insert(self):
        fdc_api = frappe.db.get_single_value('PT Settings', 'fdc_api')
        auto_image = frappe.db.get_single_value('PT Settings', 'auto_image')
        unsplash_api = frappe.db.get_single_value('PT Settings', 'unsplash_api')

        if fdc_api:
            try:
                url = f"https://api.nal.usda.gov/fdc/v1/food/{self.fdcid}?api_key={fdc_api}"
                response = requests.get(url)
                response.raise_for_status()  # Ensure that a failed request raises an error

                # Parse the JSON response
                data = response.json()

                # Check if the response contains the necessary data
                if 'fdcId' in data:
                    # Set basic fields from the API response
                    self.title = data['description'].split(',')[0].strip()
                    self.description = data.get('description', '')

                    # Food category might not always be present
                    if 'foodCategory' in data and 'description' in data['foodCategory']:
                        self.category = data['foodCategory']['description']

                    # Clear the child table before appending new entries
                    self.nutritional_facts = []

                    # Iterate through food nutrients and append valid ones to the child table
                    for nutrient in data.get('foodNutrients', []):
                        if nutrient.get('type') == 'FoodNutrient':
                            nutrient_data = nutrient.get('nutrient', {})
                            if nutrient_data and 'name' in nutrient_data and 'amount' in nutrient:
                                self.append('nutritional_facts', {
                                    'nutrient': nutrient_data['name'],
                                    'value': nutrient['amount'],
                                    'unit': nutrient_data.get('unitName', '')
                                })
                            else:
                                # Log an error if nutrient data is incomplete
                                frappe.log_error(
                                    f"Incomplete nutrient data: {nutrient}", "Nutrient Error")

                    # Fetch an image from Unsplash if auto_image is enabled
                    if auto_image and unsplash_api and not self.image:
                        image_url = self.fetch_unsplash_image(self.title, unsplash_api)
                        if image_url:
                            self.image = image_url

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
            response.raise_for_status()  # Ensure that a failed request raises an error
            
            # Parse the JSON response
            data = response.json()
            
            # Check if there are any photos in the response
            if data.get('results'):
                # Return the URL of the first image
                return data['results'][0]['urls']['small']  # You can change 'small' to 'regular' for a higher resolution image
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