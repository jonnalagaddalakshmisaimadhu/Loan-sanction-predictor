export enum Gender {
  Male = "Male",
  Female = "Female"
}

export enum Married {
  Yes = "Yes",
  No = "No"
}

export enum Education {
  Graduate = "Graduate",
  NotGraduate = "Not Graduate"
}

export enum SelfEmployed {
  Yes = "Yes",
  No = "No"
}

export enum PropertyArea {
  Urban = "Urban",
  Semiurban = "Semiurban",
  Rural = "Rural"
}

export enum CreditHistory {
  Yes = "1",
  No = "0"
}

export interface LoanApplicationData {
  Gender: Gender;
  Married: Married;
  Dependents: string;
  Education: Education;
  Self_Employed: SelfEmployed;
  ApplicantIncome: number;
  CoapplicantIncome: number;
  LoanAmount: number;
  Loan_Amount_Term: number;
  Credit_History: number;
  Property_Area: PropertyArea;
}

export interface PredictionResult {
  status: "Y" | "N";
  confidence: number;
  message: string;
}