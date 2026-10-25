"""Predict an attention-interference level from a JSON or CSV assessment."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

import joblib
import numpy as np
import pandas as pd

from preprocess import prepare_features

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "trained_model.h5"
PREPROCESSOR_PATH = BASE_DIR / "preprocessor.pkl"
METADATA_PATH = BASE_DIR / "model_metadata.json"


def load_assessment(input_path: Path | None, json_text: str | None) -> pd.DataFrame:
    if input_path is not None and json_text is not None:
        raise ValueError("Provide either --input or --json, not both.")
    if input_path is not None:
        if input_path.suffix.lower() == ".json":
            payload = json.loads(input_path.read_text(encoding="utf-8"))
            records = payload if isinstance(payload, list) else [payload]
            if not all(isinstance(record, dict) for record in records):
                raise ValueError("JSON input must be an object or a list of objects.")
            return pd.DataFrame(records)
        return pd.read_csv(input_path)
    if json_text is not None:
        payload = json.loads(json_text)
        records = payload if isinstance(payload, list) else [payload]
        if not all(isinstance(record, dict) for record in records):
            raise ValueError("JSON input must be an object or a list of objects.")
        return pd.DataFrame(records)
    raise ValueError("Provide a JSON or CSV assessment using --json or --input.")


def _load_model() -> tuple[Any, Any, dict[str, Any]]:
    required_paths = [MODEL_PATH, PREPROCESSOR_PATH, METADATA_PATH]
    missing = [str(path) for path in required_paths if not path.is_file()]
    if missing:
        raise FileNotFoundError(
            "Model files are missing. Run `python ml_model/train_model.py` first: "
            + ", ".join(missing)
        )
    try:
        from tensorflow.keras.models import load_model
    except (ImportError, OSError, RuntimeError) as exc:
        raise RuntimeError(
            "TensorFlow/Keras could not be loaded for prediction. Install "
            "ml_model/requirements.txt and check that TensorFlow supports this "
            f"Python/platform combination. Original error: {exc}"
        ) from exc
    model = load_model(MODEL_PATH)
    preprocessor = joblib.load(PREPROCESSOR_PATH)
    metadata = json.loads(METADATA_PATH.read_text(encoding="utf-8"))
    return model, preprocessor, metadata


def predict(assessments: pd.DataFrame) -> list[dict[str, Any]]:
    model, preprocessor, metadata = _load_model()
    schema = metadata["schema"]
    aligned = prepare_features(assessments, schema)
    processed = np.asarray(preprocessor.transform(aligned), dtype=np.float32)
    probabilities = model.predict(processed, verbose=0)
    classes = metadata["class_names"]
    baseline = pd.DataFrame(
        [metadata["baseline_row"]], columns=schema["feature_columns"]
    )
    results: list[dict[str, Any]] = []

    for row_index, (row, row_probabilities) in enumerate(
        zip(aligned.to_dict(orient="records"), probabilities)
    ):
        predicted_index = int(np.argmax(row_probabilities))
        predicted_class = classes[predicted_index]
        confidence = float(row_probabilities[predicted_index])
        sensitivities: list[dict[str, Any]] = []
        for feature in schema["feature_columns"]:
            perturbed = dict(row)
            perturbed[feature] = baseline.iloc[0][feature]
            perturbed_frame = pd.DataFrame(
                [perturbed], columns=schema["feature_columns"]
            )
            perturbed_processed = np.asarray(
                preprocessor.transform(perturbed_frame), dtype=np.float32
            )
            perturbed_probabilities = model.predict(
                perturbed_processed, verbose=0
            )[0]
            delta = confidence - float(perturbed_probabilities[predicted_index])
            if abs(delta) > 1e-6:
                sensitivities.append(
                    {
                        "feature": feature,
                        "confidence_change": round(delta * 100, 2),
                    }
                )
        sensitivities.sort(
            key=lambda item: abs(item["confidence_change"]), reverse=True
        )

        results.append(
            {
                "assessment_number": row_index + 1,
                "attention_interference_level": predicted_class,
                "confidence": round(confidence * 100, 2),
                "major_contributing_factors": sensitivities[:5],
                "global_permutation_importance": metadata[
                    "top_global_features"
                ][:5],
            }
        )
    return results


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, help="Assessment JSON or CSV file.")
    parser.add_argument("--json", help="Assessment values as a JSON object.")
    arguments = parser.parse_args()
    try:
        assessment = load_assessment(arguments.input, arguments.json)
        for result in predict(assessment):
            print(json.dumps(result, indent=2))
    except (FileNotFoundError, ValueError, json.JSONDecodeError, RuntimeError) as exc:
        print(f"Prediction failed: {exc}", file=sys.stderr)
        raise SystemExit(1) from exc


if __name__ == "__main__":
    main()
