"""Load the trained model artifacts and produce explainable predictions quickly."""

from __future__ import annotations

import csv
import json
from pathlib import Path
from typing import Any

import joblib
import numpy as np
import pandas as pd
from tensorflow.keras.models import load_model

from .explanations import (
    factor_explanation,
    feature_label,
    generate_personalized_suggestions,
    global_factor_items,
)

import os

ROOT_DIR = Path(__file__).resolve().parents[2]


def _resolve_model_dir() -> Path:
    env_dir = os.getenv("MODEL_DIR")
    if env_dir and Path(env_dir).is_dir():
        return Path(env_dir)
    candidates = [
        ROOT_DIR / "ml_model",
        Path(__file__).resolve().parents[1] / "ml_model",
        Path.cwd() / "ml_model",
        Path.cwd().parent / "ml_model",
    ]
    for candidate in candidates:
        if candidate.is_dir() and (candidate / "trained_model.h5").is_file():
            return candidate
    return candidates[0]


DEFAULT_MODEL_DIR = _resolve_model_dir()
DISCLAIMER = (
    "MindEase is a research and digital-wellness tool, not a medical diagnosis. "
    "These model-based patterns are not proof of cause and should not replace "
    "professional medical or psychological advice."
)


class InvalidAssessmentError(ValueError):
    """Raised when assessment responses do not match the model input schema."""


class AssessmentPredictor:
    # Class-level caches to guarantee artifacts are loaded only once
    _cached_model: Any = None
    _cached_preprocessor: Any = None
    _cached_metadata: dict[str, Any] | None = None
    _cached_importance_map: dict[str, float] | None = None

    def __init__(self, model_dir: Path = DEFAULT_MODEL_DIR) -> None:
        if (
            AssessmentPredictor._cached_model is None
            or AssessmentPredictor._cached_preprocessor is None
            or AssessmentPredictor._cached_metadata is None
        ):
            self._load_artifacts(model_dir)

        self.model = AssessmentPredictor._cached_model
        self.preprocessor = AssessmentPredictor._cached_preprocessor
        self.metadata = AssessmentPredictor._cached_metadata  # type: ignore[assignment]
        self.importance_map = AssessmentPredictor._cached_importance_map or {}

        self.schema = self.metadata["schema"]
        self.feature_columns = self.metadata["feature_columns"]
        self.class_names = self.metadata["class_names"]
        self.baseline = pd.DataFrame(
            [self.metadata["baseline_row"]], columns=self.feature_columns
        )
        self.feature_index = {
            feature: index for index, feature in enumerate(self.feature_columns)
        }
        self._validate_artifacts()
        self._warmup_model()

    def _load_artifacts(self, model_dir: Path) -> None:
        model_path = model_dir / "trained_model.h5"
        preprocessor_path = model_dir / "preprocessor.pkl"
        metadata_path = model_dir / "model_metadata.json"
        missing = [
            path.name
            for path in (model_path, preprocessor_path, metadata_path)
            if not path.is_file()
        ]
        if missing:
            raise FileNotFoundError(
                f"Required trained model artifacts are missing from {model_dir}: "
                + ", ".join(missing)
            )

        AssessmentPredictor._cached_model = load_model(model_path, compile=False)
        AssessmentPredictor._cached_preprocessor = joblib.load(preprocessor_path)
        metadata = json.loads(metadata_path.read_text(encoding="utf-8"))
        AssessmentPredictor._cached_metadata = metadata

        # Build feature importance map for quick candidate prioritization
        importance_map: dict[str, float] = {}
        perm_file = model_dir / "permutation_importance.csv"
        if perm_file.is_file():
            try:
                with open(perm_file, mode="r", encoding="utf-8") as f:
                    reader = csv.DictReader(f)
                    for row in reader:
                        feat = row.get("feature")
                        val = row.get("permutation_importance_mean")
                        if feat and val:
                            importance_map[feat] = float(val)
            except Exception:
                pass

        if not importance_map:
            for item in metadata.get("top_global_features", []):
                importance_map[item["feature"]] = float(
                    item.get("permutation_importance_mean", 0.01)
                )

        # Baseline priorities for core user-facing attention domains
        core_priorities = [
            "sleep_quality",
            "daily_screen_time",
            "phone_checking_without_notification",
            "mental_overload",
            "stress_level",
            "procrastination",
            "reaction_time_ms",
            "attention_accuracy_percentage",
            "focus_flow_distraction_count",
            "app_switching_frequency",
            "memory_score",
            "task_switch_accuracy",
            "stroop_accuracy_percentage",
            "noise_level",
            "desk_organization",
            "difficulty_controlling_thoughts",
            "thought_branching",
            "thought_worries",
            "thought_future_planning",
            "thought_past_memories",
            "wake_refreshed",
            "notifications_interrupt_work",
        ]
        for idx, feat in enumerate(core_priorities):
            # Ensure core features have at least a solid priority score
            importance_map[feat] = max(
                importance_map.get(feat, 0.0), 0.02 - (idx * 0.0005)
            )

        AssessmentPredictor._cached_importance_map = importance_map

    def _validate_artifacts(self) -> None:
        if set(self.feature_columns) != set(self.schema["feature_columns"]):
            raise RuntimeError(
                "Saved model metadata has inconsistent feature-column definitions."
            )
        if len(self.class_names) != 3:
            raise RuntimeError("Saved model metadata must define three output classes.")
        expected_size = int(self.model.input_shape[-1])
        actual_size = int(self.preprocessor.transform(self.baseline).shape[1])
        if actual_size != expected_size:
            raise RuntimeError(
                "The saved preprocessor output does not match the neural-network "
                f"input ({actual_size} features vs {expected_size})."
            )

    def _warmup_model(self) -> None:
        """Execute a quick warm-up inference pass so TensorFlow initializes graph execution."""
        try:
            expected_size = int(self.model.input_shape[-1])
            dummy = np.zeros((1, expected_size), dtype=np.float32)
            self.model(dummy, training=False)
        except Exception:
            pass

    def predict(self, responses: dict[str, Any]) -> dict[str, Any]:
        if not responses:
            raise InvalidAssessmentError("Provide at least one assessment response.")

        # Clean copy and normalize user-friendly aliases
        cleaned_responses = dict(responses)

        # Handle break habits mapping cleanly
        break_habits = cleaned_responses.pop("break_habits", None)
        if break_habits is not None:
            if str(break_habits).strip() == "Regular breaks":
                cleaned_responses.setdefault("improve_breaks", 0.0)
                cleaned_responses.setdefault("method_pomodoro", 1.0)
            else:
                cleaned_responses.setdefault("improve_breaks", 1.0)
                cleaned_responses.setdefault("method_pomodoro", 0.0)

        # Handle exercise frequency alias
        if cleaned_responses.get("exercise_frequency") == "Occasionally":
            cleaned_responses["exercise_frequency"] = "1-2 times/week"

        allowed = set(self.feature_columns)
        provided = set(cleaned_responses)
        unknown = sorted(provided - allowed)
        if unknown:
            raise InvalidAssessmentError(
                "Unrecognized assessment field(s): "
                + ", ".join(unknown)
                + ". Use feature names from the dataset."
            )
        invalid_values = [
            key
            for key, value in cleaned_responses.items()
            if isinstance(value, (dict, list, tuple, set))
        ]
        if invalid_values:
            raise InvalidAssessmentError(
                "Each assessment answer must be a single value. Invalid field(s): "
                + ", ".join(invalid_values)
            )

        # Build clean assessment dataframe
        row_dict: dict[str, Any] = {}
        for column in self.feature_columns:
            row_dict[column] = cleaned_responses.get(column, np.nan)

        assessment = pd.DataFrame([row_dict], columns=self.feature_columns)

        for feature in self.schema["numeric_columns"]:
            raw_value = assessment.at[0, feature]
            if pd.isna(raw_value):
                continue
            try:
                numeric_value = float(raw_value)
            except (TypeError, ValueError) as error:
                raise InvalidAssessmentError(
                    f"'{feature}' must be a numeric value."
                ) from error
            if not np.isfinite(numeric_value):
                raise InvalidAssessmentError(
                    f"'{feature}' must be a finite numeric value."
                )
            assessment.at[0, feature] = numeric_value

        for feature in self.schema["binary_columns"]:
            raw_value = assessment.at[0, feature]
            if pd.isna(raw_value):
                continue
            try:
                numeric_value = float(raw_value)
            except (TypeError, ValueError) as error:
                raise InvalidAssessmentError(
                    f"'{feature}' must be 0 or 1."
                ) from error
            if numeric_value not in (0.0, 1.0):
                raise InvalidAssessmentError(f"'{feature}' must be 0 or 1.")
            assessment.at[0, feature] = numeric_value

        for feature in self.schema["categorical_columns"]:
            raw_value = assessment.at[0, feature]
            if not pd.isna(raw_value):
                assessment.at[0, feature] = str(raw_value)

        transformed = np.asarray(
            self.preprocessor.transform(assessment), dtype=np.float32
        )
        probabilities = self.model(transformed, training=False).numpy()[0]
        predicted_index = int(np.argmax(probabilities))
        level = str(self.class_names[predicted_index])
        confidence = float(probabilities[predicted_index])

        factors = self._local_factors(
            assessment, cleaned_responses, predicted_index, confidence, level
        )

        suggestions = generate_personalized_suggestions(
            cleaned_responses, factors, level
        )

        if factors:
            explanation = (
                f"The model estimated {level} attention interference with "
                f"{confidence:.1%} confidence. The responses that most actively "
                "shaped this result are highlighted below."
            )
        else:
            explanation = (
                f"The model estimated {level} attention interference with "
                f"{confidence:.1%} confidence based on your balanced lifestyle "
                "and focus habits."
            )

        return {
            "attention_interference_level": level,
            "confidence_percentage": round(confidence * 100, 2),
            "explanation": explanation,
            "contributing_factors": factors,
            "personalized_suggestions": suggestions,
            "global_model_factors": global_factor_items(
                self.metadata.get("top_global_features", [])
            ),
            "disclaimer": DISCLAIMER,
        }

    def _local_factors(
        self,
        assessment: pd.DataFrame,
        cleaned_responses: dict[str, Any],
        predicted_index: int,
        confidence: float,
        level: str,
        limit: int = 5,
    ) -> list[dict[str, Any]]:
        """Compute personal sensitivity factors rapidly by testing provided answers against baseline."""
        # Candidate features must be answered by the user and differ from the baseline value
        candidates: list[str] = []
        for feature in self.feature_columns:
            if feature not in cleaned_responses:
                continue
            answer = assessment.at[0, feature]
            if pd.isna(answer):
                continue
            base_val = self.baseline.at[0, feature]
            if isinstance(answer, (int, float, np.number)) and isinstance(
                base_val, (int, float, np.number)
            ):
                if abs(float(answer) - float(base_val)) < 1e-4:
                    continue
            elif str(answer).strip().lower() == str(base_val).strip().lower():
                continue
            candidates.append(feature)

        if not candidates:
            return []

        # Sort candidate features by importance so top candidate signals are evaluated first
        candidates.sort(
            key=lambda f: self.importance_map.get(f, 0.0), reverse=True
        )

        # Evaluate up to 20 candidates in a single tensor batch
        eval_candidates = candidates[:20]
        base_dict = assessment.iloc[0].to_dict()

        variant_rows: list[dict[str, Any]] = []
        tested_features: list[str] = []
        for feature in eval_candidates:
            row = dict(base_dict)
            row[feature] = self.baseline.at[0, feature]
            variant_rows.append(row)
            tested_features.append(feature)

        variants_df = pd.DataFrame(variant_rows, columns=self.feature_columns)
        transformed_variants = np.asarray(
            self.preprocessor.transform(variants_df), dtype=np.float32
        )
        variant_probabilities = self.model(
            transformed_variants, training=False
        ).numpy()

        rows: list[dict[str, Any]] = []
        for index, feature in enumerate(tested_features):
            reference_confidence = float(
                variant_probabilities[index, predicted_index]
            )
            change_points = (confidence - reference_confidence) * 100
            if abs(change_points) < 0.05:
                continue
            answer = assessment.at[0, feature]
            direction = "supports" if change_points > 0 else "reduces"
            rows.append(
                {
                    "feature": feature,
                    "label": feature_label(feature),
                    "answer": answer.item() if hasattr(answer, "item") else answer,
                    "confidence_change_percentage_points": round(
                        change_points, 2
                    ),
                    "explanation": factor_explanation(
                        feature, answer, direction, level
                    ),
                    "_magnitude": abs(change_points),
                }
            )

        rows.sort(key=lambda factor: factor["_magnitude"], reverse=True)
        for factor in rows:
            factor.pop("_magnitude")
        return rows[:limit]
