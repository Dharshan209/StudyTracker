import React, { useState, useEffect } from 'react';
import { Code2, Plus, ExternalLink, Clock, Filter, ChevronDown, MoreVertical } from 'lucide-react';
import Button from '../UI/Button';
import { useScheduledProblems } from '../../Hooks/useScheduledProblems';
import { useAddProblem } from '../../Hooks/useAddProblem';
import { useProblemCompletion } from '../../Hooks/useProblemCompletion';
import AddProblemModal from './AddProblemModal';

const ProblemItem = ({ title, difficulty, isCompleted, onToggle, planId, estimatedTime = 30, isMobile = false }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    const difficultyColors = {
        Easy: 'bg-green-100 text-green-800 border-green-200',
        Medium: 'bg-orange-100 text-orange-800 border-orange-200',
        Hard: 'bg-red-100 text-red-800 border-red-200',
    };

    const difficultyDotColors = {
        Easy: 'bg-green-500',
        Medium: 'bg-orange-500',
        Hard: 'bg-red-500',
    };

    const generateUrlSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    };

    const leetcodeUrl = `https://leetcode.com/problems/${generateUrlSlug(title)}`;
    const resourceUrl = `/resources/${generateUrlSlug(title)}`;

    const handleLeetCodeClick = (e) => {
        e.stopPropagation();
        window.open(leetcodeUrl, '_blank', 'noopener,noreferrer');
    };

    if (isMobile) {
        return (
            <div className={`rounded-xl transition-all duration-200 border-2 ${isCompleted ? 'bg-gray-50 border-gray-200' : 'bg-white hover:bg-gray-50 border-gray-100 hover:border-gray-200 hover:shadow-sm'}`}>
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center flex-1 min-w-0">
                        <input
                            type="checkbox"
                            checked={isCompleted}
                            onChange={() => onToggle(title, planId)}
                            className="touch-target-sm h-5 w-5 rounded-md border-2 border-gray-300 text-blue-600 focus:ring-blue-500 mr-3 flex-shrink-0"
                        />
                        <div className={`p-2 rounded-lg border mr-3 flex-shrink-0 ${isCompleted ? 'bg-gray-100 border-gray-200' : 'bg-blue-50 border-blue-100'}`}>
                            <Code2 className={`h-5 w-5 ${isCompleted ? 'text-gray-400' : 'text-blue-600'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <a
                                href={resourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`font-semibold text-sm transition-colors duration-200 block truncate ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-900 hover:text-blue-600'}`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {title}
                            </a>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <div className={`w-2 h-2 rounded-full ${difficultyDotColors[difficulty] || difficultyDotColors.Medium}`}></div>
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="touch-target-sm p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                </div>
                
                {/* Mobile Expanded Content */}
                {isExpanded && (
                    <div className="px-4 pb-4 border-t border-gray-100">
                        <div className="flex items-center justify-between pt-3">
                            <div className="flex items-center gap-3">
                                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${difficultyColors[difficulty] || difficultyColors.Medium}`}>
                                    {difficulty}
                                </span>
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <Clock className="h-3 w-3" />
                                    <span className="text-xs">{estimatedTime}m</span>
                                </div>
                            </div>
                            <button
                                onClick={handleLeetCodeClick}
                                className="touch-target flex items-center gap-2 px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-all duration-200"
                                title={`Open "${title}" on LeetCode`}
                            >
                                <ExternalLink className="h-3 w-3" />
                                <span>Solve</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Desktop layout
    return (
        <div className={`flex items-start space-x-4 p-5 rounded-xl transition-all duration-200 border-2 ${isCompleted ? 'bg-gray-50 border-gray-200' : 'bg-white hover:bg-gray-50 border-gray-100 hover:border-gray-200 hover:shadow-sm'}`}>
            <div className="flex items-center mt-1">
                <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => onToggle(title, planId)}
                    className="h-6 w-6 rounded-md border-2 border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-offset-2 cursor-pointer transition-all duration-200"
                />
            </div>
            
            <div className={`p-3 rounded-xl border ${isCompleted ? 'bg-gray-100 border-gray-200' : 'bg-blue-50 border-blue-100'}`}>
                <Code2 className={`h-6 w-6 ${isCompleted ? 'text-gray-400' : 'text-blue-600'}`} />
            </div>
            
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                    <a
                      href={resourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`font-semibold text-lg transition-colors duration-200 ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-900 hover:text-blue-600 hover:underline'}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                        {title}
                    </a>
                </div>
                
                <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${difficultyDotColors[difficulty] || difficultyDotColors.Medium}`}></div>
                        <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full border ${difficultyColors[difficulty] || difficultyColors.Medium}`}>
                            {difficulty}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>{estimatedTime} min</span>
                    </div>
                </div>
            </div>
            
            <button
                onClick={handleLeetCodeClick}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 hover:border-blue-300 rounded-xl transition-all duration-200 flex-shrink-0 hover:shadow-sm"
                title={`Open "${title}" on LeetCode`}
            >
                <ExternalLink className="h-4 w-4" />
                <span>LeetCode</span>
            </button>
        </div>
    );
};

const ScheduledProblems = ({ selectedDate }) => {
    const { problems, isLoading, error, toggleProblemCompletion } = useScheduledProblems(selectedDate);
    const { userPlans } = useProblemCompletion();
    const { addProblemToPlan, isLoading: isAddingProblem, error: addError, clearError } = useAddProblem();
    
    const [filterDifficulty, setFilterDifficulty] = useState('All');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isFilterExpanded, setIsFilterExpanded] = useState(false);
    
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const filteredProblems = problems.filter(problem => {
        if (filterDifficulty !== 'All' && problem.difficulty !== filterDifficulty) return false;
        return true;
    });

    const completedCount = problems.filter(p => p.isCompleted).length;
    const totalCount = problems.length;
    const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    // Get the most recent active plan (or first plan if available)
    const activePlan = userPlans.length > 0 ? userPlans[0] : null;

    const handleAddProblem = async (problemData) => {
        if (!activePlan) {
            return;
        }

        const success = await addProblemToPlan(activePlan.id, problemData);
        if (success) {
            setIsAddModalOpen(false);
            clearError();
            // The problems will be automatically refreshed due to the selectedDate dependency
        }
    };

    const handleOpenAddModal = () => {
        clearError();
        setIsAddModalOpen(true);
    };

    if (isMobile) {
        return (
            <div className="bg-white rounded-xl border-2 border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
                {/* Mobile Header */}
                <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold text-gray-900">
                            Today's Schedule
                        </h3>
                        <button
                            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                            className="touch-target-sm p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <MoreVertical className="h-4 w-4" />
                        </button>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">
                        {selectedDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                    
                    {totalCount > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-medium text-gray-900">
                                    {completedCount}/{totalCount}
                                </span>
                            </div>
                            <div className="bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${completionPercentage}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                    
                    {/* Mobile Filter/Actions */}
                    {isFilterExpanded && (
                        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                <select 
                                    value={filterDifficulty}
                                    onChange={(e) => setFilterDifficulty(e.target.value)}
                                    className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="All">All Levels</option>
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </div>
                            
                            <Button 
                                variant="primary" 
                                size="sm" 
                                onClick={handleOpenAddModal}
                                disabled={!activePlan}
                                title={!activePlan ? "Create a study plan first to add problems" : "Add a new problem to your active plan"}
                                className="w-full touch-target"
                            >
                                <Plus className="h-4 w-4" />
                                Add Problem
                            </Button>
                        </div>
                    )}
                </div>
                
                {/* Mobile Problem List */}
                <div className="p-4">
                    <div className="space-y-3 min-h-[100px]">
                        {isLoading ? (
                            <p className="text-gray-500 text-center pt-8 text-sm">Loading schedule...</p>
                        ) : error ? (
                             <p className="text-red-500 text-center pt-8 text-sm">{error}</p>
                        ) : filteredProblems.length > 0 ? (
                            filteredProblems.map((problem) => (
                                <ProblemItem
                                    key={problem.id}
                                    title={problem.title}
                                    difficulty={problem.difficulty}
                                    isCompleted={problem.isCompleted}
                                    onToggle={toggleProblemCompletion}
                                    planId={problem.planId}
                                    estimatedTime={problem.estimatedTime || (problem.difficulty === 'Easy' ? 20 : problem.difficulty === 'Medium' ? 35 : 50)}
                                    isMobile={true}
                                />
                            ))
                        ) : (
                            <div className="text-center pt-8 pb-4">
                                <Code2 className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                                <p className="text-gray-500 font-medium">No problems today</p>
                                <p className="text-gray-400 text-sm mt-1">Add some problems to get started!</p>
                            </div>
                        )}
                    </div>
                </div>

                <AddProblemModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onAdd={handleAddProblem}
                    selectedDate={selectedDate}
                    isLoading={isAddingProblem}
                    error={addError}
                />
            </div>
        );
    }

    // Desktop layout
    return (
        <div className="bg-white rounded-xl border-2 border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        Today's Schedule
                    </h3>
                    <p className="text-gray-600">
                        {selectedDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    {totalCount > 0 && (
                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[200px]">
                                <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${completionPercentage}%` }}
                                ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-600">
                                {completedCount}/{totalCount} completed
                            </span>
                        </div>
                    )}
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-gray-500" />
                        <select 
                            value={filterDifficulty}
                            onChange={(e) => setFilterDifficulty(e.target.value)}
                            className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="All">All Levels</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>
                    
                    <Button 
                        variant="primary" 
                        size="sm" 
                        onClick={handleOpenAddModal}
                        disabled={!activePlan}
                        title={!activePlan ? "Create a study plan first to add problems" : "Add a new problem to your active plan"}
                    >
                        <Plus className="h-4 w-4" />
                        Add Problem
                    </Button>
                </div>
            </div>
            
            <div className="space-y-4 min-h-[100px]">
                {isLoading ? (
                    <p className="text-gray-500 text-center pt-8">Loading schedule...</p>
                ) : error ? (
                     <p className="text-red-500 text-center pt-8">{error}</p>
                ) : filteredProblems.length > 0 ? (
                    filteredProblems.map((problem) => (
                        <ProblemItem
                            key={problem.id}
                            title={problem.title}
                            difficulty={problem.difficulty}
                            isCompleted={problem.isCompleted}
                            onToggle={toggleProblemCompletion}
                            planId={problem.planId}
                            estimatedTime={problem.estimatedTime || (problem.difficulty === 'Easy' ? 20 : problem.difficulty === 'Medium' ? 35 : 50)}
                            isMobile={false}
                        />
                    ))
                ) : (
                    <div className="text-center pt-8 pb-4">
                        <Code2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 text-lg font-medium">No problems scheduled for today</p>
                        <p className="text-gray-400 text-sm mt-1">Add some problems to get started!</p>
                    </div>
                )}
            </div>

            <AddProblemModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddProblem}
                selectedDate={selectedDate}
                isLoading={isAddingProblem}
                error={addError}
            />
        </div>
    );
};

export default ScheduledProblems;