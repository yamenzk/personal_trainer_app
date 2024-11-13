# Copyright (c) 2024, Yamen Zakhour and contributors
# For license information, please see license.txt

from frappe.utils import now_datetime, get_datetime
from frappe.model.document import Document
import frappe


class PromoCode(Document):
    def validate(self):
        if not self.manual:
            if self.start and self.end:
                now = now_datetime()
                start = get_datetime(self.start)
                end = get_datetime(self.end)
                if start <= now <= end:
                    self.enabled = 1
                else:
                    self.enabled = 0
            else:
                self.enabled = 1
                self.manual = 1


def update_promo_code_statuses():
    now = now_datetime()
    promo_codes = frappe.get_all('PromoC ode', fields=['name', 'start', 'end'])
    for code in promo_codes:
        if code.start and code.end:
            start = get_datetime(code.start)
            end = get_datetime(code.end)
            enabled = 1 if start <= now <= end else 0
            frappe.db.set_value('Promo Code', code.name, 'enabled', enabled)
            frappe.db.commit()
