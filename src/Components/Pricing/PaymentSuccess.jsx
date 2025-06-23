import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Hooks/useAuth';

function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const plan = location.state?.plan;

  const { updateUserProfile, isAuthLoading } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

//   useEffect(() => {
//     const updateRole = async () => {
//       if (plan?.name === 'Premium') {
//         try {
//           setIsUpdating(true);
//           await updateUserProfile({ role: 'premium' });
//           console.log("User upgraded to premium successfully.");
//         } catch (error) {
//           console.error("Failed to update role:", error);
//         } finally {
//           setIsUpdating(false);
//         }
//       }
//     };

//     if (!isAuthLoading) {
//       updateRole();
//     }
//   }, [plan, updateUserProfile, isAuthLoading]);

  useEffect(() => {
    if (!isAuthLoading && !isUpdating) {
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isAuthLoading, isUpdating, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900">
      <div className="max-w-md w-full mx-4 p-8 rounded-2xl shadow-lg text-center bg-white border border-gray-200">
        <div className="mb-6">
          <svg className="w-16 h-16 mx-auto text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-green-500 mb-2">Payment Successful!</h2>
          {plan && <p className="text-gray-600 mb-4">Thank you for purchasing the {plan.name} plan.</p>}
          <p className="text-sm text-gray-500">
            You will be redirected to your dashboard shortly...
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

export default PaymentSuccess;
