frappe.ui.form.on('Exercise Template', {
    refresh: function(frm) {
        set_exercise_filters(frm);

        // Add the "Generate Exercises" button to the form
        frm.add_custom_button(__('Generate Exercises'), function() {
            generate_exercises(frm);
        });
    },
    clear_filters: function(frm) {
        clear_exercise_filters(frm);
    },
    setup: function(frm) {
        const filter_fields = ['primary_muscle', 'level', 'force', 'equipment', 'mechanic', 'category'];
        filter_fields.forEach(field => {
            frm.fields_dict[field].df.onchange = () => {
                set_exercise_filters(frm);
            };
        });
    }
});

function set_exercise_filters(frm) {
    frm.fields_dict['exercises'].grid.get_field('exercise').get_query = function(doc, cdt, cdn) {
        let filters = [['enabled', '=', 1]];

        // Dynamically add filters based on filled fields
        ['primary_muscle', 'level', 'force', 'equipment', 'mechanic', 'category'].forEach(field => {
            if (frm.doc[field]) {
                filters.push([field, '=', frm.doc[field]]);
            }
        });

        console.log(filters);
        return {
            filters: filters
        };
    };
}

function clear_exercise_filters(frm) {
    ['primary_muscle', 'level', 'force', 'equipment', 'mechanic', 'category'].forEach(field => {
        frm.set_value(field, '');
    });

    frm.refresh();
    set_exercise_filters(frm);
}

function generate_exercises(frm) {
    // Fetch filters applied
    let filters = {
        'enabled': 1
    };

    // Collect filters from the form
    ['primary_muscle', 'level', 'force', 'equipment', 'mechanic', 'category'].forEach(field => {
        if (frm.doc[field]) {
            filters[field] = frm.doc[field];
        }
    });

    // Fetch exercises matching the filters
    frappe.call({
        method: 'frappe.client.get_list',
        args: {
            doctype: 'Exercise',
            filters: filters,
            fields: ['name', 'primary_muscle', 'force'], // Add any other fields you need
            limit_page_length: 1000  // Fetch all matching exercises
        },
        callback: function(r) {
            if (r.message && r.message.length > 0) {
                // Randomly select up to 7 exercises
                let selected_exercises = get_random_exercises(r.message, 7);

                // Add the selected exercises to the child table
                selected_exercises.forEach(function(exercise) {
                    let new_row = frm.add_child('exercises');
                    frappe.model.set_value(new_row.doctype, new_row.name, 'exercise', exercise.name);
                });

                // Refresh the child table to show the new entries
                frm.refresh_field('exercises');
            } else {
                frappe.msgprint(__('No exercises found matching the filters'));
            }
        }
    });
}

function get_random_exercises(exercises, count) {
    // Shuffle the exercises array
    for (let i = exercises.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [exercises[i], exercises[j]] = [exercises[j], exercises[i]];
    }

    // Return the first 'count' exercises (up to 7)
    return exercises.slice(0, count);
}