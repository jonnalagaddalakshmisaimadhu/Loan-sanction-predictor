from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd


BASE_DIR = Path(__file__).resolve().parents[1]
MODEL_PATH = BASE_DIR / "ml model" / "random_forest_model.joblib"


class LoanApplication(BaseModel):
    Gender: str
    Married: str
    Dependents: str
    Education: str
    Self_Employed: str
    ApplicantIncome: float
    CoapplicantIncome: float
    LoanAmount: float
    Loan_Amount_Term: float
    Credit_History: float
    Property_Area: str


class PredictionResponse(BaseModel):
    status: str
    confidence: float
    message: str


app = FastAPI(title="Loan Sanction Predictor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def load_model() -> None:
    """
    Load the trained Random Forest model into memory when the API starts.
    """
    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")

    # Store model on the app instance for reuse
    app.state.model = joblib.load(MODEL_PATH)


@app.post("/predict", response_model=PredictionResponse)
def predict_loan_sanction(data: LoanApplication) -> PredictionResponse:
    """
    Run prediction using the trained ML model.
    """
    model = app.state.model

    # Try to align with the feature names the model was trained on.
    raw_input = data.dict()

    feature_names = getattr(model, "feature_names_in_", None)

    if feature_names is not None:
        # Engineered feature construction to match training columns
        engineered_row = {}

        # Basic numeric values
        applicant_income = float(raw_input["ApplicantIncome"])
        coapplicant_income = float(raw_input["CoapplicantIncome"])
        loan_amount = float(raw_input["LoanAmount"])
        loan_term = float(raw_input["Loan_Amount_Term"]) or 1.0
        credit_history = float(raw_input["Credit_History"])
        total_income = applicant_income + coapplicant_income

        # Common engineered features used in loan datasets
        emi = loan_amount / loan_term  # per-month EMI in "thousands"
        balance_income = total_income - (emi * 1000.0)

        for fname in feature_names:
            # Direct numeric features
            if fname == "ApplicantIncome":
                engineered_row[fname] = applicant_income
            elif fname == "CoapplicantIncome":
                engineered_row[fname] = coapplicant_income
            elif fname == "LoanAmount":
                engineered_row[fname] = loan_amount
            elif fname == "Loan_Amount_Term":
                engineered_row[fname] = loan_term
            elif fname == "Credit_History":
                engineered_row[fname] = credit_history
            elif fname == "TotalIncome":
                engineered_row[fname] = total_income
            elif fname == "EMI":
                engineered_row[fname] = emi
            elif fname == "Balance_Income":
                engineered_row[fname] = balance_income

            # One-hot encodings for categoricals (Gender_, Married_, etc.)
            elif fname.startswith("Gender_"):
                category = fname.split("_", 1)[1]
                engineered_row[fname] = 1.0 if raw_input["Gender"] == category else 0.0
            elif fname.startswith("Married_"):
                category = fname.split("_", 1)[1]
                engineered_row[fname] = 1.0 if raw_input["Married"] == category else 0.0
            elif fname.startswith("Education_"):
                category = fname.split("_", 1)[1]
                engineered_row[fname] = (
                    1.0 if raw_input["Education"] == category else 0.0
                )
            elif fname.startswith("Self_Employed_"):
                category = fname.split("_", 1)[1]
                engineered_row[fname] = (
                    1.0 if raw_input["Self_Employed"] == category else 0.0
                )
            elif fname.startswith("Property_Area_"):
                category = fname.split("_", 1)[1]
                engineered_row[fname] = (
                    1.0 if raw_input["Property_Area"] == category else 0.0
                )
            elif fname.startswith("Dependents_"):
                category = fname.split("_", 1)[1]
                engineered_row[fname] = (
                    1.0 if raw_input["Dependents"] == category else 0.0
                )
            else:
                # Any other engineered / dummy feature not directly mapped
                engineered_row[fname] = engineered_row.get(fname, 0.0)

        df = pd.DataFrame([engineered_row], columns=feature_names)
    else:
        # Fall back to raw features if the model does not expose feature names
        df = pd.DataFrame([raw_input])

    # Predict class using the aligned feature DataFrame
    raw_pred = model.predict(df)[0]

    # Normalize status to expected "Y" / "N"
    status_str = str(raw_pred)
    if status_str.upper() in {"Y", "YES", "1", "APPROVED"}:
        status = "Y"
    else:
        status = "N"

    # Predict probability if available
    confidence = 0.8
    if hasattr(model, "predict_proba"):
        proba = model.predict_proba(df)[0]
        confidence = float(max(proba))

    if status == "Y":
        message = (
            "Congratulations! Based on the provided details, your loan is likely to be sanctioned."
        )
    else:
        message = (
            "Unfortunately, based on the provided details, the loan is likely to be rejected."
        )

    return PredictionResponse(
        status=status,
        confidence=round(confidence, 2),
        message=message,
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)


