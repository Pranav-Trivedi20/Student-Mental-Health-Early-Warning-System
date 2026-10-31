# Student-Mental-Health-Early-Warning-System

# Student Mental Health Early Warning System

A deep learning project that predicts students' mental health risk from tabular survey data, so that at-risk students can be flagged early. It replicates a 2026 PLOS ONE research paper, extends it with a custom attention-based attribution layer, and compares classical ML models against modern tabular deep learning models.

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Datasets](#datasets)
- [Methodology](#methodology)
- [Models Compared](#models-compared)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Results](#results)
- [Limitations](#limitations)
- [Future Work](#future-work)
- [Acknowledgements](#acknowledgements)
- [Author](#author)
- [License](#license)

---

## Overview

Mental health issues among students often go unnoticed until they affect academic performance and well-being. This project builds an **early warning system** that learns from student survey responses (lifestyle, academic, and psychological indicators) and predicts mental health risk.

The work has two phases:

1. **Replication** – Reproduce the pipeline of a 2026 PLOS ONE paper on a public Kaggle dataset, using classical ML baselines, SMOTE for class imbalance, and a deep learning model with a custom **Cross-Attention Attribution Layer (CAAL)**.
2. **Extension** – Build a synthetic dataset from real survey responses collected locally and compare basic vs. advanced tabular models, with **TabNet** chosen as the final model.

## Features

- End-to-end pipeline: preprocessing, class balancing, training, evaluation
- Classical ML baselines for benchmarking
- SMOTE to handle class imbalance
- Custom **CAAL** (Cross-Attention Attribution Layer) in TensorFlow/Keras for interpretable feature attribution
- Synthetic data generation from a small real survey using SDV
- Comparison of tree-based, linear, and deep tabular models
- Runs fully in Google Colab

## Datasets

| Dataset | Description |
|---|---|
| Kaggle student mental health dataset | Public dataset used for paper replication |
| Custom survey data | 40 real survey responses collected from students |
| Synthetic dataset | 600 rows generated from the 40 real responses using SDV's `GaussianCopulaSynthesizer` |

> **Note:** The "Overall Mental Health" target for the custom dataset is not collected directly. It is **derived** from the survey indicators (see the notebook for the derivation logic).

## Methodology

1. **Data preprocessing** – cleaning, encoding categorical features, scaling numeric features
2. **Target derivation** – constructing the overall mental health label for the custom survey data
3. **Synthetic data generation** – expanding 40 real responses to 600 rows with a Gaussian Copula synthesizer
4. **Class balancing** – SMOTE applied on the training split only
5. **Model training** – classical ML, tabular deep learning, and the CAAL-based model
6. **Evaluation** – accuracy, precision, recall, F1-score, confusion matrices
7. **Interpretability** – feature attribution via CAAL attention weights

## Models Compared

**Basic / classical**
- Random Forest
- Logistic Regression

**Advanced / boosting**
- XGBoost
- LightGBM
- CatBoost

**Deep tabular**
- TabNet *(final chosen model)*
- FT-Transformer
- TabTransformer
- CAAL-based neural network (TensorFlow/Keras)

## Tech Stack

- **Language:** Python
- **Deep learning:** TensorFlow / Keras, PyTorch (TabNet, FT-Transformer, TabTransformer)
- **ML:** scikit-learn, XGBoost, LightGBM, CatBoost, imbalanced-learn (SMOTE)
- **Synthetic data:** SDV (Synthetic Data Vault)
- **Data/visualization:** pandas, NumPy, Matplotlib, Seaborn
- **Environment:** Google Colab

## Project Structure

> Adjust to match your repository.

```
.
├── data/
│   ├── kaggle_dataset.csv
│   ├── survey_real_40.csv
│   └── survey_synthetic_600.csv
├── notebooks/
│   ├── 01_paper_replication.ipynb
│   ├── 02_synthetic_data_generation.ipynb
│   └── 03_model_comparison.ipynb
├── models/
├── requirements.txt
└── README.md
```

## Getting Started

### Option 1: Google Colab
1. Open the notebook in Colab (upload or use the "Open in Colab" badge).
2. Upload the dataset files when prompted.
3. Run all cells.

### Option 2: Local setup

```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
jupyter notebook
```

## Results

> Fill in with your final numbers.

| Model | Accuracy | Precision | Recall | F1 |
|---|---|---|---|---|
| Random Forest | – | – | – | – |
| Logistic Regression | – | – | – | – |
| XGBoost | – | – | – | – |
| LightGBM | – | – | – | – |
| CatBoost | – | – | – | – |
| FT-Transformer | – | – | – | – |
| TabTransformer | – | – | – | – |
| **TabNet** | – | – | – | – |
| CAAL model (Kaggle) | – | – | – | – |

## Limitations

- The custom dataset is synthetic, expanded from only 40 real responses, so results may not generalize to real populations.
- The target label is derived rather than clinically assessed.
- This is a research/educational prototype and **not a diagnostic tool**. It must not replace professional mental health evaluation.

## Future Work

- Collect a larger real-world survey dataset
- Validate labels with mental health professionals
- Deploy as a web app or dashboard for counselors
- Add explainability views (SHAP / attention visualizations)

## Acknowledgements

- The authors of the 2026 PLOS ONE paper this project replicates
- Kaggle dataset contributors
- Students who participated in the survey
- Open-source libraries: TensorFlow, scikit-learn, SDV, pytorch-tabnet, and others

## Author

**Pranav,Prayanshu,Rohit**
B.Tech CSE, Jaypee University of Engineering and Technology (JUET), Guna

## License

This project is released under the MIT License. See `LICENSE` for details.
