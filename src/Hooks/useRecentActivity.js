// src/Hooks/useRecentActivity.js
import { useState, useEffect, useCallback } from 'react';
import { db } from '../Config/firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';

// Helper function to format time since an event
const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};

/**
 * Fetches and combines recent user activities (solved problems, started plans).
 */
export const useRecentActivity = () => {
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId(null);
                setActivities([]);
                setError("You must be logged in to see recent activity.");
                setIsLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    const fetchActivities = useCallback(async () => {
        if (!userId) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            // Fetch plans and completed problems concurrently
            const [plansSnapshot, completedSnapshot] = await Promise.all([
                getDocs(collection(db, 'artifacts', userId, 'plan')),
                getDocs(collection(db, 'artifacts', userId, 'problems'))
            ]);

            let combinedActivities = [];

            // Process started plans
            plansSnapshot.forEach(doc => {
                const plan = doc.data();
                if (plan.startDate?.seconds) {
                    combinedActivities.push({
                        id: `plan-${doc.id}`,
                        type: 'started',
                        title: `${plan.planName || 'Unnamed Plan'} started`,
                        date: new Date(plan.startDate.seconds * 1000)
                    });
                }
            });

            // Process solved problems
            completedSnapshot.forEach(doc => {
                const problem = doc.data();
                if (problem.completed && problem.completedAt?.seconds) {
                    combinedActivities.push({
                        id: `problem-${doc.id}`,
                        type: 'solved',
                        title: `${doc.id} solved`,
                        date: new Date(problem.completedAt.seconds * 1000)
                    });
                }
            });

            // Sort all activities by date descending
            combinedActivities.sort((a, b) => b.date - a.date);

            // Format date to 'timeAgo' string and take the top 5
            const formattedActivities = combinedActivities.slice(0, 5).map(act => ({
                ...act,
                timeAgo: timeAgo(act.date)
            }));

            setActivities(formattedActivities);
            setError(null);
        } catch (err) {
            console.error("Error fetching recent activity:", err);
            setError("Could not load your recent activity.");
            setActivities([]);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        if (userId) {
            fetchActivities();
        }
    }, [userId, fetchActivities]);

    return { activities, isLoading, error, refreshActivities: fetchActivities };
};