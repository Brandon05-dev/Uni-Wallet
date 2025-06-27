
import { useState } from 'react';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import Onboarding from '@/components/Onboarding';
import Dashboard from '@/components/Dashboard';
import SendMoney from '@/components/SendMoney';
import TopUpPage from '@/components/TopUpPage';
import BillPayments from '@/components/BillPayments';
import Savings from '@/components/Savings';
import Offers from '@/components/Offers';
import Navigation from '@/components/Navigation';
import AuthPage from '@/components/AuthPage';

const AppContent = () => {
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showAuth, setShowAuth] = useState(false);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mint-500"></div>
      </div>
    );
  }

  // Show auth page if user clicks login/signup
  if (showAuth) {
    return <AuthPage onBack={() => setShowAuth(false)} />;
  }

  // Show onboarding if first time and not authenticated
  if (isFirstTime && !user) {
    return (
      <Onboarding 
        onComplete={() => setIsFirstTime(false)}
        onLogin={() => setShowAuth(true)}
      />
    );
  }

  // Show auth prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-600 via-navy-700 to-navy-800 flex items-center justify-center p-4">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">🎓</div>
          <h1 className="text-3xl font-bold mb-2">Campus Wallet</h1>
          <p className="text-navy-200 mb-8">Your complete financial companion for campus life</p>
          <button
            onClick={() => setShowAuth(true)}
            className="bg-mint-500 hover:bg-mint-600 text-white px-8 py-3 rounded-lg font-semibold"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onPageChange={setCurrentPage} />;
      case 'send':
        return <SendMoney />;
      case 'topup':
        return <TopUpPage onBack={() => setCurrentPage('dashboard')} />;
      case 'bills':
        return <BillPayments />;
      case 'savings':
        return <Savings />;
      case 'offers':
        return <Offers />;
      default:
        return <Dashboard onPageChange={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
        {renderCurrentPage()}
        <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
