// Copyright (c) 2024, YZ and contributors
// For license information, please see license.txt

frappe.ui.form.on('PT Settings', {
    fetch_premade_exercises: function(frm) {
        frm.call({
            doc: frm.doc,
            method: 'fetch_premade_exercises',
            freeze: true,
            freeze_message: __('Importing exercises... Please wait'),
            callback: function(r) {
                frm.reload_doc();
            }
        });
    },
    fetch_premade_foods: function(frm) {
        frm.call({
            doc: frm.doc,
            method: 'fetch_premade_foods',
            freeze: true,
            freeze_message: __('Importing foods... Please wait'),
            callback: function(r) {
                frm.reload_doc();
            }
        });
    }
});