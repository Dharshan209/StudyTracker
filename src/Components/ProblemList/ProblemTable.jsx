import React, { useRef, useEffect, useState } from 'react';
import { Code, ExternalLink, BookOpen, Activity, Youtube, MoreHorizontal, ChevronDown } from 'lucide-react';
import PlatformLogos from '../UI/PlatformLogos';

const DifficultyBadge = ({ difficulty }) => {
    const styles = {
        Easy: 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm',
        Medium: 'bg-amber-100 text-amber-800 border border-amber-300 shadow-sm',
        Hard: 'bg-rose-100 text-rose-800 border border-rose-300 shadow-sm',
    };
    return (
        <span className={`inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-full ${styles[difficulty]}`}>
            {difficulty}
        </span>
    );
};

const SkeletonRow = () => (
    <tr className="animate-pulse">
        <td className="px-8 py-6"><div className="h-4 w-4 rounded bg-gray-200"></div></td>
        <td className="px-8 py-6">
            <div className="flex items-center">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gray-200 mr-4"></div>
                <div className="space-y-2">
                    <div className="h-4 w-48 rounded bg-gray-200"></div>
                </div>
            </div>
        </td>
        <td className="px-8 py-6"><div className="h-7 w-20 rounded-full bg-gray-200"></div></td>
        <td className="px-8 py-6">
            <div className="flex flex-wrap gap-2">
                <div className="h-7 w-24 rounded-lg bg-gray-200"></div>
                <div className="h-7 w-20 rounded-lg bg-gray-200"></div>
            </div>
        </td>
        <td className="px-8 py-6">
            <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-gray-200"></div>
                <div className="h-9 w-9 rounded-xl bg-gray-200"></div>
            </div>
        </td>
    </tr>
);

const SkeletonCard = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
        <div className="flex items-start justify-between mb-3">
            <div className="flex items-center">
                <div className="h-4 w-4 rounded bg-gray-200 mr-3"></div>
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gray-200 mr-3"></div>
                <div className="h-4 w-40 rounded bg-gray-200"></div>
            </div>
            <div className="h-7 w-16 rounded-full bg-gray-200"></div>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
            <div className="h-6 w-20 rounded-lg bg-gray-200"></div>
            <div className="h-6 w-24 rounded-lg bg-gray-200"></div>
        </div>
        <div className="flex justify-between items-center">
            <div className="flex gap-2">
                <div className="h-10 w-10 rounded-xl bg-gray-200"></div>
                <div className="h-10 w-10 rounded-xl bg-gray-200"></div>
            </div>
            <div className="h-10 w-10 rounded-xl bg-gray-200"></div>
        </div>
    </div>
);

const ActionMenu = ({ problem, onSolve, onGuide, onVisualize, onYouTube }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const actions = [
        { label: 'Solve on LeetCode', onClick: () => onSolve(problem.title), icon: 'LeetCode', color: 'blue' },
        { label: 'View Guide', onClick: () => onGuide(problem.title), icon: 'Guide', color: 'purple' },
        ...(problem.visualization ? [{ label: 'View Visualization', onClick: () => onVisualize(problem.visualization), icon: 'Visualization', color: 'orange' }] : []),
        ...(problem.youtube ? [{ label: 'Watch on YouTube', onClick: () => onYouTube(problem.youtube), icon: 'YouTube', color: 'red' }] : [])
    ];
    
    const handleAction = (action) => {
        action.onClick();
        setIsOpen(false);
    };
    
    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="touch-target p-2 text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all duration-200"
                title="More actions"
            >
                <MoreHorizontal className="w-5 h-5" />
            </button>
            
            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
                        {actions.map((action, idx) => {
                            const PlatformIcon = PlatformLogos[action.icon];
                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleAction(action)}
                                    className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors touch-target-sm"
                                >
                                    <div className="w-4 h-4 mr-3 flex items-center justify-center">
                                        <PlatformIcon className="w-4 h-4" />
                                    </div>
                                    {action.label}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

const ProblemCard = ({ problem, isChecked, onCheckChange, onSolve, onGuide, onVisualize, onYouTube }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all duration-200 hover:border-gray-300">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center flex-1 min-w-0">
                    <input
                        type="checkbox"
                        className="touch-target-sm h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3 flex-shrink-0"
                        checked={isChecked}
                        onChange={onCheckChange}
                    />
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-3 shadow-sm">
                        <Code className="w-5 h-5 text-white" />
                    </div>
                    <button
                        onClick={() => onSolve(problem.title)}
                        className="text-sm font-bold text-gray-900 hover:text-blue-700 transition-colors text-left leading-tight truncate flex-1 min-w-0"
                    >
                        {problem.title}
                    </button>
                </div>
                <div className="flex-shrink-0 ml-3">
                    <DifficultyBadge difficulty={problem.difficulty} />
                </div>
            </div>
            
            {/* Topics - Show limited on mobile */}
            <div className="mb-3">
                <div className="flex flex-wrap gap-2">
                    {problem.topics.slice(0, isExpanded ? problem.topics.length : 2).map((topic, idx) => (
                        <span key={idx} className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-lg">
                            {topic}
                        </span>
                    ))}
                    {problem.topics.length > 2 && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors touch-target-sm"
                        >
                            {isExpanded ? 'Show less' : `+${problem.topics.length - 2} more`}
                            <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                    )}
                    {problem.topics.length === 0 && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-500 rounded-lg">
                            N/A
                        </span>
                    )}
                </div>
            </div>
            
            {/* Actions */}
            <div className="flex justify-between items-center">
                <div className="flex gap-3">
                    <button 
                        onClick={() => onSolve(problem.title)} 
                        className="touch-target p-2 text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 hover:scale-110 transition-all duration-200 shadow-sm"
                        title="Solve on LeetCode"
                    >
                        <PlatformLogos.LeetCode className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => onGuide(problem.title)} 
                        className="touch-target p-2 text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 hover:scale-110 transition-all duration-200 shadow-sm"
                        title="View Guide"
                    >
                        <PlatformLogos.Guide className="w-5 h-5" />
                    </button>
                    {problem.youtube && (
                        <button 
                            onClick={() => onYouTube(problem.youtube)} 
                            className="touch-target p-2 text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 hover:scale-110 transition-all duration-200 shadow-sm"
                            title="Watch on YouTube"
                        >
                            <PlatformLogos.YouTube className="w-5 h-5" />
                        </button>
                    )}
                    {problem.visualization && (
                        <button 
                            onClick={() => onVisualize(problem.visualization)} 
                            className="touch-target p-2 text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 hover:scale-110 transition-all duration-200 shadow-sm"
                            title="View Visualization"
                        >
                            <PlatformLogos.Visualization className="w-5 h-5" />
                        </button>
                    )}
                </div>
                <ActionMenu 
                    problem={problem}
                    onSolve={onSolve}
                    onGuide={onGuide}
                    onVisualize={onVisualize}
                    onYouTube={onYouTube}
                />
            </div>
        </div>
    );
};

export const ProblemTable = ({
    isLoading,
    problemsPerPage,
    currentProblems,
    checkedProblems,
    handleCheckChange,
    onSolve,
    onGuide,
    onVisualize,
    onYouTube,
    onSelectAll,
    allSelected,
    someSelected
}) => {
    const headerCheckboxRef = useRef();
    const [isMobileView, setIsMobileView] = useState(false);

    useEffect(() => {
        if (headerCheckboxRef.current) {
            headerCheckboxRef.current.indeterminate = someSelected && !allSelected;
        }
    }, [someSelected, allSelected]);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobileView(window.innerWidth < 768);
        };
        
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Mobile Card View
    if (isMobileView) {
        return (
            <div className="space-y-4">
                {/* Mobile Header */}
                <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            ref={headerCheckboxRef}
                            className="touch-target-sm h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                            checked={allSelected}
                            onChange={(e) => onSelectAll(e.target.checked)}
                        />
                        <span className="text-sm font-bold text-gray-700">Select All</span>
                    </div>
                    <span className="text-xs text-gray-500">
                        {currentProblems.length} problem{currentProblems.length !== 1 ? 's' : ''}
                    </span>
                </div>
                
                {/* Card List */}
                {isLoading ? (
                    <div className="space-y-4">
                        {[...Array(problemsPerPage)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {currentProblems.map((problem) => (
                            <ProblemCard
                                key={problem.title}
                                problem={problem}
                                isChecked={checkedProblems.has(problem.title)}
                                onCheckChange={() => handleCheckChange(problem.title)}
                                onSolve={onSolve}
                                onGuide={onGuide}
                                onVisualize={onVisualize}
                                onYouTube={onYouTube}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // Desktop Table View
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-8 py-5 text-left">
                            <input
                                type="checkbox"
                                ref={headerCheckboxRef}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                checked={allSelected}
                                onChange={(e) => onSelectAll(e.target.checked)}
                            />
                        </th>
                        <th className="px-8 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Problem</th>
                        <th className="px-8 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Difficulty</th>
                        <th className="px-8 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Topics</th>
                        <th className="px-8 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                    {isLoading ? (
                        [...Array(problemsPerPage)].map((_, i) => <SkeletonRow key={i} />)
                    ) : (
                        currentProblems.map((problem) => (
                            <tr key={problem.title} className="hover:bg-blue-50/50 transition-all duration-200 group">
                                <td className="px-8 py-6">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors"
                                        checked={checkedProblems.has(problem.title)}
                                        onChange={() => handleCheckChange(problem.title)}
                                    />
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-md">
                                            <Code className="w-5 h-5 text-white" />
                                        </div>
                                        <button
                                            onClick={() => onSolve(problem.title)}
                                            className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors hover:underline text-left leading-tight"
                                        >
                                            {problem.title}
                                        </button>
                                    </div>
                                </td>
                                <td className="px-8 py-6 whitespace-nowrap">
                                    <DifficultyBadge difficulty={problem.difficulty} />
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex flex-wrap gap-2">
                                        {problem.topics.slice(0, 3).map((topic, idx) => (
                                            <span key={idx} className="inline-flex items-center px-3 py-1.5 text-xs font-semibold bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors">
                                                {topic}
                                            </span>
                                        ))}
                                        {problem.topics.length > 3 && (
                                            <span className="inline-flex items-center px-3 py-1.5 text-xs font-semibold bg-gray-100 text-gray-600 rounded-lg">
                                                +{problem.topics.length - 3}
                                            </span>
                                        )}
                                        {problem.topics.length === 0 && (
                                            <span className="inline-flex items-center px-3 py-1.5 text-xs font-semibold bg-gray-100 text-gray-500 rounded-lg">
                                                N/A
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-8 py-6 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={() => onSolve(problem.title)} 
                                            className="p-2.5 text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 hover:scale-110 transition-all duration-300 shadow-sm"
                                            title="Solve on LeetCode"
                                        >
                                            <PlatformLogos.LeetCode className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => onGuide(problem.title)} 
                                            className="p-2.5 text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 hover:scale-110 transition-all duration-300 shadow-sm"
                                            title="View Guide"
                                        >
                                            <PlatformLogos.Guide className="w-4 h-4" />
                                        </button>
                                        {problem.visualization && (
                                            <button 
                                                onClick={() => onVisualize(problem.visualization)} 
                                                className="p-2.5 text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 hover:scale-110 transition-all duration-300 shadow-sm"
                                                title="View Visualization"
                                            >
                                                <PlatformLogos.Visualization className="w-4 h-4" />
                                            </button>
                                        )}
                                        {problem.youtube && (
                                            <button 
                                                onClick={() => onYouTube(problem.youtube)} 
                                                className="p-2.5 text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 hover:scale-110 transition-all duration-300 shadow-sm"
                                                title="Watch on YouTube"
                                            >
                                                <PlatformLogos.YouTube className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};