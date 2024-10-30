# Copyright (c) 2024, YZ and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import now_datetime, add_to_date, get_datetime

class Membership(Document):
    def validate(self):
        if self.has_value_changed('package'):
            self.set_membership_dates()
        
        self.set_active_status()
    
    def set_membership_dates(self):
        if self.package:
            # Get the package duration in seconds
            package_duration = frappe.db.get_value('PT Package', self.package, 'duration')
            
            if package_duration:
                if not self.start:
                    self.start = now_datetime()
                
                self.end = add_to_date(
                    date=self.start,
                    seconds=package_duration
                )
    
    def set_active_status(self):
        if self.start and self.end:
            current_time = now_datetime()
            start_time = get_datetime(self.start)
            end_time = get_datetime(self.end)
            
            self.active = 1 if start_time <= current_time <= end_time else 0
            
def update_membership_statuses():
    """
    Background job to update active status of all memberships.
    This runs hourly via the scheduler.
    """
    frappe.log("Starting membership status update job")
    try:
        # Get all memberships that are currently marked as active
        active_memberships = frappe.get_all(
            "Membership",
            filters={"active": 1},
            fields=["name", "start", "end"]
        )
        
        current_time = now_datetime()
        
        for membership in active_memberships:
            end_time = get_datetime(membership.end)
            
            # If membership has expired, set active to 0
            if current_time > end_time:
                frappe.db.set_value(
                    "Membership",
                    membership.name,
                    "active",
                    0,
                    update_modified=False
                )
        
        frappe.db.commit()
        
        frappe.log(f"Membership status update completed. Checked {len(active_memberships)} active memberships.")
        
    except Exception as e:
        frappe.log_error("Membership Status Update Error")