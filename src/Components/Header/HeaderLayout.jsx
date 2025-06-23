import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Sidebar from '../Header/Sidebar';
import LoginModal from '../Header/LoginModal';
import ErrorBanner from '../Header/ErrorBanner';
import BottomNavigation from '../UI/BottomNavigation';
import { useAuth } from '../../Hooks/useAuth';

const HeaderLayout = ({ children }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const {
    user,
    isAuthLoading,
    authError,
    setAuthError,
    signInWithGoogle,
    signOutUser,
  } = useAuth();

  const handleSignInWithGoogle = async () => {
    await signInWithGoogle();
    setIsLoginModalOpen(false);
  };

  const handleSignOut = async () => {
    await signOutUser();
  };

  const handleOpenLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
    if (authError) {
      setAuthError(null);
    }
  };

  const handleDismissAuthError = () => {
    setAuthError(null);
  };

  // Display a full-page loader while authenticating
  if (isAuthLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 size={48} className="animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 relative">
      {/* Sidebar Navigation - Hidden on mobile when bottom nav is active */}
      <Sidebar
        user={user}
        signOutUser={handleSignOut}
        onLoginClick={handleOpenLoginModal}
        isMobile={isMobile}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden ml-0 lg:ml-0">
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className={`max-w-none mx-auto px-2 sm:px-4 lg:px-8 py-4 pt-12 lg:pt-8 ${isMobile ? 'pb-16' : ''}`}>
            {authError && (
              <div className="mb-2">
                <ErrorBanner
                  error={authError}
                  onDismiss={handleDismissAuthError}
                />
              </div>
            )}
            {children}
          </div>
        </main>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      {isMobile && <BottomNavigation />}

      {/* Login Modal (remains unchanged) */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseLoginModal}
        signInWithGoogle={handleSignInWithGoogle}
      />
    </div>
  );
};

export default HeaderLayout;