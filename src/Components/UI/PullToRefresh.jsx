import React from 'react';
import { RotateCcw, ArrowDown } from 'lucide-react';

const PullToRefresh = ({ 
    isRefreshing, 
    pullDistance, 
    threshold = 80, 
    style,
    className = ""
}) => {
    const progress = Math.min(pullDistance / threshold, 1);
    const isTriggered = pullDistance >= threshold;
    
    return (
        <div 
            className={`flex items-center justify-center py-4 ${className}`}
            style={style}
        >
            <div className={`flex items-center gap-2 text-sm ${
                isTriggered ? 'text-blue-600' : 'text-gray-500'
            }`}>
                {isRefreshing ? (
                    <>
                        <RotateCcw className="h-5 w-5 animate-spin" />
                        <span>Refreshing...</span>
                    </>
                ) : (
                    <>
                        <div className="relative">
                            <ArrowDown 
                                className="h-5 w-5 transition-transform duration-200" 
                                style={{ 
                                    transform: `rotate(${progress * 180}deg)`,
                                    opacity: Math.max(0.3, progress)
                                }}
                            />
                        </div>
                        <span>
                            {isTriggered ? 'Release to refresh' : 'Pull to refresh'}
                        </span>
                    </>
                )}
            </div>
        </div>
    );
};

export default PullToRefresh;