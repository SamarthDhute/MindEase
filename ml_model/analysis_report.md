# Dataset analysis report

- Source: `dataset\attention_interference_dataset.csv`
- Rows: 5000
- Columns (including target): 122
- Feature columns: 121
- Duplicate records: 0
- Missing cells: 1057
- Target column: `attention_interference_level`

## Target distribution

| Class | Count | Percentage |
|---|---:|---:|
| Moderate | 1735 | 34.70% |
| Low | 1665 | 33.30% |
| High | 1600 | 32.00% |

## Columns and data types

| Column | Data type | Missing |
|---|---|---:|
| `participant_id` | `str` | 0 |
| `age_group` | `str` | 0 |
| `gender` | `str` | 0 |
| `occupation` | `str` | 0 |
| `highest_education` | `str` | 0 |
| `daily_study_working_hours` | `str` | 0 |
| `average_sleep_duration` | `str` | 0 |
| `sleep_quality` | `str` | 0 |
| `wake_refreshed` | `str` | 0 |
| `exercise_frequency` | `str` | 0 |
| `daily_water_intake` | `str` | 0 |
| `caffeine_intake` | `str` | 1057 |
| `energy_level_day` | `str` | 0 |
| `daily_screen_time` | `str` | 0 |
| `social_media_usage` | `str` | 0 |
| `app_social_media` | `int64` | 0 |
| `app_video` | `int64` | 0 |
| `app_gaming` | `int64` | 0 |
| `app_messaging` | `int64` | 0 |
| `app_education` | `int64` | 0 |
| `app_productivity` | `int64` | 0 |
| `app_other` | `int64` | 0 |
| `phone_checking_without_notification` | `str` | 0 |
| `daily_phone_pickups` | `str` | 0 |
| `app_switching_frequency` | `str` | 0 |
| `notifications_received_per_day` | `str` | 0 |
| `notifications_interrupt_work` | `str` | 0 |
| `phone_usage_during_work` | `str` | 0 |
| `phone_accessibility` | `str` | 0 |
| `short_form_video_usage` | `str` | 0 |
| `social_media_session_length` | `str` | 0 |
| `study_location` | `str` | 0 |
| `noise_level` | `str` | 0 |
| `study_interruptions` | `str` | 0 |
| `interruption_phone_notif` | `int64` | 0 |
| `interruption_family` | `int64` | 0 |
| `interruption_friends` | `int64` | 0 |
| `interruption_noise` | `int64` | 0 |
| `interruption_internet` | `int64` | 0 |
| `interruption_thoughts` | `int64` | 0 |
| `interruption_other` | `int64` | 0 |
| `lighting_condition` | `str` | 0 |
| `internet_distraction` | `str` | 0 |
| `music_while_studying` | `str` | 0 |
| `desk_organization` | `str` | 0 |
| `study_environment_comfort` | `str` | 0 |
| `focus_duration` | `str` | 0 |
| `losing_focus_frequency` | `str` | 0 |
| `forgetting_current_task` | `str` | 0 |
| `task_switching_behavior` | `str` | 0 |
| `completing_one_task_before_another` | `str` | 0 |
| `returning_after_interruption` | `str` | 0 |
| `procrastination` | `str` | 0 |
| `rereading_same_content` | `str` | 0 |
| `missing_details` | `str` | 0 |
| `ignoring_background_noise` | `str` | 0 |
| `losing_track_during_conversations` | `str` | 0 |
| `mind_wandering_frequency` | `str` | 0 |
| `thought_future_planning` | `int64` | 0 |
| `thought_work_study` | `int64` | 0 |
| `thought_personal_responsibilities` | `int64` | 0 |
| `thought_family` | `int64` | 0 |
| `thought_friends_social` | `int64` | 0 |
| `thought_past_memories` | `int64` | 0 |
| `thought_entertainment` | `int64` | 0 |
| `thought_random` | `int64` | 0 |
| `thought_worries` | `int64` | 0 |
| `nature_of_thoughts` | `str` | 0 |
| `thought_branching` | `str` | 0 |
| `difficulty_controlling_thoughts` | `str` | 0 |
| `replay_conversations` | `str` | 0 |
| `future_overthinking` | `str` | 0 |
| `random_ideas_interrupt` | `str` | 0 |
| `daydreaming_during_tasks` | `str` | 0 |
| `mental_overload` | `str` | 0 |
| `returning_attention_after_thoughts` | `str` | 0 |
| `stress_level` | `str` | 0 |
| `anxiety_level` | `str` | 0 |
| `mood` | `str` | 0 |
| `motivation_level` | `str` | 0 |
| `mental_fatigue` | `str` | 0 |
| `emotional_exhaustion` | `str` | 0 |
| `confidence_while_working` | `str` | 0 |
| `emotions_affect_concentration` | `str` | 0 |
| `productive_hours` | `str` | 0 |
| `task_completion_rate` | `str` | 0 |
| `barrier_phone` | `int64` | 0 |
| `barrier_stress` | `int64` | 0 |
| `barrier_poor_planning` | `int64` | 0 |
| `barrier_low_motivation` | `int64` | 0 |
| `barrier_environment` | `int64` | 0 |
| `barrier_fatigue` | `int64` | 0 |
| `barrier_thoughts` | `int64` | 0 |
| `productivity_satisfaction` | `str` | 0 |
| `postponing_difficult_tasks` | `str` | 0 |
| `tiredness_before_comp` | `str` | 0 |
| `main_distraction_source` | `str` | 0 |
| `most_focused_time` | `str` | 0 |
| `improve_quiet_env` | `int64` | 0 |
| `improve_music` | `int64` | 0 |
| `improve_breaks` | `int64` | 0 |
| `improve_planning` | `int64` | 0 |
| `improve_meditation` | `int64` | 0 |
| `improve_exercise` | `int64` | 0 |
| `improve_reducing_phone` | `int64` | 0 |
| `tried_improving_focus` | `str` | 0 |
| `method_pomodoro` | `int64` | 0 |
| `method_meditation` | `int64` | 0 |
| `method_exercise` | `int64` | 0 |
| `method_planning` | `int64` | 0 |
| `method_digital_detox` | `int64` | 0 |
| `method_none` | `int64` | 0 |
| `focus_flow_distraction_count` | `int64` | 0 |
| `focus_recovery_time_seconds` | `float64` | 0 |
| `attention_accuracy_percentage` | `float64` | 0 |
| `missed_targets` | `int64` | 0 |
| `reaction_time_ms` | `float64` | 0 |
| `memory_score` | `float64` | 0 |
| `stroop_accuracy_percentage` | `float64` | 0 |
| `task_switch_accuracy` | `float64` | 0 |
| `visual_attention_score` | `float64` | 0 |
| `attention_interference_level` | `str` | 0 |
