import React, { useState, useEffect } from 'react';

const ProgressiveLoader = ({ 
    children, 
    loadingComponent, 
    delay = 0, 
    fadeIn = true,
    className = ""
}) => {
    const [isVisible, setIsVisible] = useState(delay === 0);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        if (delay > 0) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, delay);
            return () => clearTimeout(timer);
        }
    }, [delay]);

    useEffect(() => {
        if (isVisible && fadeIn) {
            // Small delay to trigger fade-in animation
            const timer = setTimeout(() => {
                setShowContent(true);
            }, 50);
            return () => clearTimeout(timer);
        } else if (isVisible) {
            setShowContent(true);
        }
    }, [isVisible, fadeIn]);

    if (!isVisible) {
        return loadingComponent || null;
    }

    return (
        <div 
            className={`${
                fadeIn 
                    ? `transition-opacity duration-300 ${
                        showContent ? 'opacity-100' : 'opacity-0'
                    }`
                    : ''
            } ${className}`}
        >
            {children}
        </div>
    );
};

// Staggered loading for lists
export const StaggeredLoader = ({ 
    items, 
    renderItem, 
    loadingComponent,
    staggerDelay = 100,
    className = ""
}) => {
    const [visibleCount, setVisibleCount] = useState(1);

    useEffect(() => {
        if (visibleCount < items.length) {
            const timer = setTimeout(() => {
                setVisibleCount(prev => prev + 1);
            }, staggerDelay);
            return () => clearTimeout(timer);
        }
    }, [visibleCount, items.length, staggerDelay]);

    return (
        <div className={className}>
            {items.slice(0, visibleCount).map((item, index) => (
                <ProgressiveLoader
                    key={index}
                    delay={0}
                    fadeIn={true}
                >
                    {renderItem(item, index)}
                </ProgressiveLoader>
            ))}
            {visibleCount < items.length && loadingComponent}
        </div>
    );
};

export default ProgressiveLoader;