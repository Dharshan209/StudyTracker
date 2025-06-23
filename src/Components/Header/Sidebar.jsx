import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, ListChecks, Calendar, LogOut, User, UserCircle, Tag, Menu, X } from 'lucide-react';

const Sidebar = ({ user, signOutUser, onLoginClick, isMobile = false }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Style for active navigation links
  const navLinkClass = ({ isActive }) =>
    `flex flex-col lg:flex-col items-center justify-center p-2 lg:p-3 rounded-lg lg:rounded-xl transition-all duration-200 group relative ${
      isActive
        ? 'bg-blue-600 text-white shadow-lg'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;

  const NavItem = ({ to, icon: IconComponent, label, onClick }) => (
    <NavLink 
      to={to} 
      className={navLinkClass} 
      title={label}
      onClick={onClick}
    >
      <IconComponent size={20} className="mb-0.5 lg:mb-1 lg:w-6 lg:h-6" />
      <span className="text-xs font-medium lg:block">{label}</span>
    </NavLink>
  );

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button 
        className="lg:hidden fixed top-2 left-2 z-50 p-1.5 bg-white rounded-lg shadow-md border border-gray-200"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop & Mobile */}
      <aside className={`
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        fixed lg:relative inset-y-0 left-0 z-40
        w-56 lg:w-20 flex-shrink-0 bg-white border-r border-gray-200 
        flex flex-col py-2 lg:py-4 transition-transform duration-300 ease-in-out
      `}>
        {/* App Logo */}
        <div className="h-12 lg:h-16 flex items-center justify-center lg:justify-center mb-4 lg:mb-6 px-3 lg:px-0">
          <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl flex items-center justify-center bg-blue-600 shadow-lg">
            <span className="text-white font-bold text-sm lg:text-lg">D</span>
          </div>
          <span className="ml-2 lg:hidden text-lg font-bold text-gray-900">DSA Tracker</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 lg:px-2 space-y-1.5 lg:space-y-4">
          <NavItem 
            to="/" 
            icon={LayoutDashboard} 
            label="Dashboard"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <NavItem 
            to="/problemlist" 
            icon={ListChecks} 
            label="Problems"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <NavItem 
            to="/plan" 
            icon={Calendar} 
            label="Plans"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <NavItem 
            to="/pricing" 
            icon={Tag} 
            label="Pricing"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        </nav>

        {/* User Profile Section */}
        <div className="px-3 lg:px-2 pt-2 lg:pt-4 border-t border-gray-200 relative">
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-full flex flex-row lg:flex-col items-center justify-start lg:justify-center p-1.5 lg:p-2 rounded-lg lg:rounded-xl hover:bg-gray-100 transition-colors group"
                title={user.displayName || user.email}
              >
                <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full border-2 border-gray-300 mb-0 lg:mb-1 overflow-hidden flex-shrink-0">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <User size={14} />
                    </div>
                  )}
                </div>
                <span className="ml-2 lg:ml-0 text-xs font-medium text-gray-700 truncate">
                  {user.displayName || user.email || ''}
                </span>
              </button>
              
              {/* User Menu Dropdown */}
              {showUserMenu && (
                <div className="absolute bottom-full left-0 lg:left-full lg:ml-2 mb-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user.displayName || user.email}
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      setShowUserMenu(false);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <UserCircle size={16} className="mr-3" />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      signOutUser();
                      setShowUserMenu(false);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <LogOut size={16} className="mr-3" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                onLoginClick();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex flex-row lg:flex-col items-center justify-start lg:justify-center p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              title="Login"
            >
              <User size={20} className="mb-0 lg:mb-1" />
              <span className="ml-3 lg:ml-0 text-sm lg:text-xs font-medium">Login</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;