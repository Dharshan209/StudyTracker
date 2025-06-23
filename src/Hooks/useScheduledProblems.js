import { useState, useEffect, useCallback } from 'react';
import { db } from '../Config/firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

// ... (imports remain the same)

export const useScheduledProblems = (selectedDate) => {
    const [problems, setProblems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);

    // ... (the first useEffect for auth remains the same)
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
                setError(null);
            } else {
                setUserId(null);
                setProblems([]);
                setError("You must be logged in to see your schedule.");
                setIsLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!userId || !selectedDate) {
            if (userId) setIsLoading(false);
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);

            try {
                const [completedSnapshot, plansSnapshot] = await Promise.all([
                    getDocs(collection(db, 'artifacts', userId, 'problems')),
                    getDocs(collection(db, 'artifacts', userId, 'plan'))
                ]);

                // ✨ Create a Set of completed problem titles for easy lookup
                const completedTitles = new Set();
                completedSnapshot.forEach((doc) => completedTitles.add(doc.id));

                let allProblemsForDate = [];
                plansSnapshot.forEach(planDoc => {
                    const planContent = planDoc.data().content || {};
                    const problemsInPlan = Object.values(planContent);

                    const problemsForDate = problemsInPlan.filter(problem => {
                        const problemDate = problem.dueDate.toDate();
                        return problemDate.toDateString() === selectedDate.toDateString();
                    });
                    allProblemsForDate.push(...problemsForDate);
                });

                const formattedAndMergedProblems = allProblemsForDate.map((p, index) => ({
                    ...p,
                    id: `${p.planId}-${encodeURIComponent(p.title)}-${p.dueDate.seconds}-${index}`, // More unique and URL-safe ID
                    isCompleted: completedTitles.has(p.title)
                }));

                setProblems(formattedAndMergedProblems);
                setError(null);

            } catch (err) {
                console.error("Error fetching scheduled problems:", err);
                setError("Could not fetch your schedule. Please try again later.");
                setProblems([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [selectedDate, userId]);

    // ✨ Update the toggle function to accept planId
    const toggleProblemCompletion = useCallback(async (problemTitle, planId) => {
        if (!userId) {
            console.warn("Cannot update progress. User is not signed in.");
            return;
        }
        if (!planId) {
            console.error("Cannot toggle completion without a planId.");
            return;
        }

        const problemRef = doc(db, 'artifacts', userId, 'problems', problemTitle);
        const currentProblem = problems.find(p => p.title === problemTitle);
        const isCurrentlyCompleted = currentProblem ? currentProblem.isCompleted : false;

        setProblems(currentProblems =>
            currentProblems.map(p =>
                p.title === problemTitle ? { ...p, isCompleted: !isCurrentlyCompleted } : p
            )
        );

        try {
            if (isCurrentlyCompleted) {
                await deleteDoc(problemRef);
            } else {
                // ✨ Store planId with the completed problem
                await setDoc(problemRef, {
                    completed: true,
                    completedAt: new Date(),
                    planId: planId // Store which plan this problem belongs to
                });
            }
        } catch (err) {
            console.error("Error updating problem status:", err);
            setProblems(currentProblems =>
                currentProblems.map(p =>
                    p.title === problemTitle ? { ...p, isCompleted: isCurrentlyCompleted } : p
                )
            );
        }
    }, [userId, problems]);

    return { problems, isLoading, error, toggleProblemCompletion };
};