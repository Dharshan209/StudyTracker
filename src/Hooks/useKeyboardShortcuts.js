import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useKeyboardShortcuts = (setSelectedDate, showNotification, onAddProblem) => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Only handle shortcuts if not typing in an input field
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            // Alt + A to add new problem
            if (e.altKey && e.key === 'a') {
                e.preventDefault();
                if (onAddProblem) {
                    onAddProblem();
                    showNotification('🚀 Opening Add Problem dialog!', 'success');
                } else {
                    showNotification('🚀 Add Problem shortcut pressed! (Alt + A)', 'success');
                }
            }
            // Alt + P to create new plan
            if (e.altKey && e.key === 'p') {
                e.preventDefault();
                navigate('/plan');
                showNotification('📋 Navigating to Create Plan!', 'success');
            }
            // Alt + T to go to today
            if (e.altKey && e.key === 't') {
                e.preventDefault();
                setSelectedDate(new Date());
                showNotification('📅 Jumped to today!', 'success');
            }
            // Alt + H to go home/dashboard
            if (e.altKey && e.key === 'h') {
                e.preventDefault();
                navigate('/dashboard');
                showNotification('🏠 Navigating to Dashboard!', 'success');
            }
            // Alt + R to go to resources
            if (e.altKey && e.key === 'r') {
                e.preventDefault();
                navigate('/resources');
                showNotification('📚 Navigating to Resources!', 'success');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [setSelectedDate, showNotification, onAddProblem, navigate]);
};