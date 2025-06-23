import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ListChecks, Calendar, Tag } from 'lucide-react';

const BottomNavigation = () => {
    const navItems = [
        {
            to: '/dashboard',
            icon: LayoutDashboard,
            label: 'Dashboard',
            badge: null
        },
        {
            to: '/problemlist',
            icon: ListChecks,
            label: 'Problems',
            badge: null
        },
        {
            to: '/plan',
            icon: Calendar,
            label: 'Plans',
            badge: null
        },
        {
            to: '/pricing',
            icon: Tag,
            label: 'Pricing',
            badge: 'Pro'
        }
    ];

    const navLinkClass = ({ isActive }) =>
        `flex flex-col items-center justify-center p-1.5 min-h-[50px] transition-all duration-200 relative ${
            isActive
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
        }`;

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-1 py-0.5 z-50 lg:hidden">
            <div className="flex justify-around items-center max-w-sm mx-auto">
                {navItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={navLinkClass}
                        >
                            {({ isActive }) => (
                                <>
                                    <div className="relative">
                                        <IconComponent 
                                            size={20} 
                                            className={`mb-0.5 ${isActive ? 'text-blue-600' : ''}`}
                                        />
                                        {item.badge && (
                                            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold px-1 py-0.5 rounded-full leading-none">
                                                {item.badge}
                                            </span>
                                        )}
                                        {isActive && (
                                            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
                                        )}
                                    </div>
                                    <span className={`text-xs font-medium ${isActive ? 'text-blue-600' : ''}`}>
                                        {item.label}
                                    </span>
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNavigation;