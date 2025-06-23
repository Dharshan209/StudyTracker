// src/components/StudyPlans.jsx
import React, { useEffect, useMemo } from 'react';
import { BookOpen, Plus, Activity, Loader2, AlertTriangle, Calendar, TrendingUp, Target, Clock, Play, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../UI/Button';
import { useProblemCompletion } from '../../Hooks/useProblemCompletion';
import { usePlanProgress } from '../../Hooks/usePlanProgress';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../Config/firebase';
import { getAuth } from 'firebase/auth'; 

const PlanItem = ({ plan, onSelectPlan, onDeletePlan, isActive }) => {
    const planName = plan.planName || 'Untitled Plan';
    const startDate = plan.startDate?.seconds
        ? new Date(plan.startDate.seconds * 1000).toLocaleDateString()
        : 'Not started';

    // ✨ REAL DATA: Use calculated data passed in props
    const completedCount = plan.completedCount ?? 0;
    const totalProblems = plan.totalProblems ?? 0;
    const progressPercentage = plan.progress ?? 0;
    const daysRemaining = plan.daysRemaining ?? 0;
    const currentStreak = plan.currentStreak ?? 0;

    return (
        <div
            className={`p-6 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                isActive
                    ? 'bg-blue-50 border-blue-200 shadow-md'
                    : 'bg-white hover:bg-gray-50 border-gray-100 hover:border-gray-200 hover:shadow-sm'
            }`}
            onClick={() => onSelectPlan(plan.id)}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl border ${isActive ? 'bg-blue-100 border-blue-200' : 'bg-gray-100 border-gray-200'}`}>
                        <BookOpen className={`h-6 w-6 ${isActive ? 'text-blue-600' : 'text-gray-600'}`} />
                    </div>
                    <div>
                        <h4 className="font-bold text-lg text-gray-900 mb-1">{planName}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>Started: {startDate}</span>
                            </div>
                            {/* ✨ REAL DATA: Days remaining */}
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{daysRemaining} days left</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {isActive && (
                    <span className="flex items-center text-xs font-bold text-blue-600 bg-blue-100 px-3 py-1.5 rounded-full border border-blue-200">
                        <Activity className="h-3 w-3 mr-1.5"/>
                        Active
                    </span>
                )}
            </div>
            
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                        {completedCount}/{totalProblems} problems
                    </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
                    <div 
                        className={`h-3 rounded-full transition-all duration-500 ${
                            isActive ? 'bg-blue-600' : 'bg-gray-400'
                        }`}
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                        {progressPercentage}%
                    </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                    {/* ✨ REAL DATA: Display streak only on active plan */}
                    {isActive && currentStreak > 0 ? (
                        <div className="flex items-center gap-2 text-green-600">
                            <TrendingUp className="h-4 w-4" />
                            <span className="font-semibold">{currentStreak} day streak</span>
                        </div>
                    ) : (
                        // Placeholder to maintain layout
                        <div></div> 
                    )}
                    
                    <div className="flex items-center gap-2">
                        <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm('Are you sure you want to delete this study plan? This action cannot be undone.')) {
                                    onDeletePlan(plan.id);
                                }
                            }}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                        
                        <Button 
                            variant={isActive ? "primary" : "secondary"} 
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelectPlan(plan.id);
                            }}
                        >
                            <Play className="h-3 w-3" />
                            Continue
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StudyPlans = () => {
    const navigate = useNavigate();
    // ✨ 1. Get studyStreak from the hook
    const { userPlans, fetchUserPlans, isLoadingPlans, isAuthLoading, authError, studyStreak } = useProblemCompletion();
    const { planProgress, isLoading: isProgressLoading } = usePlanProgress();

    // ✨ 2. Merge plan data and add calculated fields
    const mergedPlans = useMemo(() => {
        if (!userPlans.length) return [];
        
        return userPlans.map(plan => {
            const progressInfo = planProgress.find(p => p.planId === plan.id) || {};
            
            // Calculate days remaining
            let daysRemaining = 0;
            if (plan.startDate?.seconds && progressInfo.totalProblems > 0) {
                const startDate = new Date(plan.startDate.seconds * 1000);
                const endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + progressInfo.totalProblems);
                
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Normalize today to the start of the day

                const diffTime = Math.max(0, endDate.getTime() - today.getTime());
                daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            }

            return {
                ...plan,
                ...progressInfo,
                daysRemaining, // Add calculated days remaining
                currentStreak: studyStreak, // Add global study streak
            };
        });
    }, [userPlans, planProgress, studyStreak]);

    const activePlanId = useMemo(() => {
        if (!mergedPlans || mergedPlans.length === 0) return null;
        return [...mergedPlans].sort((a, b) => (b.startDate?.seconds ?? 0) - (a.startDate?.seconds ?? 0))[0].id;
    }, [mergedPlans]);

    useEffect(() => {
        if (!authError) {
            fetchUserPlans();
        }
    }, [fetchUserPlans, authError]);

    const handleCreatePlan = () => navigate('/plan');
    const handleSelectPlan = (planId) => navigate(`/plan/${planId}`);
    
    const handleDeletePlan = async (planId) => {
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (!user) {
            console.error('User not authenticated');
            return;
        }
        
        try {
            await deleteDoc(doc(db, 'artifacts', user.uid, 'plan', planId));
            // Refresh the plans list after successful deletion
            fetchUserPlans();
        } catch (error) {
            console.error('Error deleting plan:', error);
            alert('Failed to delete plan. Please try again.');
        }
    };

    const renderContent = () => {
        if (isAuthLoading || isLoadingPlans || isProgressLoading) {
            return (
                <div className="flex justify-center items-center p-10 min-h-[150px]">
                    <Loader2 className="h-8 w-8 text-gray-500 animate-spin" />
                </div>
            );
        }

        if (authError) {
             return (
                <div className="text-center p-10 min-h-[150px]">
                    <AlertTriangle className="mx-auto h-10 w-10 text-yellow-500" />
                    <h3 className="mt-2 text-md font-medium text-yellow-800">Authentication Required</h3>
                    <p className="mt-1 text-sm text-yellow-600">{authError}</p>
                </div>
            );
        }
        
        if (mergedPlans.length > 0) {
            return (
                <div className="space-y-4">
                    {mergedPlans.map((plan) => (
                        <PlanItem
                            key={plan.id}
                            plan={plan}
                            onSelectPlan={handleSelectPlan}
                            onDeletePlan={handleDeletePlan}
                            isActive={plan.id === activePlanId}
                        />
                    ))}
                </div>
            );
        }

        return (
            <div className="text-center p-10 min-h-[150px]">
                <BookOpen className="mx-auto h-10 w-10 text-gray-400" />
                <h3 className="mt-2 text-md font-medium text-gray-900">No study plans yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new plan.</p>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-xl border-2 border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">My Study Plans</h3>
                    <p className="text-gray-600">Track your learning journey and stay motivated</p>
                </div>
                <Button onClick={handleCreatePlan} disabled={!!authError} variant="primary">
                    <Plus className="h-4 w-4" />
                    Create New Plan
                </Button>
            </div>
            {renderContent()}
        </div>
    );
};

export default StudyPlans;