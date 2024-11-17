# Copyright (c) 2024, Yamen Zakhour and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import add_to_date


class CodeRedeem(Document):
    def before_insert(self):
        # Check that both membership and code are provided
        if not self.membership or not self.code:
            frappe.throw('Please provide both membership and code.')

        # Check if the membership has already redeemed this code
        existing_redemption = frappe.db.exists('Code Redeem', {
            'membership': self.membership,
            'code': self.code
        })
        if existing_redemption:
            frappe.throw('This client has already redeemed this code.')
        
        # Check if membership is active
        membership = frappe.get_doc('Membership', self.membership)
        if membership and not membership.active:
            frappe.throw('Membership is not active.')
        
        # Check if code is enabled
        promo_code = frappe.get_doc('Promo Code', self.code)
        if promo_code and not promo_code.enabled:
            frappe.throw('Promo code is expired.')
        
        # Check if duration is enabled
        if promo_code.duration:
            # Add duration to the end date of membership
            membership.end = add_to_date(membership.end, seconds=promo_code.additional_duration)
            membership.save(ignore_permissions=True)
            frappe.db.commit()
