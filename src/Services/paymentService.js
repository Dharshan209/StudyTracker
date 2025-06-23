const RAZORPAY_CONFIG = {
  KEY: import.meta.env?.VITE_RAZORPAY_KEY || 'rzp_test_gIuzcWxQETCGYP',
  API_ENDPOINT: import.meta.env?.VITE_PAYMENT_API || 'https://f2fu7yv0w6.execute-api.ap-south-1.amazonaws.com/First_Stage/mytest'
};

export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const createSubscription = async (planId, customerData, userId) => {
  try {
    const response = await fetch(RAZORPAY_CONFIG.API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId, customer: customerData, userId })
    });

    if (!response.ok) throw new Error('Failed to create subscription');
    return await response.json();
  } catch (error) {
    console.error('Subscription creation error:', error);
    throw error;
  }
};

export const initiateAutoPay = async (plan, formData, userId, onSuccess, onError) => {
  try {
    const loaded = await loadRazorpayScript();
    if (!loaded) throw new Error('Razorpay SDK load failed');

    const subscriptionData = await createSubscription(plan.razorpayPlanId, formData, userId);

    const options = {
      key: RAZORPAY_CONFIG.KEY,
      subscription_id: subscriptionData.id,
      name: 'DSA Tracker Platform',
      description: `Subscription for ${plan.name}`,
      handler: onSuccess,
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone
      },
      theme: { color: '#3B82F6' },
      notes: { planName: plan.name },
      modal: { ondismiss: onError }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (error) {
    console.error('AutoPay Error:', error.message);
    onError();
  }
};