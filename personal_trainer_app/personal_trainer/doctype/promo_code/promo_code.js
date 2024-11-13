// Copyright (c) 2024, Yamen Zakhour and contributors
// For license information, please see license.txt

frappe.ui.form.on('Promo Code', {
    refresh: function(frm) {
        if (!frm.is_new() && (!frm.doc.start || !frm.doc.end)) {
            frm.set_df_property('start', 'hidden', 1);
            frm.set_df_property('end', 'hidden', 1);
        }
        if (frm.doc.manual) {
            if (frm.doc.enabled) {
                frm.add_custom_button(__('Disable'), function() {
                    frm.set_value('enabled', 0);
                    frm.set_value('manual', 1)
                    frm.save();
                });
            } else {
                frm.add_custom_button(__('Enable'), function() {
                    frm.set_value('enabled', 1);
                    frm.set_value('manual', 1)
                    frm.save();
                });
            }
        }
    }
});