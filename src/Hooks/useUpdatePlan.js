import { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../Config/firebase';
import { doc, getDoc, serverTimestamp, Timestamp, setDoc } from 'firebase/firestore';

/**
 * Custom hook to fetch a study plan, process it, and save it as a single document
 * for the currently logged-in user.
 */
const useUpdatePlan = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);

    /**
     * Fetches a plan, adds due dates, and saves it as a single JSON object.
     * @param {string} planId - The document ID of the plan in the 'plans' collection.
     * @param {Date} startDate - The date to start scheduling the plan from.
     */
    const importPlan = async (planId, startDate) => {
        setIsLoading(true);
        setError(null);
        setIsSuccess(false);

        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                throw new Error("You must be logged in to import a plan.");
            }
            const userId = user.uid;

            const planRef = doc(db, 'plans', planId);
            const planSnap = await getDoc(planRef);

            if (!planSnap.exists()) {
                throw new Error("Could not find the specified study plan.");
            }

            const planData = planSnap.data();
            const planContent = planData.content;

            if (!planContent || Object.keys(planContent).length === 0) {
                throw new Error("Plan data is missing content or is empty.");
            }

            const scheduledPlan = {
                planId: planId,
                planName: planData.title,
                scheduledAt: serverTimestamp(),
                startDate: Timestamp.fromDate(startDate),
                content: {}
            };

            for (const dayKey in planContent) {
                const dayNumberMatch = dayKey.match(/\d+/);
                if (!dayNumberMatch) continue;

                const dayNumber = parseInt(dayNumberMatch[0], 10);
                const dueDate = new Date(startDate);
                dueDate.setDate(dueDate.getDate() + dayNumber - 1);

                const problemTitle = planContent[dayKey];

                scheduledPlan.content[dayKey] = {
                    title: problemTitle,
                    dueDate: Timestamp.fromDate(dueDate),
                    status: 'pending',
                    // ✨ ADD THIS LINE
                    planId: planId // Associate each problem with its plan
                };
            }

            const newPlanRef = doc(db, 'artifacts', userId, 'plan', planId);
            await setDoc(newPlanRef, scheduledPlan);

            console.log('Plan imported and saved successfully!');
            setIsSuccess(true);
            window.dispatchEvent(new CustomEvent('show-notification', { detail: 'Plan imported successfully!' }));

        } catch (err) {
            console.error("Error importing plan:", err);
            setError(err.message);
            window.dispatchEvent(new CustomEvent('show-notification', { detail: `Error: ${err.message}`, type: 'error' }));
        } finally {
            setIsLoading(false);
        }
    };

    return { importPlan, isLoading, isSuccess, error };
};

export default useUpdatePlan;