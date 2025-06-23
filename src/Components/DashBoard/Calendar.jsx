// src/components/Calendar.jsx
import React, { useState, memo, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import Button from '../UI/Button';
import { useCalendarData } from '../../Hooks/useCalendarData';

const Calendar = memo(({ selectedDate, setSelectedDate }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    // Use the hook to get real calendar data for the current month
    const { calendarData: daysWithProblems, isLoading } = useCalendarData(currentMonth, currentYear);

    // Helper function to generate calendar days
    const generateCalendarDays = (year, month) => {
        const date = new Date(year, month, 1);
        const days = [];
        const firstDayOfWeek = date.getDay();

        // Add empty placeholders for days before the 1st of the month
        for (let i = 0; i < firstDayOfWeek; i++) {
            days.push(null);
        }

        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    };

    const getDayInfo = (day) => {
        const dateKey = day.toISOString().split('T')[0];
        return daysWithProblems[dateKey] || null;
    };

    const isToday = (day) => {
        const today = new Date();
        return day.toDateString() === today.toDateString();
    };

    const monthNames = useMemo(() => ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], []);
    const daysOfWeek = useMemo(() => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], []);
    const calendarDays = useMemo(() => generateCalendarDays(currentYear, currentMonth), [currentYear, currentMonth]);

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    return (
        <div className="bg-white rounded-xl border-2 border-gray-100 p-4 lg:p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
                <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600" />
                    <h3 className="text-lg lg:text-xl font-bold text-gray-900">{monthNames[currentMonth]} {currentYear}</h3>
                </div>
                <div className="flex items-center gap-1">
                    <Button onClick={handlePrevMonth} variant="ghost" size="sm" className="p-2 hover:bg-gray-100 touch-target-sm">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button onClick={handleNextMonth} variant="ghost" size="sm" className="p-2 hover:bg-gray-100 touch-target-sm">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-3 lg:mb-4">
                {daysOfWeek.map((day, i) => (
                    <div key={i} className="text-center text-xs lg:text-sm font-semibold text-gray-600 py-1 lg:py-2 uppercase tracking-wide">
                        {day}
                    </div>
                ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2 relative">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                        <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                    </div>
                )}
                {calendarDays.map((day, index) => {
                    if (!day) return <div key={index} />;
                    
                    const dayInfo = getDayInfo(day);
                    const isSelected = selectedDate?.toDateString() === day.toDateString();
                    const isTodayDate = isToday(day);
                    
                    return (
                        <div key={index} className="aspect-square flex flex-col items-center justify-center relative">
                            <button
                                onClick={() => setSelectedDate(day)}
                                className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex flex-col items-center justify-center transition-all duration-200 text-xs lg:text-sm font-semibold relative group touch-target ${
                                    isSelected
                                        ? 'bg-blue-600 text-white shadow-lg transform scale-105' 
                                        : isTodayDate
                                        ? 'bg-blue-50 text-blue-600 border-2 border-blue-200 hover:bg-blue-100'
                                        : dayInfo
                                        ? 'bg-green-50 text-green-800 border border-green-200 hover:bg-green-100'
                                        : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                                }`}
                            >
                                <span className="text-xs lg:text-sm">{day.getDate()}</span>
                                {dayInfo && (
                                    <div className="flex gap-0.5 mt-0.5">
                                        {Array.from({ length: Math.min(dayInfo.count, 3) }).map((_, i) => (
                                            <div
                                                key={i}
                                                className={`w-1.5 h-1.5 rounded-full ${
                                                    i < dayInfo.completed 
                                                        ? isSelected ? 'bg-white' : 'bg-green-500'
                                                        : isSelected ? 'bg-blue-300' : 'bg-gray-300'
                                                }`}
                                            />
                                        ))}
                                        {dayInfo.count > 3 && (
                                            <span className={`text-xs ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                                                +{dayInfo.count - 3}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </button>
                            
                            {isTodayDate && !isSelected && (
                                <div className="absolute -bottom-1 w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
                        </div>
                    );
                })}
            </div>
            
            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                        <span>Scheduled</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span>Today</span>
                    </div>
                </div>
            </div>
        </div>
    );
}, (prevProps, nextProps) => {
    return prevProps.selectedDate?.getTime() === nextProps.selectedDate?.getTime();
});

Calendar.displayName = 'Calendar';

export default Calendar;