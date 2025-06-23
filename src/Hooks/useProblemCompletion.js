// hooks/useProblemCompletion.js
import { useState, useEffect, useCallback } from 'react';
import { doc, setDoc, deleteDoc, collection, getDocs, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../Config/firebase';

/**
 * Calculates the study streak based on a list of completion dates.
 * @param {Date[]} completionDates - An array of Date objects for each completed problem.
 * @returns {number} The number of consecutive days of studying.
 */
const calculateStudyStreak = (completionDates) => {
    if (!completionDates || completionDates.length === 0) {
        return 0;
    }

    // Get unique days in UTC, normalized to the start of the day
    const uniqueDays = new Set(
        completionDates.map(date => {
            const d = new Date(date);
            return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())).getTime();
        })
    );

    const sortedDays = Array.from(uniqueDays).sort((a, b) => b - a);
    
    if (sortedDays.length === 0) return 0;

    const today = new Date();
    const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())).getTime();
    
    let streak = 0;
    let lastDate = todayUTC;

    // Check if the most recent completion was today or yesterday
    if (sortedDays[0] === todayUTC || sortedDays[0] === todayUTC - 86400000) {
        streak = 1;
        lastDate = sortedDays[0];

        // Iterate through the rest of the days
        for (let i = 1; i < sortedDays.length; i++) {
            const currentDate = sortedDays[i];
            if (lastDate - currentDate === 86400000) { // 24 * 60 * 60 * 1000 ms
                streak++;
                lastDate = currentDate;
            } else {
                break; // Streak is broken
            }
        }
    }
    
    return streak;
};


export const useProblemCompletion = () => {
    // Auth State
    const [userId, setUserId] = useState(null);
    const [authError, setAuthError] = useState(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    // Problem Completion State
    const [completedProblems, setCompletedProblems] = useState(new Map());
    const [isLoadingCompletion, setIsLoadingCompletion] = useState(true);
    
    // Plan Management State
    const [userPlans, setUserPlans] = useState([]);
    const [isLoadingPlans, setIsLoadingPlans] = useState(true);
    
    // Calculated Stats
    const [studyStreak, setStudyStreak] = useState(0);

    // Auth State Listener
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
                setAuthError(null);
            } else {
                setUserId(null);
                setCompletedProblems(new Map());
                setUserPlans([]);
                setAuthError("You must be logged in.");
            }
            setIsAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Effect for fetching completed problems
    useEffect(() => {
        if (!userId) {
            setCompletedProblems(new Map());
            setIsLoadingCompletion(false);
            return;
        }

        const fetchCompletedProblems = async () => {
            setIsLoadingCompletion(true);
            try {
                const problemsRef = collection(db, 'artifacts', userId, 'problems');
                const querySnapshot = await getDocs(problemsRef);
                const problemsMap = new Map();
                querySnapshot.docs.forEach(doc => {
                     if(doc.data().completed) {
                        problemsMap.set(doc.id, doc.data());
                     }
                });
                setCompletedProblems(problemsMap);
            } catch (error) {
                console.error("Error fetching completed problems:", error);
            } finally {
                setIsLoadingCompletion(false);
            }
        };

        fetchCompletedProblems();
    }, [userId]);
    
    // Effect for fetching user plans
    const fetchUserPlans = useCallback(async () => {
        if (!userId) {
            setUserPlans([]);
            setIsLoadingPlans(false);
            return;
        }
        setIsLoadingPlans(true);
        try {
            const plansRef = collection(db, 'artifacts', userId, 'plan');
            const querySnapshot = await getDocs(plansRef);
            const plans = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUserPlans(plans);
        } catch (error) {
            console.error("Error fetching user plans:", error);
        } finally {
            setIsLoadingPlans(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchUserPlans();
    }, [fetchUserPlans])


    // Effect to calculate stats whenever underlying data changes
   // TO:
useEffect(() => {
    const dates = Array.from(completedProblems.values())
        .map(p => {
            const completedAt = p.completedAt;
            if (!completedAt) return null;

            // If it's a Firestore Timestamp, convert it. Otherwise, use it as is.
            return typeof completedAt.toDate === 'function' 
                ? completedAt.toDate() 
                : completedAt;
        })
        .filter(Boolean);
    setStudyStreak(calculateStudyStreak(dates));
}, [completedProblems]);

    // Handle problem check changes
    const handleCheckChange = useCallback(async (problemTitle) => {
        if (!userId) return;
        
        const problemRef = doc(db, 'artifacts', userId, 'problems', problemTitle);
        const newCompletedProblems = new Map(completedProblems);

        try {
            if (newCompletedProblems.has(problemTitle)) {
                newCompletedProblems.delete(problemTitle);
                await deleteDoc(problemRef);
            } else {
                const newData = { completed: true, completedAt: new Date() };
                newCompletedProblems.set(problemTitle, newData);
                await setDoc(problemRef, newData);
            }
            setCompletedProblems(newCompletedProblems);
        } catch (error) {
            console.error("Error updating problem status:", error);
        }
    }, [userId, completedProblems]);
    
    return {
        // Raw Data
        completedProblems,
        userPlans,
        
        // Calculated Stats
        problemsSolvedCount: completedProblems.size,
        activePlansCount: userPlans.length,
        studyStreak,

        // Loading and Error States
        isAuthLoading,
        authError,
        isLoading: isLoadingCompletion || isLoadingPlans,
        
        // Functions
        handleCheckChange,
        fetchUserPlans,
    };
};
