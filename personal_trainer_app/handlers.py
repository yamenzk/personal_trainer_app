from .api import MembershipCache
import frappe

def on_plan_update(doc, method):
    """Handle plan updates"""
    cache = MembershipCache()
    frappe.cache().delete_value(cache.get_version_hash_key(doc.membership))
    cache.invalidate_membership_cache(doc.membership)

def on_membership_update(doc, method):
    """Handle membership updates"""
    cache = MembershipCache()
    frappe.cache().delete_value(cache.get_version_hash_key(doc.name))
    cache.invalidate_membership_cache(doc.name)

def on_client_update(doc, method):
    """Handle client updates"""
    cache = MembershipCache()
    # Invalidate version hash for all client's memberships
    for membership in frappe.get_all("Membership", filters={"client": doc.name}):
        frappe.cache().delete_value(cache.get_version_hash_key(membership.name))
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

def on_chat_update(doc, method):
    """Handle chat updates"""
    frappe.publish_realtime(
        "chat_update", 
        {
            "doctype": "Chat",
            "membership": doc.membership,
            "creation": doc.creation
        },
        room="website",
        after_commit=True
    )