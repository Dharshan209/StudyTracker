import { useState, useRef, useCallback } from 'react';

export const usePullToRefresh = (onRefresh, threshold = 80) => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [pullDistance, setPullDistance] = useState(0);
    const [isPulling, setIsPulling] = useState(false);
    
    const startY = useRef(0);
    const currentY = useRef(0);
    const scrollElement = useRef(null);

    const handleTouchStart = useCallback((e) => {
        const touch = e.touches[0];
        startY.current = touch.clientY;
        currentY.current = touch.clientY;
        
        // Only enable pull-to-refresh if at the top of the scroll
        const element = scrollElement.current || e.currentTarget;
        if (element.scrollTop === 0) {
            setIsPulling(true);
        }
    }, []);

    const handleTouchMove = useCallback((e) => {
        if (!isPulling || isRefreshing) return;
        
        const touch = e.touches[0];
        currentY.current = touch.clientY;
        const pullDist = Math.max(0, (currentY.current - startY.current) * 0.5);
        
        if (pullDist > 0) {
            e.preventDefault();
            setPullDistance(pullDist);
        }
    }, [isPulling, isRefreshing]);

    const handleTouchEnd = useCallback(async () => {
        if (!isPulling || isRefreshing) return;
        
        setIsPulling(false);
        
        if (pullDistance >= threshold) {
            setIsRefreshing(true);
            try {
                await onRefresh();
            } finally {
                setIsRefreshing(false);
            }
        }
        
        setPullDistance(0);
    }, [isPulling, isRefreshing, pullDistance, threshold, onRefresh]);

    const pullToRefreshProps = {
        onTouchStart: handleTouchStart,
        onTouchMove: handleTouchMove,
        onTouchEnd: handleTouchEnd,
        style: {
            transform: `translateY(${Math.min(pullDistance, threshold)}px)`,
            transition: isPulling ? 'none' : 'transform 0.3s ease-out'
        }
    };

    const refreshIndicatorStyle = {
        opacity: pullDistance > 0 ? Math.min(pullDistance / threshold, 1) : 0,
        transform: `scale(${Math.min(pullDistance / threshold, 1)})`,
        transition: isPulling ? 'none' : 'all 0.3s ease-out'
    };

    return {
        isRefreshing,
        pullDistance,
        isPulling,
        pullToRefreshProps,
        refreshIndicatorStyle,
        setScrollElement: (element) => { scrollElement.current = element; }
    };
};