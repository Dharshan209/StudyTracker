import { useEffect, useRef } from 'react';

export const useSwipeGestures = (onSwipeLeft, onSwipeRight, onSwipeDown) => {
    const elementRef = useRef(null);
    const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
    const touchEndRef = useRef({ x: 0, y: 0, time: 0 });

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const handleTouchStart = (e) => {
            const touch = e.touches[0];
            touchStartRef.current = {
                x: touch.clientX,
                y: touch.clientY,
                time: Date.now()
            };
        };

        const handleTouchMove = (e) => {
            // Prevent default scrolling for potential swipe gestures
            const touch = e.touches[0];
            const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
            const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
            
            // If it's more horizontal than vertical movement, prevent default
            if (deltaX > deltaY && deltaX > 20) {
                e.preventDefault();
            }
        };

        const handleTouchEnd = (e) => {
            const touch = e.changedTouches[0];
            touchEndRef.current = {
                x: touch.clientX,
                y: touch.clientY,
                time: Date.now()
            };

            const deltaX = touchEndRef.current.x - touchStartRef.current.x;
            const deltaY = touchEndRef.current.y - touchStartRef.current.y;
            const deltaTime = touchEndRef.current.time - touchStartRef.current.time;
            
            // Only consider as swipe if it's fast enough (less than 300ms)
            if (deltaTime > 300) return;

            const minSwipeDistance = 50;
            const absX = Math.abs(deltaX);
            const absY = Math.abs(deltaY);

            // Horizontal swipes
            if (absX > absY && absX > minSwipeDistance) {
                if (deltaX > 0 && onSwipeRight) {
                    onSwipeRight();
                } else if (deltaX < 0 && onSwipeLeft) {
                    onSwipeLeft();
                }
            }
            // Vertical swipes (pull to refresh)
            else if (absY > absX && absY > minSwipeDistance && deltaY > 0 && onSwipeDown) {
                // Only trigger if swipe started near the top
                if (touchStartRef.current.y < 100) {
                    onSwipeDown();
                }
            }
        };

        element.addEventListener('touchstart', handleTouchStart, { passive: true });
        element.addEventListener('touchmove', handleTouchMove, { passive: false });
        element.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            element.removeEventListener('touchstart', handleTouchStart);
            element.removeEventListener('touchmove', handleTouchMove);
            element.removeEventListener('touchend', handleTouchEnd);
        };
    }, [onSwipeLeft, onSwipeRight, onSwipeDown]);

    return elementRef;
};