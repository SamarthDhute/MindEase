# Model evaluation report

The holdout test set is 20% of the dataset and was not used to fit preprocessing or models.
Precision, recall, and F1 are reported per class and as macro/weighted averages.

## Neural Network

- Accuracy: 0.6210

| Class | Precision | Recall | F1-score | Support |
|---|---:|---:|---:|---:|
| High | 0.6891 | 0.7344 | 0.7110 | 320 |
| Low | 0.6586 | 0.7357 | 0.6950 | 333 |
| Moderate | 0.4913 | 0.4063 | 0.4448 | 347 |
| macro avg | 0.6130 | 0.6255 | 0.6170 | 1000 |
| weighted avg | 0.6103 | 0.6210 | 0.6133 | 1000 |

Confusion matrix (rows = actual, columns = predicted):

| Actual / predicted | High | Low | Moderate |
|---|---:|---:|---:|
| High | 235 | 15 | 70 |
| Low | 12 | 245 | 76 |
| Moderate | 94 | 112 | 141 |

## Random Forest

- Accuracy: 0.6200

| Class | Precision | Recall | F1-score | Support |
|---|---:|---:|---:|---:|
| High | 0.7125 | 0.7281 | 0.7202 | 320 |
| Low | 0.6578 | 0.7447 | 0.6986 | 333 |
| Moderate | 0.4696 | 0.4006 | 0.4323 | 347 |
| macro avg | 0.6133 | 0.6245 | 0.6171 | 1000 |
| weighted avg | 0.6100 | 0.6200 | 0.6131 | 1000 |

Confusion matrix (rows = actual, columns = predicted):

| Actual / predicted | High | Low | Moderate |
|---|---:|---:|---:|
| High | 233 | 10 | 77 |
| Low | 5 | 248 | 80 |
| Moderate | 89 | 119 | 139 |
