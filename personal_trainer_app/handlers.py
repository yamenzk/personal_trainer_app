from .api import MembershipCache
import frappe

def on_plan_update(doc, method):
    """Handle plan updates"""
    cache = MembershipCache()
    cache.invalidate_membership_cache(doc.membership)

def on_membership_update(doc, method):
    """Handle membership updates"""
    cache = MembershipCache()
    cache.invalidate_membership_cache(doc.name)

def on_client_update(doc, method):
    """Handle client updates"""
    cache = MembershipCache()
    cache.invalidate_client_caches(doc.name)

def on_exercise_update(doc, method):
    """Handle exercise library updates"""
    cache = MembershipCache()
    if cache.get_cached_library_item("Exercise", doc.name):
        frappe.cache().delete_value(cache.get_library_cache_key("Exercise", doc.name))

def on_food_update(doc, method):
    """Handle food library updates"""
    cache = MembershipCache()
    if cache.get_cached_library_item("Food", doc.name):
        frappe.cache().delete_value(cache.get_library_cache_key("Food", doc.name))