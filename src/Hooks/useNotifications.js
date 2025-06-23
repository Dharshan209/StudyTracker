import { useState, useEffect } from 'react';

export const useNotifications = () => {
    const [notification, setNotification] = useState(null);

    // Effect to listen for custom notification events
    useEffect(() => {
        const handleNotification = (e) => {
            setNotification({ 
                message: e.detail.message, 
                type: e.detail.type || 'success' 
            });
            setTimeout(() => setNotification(null), 4000);
        };

        window.addEventListener('show-notification', handleNotification);
        return () => window.removeEventListener('show-notification', handleNotification);
    }, []);

    const showNotification = (message, type = 'success') => {
        window.dispatchEvent(new CustomEvent('show-notification', {
            detail: { message, type }
        }));
    };

    return {
        notification,
        showNotification,
        clearNotification: () => setNotification(null)
    };
};