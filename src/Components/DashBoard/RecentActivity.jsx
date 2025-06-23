// src/components/RecentActivity.jsx
import React, { memo } from 'react';
import { Clock, Loader2, AlertTriangle, List } from 'lucide-react';
import { useRecentActivity } from '../../Hooks/useRecentActivity'; // Adjust path if necessary

const ActivityItem = memo(({ type, title, timeAgo }) => {
    const getColorClass = (type) => {
        switch (type) {
            case 'solved':
                return 'bg-green-500';
            case 'started':
                return 'bg-blue-500';
            // Future achievement type
            case 'achievement':
                return 'bg-purple-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${getColorClass(type)}`}></div>
            <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{title}</div>
                <div className="text-xs text-gray-500">{timeAgo}</div>
            </div>
        </div>
    );
});

ActivityItem.displayName = 'ActivityItem';

const RecentActivity = memo(() => {
    // ✨ 1. Use the new hook to get real activity data
    const { activities, isLoading, error } = useRecentActivity();

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center min-h-[120px]">
                    <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center py-4 min-h-[120px]">
                    <AlertTriangle className="mx-auto h-8 w-8 text-yellow-500" />
                    <p className="mt-2 text-sm text-yellow-600">{error}</p>
                </div>
            );
        }
        
        if (activities.length === 0) {
            return (
                <div className="text-center py-4 min-h-[120px]">
                     <List className="mx-auto h-8 w-8 text-gray-400" />
                     <p className="mt-2 text-sm text-gray-500">No recent activity to show.</p>
                </div>
            );
        }

        return (
            <div className="space-y-3">
                {activities.map((activity) => (
                    <ActivityItem
                        key={activity.id}
                        type={activity.type}
                        title={activity.title}
                        timeAgo={activity.timeAgo}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-xl border-2 border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
            </div>
            {renderContent()}
        </div>
    );
});

RecentActivity.displayName = 'RecentActivity';

export default RecentActivity;