import { useState, useEffect, useCallback } from 'react';
import { db } from '../Config/firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

export const useTimeTracking = () => {
    const [userId, setUserId] = useState(null);
    const [todayTimeSpent, setTodayTimeSpent] = useState(0); // in minutes
    const [isLoading, setIsLoading] = useState(true);
    const [sessionStartTime, setSessionStartTime] = useState(null);
    const [isTracking, setIsTracking] = useState(false);

    // Auth state listener
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId(null);
                setTodayTimeSpent(0);
                setSessionStartTime(null);
                setIsTracking(false);
                setIsLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    // Load today's time spent
    useEffect(() => {
        if (!userId) {
            setIsLoading(false);
            return;
        }

        const loadTodayTime = async () => {
            setIsLoading(true);
            try {
                const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
                const timeDocRef = doc(db, 'artifacts', userId, 'timeTracking', today);
                const timeDoc = await getDoc(timeDocRef);
                
                if (timeDoc.exists()) {
                    setTodayTimeSpent(timeDoc.data().totalMinutes || 0);
                } else {
                    setTodayTimeSpent(0);
                }
            } catch (error) {
                console.error("Error loading today's time:", error);
                setTodayTimeSpent(0);
            } finally {
                setIsLoading(false);
            }
        };

        loadTodayTime();
    }, [userId]);

    // Start tracking time
    const startSession = useCallback(() => {
        if (!isTracking) {
            setSessionStartTime(Date.now());
            setIsTracking(true);
        }
    }, [isTracking]);

    // Stop tracking time and save to Firebase
    const endSession = useCallback(async () => {
        if (!isTracking || !sessionStartTime || !userId) return;

        const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000 / 60); // minutes
        if (sessionDuration < 1) return; // Don't save sessions less than 1 minute

        try {
            const today = new Date().toISOString().split('T')[0];
            const timeDocRef = doc(db, 'artifacts', userId, 'timeTracking', today);
            const timeDoc = await getDoc(timeDocRef);

            const newTotalMinutes = todayTimeSpent + sessionDuration;

            if (timeDoc.exists()) {
                await updateDoc(timeDocRef, {
                    totalMinutes: newTotalMinutes,
                    lastUpdated: new Date()
                });
            } else {
                await setDoc(timeDocRef, {
                    totalMinutes: newTotalMinutes,
                    date: today,
                    lastUpdated: new Date()
                });
            }

            setTodayTimeSpent(newTotalMinutes);
        } catch (error) {
            console.error("Error saving session time:", error);
        } finally {
            setIsTracking(false);
            setSessionStartTime(null);
        }
    }, [isTracking, sessionStartTime, userId, todayTimeSpent]);

    // Auto-start session when component mounts
    useEffect(() => {
        if (userId && !isLoading) {
            startSession();
        }

        // Auto-end session when page is about to unload  
        const handleBeforeUnload = () => {
            if (isTracking && sessionStartTime && userId) {
                const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000 / 60);
                if (sessionDuration >= 1) {
                    // Use navigator.sendBeacon for reliable data sending on page unload
                    const today = new Date().toISOString().split('T')[0];
                    const data = {
                        userId,
                        date: today,
                        sessionMinutes: sessionDuration,
                        currentTotal: todayTimeSpent
                    };
                    navigator.sendBeacon('/api/track-time', JSON.stringify(data));
                }
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            endSession();
        };
    }, [userId, isLoading, startSession, endSession, isTracking, sessionStartTime, todayTimeSpent]);

    // Format time for display
    const formatTime = useCallback((minutes) => {
        if (minutes < 60) {
            return `${minutes}m`;
        } else {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
        }
    }, []);

    return {
        todayTimeSpent,
        isLoading,
        isTracking,
        startSession,
        endSession,
        formatTime: () => formatTime(todayTimeSpent),
        todayTimeSpentMinutes: todayTimeSpent
    };
};