import React, { memo } from 'react';
import { Loader2, Info } from 'lucide-react';
import ProgressRing from './ProgressRing';
import Tooltip from '../UI/Tooltip';

const StatsCard = memo(({ 
    label, 
    value, 
    icon: IconComponent, 
    color = "blue", 
    isLoading, 
    progress, 
    showProgress = false, 
    tooltip 
}) => {
    const colors = {
        blue: "text-blue-600 bg-blue-50 border-blue-100",
        green: "text-green-600 bg-green-50 border-green-100",
        purple: "text-purple-600 bg-purple-50 border-purple-100",
        orange: "text-orange-600 bg-orange-50 border-orange-100",
    };

    return (
        <div className="bg-white rounded-lg lg:rounded-xl border-2 border-gray-100 p-3 lg:p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center">
                    <div className={`p-1.5 lg:p-3 rounded-lg lg:rounded-xl border ${colors[color]}`}>
                        <IconComponent className="h-4 w-4 lg:h-7 lg:w-7" />
                    </div>
                    <div className="ml-2 lg:ml-5 flex-1">
                        <div className="flex items-center gap-1 lg:gap-2">
                            <p className="text-xs lg:text-sm font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
                            {tooltip && (
                                <Tooltip content={tooltip} position="top">
                                    <Info className="h-3 w-3 lg:h-4 lg:w-4 text-gray-400 hover:text-gray-600 cursor-help" />
                                </Tooltip>
                            )}
                        </div>
                        {isLoading ? (
                             <Loader2 className="h-5 w-5 lg:h-8 lg:w-8 mt-0.5 lg:mt-2 text-gray-400 animate-spin" />
                        ) : (
                             <p className="text-lg lg:text-3xl font-bold text-gray-900 mt-0.5 lg:mt-1">{value}</p>
                        )}
                    </div>
                </div>
                {showProgress && !isLoading && (
                    <div className="mt-2 lg:mt-0 flex justify-center lg:justify-end">
                        <ProgressRing progress={progress || 0} color={color} />
                    </div>
                )}
            </div>
        </div>
    );
});

StatsCard.displayName = 'StatsCard';

export default StatsCard;