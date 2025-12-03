import React from 'react';
import { PredictionResult } from '../types';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: PredictionResult | null;
}

export const ResultModal: React.FC<ResultModalProps> = ({ isOpen, onClose, result }) => {
  if (!isOpen || !result) return null;

  const isApproved = result.status === 'Y';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
        <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
          <button
            type="button"
            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 ${isApproved ? 'bg-green-100' : 'bg-red-100'}`}>
              {isApproved ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600" />
              )}
            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 className={`text-xl font-semibold leading-6 ${isApproved ? 'text-green-600' : 'text-red-600'}`}>
                {isApproved ? 'Loan Approved' : 'Loan Rejected'}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  {result.message}
                </p>
                <div className="mt-4 rounded-md bg-gray-50 p-4 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Model Confidence</span>
                    <span className="text-lg font-bold text-gray-900">{(result.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                    <div 
                      className={`h-2 rounded-full ${isApproved ? 'bg-green-500' : 'bg-red-500'}`} 
                      style={{ width: `${result.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button
            type="button"
            className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto ${isApproved ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'}`}
            onClick={onClose}
          >
            Check Another
          </button>
        </div>
      </div>
    </div>
  );
};