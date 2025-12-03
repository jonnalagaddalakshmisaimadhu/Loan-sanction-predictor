import { LoanApplicationData, PredictionResult } from '../types';

/**
 * Call the local FastAPI backend which uses the trained Random Forest
 * model stored in `ml model/random_forest_model.joblib`.
 */
export const predictLoanSanction = async (
  data: LoanApplicationData
): Promise<PredictionResult> => {
  const response = await fetch('https://loan-sanction-predictor.onrender.com/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Prediction API failed with status ${response.status}`);
  }

  const result = (await response.json()) as PredictionResult;
  return result;
};
