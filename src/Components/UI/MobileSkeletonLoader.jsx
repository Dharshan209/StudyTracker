import React from 'react';

// Mobile-optimized skeleton components
export const MobileStatsCardSkeleton = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-xl mr-3"></div>
                <div>
                    <div className="h-3 w-16 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 w-12 bg-gray-200 rounded"></div>
                </div>
            </div>
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        </div>
    </div>
);

export const MobileProblemCardSkeleton = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
        <div className="flex items-center justify-between mb-3">
            <div className="flex items-center flex-1 min-w-0">
                <div className="w-4 h-4 bg-gray-200 rounded mr-3"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-lg mr-3"></div>
                <div className="h-4 w-32 bg-gray-200 rounded flex-1"></div>
            </div>
            <div className="w-12 h-5 bg-gray-200 rounded-full"></div>
        </div>
        <div className="flex items-center justify-between">
            <div className="flex gap-2">
                <div className="w-16 h-5 bg-gray-200 rounded"></div>
                <div className="w-12 h-5 bg-gray-200 rounded"></div>
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
        </div>
    </div>
);

export const MobileScheduleSkeleton = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100 animate-pulse">
            <div className="flex items-center justify-between mb-3">
                <div className="h-5 w-28 bg-gray-200 rounded"></div>
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
            </div>
            <div className="h-3 w-20 bg-gray-200 rounded mb-3"></div>
            <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                    <div className="h-3 w-16 bg-gray-200 rounded"></div>
                    <div className="h-3 w-8 bg-gray-200 rounded"></div>
                </div>
                <div className="bg-gray-200 rounded-full h-2"></div>
            </div>
        </div>
        <div className="p-4 space-y-3">
            {[...Array(3)].map((_, i) => (
                <MobileProblemCardSkeleton key={i} />
            ))}
        </div>
    </div>
);

export const MobileCalendarSkeleton = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm animate-pulse">
        <div className="flex items-center justify-between mb-4">
            <div className="h-5 w-20 bg-gray-200 rounded"></div>
            <div className="flex gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
            </div>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-3">
            {[...Array(7)].map((_, i) => (
                <div key={i} className="h-6 bg-gray-200 rounded"></div>
            ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
            {[...Array(35)].map((_, i) => (
                <div key={i} className="w-8 h-8 bg-gray-200 rounded"></div>
            ))}
        </div>
    </div>
);

export const MobileRecentActivitySkeleton = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm animate-pulse">
        <div className="h-5 w-24 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                        <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
                        <div className="h-3 w-16 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-3 w-12 bg-gray-200 rounded"></div>
                </div>
            ))}
        </div>
    </div>
);

export const MobileDashboardSkeleton = () => (
    <div className="space-y-4">
        {/* Header */}
        <div className="animate-pulse">
            <div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MobileStatsCardSkeleton />
            <MobileStatsCardSkeleton />
        </div>
        
        {/* Main content */}
        <div className="space-y-4">
            <MobileScheduleSkeleton />
            <div className="grid grid-cols-1 gap-4">
                <MobileCalendarSkeleton />
                <MobileRecentActivitySkeleton />
            </div>
        </div>
    </div>
);