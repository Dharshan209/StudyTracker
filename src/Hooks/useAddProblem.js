import { useState, useCallback } from 'react';
import { db } from '../Config/firebase';
import { getAuth } from "firebase/auth";
import { doc, updateDoc, getDoc } from 'firebase/firestore';

export const useAddProblem = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const addProblemToPlan = useCallback(async (planId, problemData) => {
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (!user) {
            setError("You must be logged in to add problems.");
            return false;
        }

        setIsLoading(true);
        setError(null);

        try {
            const planRef = doc(db, 'artifacts', user.uid, 'plan', planId);
            const planDoc = await getDoc(planRef);
            
            if (!planDoc.exists()) {
                setError("Plan not found.");
                return false;
            }

            const planData = planDoc.data();
            const existingContent = planData.content || {};
            
            // Generate a unique key for the new problem
            const problemKey = `problem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            // Add the new problem to the plan's content
            const updatedContent = {
                ...existingContent,
                [problemKey]: {
                    title: problemData.title,
                    difficulty: problemData.difficulty || 'Medium',
                    dueDate: problemData.dueDate || new Date(),
                    estimatedTime: problemData.estimatedTime || 30,
                    planId: planId,
                    addedAt: new Date()
                }
            };

            await updateDoc(planRef, {
                content: updatedContent
            });

            return true;
        } catch (err) {
            console.error("Error adding problem to plan:", err);
            setError("Failed to add problem. Please try again.");
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const addQuickProblem = useCallback(async (activePlanId, problemTitle, selectedDate) => {
        if (!activePlanId) {
            setError("No active plan found. Please create a plan first.");
            return false;
        }

        const problemData = {
            title: problemTitle.trim(),
            difficulty: 'Medium', // Default difficulty
            dueDate: selectedDate || new Date(),
            estimatedTime: 30 // Default 30 minutes
        };

        return await addProblemToPlan(activePlanId, problemData);
    }, [addProblemToPlan]);

    return {
        addProblemToPlan,
        addQuickProblem,
        isLoading,
        error,
        clearError: () => setError(null)
    };
};