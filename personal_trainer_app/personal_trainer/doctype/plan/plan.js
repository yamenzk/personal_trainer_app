frappe.ui.form.on('Plan', {
    refresh: function(frm) {
        frm.add_custom_button(__('Fetch Previous'), function() {
            fetch_previous_plan(frm);
        });
        if (has_required_fields(frm)) {
            const message = generate_summary_html(frm);
            frm.set_intro(message, 'orange');
        }
    },

    client: function(frm) {
        if (frm.doc.client) {
            frappe.call({
                method: 'frappe.client.get_list',
                args: {
                    doctype: 'Membership',
                    filters: {
                        client: frm.doc.client,
                        active: 1
                    },
                    fields: ['name', 'package']
                },
                callback: function(response) {
                    handle_membership_selection(frm, response.message);
                }
            });
        }
    },

    onload: function(frm) {
        setup_food_filters(frm);
        
        // Initialize hash if not exists
        if (!frm.doc.__food_hash) {
            frm.doc.__food_hash = calculate_food_hash(frm);
        }
    },

    before_save: function(frm) {
        const current_hash = calculate_food_hash(frm);
        
        // If food data changed, run calculations
        if (current_hash !== frm.doc.__food_hash) {
            const food_data = collect_food_data(frm);
            
            if (Object.keys(food_data).length > 0) {
                calculate_nutritional_totals(frm, food_data)
                    .then(() => {
                        frm.doc.__food_hash = current_hash;
                    })
                    .catch((error) => {
                        frappe.throw(__('Failed to calculate nutritional totals: {0}', [error.message]));
                    });
            }
            
            frm.doc.__food_hash = current_hash;
        }
    }
});

// Exercise template handlers
['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7'].forEach(day => {
    frappe.ui.form.on('Plan', {
        [`${day}_template`]: function(frm) {
            populate_exercises(frm, `${day}_template`, `${day}_e`);
        }
    });
});

// Utility Functions

function calculate_food_hash(frm) {
    const table_ids = ['d1_f', 'd2_f', 'd3_f', 'd4_f', 'd5_f', 'd6_f', 'd7_f'];
    const food_data = table_ids.map(id => {
        return (frm.doc[id] || [])
            .map(row => `${row.food}:${row.amount}`)
            .join('|');
    }).join('||');
    
    let hash = 0;
    for (let i = 0; i < food_data.length; i++) {
        const char = food_data.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString();
}

function collect_food_data(frm) {
    const food_data = {};
    const table_ids = ['d1_f', 'd2_f', 'd3_f', 'd4_f', 'd5_f', 'd6_f', 'd7_f'];
    
    table_ids.forEach(table_id => {
        const table_foods = (frm.doc[table_id] || [])
            .filter(row => row.food && row.amount)
            .map(row => ({
                food_docname: row.food,
                amount_in_grams: parseFloat(row.amount)
            }));
            
        if (table_foods.length > 0) {
            food_data[table_id] = table_foods;
        }
    });
    
    return food_data;
}

function calculate_nutritional_totals(frm, food_data) {
    return new Promise((resolve, reject) => {
        frappe.call({
            freeze: true,
            freeze_message: __('Calculating nutrition...'),
            method: 'personal_trainer_app.personal_trainer.doctype.plan.plan.calculate_all_nutritional_totals',
            args: { all_food_data: food_data },
            callback: function(r) {
                if (r.message) {
                    update_nutrition_summaries(frm, r.message);
                    resolve();
                } else {
                    reject(new Error('Failed to calculate nutritional totals'));
                }
            }
        });
    });
}

function update_nutrition_summaries(frm, totals_data) {
    Object.entries(totals_data).forEach(([table_id, totals]) => {
        const summary = `Protein: ${Math.round(totals.protein)}g + ` +
                       `Carbs: ${Math.round(totals.carbs)}g + ` +
                       `Fat: ${Math.round(totals.fat)}g = ` +
                       `${Math.round(totals.energy)} kcal`;
        frm.set_value(`${table_id}_macro`, summary);
    });
}

function setup_food_filters(frm) {
    ['d1_f', 'd2_f', 'd3_f', 'd4_f', 'd5_f', 'd6_f', 'd7_f'].forEach(fieldName => {
        frm.fields_dict[fieldName].grid.get_field('food').get_query = function() {
            return {
                filters: [
                    ['name', 'not in', get_blocked_foods(frm)],
                    ['enabled', '=', 1]
                ]
            };
        };
    });
}

function get_blocked_foods(frm) {
    return frm.doc.blocked_foods ? 
           frm.doc.blocked_foods.split(',').map(id => id.trim()) : 
           [];
}

function has_required_fields(frm) {
    return frm.doc.weekly_workouts && 
           frm.doc.daily_meals && 
           frm.doc.target_carbs && 
           frm.doc.target_energy && 
           frm.doc.target_proteins && 
           frm.doc.target_fats;
}

function generate_summary_html(frm) {
    return `
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; border: 1px solid #dcdcdc; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <div style="flex: 1; text-align: center;">
                    <strong style="color: #444; font-size: 16px;">Preferences</strong>
                </div>    
                <div style="flex: 1; text-align: center;">
                    <p style="margin: 0; font-weight: 500; color: #666;">Weekly Workouts</p>
                    <span style="font-size: 12px; color: #333;">${frm.doc.weekly_workouts}</span>
                </div>
                <div style="flex: 1; text-align: center;">
                    <p style="margin: 0; font-weight: 500; color: #666;">Daily Meals</p>
                    <span style="font-size: 12px; color: #333;">${frm.doc.daily_meals}</span>
                </div>
                <div style="flex: 1; text-align: center;">
                    <p style="margin: 0; font-weight: 500; color: #666;">Goal</p>
                    <span style="font-size: 12px; color: #333;">${frm.doc.goal}</span>
                </div>
            </div>
            <hr style="border: 1px solid #dcdcdc; margin: 15px 0;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="flex: 1; text-align: center;">
                    <strong style="color: #444; font-size: 16px;">Targets</strong>
                </div>
                <div style="flex: 1; text-align: center;">
                    <strong style="color: #28a745; font-size: 16px;">${frm.doc.target_proteins} g</strong>
                    <p style="margin: 0; font-size: 12px; color: #666;">Proteins</p>
                </div>
                <div style="flex: 1; text-align: center;">
                    <strong style="color: #dc3545; font-size: 16px;">${frm.doc.target_fats} g</strong>
                    <p style="margin: 0; font-size: 12px; color: #666;">Fats</p>
                </div>
                <div style="flex: 1; text-align: center;">
                    <strong style="color: #ffc107; font-size: 16px;">${frm.doc.target_carbs} g</strong>
                    <p style="margin: 0; font-size: 12px; color: #666;">Carbs</p>
                </div>
                <div style="flex: 1; text-align: center;">
                    <strong style="color: #17a2b8; font-size: 16px;">${frm.doc.target_energy} kcal</strong>
                    <p style="margin: 0; font-size: 12px; color: #666;">Energy</p>
                </div>
            </div>
        </div>`;
}

function handle_membership_selection(frm, memberships) {
    if (memberships.length === 1) {
        frm.set_value('membership', memberships[0].name);
        frm.save();
    } else if (memberships.length > 1) {
        const options = memberships.map(m => ({
            label: m.package,
            value: m.name
        }));

        const d = new frappe.ui.Dialog({
            title: 'Select Membership',
            fields: [{
                fieldname: 'selected_membership',
                label: 'Membership',
                fieldtype: 'Select',
                options: options
            }],
            primary_action: function(data) {
                frm.set_value('membership', data.selected_membership);
                frm.save();
                d.hide();
            }
        });
        d.show();
    }
}

function populate_exercises(frm, template_field, exercise_table) {
    if (frm.doc[template_field]) {
        frm.doc[exercise_table] = [];
        
        frappe.call({
            method: 'frappe.client.get',
            args: {
                doctype: 'Exercise Template',
                name: frm.doc[template_field]
            },
            callback: function(response) {
                if (response.message?.exercises) {
                    response.message.exercises.forEach(exercise => {
                        frm.add_child(exercise_table, {
                            exercise: exercise.exercise,
                            sets: exercise.sets,
                            reps: exercise.reps,
                            rest: exercise.rest,
                            super: exercise.super
                        });
                    });
                    frm.refresh_field(exercise_table);
                }
            }
        });
    }
}

function fetch_previous_plan(frm) {
    frappe.call({
        method: 'frappe.client.get_list',
        args: {
            doctype: 'Plan',
            filters: {
                client: frm.doc.client,
                membership: frm.doc.membership,
                name: ['!=', frm.doc.name]
            },
            fields: ['name'],
            order_by: 'creation desc',
            limit: 1
        },
        callback: function(response) {
            if (response.message && response.message.length > 0) {
                const previous_plan_name = response.message[0].name;
                
                // Fetch only the specified fields of the previous plan document
                frappe.call({
                    method: 'frappe.client.get',
                    args: {
                        doctype: 'Plan',
                        name: previous_plan_name,
                        fields: [
                            'd1_cheat', 'd1_rest', 'd2_cheat', 'd2_rest', 'd3_cheat', 'd3_rest',
                            'd4_cheat', 'd4_rest', 'd5_cheat', 'd5_rest', 'd6_cheat', 'd6_rest',
                            'd7_cheat', 'd7_rest'
                        ].concat(
                            ['d1_e', 'd2_e', 'd3_e', 'd4_e', 'd5_e', 'd6_e', 'd7_e', 
                             'd1_f', 'd2_f', 'd3_f', 'd4_f', 'd5_f', 'd6_f', 'd7_f']
                        )
                    },
                    callback: function(res) {
                        if (res.message) {
                            const previous_data = res.message;
                            populate_form_with_previous_data(frm, previous_data);
                        }
                    }
                });
            } else {
                frappe.msgprint(__('No previous plan found for this client and membership.'));
            }
        }
    });
}

function populate_form_with_previous_data(frm, previous_data) {
    // Populate check fields
    for (let i = 1; i <= 7; i++) {
        frm.set_value(`d${i}_cheat`, previous_data[`d${i}_cheat`]);
        frm.set_value(`d${i}_rest`, previous_data[`d${i}_rest`]);
    }

    // Populate child tables
    const child_table_fields = ['d1_e', 'd2_e', 'd3_e', 'd4_e', 'd5_e', 'd6_e', 'd7_e', 'd1_f', 'd2_f', 'd3_f', 'd4_f', 'd5_f', 'd6_f', 'd7_f'];
    
    child_table_fields.forEach(table => {
        if (previous_data[table] && Array.isArray(previous_data[table])) {
            frm.clear_table(table);
            previous_data[table].forEach(row_data => {
                const child = frm.add_child(table);
                Object.assign(child, row_data);
            });
            frm.refresh_field(table);
        }
    });
    
    frappe.msgprint(__('Previous plan data has been fetched and populated.'));
}