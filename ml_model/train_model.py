"""Analyze the dataset, compare classifiers, and save the final Keras model."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
)
from sklearn.model_selection import train_test_split

from preprocess import (
    ID_COLUMN,
    TARGET_COLUMN,
    build_preprocessor,
    get_transformed_feature_names,
    infer_schema,
    prepare_features,
)

BASE_DIR = Path(__file__).resolve().parent
DATASET_PATH = BASE_DIR.parent / "dataset" / "attention_interference_dataset.csv"
RANDOM_STATE = 42
CLASS_NAMES = ["High", "Low", "Moderate"]


def _keras_permutation_importance(
    model: Any,
    features: np.ndarray,
    labels: np.ndarray,
    feature_groups: dict[str, list[int]],
    repeats: int = 5,
    max_samples: int = 1000,
) -> pd.DataFrame:
    """Calculate grouped permutation importance using Keras model predictions."""
    if features.ndim != 2 or features.shape[0] != len(labels):
        raise ValueError("Feature matrix and labels must have matching rows.")
    if repeats < 1 or max_samples < 1:
        raise ValueError("repeats and max_samples must be positive.")
    if not feature_groups:
        raise ValueError("No feature groups were provided for importance analysis.")

    rng = np.random.default_rng(RANDOM_STATE)
    if len(labels) > max_samples:
        selected = rng.choice(len(labels), size=max_samples, replace=False)
        features = features[selected]
        labels = labels[selected]

    baseline_predictions = model.predict(
        np.asarray(features, dtype=np.float32), batch_size=256, verbose=0
    )
    baseline_predictions = np.asarray(CLASS_NAMES)[baseline_predictions.argmax(axis=1)]
    baseline_accuracy = accuracy_score(labels, baseline_predictions)
    feature_names = list(feature_groups)
    importance_drops = np.zeros((repeats, len(feature_names)), dtype=np.float64)
    group_batch_size = 16

    for repeat in range(repeats):
        for start in range(0, len(feature_names), group_batch_size):
            batch_names = feature_names[start : start + group_batch_size]
            batch_features = []
            for feature_name in batch_names:
                permuted = features.copy()
                row_order = rng.permutation(len(labels))
                columns = feature_groups[feature_name]
                permuted[:, columns] = permuted[row_order][:, columns]
                batch_features.append(permuted)

            stacked = np.concatenate(batch_features, axis=0).astype(
                np.float32, copy=False
            )
            predictions = model.predict(
                stacked, batch_size=256, verbose=0
            )
            predictions = np.asarray(CLASS_NAMES)[predictions.argmax(axis=1)]
            predictions = predictions.reshape(len(batch_names), len(labels))
            for offset, predicted in enumerate(predictions):
                importance_drops[repeat, start + offset] = (
                    baseline_accuracy - accuracy_score(labels, predicted)
                )

    return pd.DataFrame(
        {
            "feature": feature_names,
            "permutation_importance_mean": importance_drops.mean(axis=0),
            "permutation_importance_std": importance_drops.std(axis=0),
        }
    ).sort_values("permutation_importance_mean", ascending=False)


def _dataset_analysis(data: pd.DataFrame) -> str:
    target_counts = data[TARGET_COLUMN].value_counts(dropna=False)
    feature_columns = [
        column for column in data.columns if column != TARGET_COLUMN
    ]
    dtypes = data.dtypes.astype(str)
    missing = data.isna().sum()
    duplicate_count = int(data.duplicated().sum())

    sections = [
        "# Dataset analysis report",
        "",
        f"- Source: `{DATASET_PATH.relative_to(BASE_DIR.parent)}`",
        f"- Rows: {len(data)}",
        f"- Columns (including target): {len(data.columns)}",
        f"- Feature columns: {len(feature_columns)}",
        f"- Duplicate records: {duplicate_count}",
        f"- Missing cells: {int(missing.sum())}",
        f"- Target column: `{TARGET_COLUMN}`",
        "",
        "## Target distribution",
        "",
        "| Class | Count | Percentage |",
        "|---|---:|---:|",
    ]
    for label, count in target_counts.items():
        sections.append(
            f"| {label} | {int(count)} | {count / len(data) * 100:.2f}% |"
        )

    sections.extend(
        [
            "",
            "## Columns and data types",
            "",
            "| Column | Data type | Missing |",
            "|---|---|---:|",
        ]
    )
    for column in data.columns:
        sections.append(
            f"| `{column}` | `{dtypes[column]}` | {int(missing[column])} |"
        )
    return "\n".join(sections) + "\n"


def _classification_metrics(
    y_true: np.ndarray, y_pred: np.ndarray, labels: list[str]
) -> dict[str, Any]:
    return {
        "accuracy": float(accuracy_score(y_true, y_pred)),
        "classification_report": classification_report(
            y_true,
            y_pred,
            labels=labels,
            output_dict=True,
            zero_division=0,
        ),
        "confusion_matrix": confusion_matrix(
            y_true, y_pred, labels=labels
        ).tolist(),
    }


def _write_evaluation_report(
    model_metrics: dict[str, dict[str, Any]], labels: list[str]
) -> None:
    lines = [
        "# Model evaluation report",
        "",
        "The holdout test set is 20% of the dataset and was not used to fit preprocessing or models.",
        "Precision, recall, and F1 are reported per class and as macro/weighted averages.",
        "",
    ]
    for model_name, metrics in model_metrics.items():
        lines.extend(
            [
                f"## {model_name}",
                "",
                f"- Accuracy: {metrics['accuracy']:.4f}",
                "",
                "| Class | Precision | Recall | F1-score | Support |",
                "|---|---:|---:|---:|---:|",
            ]
        )
        report = metrics["classification_report"]
        for label in labels + ["macro avg", "weighted avg"]:
            values = report[label]
            lines.append(
                f"| {label} | {values['precision']:.4f} | {values['recall']:.4f} "
                f"| {values['f1-score']:.4f} | {int(values['support'])} |"
            )
        matrix = metrics["confusion_matrix"]
        lines.extend(
            [
                "",
                "Confusion matrix (rows = actual, columns = predicted):",
                "",
                "| Actual / predicted | "
                + " | ".join(labels)
                + " |",
                "|---|"
                + "---:|" * len(labels),
            ]
        )
        for label, row in zip(labels, matrix):
            lines.append(
                f"| {label} | " + " | ".join(str(value) for value in row) + " |"
            )
        lines.append("")
    (BASE_DIR / "evaluation_report.md").write_text(
        "\n".join(lines), encoding="utf-8"
    )


def _build_neural_network(input_size: int, class_count: int) -> Any:
    try:
        import tensorflow as tf
    except (ImportError, OSError, RuntimeError) as exc:
        raise RuntimeError(
            "TensorFlow/Keras could not be loaded for neural-network training. "
            "Install project dependencies with `python -m pip install -r "
            "ml_model/requirements.txt` and check that TensorFlow supports this "
            f"Python/platform combination. Original error: {exc}"
        ) from exc

    tf.keras.utils.set_random_seed(RANDOM_STATE)
    model = tf.keras.Sequential(
        [
            tf.keras.layers.Input(shape=(input_size,)),
            tf.keras.layers.Dense(128, activation="relu"),
            tf.keras.layers.Dropout(0.30),
            tf.keras.layers.Dense(64, activation="relu"),
            tf.keras.layers.Dropout(0.20),
            tf.keras.layers.Dense(32, activation="relu"),
            tf.keras.layers.Dense(class_count, activation="softmax"),
        ]
    )
    model.compile(
        optimizer="adam",
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"],
    )
    return model


def train(dataset_path: Path = DATASET_PATH) -> None:
    if not dataset_path.is_file():
        raise FileNotFoundError(f"Dataset file was not found: {dataset_path}")
    data = pd.read_csv(dataset_path)
    if TARGET_COLUMN not in data:
        raise ValueError(f"Required target column is missing: {TARGET_COLUMN}")
    if data[TARGET_COLUMN].isna().any():
        raise ValueError("Target labels cannot be missing.")

    analysis_path = BASE_DIR / "analysis_report.md"
    analysis_path.write_text(_dataset_analysis(data), encoding="utf-8")

    features = data.drop(columns=[TARGET_COLUMN, ID_COLUMN], errors="ignore")
    if features.empty:
        raise ValueError("No input features remain after excluding identifiers.")
    labels = data[TARGET_COLUMN].astype(str)
    observed_classes = sorted(labels.unique().tolist())
    if observed_classes != CLASS_NAMES:
        raise ValueError(
            f"Expected exactly these target classes {CLASS_NAMES}; "
            f"found {observed_classes}."
        )

    x_train, x_test, y_train_text, y_test_text = train_test_split(
        features,
        labels,
        test_size=0.20,
        random_state=RANDOM_STATE,
        stratify=labels,
    )
    x_fit, x_validation, y_fit_text, y_validation_text = train_test_split(
        x_train,
        y_train_text,
        test_size=0.10,
        random_state=RANDOM_STATE,
        stratify=y_train_text,
    )

    schema = infer_schema(x_fit)
    preprocessor = build_preprocessor(schema)
    x_fit_ready = prepare_features(x_fit, schema)
    x_validation_ready = prepare_features(x_validation, schema)
    x_test_ready = prepare_features(x_test, schema)
    x_fit_processed = preprocessor.fit_transform(x_fit_ready)
    x_validation_processed = preprocessor.transform(x_validation_ready)
    x_test_processed = preprocessor.transform(x_test_ready)

    # TensorFlow models accept dense arrays. This dataset's one-hot matrix is modest.
    x_fit_processed = np.asarray(x_fit_processed, dtype=np.float32)
    x_validation_processed = np.asarray(x_validation_processed, dtype=np.float32)
    x_test_processed = np.asarray(x_test_processed, dtype=np.float32)
    class_to_index = {label: index for index, label in enumerate(CLASS_NAMES)}
    y_fit = y_fit_text.map(class_to_index).to_numpy(dtype=np.int64)
    y_validation = y_validation_text.map(class_to_index).to_numpy(dtype=np.int64)

    model = _build_neural_network(x_fit_processed.shape[1], len(CLASS_NAMES))
    import tensorflow as tf

    callbacks = [
        tf.keras.callbacks.EarlyStopping(
            monitor="val_loss", patience=10, restore_best_weights=True
        ),
        tf.keras.callbacks.ReduceLROnPlateau(
            monitor="val_loss", factor=0.5, patience=4, min_lr=1e-6
        ),
    ]
    model.fit(
        x_fit_processed,
        y_fit,
        validation_data=(x_validation_processed, y_validation),
        epochs=100,
        batch_size=32,
        callbacks=callbacks,
        verbose=2,
    )

    y_test = y_test_text.to_numpy()
    nn_probabilities = model.predict(x_test_processed, verbose=0)
    nn_predictions = np.asarray(CLASS_NAMES)[nn_probabilities.argmax(axis=1)]

    forest = RandomForestClassifier(
        n_estimators=300,
        min_samples_leaf=2,
        class_weight="balanced",
        random_state=RANDOM_STATE,
        n_jobs=-1,
    )
    forest.fit(x_fit_processed, y_fit_text)
    forest_predictions = forest.predict(x_test_processed)
    metrics = {
        "Neural Network": _classification_metrics(
            y_test, nn_predictions, CLASS_NAMES
        ),
        "Random Forest": _classification_metrics(
            y_test, forest_predictions, CLASS_NAMES
        ),
    }
    _write_evaluation_report(metrics, CLASS_NAMES)
    pd.DataFrame(
        [
            {"model": name, "accuracy": result["accuracy"]}
            for name, result in metrics.items()
        ]
    ).to_csv(BASE_DIR / "model_comparison.csv", index=False)

    transformed_names = get_transformed_feature_names(preprocessor, schema)
    if len(transformed_names) != x_test_processed.shape[1]:
        raise RuntimeError(
            "Transformed feature names do not match the preprocessing output."
        )

    source_by_transformed: dict[str, str] = {}
    for column in schema["binary_columns"] + schema["numeric_columns"]:
        source_by_transformed[column] = column
    for column in schema["categorical_columns"]:
        encoder = preprocessor.named_transformers_["categorical"].named_steps[
            "encoder"
        ]
        categories = encoder.categories_
        for original, values in zip(schema["categorical_columns"], categories):
            for value in values:
                source_by_transformed[f"{original}_{value}"] = original

    feature_groups: dict[str, list[int]] = {}
    for index, name in enumerate(transformed_names):
        source = source_by_transformed.get(name, name)
        feature_groups.setdefault(source, []).append(index)

    importance_frame = _keras_permutation_importance(
        model, x_test_processed, y_test, feature_groups
    )
    importance_frame.to_csv(BASE_DIR / "permutation_importance.csv", index=False)
    try:
        import matplotlib

        matplotlib.use("Agg")
        import matplotlib.pyplot as plt
    except ImportError as exc:
        raise RuntimeError(
            "Matplotlib is required to create the feature-importance plot. "
            "Install project dependencies with `python -m pip install -r "
            "ml_model/requirements.txt`."
        ) from exc

    plot_features = importance_frame.head(20).sort_values(
        "permutation_importance_mean", ascending=True
    )
    figure_height = max(6, len(plot_features) * 0.32)
    figure, axis = plt.subplots(figsize=(10, figure_height))
    axis.barh(
        plot_features["feature"],
        plot_features["permutation_importance_mean"],
        xerr=plot_features["permutation_importance_std"],
        color="#3977a8",
        alpha=0.85,
    )
    axis.set_xlabel("Decrease in holdout accuracy after permutation")
    axis.set_title("Neural network global feature importance")
    axis.grid(axis="x", linestyle=":", alpha=0.5)
    figure.tight_layout()
    figure.savefig(BASE_DIR / "feature_importance.png", dpi=160)
    plt.close(figure)

    baseline_row = {}
    for column in schema["feature_columns"]:
        values = x_fit[column]
        if column in schema["numeric_columns"] + schema["binary_columns"]:
            baseline_row[column] = float(pd.to_numeric(values, errors="coerce").median())
        else:
            modes = values.dropna().mode()
            baseline_row[column] = modes.iloc[0] if not modes.empty else np.nan

    metadata = {
        "class_names": CLASS_NAMES,
        "feature_columns": schema["feature_columns"],
        "schema": schema,
        "baseline_row": baseline_row,
        "top_global_features": importance_frame.head(10)[
            ["feature", "permutation_importance_mean"]
        ].to_dict(orient="records"),
        "excluded_columns": [ID_COLUMN, TARGET_COLUMN],
        "random_state": RANDOM_STATE,
    }
    joblib.dump(preprocessor, BASE_DIR / "preprocessor.pkl")
    (BASE_DIR / "model_metadata.json").write_text(
        json.dumps(metadata, indent=2, allow_nan=False), encoding="utf-8"
    )
    model.save(BASE_DIR / "trained_model.h5")

    print(f"Dataset analysis: {analysis_path}")
    print(f"Evaluation report: {BASE_DIR / 'evaluation_report.md'}")
    print(f"Permutation importance: {BASE_DIR / 'permutation_importance.csv'}")
    print(f"Feature-importance plot: {BASE_DIR / 'feature_importance.png'}")
    print(f"Saved model: {BASE_DIR / 'trained_model.h5'}")
    print(f"Saved preprocessor: {BASE_DIR / 'preprocessor.pkl'}")
    print(f"Model comparison: {metrics}")
    print("Top global permutation-importance features:")
    print(importance_frame.head(10).to_string(index=False))


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--dataset",
        type=Path,
        default=DATASET_PATH,
        help="CSV dataset path (defaults to dataset/attention_interference_dataset.csv).",
    )
    arguments = parser.parse_args()
    try:
        train(arguments.dataset)
    except (FileNotFoundError, ValueError, RuntimeError) as exc:
        print(f"Training failed: {exc}", file=sys.stderr)
        raise SystemExit(1) from exc


if __name__ == "__main__":
    main()
