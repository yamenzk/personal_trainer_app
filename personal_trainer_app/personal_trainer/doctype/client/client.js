// Copyright (c) 2024, YZ and contributors
// For license information, please see license.txt

frappe.ui.form.on('Client', {
    refresh: function(frm) {
        // Add a filter to the referred_by link field
        frm.set_query('referred_by', function(doc) {
            return {
                filters: [
                    ['name', '!=', frm.doc.name]  // Exclude current client
                ]
            };
        });
        if (frm.doc.adjust) {
            frm.set_intro('Manual adjustment is enabled. Client\'s targets will not be automatically updated.', 'red');
        }
    }
});