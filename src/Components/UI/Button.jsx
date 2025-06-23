// src/components/ui/Button.jsx
import React from 'react';

const Button = ({ children, onClick, variant = 'primary', size = 'md', className = '', disabled = false, ...props }) => {
    const baseStyle = "font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border-2 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600 hover:border-blue-700 shadow-md hover:shadow-lg focus:ring-blue-200 disabled:hover:bg-blue-600',
        secondary: 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md focus:ring-gray-200',
        ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 border-transparent hover:border-gray-200 focus:ring-gray-200',
        success: 'bg-green-600 text-white hover:bg-green-700 border-green-600 hover:border-green-700 shadow-md hover:shadow-lg focus:ring-green-200',
        danger: 'bg-red-600 text-white hover:bg-red-700 border-red-600 hover:border-red-700 shadow-md hover:shadow-lg focus:ring-red-200',
    };
    
    const sizes = {
        xs: 'py-1 px-2 text-xs',
        sm: 'py-2 px-3 text-sm',
        md: 'py-2.5 px-4 text-sm',
        lg: 'py-3 px-6 text-base',
        xl: 'py-4 px-8 text-lg',
    };
    
    return (
        <button 
            onClick={onClick} 
            disabled={disabled}
            className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;