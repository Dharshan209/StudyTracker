import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Hooks/useAuth';
import { initiateAutoPay } from '../../Services/paymentService';

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthLoading } = useAuth();

  const plan = location.state?.plan;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    contactTime: ''
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

useEffect(() => {
  if (isAuthLoading) return;

  if (!plan) {
    navigate('/pricing');
    return;
  }

  if (user) {
    setFormData(prev => ({
      ...prev,
      name: user.displayName || '',
      email: user.email || ''
    }));
  } else {
    navigate('/pricing');
  }
}, [plan, user, isAuthLoading, navigate]);


  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!/^[+]?[\d\s\-()]{10,}$/.test(formData.phone)) newErrors.phone = 'Invalid phone number';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handlePaymentSuccess = (response) => {
    console.log("Payment successful:", response);
    setIsProcessing(false);
    navigate('/payment-success', { state: { plan } });
  };

  const handlePaymentError = () => {
    console.error("Payment failed or cancelled.");
    setIsProcessing(false);
    navigate('/pricing', { state: { paymentFailed: true } });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("✅ handleSubmit called");
  if (!validateForm()) return;
  setIsProcessing(true);

  try {
    await initiateAutoPay(plan, formData, user.uid, handlePaymentSuccess, handlePaymentError);
  } catch (err) {
    console.error('Payment initiation failed:', err);
    setIsProcessing(false);
  }
};

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading user...</p>
      </div>
    );
  }

  if (!plan || !user) return null;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-center mb-10">Secure Checkout</h1>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white border rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6">Your Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {['name', 'email', 'phone', 'address'].map((field) => (
                <div key={field}>
                  <label className="block text-sm mb-1 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                  {field === 'address' ? (
                    <textarea
                      name={field}
                      rows="3"
                      value={formData[field]}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg"
                    />
                  ) : (
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      name={field}
                      value={formData[field]}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg ${field === 'email' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      readOnly={field === 'email'}
                    />
                  )}
                  {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
                </div>
              ))}
             <button
  type="submit"
  disabled={isProcessing}
  className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
>
  {isProcessing ? "Processing..." : "Proceed to Pay"}
</button>
            </form>
          </div>

          {/* Plan Summary */}
          <div className="bg-white border rounded-2xl p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4">Plan Summary</h2>
            <div className={`p-4 mb-6 rounded-lg bg-gray-100`}>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <div className="text-right">
                  <p className="text-2xl font-bold">{plan.price}</p>
                  <p className="text-sm text-gray-600">/{plan.period}</p>
                </div>
              </div>
            </div>
            <ul className="mb-6 space-y-2">
              {plan.features.map((feature, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2 inline-block"></span>
                  {feature}
                </li>
              ))}
            </ul>
            <div className="flex justify-between font-bold text-lg border-t pt-4">
              <span>Total</span>
              <span>{plan.price}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
