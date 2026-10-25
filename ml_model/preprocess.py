"""Reusable preprocessing helpers for attention-interference assessments."""

from __future__ import annotations

from typing import Any

import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

TARGET_COLUMN = "attention_interference_level"
ID_COLUMN = "participant_id"


def prepare_features(data: pd.DataFrame, schema: dict[str, Any]) -> pd.DataFrame:
    """Align incoming columns to the fitted schema and normalize their dtypes."""
    expected = schema["feature_columns"]
    frame = data.drop(columns=[ID_COLUMN, TARGET_COLUMN], errors="ignore").copy()
    frame = frame.reindex(columns=expected)

    for column in schema["numeric_columns"] + schema["binary_columns"]:
        frame[column] = pd.to_numeric(frame[column], errors="coerce")
    for column in schema["categorical_columns"]:
        frame[column] = frame[column].map(
            lambda value: np.nan if pd.isna(value) else str(value)
        )
    return frame


def infer_schema(features: pd.DataFrame) -> dict[str, Any]:
    """Classify feature columns from their observed training values."""
    numeric_columns: list[str] = []
    binary_columns: list[str] = []
    categorical_columns: list[str] = []

    for column in features.columns:
        converted = pd.to_numeric(features[column], errors="coerce")
        observed = features[column].notna()
        if not observed.any() or converted[observed].notna().all():
            values = set(converted.dropna().unique().tolist())
            if values and values.issubset({0, 1}):
                binary_columns.append(column)
            else:
                numeric_columns.append(column)
        else:
            categorical_columns.append(column)

    return {
        "feature_columns": list(features.columns),
        "numeric_columns": numeric_columns,
        "binary_columns": binary_columns,
        "categorical_columns": categorical_columns,
    }


def build_preprocessor(schema: dict[str, Any]) -> ColumnTransformer:
    """Build an imputation, encoding, and scaling pipeline from a schema."""
    transformers: list[tuple[str, Any, list[str]]] = []
    if schema["binary_columns"]:
        transformers.append(
            (
                "binary",
                SimpleImputer(strategy="most_frequent"),
                schema["binary_columns"],
            )
        )
    if schema["numeric_columns"]:
        transformers.append(
            (
                "numeric",
                Pipeline(
                    [
                        ("imputer", SimpleImputer(strategy="median")),
                        ("scaler", StandardScaler()),
                    ]
                ),
                schema["numeric_columns"],
            )
        )
    if schema["categorical_columns"]:
        transformers.append(
            (
                "categorical",
                Pipeline(
                    [
                        ("imputer", SimpleImputer(strategy="most_frequent")),
                        (
                            "encoder",
                            OneHotEncoder(handle_unknown="ignore"),
                        ),
                    ]
                ),
                schema["categorical_columns"],
            )
        )
    return ColumnTransformer(transformers=transformers, remainder="drop")


def get_transformed_feature_names(
    preprocessor: ColumnTransformer, schema: dict[str, Any]
) -> list[str]:
    """Return transformed names and retain the source column for each output."""
    names: list[str] = []
    for column in schema["binary_columns"]:
        names.append(column)
    for column in schema["numeric_columns"]:
        names.append(column)
    if schema["categorical_columns"]:
        encoder = preprocessor.named_transformers_["categorical"].named_steps[
            "encoder"
        ]
        names.extend(encoder.get_feature_names_out(schema["categorical_columns"]))
    return [str(name) for name in names]
