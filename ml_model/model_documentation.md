# MindEase attention assessment model

## Purpose and limitations

This project estimates an **Attention Interference Level** (Low, Moderate, or
High) from synthetic questionnaire and cognitive-test responses. It is intended
for digital wellness and research demonstration only. It is **not a medical
diagnosis**, does not establish a clinical condition, and should not be used as
a substitute for professional assessment.

## Dataset

The source CSV is `dataset/attention_interference_dataset.csv`. The training
script creates `analysis_report.md` with the actual row/column counts, column
types, missing-value and duplicate counts, and target distribution. It also
lists each field and its observed data type.

The model excludes `participant_id` because it identifies a record rather than
measuring attention. It also excludes `attention_interference_level` from the
input features because that is the value to predict. The remaining questionnaire,
behavioral, and cognitive fields are used as candidate predictors.

## Preprocessing

`preprocess.py` infers feature types from training data:

- Numeric fields containing only 0/1 are treated as binary or multi-hot.
- Other numeric fields are median-imputed and standardized.
- Categorical questionnaire fields are imputed with their most frequent value
  and one-hot encoded. Unseen categories at prediction time are ignored.
- Binary fields are imputed with the most frequent value and retained as 0/1.

The data is split into a stratified 80% training partition and 20% test
partition. A 10% validation partition is taken from the training portion for
early stopping. The preprocessor is fitted only on the training partition to
avoid test-data leakage.

## Neural network architecture

The Keras classifier receives the transformed input features and uses:

1. Dense layer with 128 units and ReLU activation.
2. Dropout of 30%.
3. Dense layer with 64 units and ReLU activation.
4. Dropout of 20%.
5. Dense layer with 32 units and ReLU activation.
6. Three-unit softmax output for High, Low, and Moderate.

The model uses Adam and sparse categorical cross-entropy. Early stopping
monitors validation loss, restores the best weights, and stops after ten
non-improving epochs. The learning rate is reduced when validation loss plateaus.

## Baseline and feature importance

A class-balanced Random Forest is trained on the same training partition and
compared with the neural network on the same held-out test partition.
`evaluation_report.md` gives accuracy, per-class precision, recall, F1-score,
macro/weighted averages, and confusion matrices for both models.
`model_comparison.csv` contains their accuracy comparison.

`permutation_importance.csv` reports neural-network permutation importance on
the held-out test data. It measures how test accuracy changes when a transformed
feature is shuffled; one-hot columns are permuted together and grouped under
their source feature. `feature_importance.png` visualizes the top 20 factors.
This implementation calls the Keras model directly and does not wrap it in a
scikit-learn estimator. Importance is a global model-importance measure, not
evidence of causality.

## Training outputs

Run the script from the project root:

```powershell
python -m pip install -r ml_model/requirements.txt
python ml_model/train_model.py
```

Training creates `analysis_report.md`, `evaluation_report.md`,
`model_comparison.csv`, `permutation_importance.csv`, `preprocessor.pkl`,
`feature_importance.png`, `trained_model.h5`, and `model_metadata.json` inside
`ml_model/`.
To use a different CSV, pass `--dataset path\to\data.csv`.

## Prediction

After training, provide one JSON file or CSV row:

```powershell
python ml_model/predict.py --input assessment.json
python ml_model/predict.py --json "{\"sleep_quality\":\"Poor\",\"stress_level\":\"High\"}"
```

Unknown extra fields are ignored; absent fields are imputed according to the
saved training preprocessing. Prediction returns the predicted level and the
softmax probability for that class as confidence.

The result also includes two kinds of factors:

- **Major contributing factors** are per-assessment sensitivity estimates. Each
  input is changed individually to a representative training value (median for
  numeric fields, most frequent value for categorical fields), and the change
  in the predicted class probability is reported. This is a local sensitivity
  check, not a causal explanation.
- **Global permutation importance** lists the leading dataset-wide factors
  measured during training.

For a batch CSV/JSON list, the script returns one result per assessment.
