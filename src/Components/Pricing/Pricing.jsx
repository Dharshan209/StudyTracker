import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Hooks/useAuth';

function Pricing() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userRole } = useAuth();

  useEffect(() => {
    if (location.state?.paymentFailed) {
      alert('Your payment could not be processed. Please try again.');
    }
  }, [location.state]);

  const pricingPlans = [
    {
      name: "Free Tier",
      price: "₹0",
      period: "forever",
      description: "Perfect for getting started with basic resources",
      features: [
        "Access to basic learning resources",
        "Limited visualization tools",
        "Basic progress tracking",
        "Community support forum",
        "5 practice problems per day"
      ],
      buttonClass: "bg-blue-600 hover:bg-blue-700 text-white",
      isPremium: false
    },
    {
      name: "Premium",
      price: "₹599",
      period: "per month",
      description: "AI-powered personalized learning experience",
      features: [
        "AI-generated personalized study plans",
        "Email and WhatsApp reminders",
        "AI mentor to monitor your progress",
        "Advanced visualization tools",
        "Unlimited practice problems",
        "Priority support",
        "Progress analytics dashboard"
      ],
      buttonClass: "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white",
      isPremium: true,
      razorpayPlanId: "plan_QhuhMqHEVqKUVp"
    }
  ];

  const handlePlanSelection = (plan) => {
    if (plan.price === '₹0') {
      alert("You're already on the Free Tier. Enjoy your learning journey!");
      navigate('/dashboard');
      return;
    }

    if (!user) {
      alert('Please sign in to proceed to checkout.');
      return;
    }

    if (userRole === 'premium') {
      alert("You're already a Premium user! 🎉");
      navigate('/dashboard');
      return;
    }

    navigate('/checkout', { state: { plan } });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Choose Your Learning Journey</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From basic resources to AI-powered personalized learning, find the perfect plan to accelerate your growth
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className="rounded-2xl p-8 bg-white border border-gray-200 shadow-lg transition-all hover:scale-105 duration-300"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-lg text-gray-600">/{plan.period}</span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${plan.buttonClass}`}
                onClick={() => handlePlanSelection(plan)}
              >
                {plan.isPremium
                  ? (userRole === 'premium' ? "View Benefits" : "Start Premium")
                  : "Get Started Free"
                }
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Pricing;
