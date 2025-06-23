import React, { useState, useEffect } from 'react';
import { X, Plus, Loader2, AlertCircle, Mic } from 'lucide-react';
import Button from '../UI/Button';
import VoiceInput from '../UI/VoiceInput';

const AddProblemModal = ({ isOpen, onClose, onAdd, selectedDate, isLoading, error }) => {
    const [problemTitle, setProblemTitle] = useState('');
    const [difficulty, setDifficulty] = useState('Medium');
    const [estimatedTime, setEstimatedTime] = useState(30);
    const [dueDate, setDueDate] = useState('');
    const [showVoiceInput, setShowVoiceInput] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    
    // Check if mobile on mount
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Set default due date when modal opens
    useEffect(() => {
        if (isOpen && selectedDate) {
            const dateStr = selectedDate.toISOString().split('T')[0];
            setDueDate(dateStr);
        }
    }, [isOpen, selectedDate]);

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setProblemTitle('');
            setDifficulty('Medium');
            setEstimatedTime(30);
            setDueDate('');
            setShowVoiceInput(false);
        }
    }, [isOpen]);
    
    // Handle voice input
    const handleVoiceProblem = (parsedProblem) => {
        if (parsedProblem.title) {
            setProblemTitle(parsedProblem.title);
        }
        if (parsedProblem.difficulty) {
            setDifficulty(parsedProblem.difficulty);
        }
        // Auto-set estimated time based on difficulty
        const timeMap = { Easy: 20, Medium: 35, Hard: 50 };
        setEstimatedTime(timeMap[parsedProblem.difficulty] || 30);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!problemTitle.trim()) return;

        const problemData = {
            title: problemTitle.trim(),
            difficulty,
            estimatedTime: parseInt(estimatedTime),
            dueDate: new Date(dueDate)
        };

        onAdd(problemData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Add New Problem</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label htmlFor="problemTitle" className="block text-sm font-medium text-gray-700">
                                Problem Title
                            </label>
                            {isMobile && (
                                <button
                                    type="button"
                                    onClick={() => setShowVoiceInput(!showVoiceInput)}
                                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors touch-target-sm"
                                    disabled={isLoading}
                                >
                                    <Mic className="h-3 w-3" />
                                    Voice
                                </button>
                            )}
                        </div>
                        
                        {showVoiceInput && isMobile && (
                            <div className="mb-3">
                                <VoiceInput
                                    onParsedProblem={handleVoiceProblem}
                                    disabled={isLoading}
                                    className="w-full"
                                />
                            </div>
                        )}
                        
                        <input
                            id="problemTitle"
                            type="text"
                            value={problemTitle}
                            onChange={(e) => setProblemTitle(e.target.value)}
                            placeholder={isMobile ? "e.g., Two Sum or use voice" : "e.g., Two Sum, Valid Parentheses"}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                            Difficulty
                        </label>
                        <select
                            id="difficulty"
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={isLoading}
                        >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="estimatedTime" className="block text-sm font-medium text-gray-700 mb-2">
                            Estimated Time (minutes)
                        </label>
                        <input
                            id="estimatedTime"
                            type="number"
                            value={estimatedTime}
                            onChange={(e) => setEstimatedTime(e.target.value)}
                            min="5"
                            max="180"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                            Due Date
                        </label>
                        <input
                            id="dueDate"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="flex-1"
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            className="flex-1"
                            disabled={isLoading || !problemTitle.trim()}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4" />
                                    Add Problem
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProblemModal;