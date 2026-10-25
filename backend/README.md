# MindEase backend

The backend exposes the saved research model through FastAPI. It loads existing
artifacts from `../ml_model/` and does not train or change the model.

## Files

- `app/main.py` defines the FastAPI application, health check, request and
  response schemas, validation responses, and prediction endpoint.
- `app/predictor.py` loads the Keras model, fitted preprocessor, and model
  metadata, transforms incoming answers, predicts the class, and computes
  per-assessment sensitivity factors.
- `app/explanations.py` turns important feature names into simple factor labels,
  explanations, global-importance descriptions, and practical suggestions.
- `requirements.txt` lists the API and inference dependencies.

## Run locally

From the project root:

```powershell
python -m pip install -r backend/requirements.txt
python -m uvicorn app.main:app --app-dir backend --reload
```

Open `http://127.0.0.1:8000/docs` for interactive API documentation. The model
and preprocessor must be present at `ml_model/trained_model.h5` and
`ml_model/preprocessor.pkl`; `ml_model/model_metadata.json` is also required
for the fitted feature schema and class names.

## API

`GET /health` reports whether the model loaded at application startup.

`POST /api/v1/assessments/predict` accepts a JSON body. Use feature names from
the dataset. Fields may be omitted; the fitted preprocessing pipeline imputes
missing answers. Unknown field names and non-scalar answers are rejected.

```json
{
  "responses": {
    "sleep_quality": "Poor",
    "stress_level": "High",
    "phone_checking_without_notification": "Many times/hour",
    "reaction_time_ms": 453.6,
    "attention_accuracy_percentage": 67.6
  }
}
```

The response includes the predicted level, its softmax confidence, up to five
input-specific factors and up to three practical suggestions. A dataset-wide
global-importance list is also returned separately from the local explanation.

The local factor check changes one answer at a time to the representative
training-set value (median for numeric inputs or the most frequent category)
and compares the model's confidence in the predicted class. It describes model
sensitivity, not cause and effect. Confidence is the model's probability, not a
measure of clinical certainty.

MindEase is a synthetic-data research and digital-wellness project, not a
medical diagnosis or a replacement for professional assessment. The API does
not enable cross-origin browser access by default; configure CORS deliberately
if a trusted frontend is added later.
