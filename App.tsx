import React, { useState } from 'react';
import { 
  Banknote, 
  User, 
  Briefcase, 
  GraduationCap, 
  Home, 
  Building2, 
  Calendar,
  CreditCard,
  Users,
  Loader2,
  TrendingUp,
  Info
} from 'lucide-react';
import { InputGroup } from './components/InputGroup';
import { ResultModal } from './components/ResultModal';
import { predictLoanSanction } from './services/mlService';
import { 
  LoanApplicationData, 
  PredictionResult, 
  Gender, 
  Married, 
  Education, 
  SelfEmployed, 
  PropertyArea 
} from './types';

const INITIAL_DATA: LoanApplicationData = {
  Gender: Gender.Male,
  Married: Married.No,
  Dependents: "0",
  Education: Education.Graduate,
  Self_Employed: SelfEmployed.No,
  ApplicantIncome: 5000,
  CoapplicantIncome: 0,
  LoanAmount: 150,
  Loan_Amount_Term: 360,
  Credit_History: 1,
  Property_Area: PropertyArea.Urban
};

function App() {
  const [formData, setFormData] = useState<LoanApplicationData>(INITIAL_DATA);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'ApplicantIncome' || name === 'CoapplicantIncome' || name === 'LoanAmount' || name === 'Loan_Amount_Term' || name === 'Credit_History')
        ? Number(value)
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const prediction = await predictLoanSanction(formData);
      setResult(prediction);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Prediction failed:", error);
      alert("Failed to process prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
              <Banknote className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Loan Sanction Predictor</h1>
              <p className="text-blue-100 text-sm font-medium">AI-Powered Financial Assessment</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4 bg-gray-50/50 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Applicant Details
                </h2>
                <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  ML Model v1.0
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
                
                {/* Personal Information */}
                <div>
                  <h3 className="text-sm uppercase tracking-wide text-gray-500 font-semibold mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup
                      label="Gender"
                      name="Gender"
                      value={formData.Gender}
                      onChange={handleInputChange}
                      options={[
                        { label: 'Male', value: 'Male' },
                        { label: 'Female', value: 'Female' }
                      ]}
                      icon={<User className="h-4 w-4 text-gray-400" />}
                    />
                    
                    <InputGroup
                      label="Marital Status"
                      name="Married"
                      value={formData.Married}
                      onChange={handleInputChange}
                      options={[
                        { label: 'Married', value: 'Yes' },
                        { label: 'Not Married', value: 'No' }
                      ]}
                      icon={<Users className="h-4 w-4 text-gray-400" />}
                    />

                    <InputGroup
                      label="Dependents"
                      name="Dependents"
                      value={formData.Dependents}
                      onChange={handleInputChange}
                      options={[
                        { label: '0', value: '0' },
                        { label: '1', value: '1' },
                        { label: '2', value: '2' },
                        { label: '3+', value: '3+' }
                      ]}
                      icon={<Users className="h-4 w-4 text-gray-400" />}
                    />

                    <InputGroup
                      label="Education"
                      name="Education"
                      value={formData.Education}
                      onChange={handleInputChange}
                      options={[
                        { label: 'Graduate', value: 'Graduate' },
                        { label: 'Not Graduate', value: 'Not Graduate' }
                      ]}
                      icon={<GraduationCap className="h-4 w-4 text-gray-400" />}
                    />

                    <InputGroup
                      label="Self Employed"
                      name="Self_Employed"
                      value={formData.Self_Employed}
                      onChange={handleInputChange}
                      options={[
                        { label: 'No', value: 'No' },
                        { label: 'Yes', value: 'Yes' }
                      ]}
                      icon={<Briefcase className="h-4 w-4 text-gray-400" />}
                    />
                  </div>
                </div>

                <div className="border-t border-gray-100"></div>

                {/* Financial Information */}
                <div>
                  <h3 className="text-sm uppercase tracking-wide text-gray-500 font-semibold mb-4">Financial Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup
                      label="Applicant Income"
                      name="ApplicantIncome"
                      type="number"
                      value={formData.ApplicantIncome}
                      onChange={handleInputChange}
                      min={0}
                      placeholder="e.g. 5000"
                      icon={<TrendingUp className="h-4 w-4 text-gray-400" />}
                    />

                    <InputGroup
                      label="Coapplicant Income"
                      name="CoapplicantIncome"
                      type="number"
                      value={formData.CoapplicantIncome}
                      onChange={handleInputChange}
                      min={0}
                      placeholder="e.g. 2000"
                      icon={<TrendingUp className="h-4 w-4 text-gray-400" />}
                    />

                    <InputGroup
                      label="Loan Amount (in thousands)"
                      name="LoanAmount"
                      type="number"
                      value={formData.LoanAmount}
                      onChange={handleInputChange}
                      min={0}
                      placeholder="e.g. 150"
                      icon={<Banknote className="h-4 w-4 text-gray-400" />}
                    />

                    <InputGroup
                      label="Loan Amount Term (Months)"
                      name="Loan_Amount_Term"
                      type="number"
                      value={formData.Loan_Amount_Term}
                      onChange={handleInputChange}
                      min={0}
                      placeholder="e.g. 360"
                      icon={<Calendar className="h-4 w-4 text-gray-400" />}
                    />

                    <InputGroup
                      label="Credit History (Debts Repaid)"
                      name="Credit_History"
                      value={formData.Credit_History}
                      onChange={handleInputChange}
                      options={[
                        { label: 'Yes (Good History)', value: 1 },
                        { label: 'No (Bad History)', value: 0 }
                      ]}
                      icon={<CreditCard className="h-4 w-4 text-gray-400" />}
                    />

                    <InputGroup
                      label="Property Area"
                      name="Property_Area"
                      value={formData.Property_Area}
                      onChange={handleInputChange}
                      options={[
                        { label: 'Urban', value: 'Urban' },
                        { label: 'Semiurban', value: 'Semiurban' },
                        { label: 'Rural', value: 'Rural' }
                      ]}
                      icon={<Home className="h-4 w-4 text-gray-400" />}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white rounded-lg px-6 py-4 font-semibold text-lg shadow-lg shadow-blue-500/30 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                        Analyzing Profile...
                      </>
                    ) : (
                      "Predict Loan Sanction Status"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar / Info Section */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Model Info Card */}
            <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center mb-4">
                <Building2 className="h-6 w-6 text-blue-300 mr-2" />
                <h3 className="text-lg font-bold">About the Model</h3>
              </div>
              <p className="text-blue-100 text-sm leading-relaxed mb-4">
                This prediction system uses a Machine Learning Classifier trained on historical loan data containing demographics, credit history, and property details.
              </p>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-md">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-200 mb-2">Key Factors</h4>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-400 mr-2"></div>
                    Credit History
                  </li>
                  <li className="flex items-center text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-400 mr-2"></div>
                    Applicant Income
                  </li>
                  <li className="flex items-center text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-400 mr-2"></div>
                    Loan Amount Term
                  </li>
                </ul>
              </div>
            </div>

            {/* Help Card */}
             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4 text-gray-900">
                <Info className="h-6 w-6 text-gray-500 mr-2" />
                <h3 className="text-lg font-bold">Need Help?</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Ensure all financial figures are accurate. "Loan Amount" should be entered in thousands (e.g., 150 = 150,000).
              </p>
              <div className="text-xs text-gray-400 pt-4 border-t border-gray-100">
                Data privacy is assured. No data is stored on our servers.
              </div>
             </div>
          </div>

        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Loan Sanction AI. All rights reserved.
        </div>
      </footer>

      <ResultModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        result={result} 
      />
    </div>
  );
}

export default App;