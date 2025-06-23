import React from 'react';

const ProgressRing = ({ progress, size = 60, strokeWidth = 6, color = "blue" }) => {
    const colorClasses = {
        blue: "stroke-blue-500",
        green: "stroke-green-500",
        purple: "stroke-purple-500",
        orange: "stroke-orange-500",
    };
    
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;
    
    return (
        <div className="relative inline-flex">
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    className="text-gray-200"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className={`${colorClasses[color]} transition-all duration-500 ease-out`}
                    strokeLinecap="round"
                />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-700">
                {Math.round(progress)}%
            </span>
        </div>
    );
};

export default ProgressRing;