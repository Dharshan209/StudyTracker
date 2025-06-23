import { useState, useEffect, useCallback } from 'react';
import { db } from '../Config/firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from 'firebase/firestore';

export const useCalendarData = (currentMonth, currentYear) => {
    const [calendarData, setCalendarData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);

    // Auth state listener
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
                setError(null);
            } else {
                setUserId(null);
                setCalendarData({});
                setError("You must be logged in to see calendar data.");
                setIsLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    const fetchCalendarData = useCallback(async () => {
        if (!userId) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            // Fetch all user plans and completed problems
            const [plansSnapshot, completedSnapshot] = await Promise.all([
                getDocs(collection(db, 'artifacts', userId, 'plan')),
                getDocs(collection(db, 'artifacts', userId, 'problems'))
            ]);

            // Create a Set of completed problem titles for easy lookup
            const completedTitles = new Set();
            completedSnapshot.forEach((doc) => completedTitles.add(doc.id));

            // Get the month range
            const startOfMonth = new Date(currentYear, currentMonth, 1);
            const endOfMonth = new Date(currentYear, currentMonth + 1, 0);

            // Process all problems from all plans
            const monthlyData = {};
            
            plansSnapshot.forEach(planDoc => {
                const planContent = planDoc.data().content || {};
                const problemsInPlan = Object.values(planContent);

                problemsInPlan.forEach(problem => {
                    const problemDate = problem.dueDate.toDate();
                    
                    // Only include problems within the current month
                    if (problemDate >= startOfMonth && problemDate <= endOfMonth) {
                        const dateKey = problemDate.toISOString().split('T')[0];
                        
                        if (!monthlyData[dateKey]) {
                            monthlyData[dateKey] = { count: 0, completed: 0 };
                        }
                        
                        monthlyData[dateKey].count++;
                        if (completedTitles.has(problem.title)) {
                            monthlyData[dateKey].completed++;
                        }
                    }
                });
            });

            setCalendarData(monthlyData);
            setError(null);
        } catch (err) {
            console.error("Error fetching calendar data:", err);
            setError("Could not load calendar data.");
            setCalendarData({});
        } finally {
            setIsLoading(false);
        }
    }, [userId, currentMonth, currentYear]);

    useEffect(() => {
        fetchCalendarData();
    }, [fetchCalendarData]);

    return { calendarData, isLoading, error, refreshCalendarData: fetchCalendarData };
};