import { useState, useEffect, useCallback } from 'react';
import { db } from '../Config/firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from 'firebase/firestore';

/**
 * Custom hook to fetch all of a user's study plans and calculate the completion
 * progress for each one.
 */
export const usePlanProgress = () => {
    const [planProgress, setPlanProgress] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);

    // Effect to get the current user
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId(null);
                setPlanProgress([]);
                setError("You must be logged in to see plan progress.");
                setIsLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    // Main data fetching and processing logic
    const fetchPlanProgress = useCallback(async () => {
        if (!userId) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            // 1. Fetch all imported plans and all completed problems concurrently
            const [plansSnapshot, completedSnapshot] = await Promise.all([
                getDocs(collection(db, 'artifacts', userId, 'plan')),
                getDocs(collection(db, 'artifacts', userId, 'problems'))
            ]);

            // 2. Create a map of completed problems organized by planId
            const completedProblemsByPlan = new Map();
            completedSnapshot.forEach(doc => {
                const data = doc.data();
                if (data.planId) {
                    if (!completedProblemsByPlan.has(data.planId)) {
                        completedProblemsByPlan.set(data.planId, new Set());
                    }
                    completedProblemsByPlan.get(data.planId).add(doc.id); // doc.id is the problem title
                }
            });

            // 3. Process each plan to calculate its progress
            const progressData = plansSnapshot.docs.map(doc => {
                const plan = doc.data();
                const planId = doc.id; // Use doc.id as the correct planId
                const totalProblems = Object.keys(plan.content || {}).length;
                const completedProblemsSet = completedProblemsByPlan.get(planId) || new Set();
                const completedCount = completedProblemsSet.size;

                // Avoid division by zero
                const progress = totalProblems > 0 ? (completedCount / totalProblems) * 100 : 0;

                return {
                    planId: planId, // Use doc.id for consistency
                    planName: plan.planName,
                    totalProblems,
                    completedCount,
                    progress: Math.round(progress) // Return a whole number percentage
                };
            });

            setPlanProgress(progressData);
            setError(null);
        } catch (err) {
            console.error("Error fetching plan progress:", err);
            setError("Could not load your plan progress.");
            setPlanProgress([]);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    // Effect to trigger the fetch when userId is available
    useEffect(() => {
        fetchPlanProgress();
    }, [fetchPlanProgress]);


    return { planProgress, isLoading, error, refreshProgress: fetchPlanProgress };
};