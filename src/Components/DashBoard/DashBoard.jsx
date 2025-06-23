import React, { useState, useEffect } from 'react';
import { Target, Flame, TrendingUp, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import ScheduledProblems from './ScheduledProblems';
import StudyPlans from './StudyPlans';
import Calendar from './Calendar';
import StatsCard from './StatsCard';
import RecentActivity from './RecentActivity';
import PullToRefresh from '../UI/PullToRefresh';
import { MobileDashboardSkeleton, MobileStatsCardSkeleton } from '../UI/MobileSkeletonLoader';
import ProgressiveLoader, { StaggeredLoader } from '../UI/ProgressiveLoader';
import { useProblemCompletion } from '../../Hooks/useProblemCompletion';
import { useNotifications } from '../../Hooks/useNotifications';
import { useKeyboardShortcuts } from '../../Hooks/useKeyboardShortcuts';
import { useTimeTracking } from '../../Hooks/useTimeTracking';
import { usePullToRefresh } from '../../Hooks/usePullToRefresh';
import { useSwipeGestures } from '../../Hooks/useSwipeGestures';

// Notification component
const Notification = ({ message, type }) => {
    if (!message) return null;
    const baseStyle = "fixed top-5 right-5 px-4 py-3 rounded-md shadow-lg z-50 transition-opacity duration-300";
    const styles = {
        success: "bg-green-100 border border-green-400 text-green-700",
        error: "bg-red-100 border border-red-400 text-red-700",
    };
    return <div className={`${baseStyle} ${type === 'error' ? styles.error : styles.success}`}>{message}</div>;
};

const Dashboard = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isMobile, setIsMobile] = useState(false);
    const [isStatsExpanded, setIsStatsExpanded] = useState(false);
    
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);
    
    // Refresh function for pull-to-refresh
    const handleRefresh = async () => {
        // Simulate refresh delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        // In a real app, you would refresh data here
        showNotification({ message: 'Dashboard refreshed!', type: 'success' });
    };
    
    // Pull to refresh hook (only for mobile)
    const pullToRefresh = usePullToRefresh(handleRefresh);
    
    // Swipe gestures for calendar navigation
    const handleSwipeLeft = () => {
        if (isMobile) {
            const nextDate = new Date(selectedDate);
            nextDate.setDate(nextDate.getDate() + 1);
            setSelectedDate(nextDate);
            showNotification({ message: 'Next day', type: 'success' });
        }
    };
    
    const handleSwipeRight = () => {
        if (isMobile) {
            const prevDate = new Date(selectedDate);
            prevDate.setDate(prevDate.getDate() - 1);
            setSelectedDate(prevDate);
            showNotification({ message: 'Previous day', type: 'success' });
        }
    };
    
    const swipeRef = useSwipeGestures(handleSwipeLeft, handleSwipeRight, isMobile ? handleRefresh : null);

    // Custom hooks
    const { 
        problemsSolvedCount, 
        activePlansCount, 
        studyStreak, 
        isLoading, 
        isAuthLoading 
    } = useProblemCompletion();
    
    const { notification, showNotification } = useNotifications();
    
    const { 
        todayTimeSpentMinutes, 
        formatTime, 
        isLoading: isTimeLoading 
    } = useTimeTracking();
    
    // Setup keyboard shortcuts
    const handleOpenAddProblem = () => {}; // Placeholder for future implementation
    useKeyboardShortcuts(setSelectedDate, showNotification, handleOpenAddProblem);

    const isDataLoading = isLoading || isAuthLoading || isTimeLoading;
    
    // Show mobile skeleton for initial load
    if (isDataLoading && isMobile) {
        return (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen font-sans">
                <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 lg:py-8">
                    <MobileDashboardSkeleton />
                </main>
            </div>
        );
    }

    // Stats configuration with priority
    const statsConfig = [
        {
            label: "Problems Solved",
            value: problemsSolvedCount,
            icon: Target,
            color: "blue",
            progress: Math.min((problemsSolvedCount / 239) * 100, 100),
            tooltip: "Total number of coding problems you've completed. Progress shown as percentage toward daily goal of 10.",
            priority: 1
        },
        {
            label: "Study Streak",
            value: `${studyStreak} day${studyStreak === 1 ? '' : 's'}`,
            icon: Flame,
            color: "green",
            progress: Math.min((studyStreak / 7) * 100, 100),
            tooltip: "Consecutive days you've solved at least one problem. Progress shown toward weekly goal of 7 days.",
            priority: 2
        },
        {
            label: "Time Spent",
            value: formatTime(),
            icon: Clock,
            color: "orange",
            progress: Math.min((todayTimeSpentMinutes / 180) * 100, 100),
            tooltip: "Total time spent coding today. Progress shown toward daily goal of 3 hours.",
            priority: 3
        },
        {
            label: "Active Plans",
            value: activePlansCount,
            icon: TrendingUp,
            color: "purple",
            progress: Math.min((activePlansCount / 3) * 100, 100),
            tooltip: "Number of study plans you're currently working on. Recommended maximum is 3 plans.",
            priority: 4
        }
    ];
    
    // Get prioritized stats for mobile
    const prioritizedStats = statsConfig.sort((a, b) => a.priority - b.priority);
    const primaryStats = prioritizedStats.slice(0, 2);
    const secondaryStats = prioritizedStats.slice(2);

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen font-sans">
            {notification && <Notification message={notification.message} type={notification.type} />}
            
            <main 
                ref={swipeRef}
                className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-3 lg:py-8"
                {...(isMobile ? pullToRefresh.pullToRefreshProps : {})}
            >
                {/* Pull to Refresh Indicator (Mobile Only) */}
                {isMobile && (
                    <PullToRefresh 
                        isRefreshing={pullToRefresh.isRefreshing}
                        pullDistance={pullToRefresh.pullDistance}
                        style={pullToRefresh.refreshIndicatorStyle}
                        className="-mt-4 mb-2"
                    />
                )}
                {/* Enhanced Header Section */}
                <div className="mb-4 lg:mb-10">
                    <h1 className="text-lg lg:text-3xl font-bold text-gray-900 mb-1 lg:mb-2">Dashboard</h1>
                    <p className="text-xs lg:text-base text-gray-600">Track your progress and stay on top of your coding journey</p>
                </div>

                {/* Stats Row */}
                {isMobile ? (
                    <div className="mb-4">
                        {/* Primary Stats - Always Visible with Progressive Loading */}
                        {isDataLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                                <MobileStatsCardSkeleton />
                                <MobileStatsCardSkeleton />
                            </div>
                        ) : (
                            <StaggeredLoader
                                items={primaryStats}
                                renderItem={(stat, index) => (
                                    <StatsCard
                                        key={index}
                                        label={stat.label}
                                        value={stat.value}
                                        icon={stat.icon}
                                        color={stat.color}
                                        isLoading={false}
                                        showProgress={true}
                                        progress={stat.progress}
                                        tooltip={stat.tooltip}
                                    />
                                )}
                                staggerDelay={150}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3"
                            />
                        )}
                        
                        {/* Secondary Stats - Collapsible */}
                        <ProgressiveLoader delay={300}>
                            <button
                                onClick={() => setIsStatsExpanded(!isStatsExpanded)}
                                className="w-full flex items-center justify-center gap-2 p-2 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors touch-target-sm"
                            >
                                <span>More Stats</span>
                                {isStatsExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                            </button>
                        </ProgressiveLoader>
                        
                        {isStatsExpanded && (
                            <ProgressiveLoader delay={0}>
                                <StaggeredLoader
                                    items={secondaryStats}
                                    renderItem={(stat, index) => (
                                        <StatsCard
                                            key={index + primaryStats.length}
                                            label={stat.label}
                                            value={stat.value}
                                            icon={stat.icon}
                                            color={stat.color}
                                            isLoading={false}
                                            showProgress={true}
                                            progress={stat.progress}
                                            tooltip={stat.tooltip}
                                        />
                                    )}
                                    staggerDelay={100}
                                    className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3"
                                />
                            </ProgressiveLoader>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-10">
                        {statsConfig.map((stat, index) => (
                            <ProgressiveLoader key={index} delay={index * 100}>
                                <StatsCard
                                    label={stat.label}
                                    value={stat.value}
                                    icon={stat.icon}
                                    color={stat.color}
                                    isLoading={isDataLoading}
                                    showProgress={true}
                                    progress={stat.progress}
                                    tooltip={stat.tooltip}
                                />
                            </ProgressiveLoader>
                        ))}
                    </div>
                )}

                {/* Enhanced Main Grid with Progressive Loading */}
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-3 lg:gap-8 mb-4 lg:mb-8">
                    <div className="lg:col-span-4 space-y-3 lg:space-y-8">
                        <ProgressiveLoader delay={isMobile ? 400 : 200}>
                            <ScheduledProblems selectedDate={selectedDate} />
                        </ProgressiveLoader>
                        <ProgressiveLoader delay={isMobile ? 600 : 300}>
                            <StudyPlans />
                        </ProgressiveLoader>
                    </div>
                    <div className="lg:col-span-2 space-y-3 lg:space-y-8">
                        <ProgressiveLoader delay={isMobile ? 500 : 250}>
                            <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                        </ProgressiveLoader>
                        <ProgressiveLoader delay={isMobile ? 700 : 350}>
                            <RecentActivity />
                        </ProgressiveLoader>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default Dashboard;
