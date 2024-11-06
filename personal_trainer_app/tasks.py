import frappe

def update_client_achievements(client):
    client_doc = frappe.get_doc("Client", client)

    # Achievement: Personal Record Setter
    if not client_doc.personal_record_setter and client_doc.exercise_performance:
        client_doc.personal_record_setter = 1

    # Achievement: Stress Buster
    if not client_doc.stress_buster:
        weekly_logs = []
        plans = frappe.get_all("Plan", filters={"client": client_doc.name})
        for plan in plans:
            plan_doc = frappe.get_doc("Plan", plan.name)
            weekly_logs.extend(
                row for day in range(1, 8)
                for row in getattr(plan_doc, f"d{day}_e", [])
                if row.super == 0 and row.logged == 1
            )
        if len(weekly_logs) >= 7:
            client_doc.stress_buster = 1

    # Achievement: First Step
    if not client_doc.first_step:
        for day in range(1, 8):
            if any(row.logged == 1 for row in getattr(client_doc, f"d{day}_e", []) if row.super == 0):
                client_doc.first_step = 1
                break

    # Achievement: BMI Boss
    if not client_doc.bmi_boss and client_doc.height and client_doc.weight:
        height_m = float(client_doc.height) / 100 if client_doc.height else None  # Convert to meters
        latest_weight = float(client_doc.weight[-1].weight) if client_doc.weight else None
        if height_m and latest_weight:
            bmi = latest_weight / (height_m ** 2)
            if 18.5 <= bmi <= 24.9:  # Healthy BMI range
                client_doc.bmi_boss = 1

    # Achievements for weight loss
    starting_weight = float(client_doc.weight[0].weight) if client_doc.weight else None
    latest_weight = float(client_doc.weight[-1].weight) if client_doc.weight else None
    target_weight = float(client_doc.target_weight) if client_doc.target_weight else None

    if starting_weight and latest_weight:
        if not client_doc.first_kilo_lost and (starting_weight - latest_weight) >= 1:
            client_doc.first_kilo_lost = 1
        if target_weight and not client_doc.halfway_there and (starting_weight - latest_weight) >= (starting_weight - target_weight) / 2:
            client_doc.halfway_there = 1
        if target_weight and not client_doc.total_transformation and latest_weight <= target_weight:
            client_doc.total_transformation = 1

    # Achievement: Level Up
    if not client_doc.level_up:
        exercise_records = {}
        for row in client_doc.exercise_performance:
            if row.exercise not in exercise_records or (row.weight > exercise_records[row.exercise].weight or row.reps > exercise_records[row.exercise].reps):
                client_doc.level_up = 1
                break

    # Rise and Grind / Night Owl Achievements
    early_workouts, late_workouts = 0, 0
    for row in client_doc.exercise_performance:
        hour = frappe.utils.get_time(row.creation).hour if row.creation else None
        if hour is not None:
            if 5 <= hour < 10:
                early_workouts += 1
            elif 18 <= hour < 24:
                late_workouts += 1

    if early_workouts >= 15:
        client_doc.rise_and_grind = 1
    if late_workouts >= 15:
        client_doc.night_owl = 1

    client_doc.save(ignore_permissions=True)

import frappe

def update_client_statistics(client):
    client_doc = frappe.get_doc("Client", client)

    # Get activity level factor from settings
    activity_level_factor = {
        "Sedentary": frappe.db.get_single_value("PT Settings", "activity_factor_sedentary"),
        "Light": frappe.db.get_single_value("PT Settings", "activity_factor_light"),
        "Moderate": frappe.db.get_single_value("PT Settings", "activity_factor_moderate"),
        "Very Active": frappe.db.get_single_value("PT Settings", "activity_factor_very"),
        "Extra Active": frappe.db.get_single_value("PT Settings", "activity_factor_extra")
    }

    # Ensure all required fields are valid numbers
    try:
        age = int(client_doc.age) if client_doc.age else None
        weight = float(client_doc.weight[-1].weight) if client_doc.weight else None
        height = float(client_doc.height) if client_doc.height else None
    except (ValueError, TypeError):
        frappe.log_error(f"Invalid data for client {client_doc.name}: Age, weight or height cannot be processed.")
        return

    # Calculate BMR
    if weight and height and age is not None:
        bmr = (10 * weight + 6.25 * height - 5 * age + (5 if client_doc.gender == "Male" else -161))
    else:
        frappe.log_error(f"Missing data for BMR calculation for client {client_doc.name}")
        return

    # Reset totals
    client_doc.total_exercises_completed = 0
    client_doc.total_sets_played = 0
    client_doc.total_reps_played = 0
    muscle_counts = {muscle: 0 for muscle in ["Chest", "Shoulders", "Biceps", "Hamstrings", "Traps", "Triceps", "Lats", "Glutes"]}

    # Fetch all completed plans for the client
    plans = frappe.get_all("Plan", filters={"client": client_doc.name, "status": "Completed"})
    
    # Gather exercise details
    exercise_names = []
    for plan in plans:
        plan_doc = frappe.get_doc("Plan", plan.name)
        for day in range(1, 8):
            exercises = getattr(plan_doc, f"d{day}_e", None)
            if exercises:
                exercise_names.extend([exercise.exercise for exercise in exercises])

    # Fetch all Exercise documents related to the exercises in the plan
    exercise_docs = frappe.get_all("Exercise", filters={"name": ["in", exercise_names]}, fields=["name", "primary_muscle"])
    
    # Map exercise names to primary muscles
    exercise_dict = {doc.name: doc.primary_muscle for doc in exercise_docs}

    # Process the exercises and calculate statistics
    for plan in plans:
        plan_doc = frappe.get_doc("Plan", plan.name)
        for day in range(1, 8):
            exercises = getattr(plan_doc, f"d{day}_e", None)
            if exercises:
                for exercise in exercises:
                    client_doc.total_exercises_completed += 1
                    client_doc.total_sets_played += exercise.sets
                    client_doc.total_reps_played += exercise.reps
                    
                    # Get primary muscle from pre-fetched exercise data
                    primary_muscle = exercise_dict.get(exercise.exercise)
                    
                    if primary_muscle and primary_muscle in muscle_counts:
                        muscle_counts[primary_muscle] += 1
                    else:
                        frappe.log(f"Muscle count not updated for {primary_muscle}: muscle not in counts or None.")


    # Assign muscle counts to the client document
    for muscle, count in muscle_counts.items():
        setattr(client_doc, f"total_{muscle.lower()}_exercises", count)

    # Calculate calories burned
    if client_doc.activity_level in activity_level_factor:
        client_doc.total_calories_burned = bmr * activity_level_factor[client_doc.activity_level] * client_doc.total_exercises_completed

    # Save the updated client statistics
    client_doc.save(ignore_permissions=True)

# Batch updates
def update_all_client_achievements():
    clients = frappe.get_all("Client")
    for client in clients:
        try:
            update_client_achievements(client.name)
            frappe.log(f"Achievements updated for {client.name}")
            frappe.db.commit()
        except Exception as e:
            frappe.log_error(f"Error updating achievements for client {client.name}: {e}")

def update_all_client_statistics():
    clients = frappe.get_all("Client")
    for client in clients:
        try:
            update_client_statistics(client.name)
            frappe.log(f"Statistics updated for {client.name}")
            frappe.db.commit()
        except Exception as e:
            frappe.log_error(f"Error updating statistics for client {client.name}: {e}")
