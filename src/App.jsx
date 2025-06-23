import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import HeaderLayout from './Components/Header/HeaderLayout';

// Lazy load components for better performance
const Dashboard = lazy(() => import('./Components/DashBoard/DashBoard'));
const ProblemList = lazy(() => import('./Components/ProblemList/ProblemList'));
const Plans = lazy(() => import('./Components/StudyPlan/Plans'));
const Resources = lazy(() => import('./Components/Resources/Resources'));
const Pricing = lazy(() => import('./Components/Pricing/Pricing'));
const Checkout = lazy(() => import('./Components/Pricing/Checkout'));
const PaymentSuccess = lazy(() => import('./Components/Pricing/PaymentSuccess'));
const ProfilePage = lazy(() => import('./Components/Header/ProfilePage'));

// Loading component for Suspense
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-64">
    <Loader2 size={48} className="animate-spin text-blue-500" />
  </div>
);

const HomePage = () => (
  <div className="px-4 py-6 lg:p-8 text-center">
    <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold">Welcome to DSA Tracker</h1>
    <p className="mt-4 text-sm sm:text-base lg:text-lg text-gray-600">Your journey to mastering Data Structures and Algorithms starts here.</p>
  </div>
);


function App() {
  return (
    <Router>
      <HeaderLayout>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/resource/:problemTitle" element={<Resources />} />
            <Route path="/problemlist" element={<ProblemList />} />
            <Route path="/plan" element={<Plans />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
          </Routes>
        </Suspense>
      </HeaderLayout>
    </Router>
  );
}

export default App;
