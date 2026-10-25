"""Human-readable, student-friendly explanations and personalized suggestions."""

from __future__ import annotations

from typing import Any

# Clear student-friendly labels for features
FEATURE_LABELS: dict[str, str] = {
    "reaction_time_ms": "Reaction Speed",
    "attention_accuracy_percentage": "Continuous Focus Accuracy",
    "focus_flow_distraction_count": "Distraction Resistance",
    "focus_recovery_time_seconds": "Recovery Time After Distraction",
    "memory_score": "Working Memory",
    "stroop_accuracy_percentage": "Distraction Filtering",
    "task_switch_accuracy": "Task Switching Flexibility",
    "visual_attention_score": "Visual Scanning Focus",
    "missed_targets": "Missed Target Count",
    "sleep_quality": "Sleep Quality",
    "average_sleep_duration": "Sleep Duration",
    "wake_refreshed": "Waking Up Refreshed",
    "daily_screen_time": "Daily Screen Time",
    "social_media_usage": "Social Media Usage",
    "short_form_video_usage": "Short-Form Video Viewing",
    "phone_checking_without_notification": "Phone Checking Frequency",
    "phone_accessibility": "Phone Proximity While Working",
    "phone_usage_during_work": "Phone Use During Focus",
    "notifications_interrupt_work": "Notification Interruptions",
    "app_switching_frequency": "App and Tab Switching",
    "noise_level": "Workspace Noise Level",
    "ignoring_background_noise": "Noise Filtering",
    "lighting_condition": "Workspace Lighting",
    "desk_organization": "Desk Organization",
    "study_environment_comfort": "Workspace Comfort",
    "focus_duration": "Natural Focus Duration",
    "losing_focus_frequency": "Losing Focus Frequency",
    "procrastination": "Task Postponement",
    "forgetting_current_task": "Losing Track of Current Task",
    "rereading_same_content": "Rereading Text",
    "missing_details": "Overlooking Small Details",
    "mental_overload": "Mental Overload",
    "mental_fatigue": "Mental Fatigue",
    "stress_level": "Stress Level",
    "anxiety_level": "Tension and Worry Level",
    "nature_of_thoughts": "Tone of Background Thoughts",
    "thought_branching": "Thought Branching",
    "difficulty_controlling_thoughts": "Wandering Thoughts",
    "replay_conversations": "Replaying Past Conversations",
    "future_overthinking": "Overthinking Upcoming Events",
    "random_ideas_interrupt": "Spontaneous Idea Interruptions",
    "main_distraction_source": "Main Distraction Source",
    "exercise_frequency": "Physical Activity Frequency",
    "improve_breaks": "Break Habits During Work",
}

COGNITIVE_TEST_KEYS = {
    "reaction_time_ms",
    "attention_accuracy_percentage",
    "focus_flow_distraction_count",
    "focus_recovery_time_seconds",
    "memory_score",
    "stroop_accuracy_percentage",
    "task_switch_accuracy",
    "visual_attention_score",
    "missed_targets",
}


def feature_label(feature: str) -> str:
    """Return a clean, human-friendly label for a feature name."""
    if feature in FEATURE_LABELS:
        return FEATURE_LABELS[feature]
    clean = feature.replace("_", " ").strip()
    return clean.title()


def factor_explanation(
    feature: str, answer: Any = None, direction: str = "supports", level: str = "Moderate"
) -> str:
    """Produce simple, student-friendly explanations without clinical jargon."""
    ans_str = str(answer).strip().lower() if answer is not None else ""

    # Specific human-friendly explanations based on feature and answer
    if feature == "stress_level":
        if any(w in ans_str for w in ("high", "very high", "severe")):
            return "Your stress level was high, which may make it harder to maintain attention for longer tasks."
        if any(w in ans_str for w in ("low", "very low", "minimal")):
            return "Your low stress level helps you stay calm and preserve mental clarity."
        return "Your daily stress level plays a noticeable role in how steady your focus feels."

    if feature == "mental_overload":
        if any(w in ans_str for w in ("high", "constant", "moderate")):
            return "Feeling mentally overloaded makes it difficult for your mind to prioritize and stay calm."
        return "A calm mind without task overload provides a supportive space for deep concentration."

    if feature == "sleep_quality":
        if any(w in ans_str for w in ("poor", "very poor", "average")):
            return "Your sleep quality was lower than ideal, which can reduce alertness and daytime energy."
        return "Your good sleep quality provides a strong, healthy base for daily concentration."

    if feature == "average_sleep_duration":
        if any(w in ans_str for w in ("less than 5", "5-6")):
            return "Sleeping fewer hours than recommended can lead to midday focus dips and mental tiredness."
        return "Consistent sleep duration helps keep your cognitive energy stable throughout the day."

    if feature == "wake_refreshed":
        if any(w in ans_str for w in ("rarely", "never", "sometimes")):
            return "Waking up without feeling fully refreshed suggests your rest may not be restoring your energy completely."
        return "Waking up refreshed gives you a natural head start on clear thinking."

    if feature == "phone_checking_without_notification":
        if any(w in ans_str for w in ("constantly", "many times", "every hour")):
            return "Checking your phone frequently without notifications interrupts your concentration before deep focus can build."
        return "Checking your phone rarely helps protect your concentration from random disruptions."

    if feature == "phone_accessibility":
        if any(w in ans_str for w in ("reach", "hand", "desk")):
            return "Keeping your phone close by while working makes it tempting to glance at it, breaking your flow."
        return "Keeping your phone away during study helps you stay immersed in your task."

    if feature == "daily_screen_time":
        if any(w in ans_str for w in ("6-8", "more than 8", "high")):
            return "High daily screen hours can create eye fatigue and make sustained reading feel more draining."
        return "Moderate screen time helps prevent digital eye strain and keeps your mind alert."

    if feature == "short_form_video_usage":
        if any(w in ans_str for w in ("1-3", "more than 3", "30 minutes-1")):
            return "Frequently watching fast short-form videos conditions your brain to crave constant stimulation."
        return "Limiting rapid short-form videos helps protect your ability to focus on slower, detailed tasks."

    if feature == "notifications_interrupt_work":
        if any(w in ans_str for w in ("often", "always", "very often")):
            return "Frequent notification pop-ups split your attention and force you to restart your train of thought."
        return "Fewer notification interruptions make it easier to stay in a productive groove."

    if feature == "app_switching_frequency":
        if any(w in ans_str for w in ("switch", "constantly", "frequently")):
            return "Switching back and forth between tabs and apps resets your focus each time you change windows."
        return "Working on one task at a time before switching helps keep your thoughts organized."

    if feature == "procrastination":
        if any(w in ans_str for w in ("often", "very often", "always")):
            return "Delaying challenging tasks creates mental pressure before you even begin working."
        return "Starting tasks promptly keeps work manageable and reduces last-minute stress."

    if feature == "noise_level":
        if any(w in ans_str for w in ("disturbance", "loud", "frequent", "continuous")):
            return "A noisy environment requires extra effort from your brain to tune out background sounds."
        return "A quiet workspace makes it much easier to sustain uninterrupted study."

    if feature == "desk_organization":
        if any(w in ans_str for w in ("messy", "distracting", "clutter")):
            return "Clutter in your workspace competes for visual attention while you try to work."
        return "An organized study area helps create a calm and inviting place to focus."

    if feature == "thought_branching":
        if any(w in ans_str for w in ("many thoughts", "multiple ideas", "distract")):
            return "When one thought quickly leads into another, it can pull your attention away from your main work."
        return "Staying focused on one train of thought helps you finish what you started."

    if feature == "difficulty_controlling_thoughts":
        if any(w in ans_str for w in ("difficult", "very difficult", "hard")):
            return "Finding it difficult to dismiss wandering thoughts can make it harder to stay in flow."
        return "Being able to gently let go of wandering thoughts helps you return to tasks quickly."

    if feature == "replay_conversations":
        return "Mentally replaying past conversations uses up attention that could be spent on your current task."

    if feature == "future_overthinking":
        return "Overthinking upcoming events can create background worry while you are trying to study."

    if feature == "reaction_time_ms":
        return "Your score on the reaction task shows how quickly you respond to visual cues."

    if feature == "attention_accuracy_percentage":
        return "Your accuracy on the continuous focus task reflects how steadily you hold visual attention."

    if feature == "task_switch_accuracy":
        return "Your score reflects how easily you adjust when alternating between different rules."

    if feature == "stroop_accuracy_percentage":
        return "Your test score reflects your ability to ignore conflicting visual distractions."

    # General supportive / moderating fallback in plain English
    lbl = feature_label(feature).lower()
    if direction == "supports":
        return f"Your answer for {lbl} was one of the key factors shaping your {level.lower()} focus estimate."
    return f"Your answer for {lbl} helped balance and moderate your overall focus estimate."


def global_factor_items(
    features: list[dict[str, Any]], limit: int = 5
) -> list[dict[str, Any]]:
    """Format dataset-wide important factors in simple non-clinical English."""
    return [
        {
            "feature": item["feature"],
            "label": feature_label(item["feature"]),
            "importance": round(float(item["permutation_importance_mean"]), 6),
            "note": "Common factor among participants that strongly influences focus and productivity.",
        }
        for item in features[:limit]
    ]


def generate_personalized_suggestions(
    responses: dict[str, Any],
    contributing_factors: list[dict[str, Any]],
    level: str,
) -> list[str]:
    """Generate 4 to 5 simple, student-friendly, and actionable suggestions.

    Considers:
    - Sleep quality & morning rest
    - Daily screen time & phone proximity
    - Notification interruptions
    - Stress level & mental overload
    - Workspace comfort & noise & lighting
    - Procrastination & break habits
    - Thought patterns (worries, planning, past conversations)
    - Cognitive test performance (strictly ONLY if completed)
    - Physical activity (strictly ONLY if provided)
    - Positive habits (gives supportive maintenance tips if habits are already good)
    """
    suggestions: list[str] = []
    seen: set[str] = set()

    def add_sugg(text: str) -> None:
        if text not in seen and len(suggestions) < 5:
            seen.add(text)
            suggestions.append(text)

    # String extraction
    sleep_qual = str(responses.get("sleep_quality", "")).strip()
    wake_ref = str(responses.get("wake_refreshed", "")).strip()
    sleep_dur = str(responses.get("average_sleep_duration", "")).strip()

    screen_time = str(responses.get("daily_screen_time", "")).strip()
    phone_checks = str(responses.get("phone_checking_without_notification", "")).strip()
    phone_access = str(responses.get("phone_accessibility", "")).strip()
    short_vids = str(responses.get("short_form_video_usage", "")).strip()
    app_switch = str(responses.get("app_switching_frequency", "")).strip()
    notif_inter = str(responses.get("notifications_interrupt_work", "")).strip()

    stress = str(responses.get("stress_level", "")).strip()
    overload = str(responses.get("mental_overload", "")).strip()
    fatigue = str(responses.get("mental_fatigue", "")).strip()

    procrast = str(responses.get("procrastination", "")).strip()
    breaks = responses.get("improve_breaks")
    break_habits = str(responses.get("break_habits", "")).strip()

    noise = str(responses.get("noise_level", "")).strip()
    noise_filt = str(responses.get("ignoring_background_noise", "")).strip()
    lighting = str(responses.get("lighting_condition", "")).strip()
    desk = str(responses.get("desk_organization", "")).strip()

    # Thought pattern indicators
    tp_future = (
        responses.get("thought_future_planning") == 1
        or responses.get("future_overthinking") in ("Often", "Very often")
    )
    tp_past = (
        responses.get("thought_past_memories") == 1
        or responses.get("replay_conversations") in ("Often", "Very often")
    )
    tp_worries = responses.get("thought_worries") == 1
    tp_family = responses.get("thought_family") == 1
    tp_work_study = responses.get("thought_work_study") == 1
    tp_branching = responses.get("thought_branching") in (
        "Many thoughts appear and distract me",
        "Thoughts connect into multiple ideas",
    )
    tp_stopping = responses.get("difficulty_controlling_thoughts") in (
        "Difficult",
        "Very difficult",
    )
    tp_random = (
        responses.get("thought_random") == 1
        or responses.get("random_ideas_interrupt") in ("Often", "Very often")
    )

    # Cognitive tests
    has_cognitive_tests = any(k in responses for k in COGNITIVE_TEST_KEYS)

    # Exercise
    exercise = str(responses.get("exercise_frequency", "")).strip()

    # Check if user has overall healthy habits
    is_mostly_healthy = (
        level.lower() == "low"
        and stress in ("Low", "Very Low", "")
        and sleep_qual in ("Good", "Excellent", "")
        and phone_checks not in ("Constantly", "Many times/hour")
    )

    # ── Healthy Habits: Positive maintenance suggestions ──
    if is_mostly_healthy:
        add_sugg("Your current habits support focus. Continue using structured study sessions.")
        add_sugg("Maintain your regular sleep schedule to keep your daily focus steady.")
        add_sugg("Keep your study area tidy so sitting down to work always feels easy and inviting.")
        add_sugg("Take short planned breaks during long work blocks to prevent fatigue before it starts.")
        add_sugg("Stay with your habit of focusing on one main priority at a time.")
        return suggestions[:5]

    # ── 1. Sleep Quality & Rest ──
    if (
        sleep_qual in ("Poor", "Very Poor")
        or wake_ref in ("Rarely", "Never")
        or sleep_dur in ("Less than 5 hours", "5-6 hours")
    ):
        add_sugg("Improve your sleep routine because better rest can support concentration.")
        add_sugg("Try unwinding without screens for 30 minutes before bed to wake up feeling more rested.")
    elif sleep_qual == "Average":
        add_sugg("Keep a steady sleep and wake schedule to give your brain predictable recovery time.")

    # ── 2. Screen Time & Phone Distractions ──
    if phone_checks in ("Many times/hour", "Constantly") or phone_access in (
        "Always within reach",
        "Frequently in hand",
        "On desk and checked sometimes",
    ):
        add_sugg("Try placing your phone out of reach during important focus sessions.")
    elif screen_time in ("6-8 hours", "More than 8 hours") or short_vids in (
        "1-3 hours/day",
        "More than 3 hours/day",
    ):
        add_sugg("Reducing phone access during work time may help you avoid unnecessary interruptions.")

    if app_switch in ("Constantly switch between apps", "Frequently switch"):
        add_sugg("Keep only the required tabs open and focus on one task at a time.")

    # ── 3. Notification Interruptions ──
    if (
        notif_inter in ("Often", "Very Often", "Always")
        or responses.get("interruption_phone_notif") == 1
    ):
        add_sugg("Turn on Do Not Disturb or silence app alerts during your planned focus blocks.")

    # ── 4. Stress Level & Mental Overload ──
    if overload in ("High overload", "Constant overload") or stress in (
        "High",
        "Very High",
    ):
        add_sugg("Take a few deep breaths before starting a difficult task. This may help you feel calmer and improve focus.")
        add_sugg("Break large tasks into smaller steps so they feel easier to start.")
    elif fatigue in ("Often", "Always"):
        add_sugg("When your mind feels tired, step away for a quick five-minute break instead of forcing yourself to push through.")

    # ── 5. Workspace Comfort & Environment ──
    if noise in ("Frequent disturbance", "Continuous disturbance", "Moderate noise") or noise_filt in (
        "Difficult",
        "Very difficult",
    ):
        add_sugg("Try using quiet study music or earplugs to block out unpredictable background sounds.")
    if desk in ("Messy", "Very distracting"):
        add_sugg("Clear off your desk so only the items you need right now are in front of you.")
    if lighting in ("Poor", "Average"):
        add_sugg("Improve your study lighting or work near natural light to reduce eye fatigue.")

    # ── 6. Procrastination & Break Habits ──
    if procrast in ("Often", "Very often"):
        add_sugg("Start with a tiny two-minute goal on tough assignments so getting started feels easy.")
    if break_habits in ("Rarely", "Sometimes") or breaks == 1:
        add_sugg("Take a five-minute stretch break every 40 minutes to keep your mind fresh.")

    # ── 7. Thought Patterns ──
    if tp_future:
        add_sugg("Write down upcoming plans on a notepad so your mind can let them go while you work.")
    if tp_past:
        add_sugg("When past conversations replay in your mind, gently remind yourself to bring your attention back to what is in front of you.")
    if tp_worries:
        add_sugg("Write down distracting thoughts and return to your main task.")
    if tp_family:
        add_sugg("Set a specific time to connect with family so those thoughts do not interrupt your study blocks.")
    if tp_work_study:
        add_sugg("Write down a quick list of top priorities each morning so you know exactly what to do first.")
    if tp_random:
        add_sugg("Keep an idea scratchpad nearby for sudden thoughts so you can capture them without losing your train of thought.")
    if tp_stopping or tp_branching:
        add_sugg("When one thought leads into another, pause for three slow breaths and gently return to your work.")

    # ── 8. Cognitive Task Performance (ONLY if tests were completed) ──
    if has_cognitive_tests:
        task_switch = responses.get("task_switch_accuracy")
        stroop = responses.get("stroop_accuracy_percentage")
        rx_time = responses.get("reaction_time_ms")
        acc = responses.get("attention_accuracy_percentage")

        if (task_switch is not None and float(task_switch) < 75.0) or (
            stroop is not None and float(stroop) < 75.0
        ):
            add_sugg("Take a 30-second pause between different subjects so your brain can reset its focus.")
        elif rx_time is not None and float(rx_time) > 440.0:
            add_sugg("Take short standing resets to stay alert when working for long periods.")
        elif acc is not None and float(acc) < 70.0:
            add_sugg("Read through instructions twice at a steady pace to catch details that get missed when rushing.")

    # ── 9. Physical Activity (ONLY if exercise info is provided) ──
    if exercise in ("Rarely", "Never", "Occasionally", "1-2 times/week"):
        add_sugg("A brief 10-minute walk between study sessions can help boost your energy and focus.")

    # ── Fallback Pool for variety and ensuring 4-5 suggestions ──
    fallbacks = [
        "Create a small phone-free period when you need deep concentration.",
        "Keep only the required tabs open and focus on one task at a time.",
        "Take a few deep breaths before starting a difficult task. This may help you feel calmer and improve focus.",
        "Break large tasks into smaller steps so they feel easier to start.",
        "Write down distracting thoughts and return to your main task.",
        "Plan a five-minute break every 40 minutes to recharge your focus before mental fatigue sets in.",
    ]
    for fb in fallbacks:
        if len(suggestions) >= 4:
            break
        add_sugg(fb)

    return suggestions[:5]
