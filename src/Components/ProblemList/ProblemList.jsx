import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, Code, ChevronLeft, ChevronRight, BookOpen, ExternalLink, Activity, Youtube, ArrowUpDown, XCircle } from 'lucide-react';
import { useProblemData } from '../../Hooks/useProblemData'; // Adjust path if needed
import { ProblemTable } from './ProblemTable'; // Adjust path if needed

// Enhanced hook to manage completion state, including select-all logic
const useProblemCompletion = (currentProblemTitles) => {
  const [completedProblems, setCompletedProblems] = useState(new Set());

  const handleCheckChange = (problemTitle) => {
    setCompletedProblems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(problemTitle)) {
        newSet.delete(problemTitle);
      } else {
        newSet.add(problemTitle);
      }
      return newSet;
    });
  };

  const handleSelectAll = (isChecked) => {
    setCompletedProblems(prev => {
        const newSet = new Set(prev);
        if (isChecked) {
            currentProblemTitles.forEach(title => newSet.add(title));
        } else {
            currentProblemTitles.forEach(title => newSet.delete(title));
        }
        return newSet;
    });
  };

  return { completedProblems, handleCheckChange, handleSelectAll };
};

// Company Logo Component
const CompanyLogo = ({ company, isActive }) => {
    const logoColor = isActive ? 'white' : 'currentColor';
    
    const logos = {
        'Google': (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill={isActive ? logoColor : "#4285F4"}/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill={isActive ? logoColor : "#34A853"}/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill={isActive ? logoColor : "#FBBC05"}/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill={isActive ? logoColor : "#EA4335"}/>
            </svg>
        ),
        'Microsoft': (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                <path d="M1 1h10v10H1V1z" fill={isActive ? logoColor : "#F25022"}/>
                <path d="M13 1h10v10H13V1z" fill={isActive ? logoColor : "#7FBA00"}/>
                <path d="M1 13h10v10H1V13z" fill={isActive ? logoColor : "#00A4EF"}/>
                <path d="M13 13h10v10H13V13z" fill={isActive ? logoColor : "#FFB900"}/>
            </svg>
        ),
        'Meta': (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill={isActive ? logoColor : "#1877F2"}>
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
        )
    };

    return logos[company] || (
        <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">{company.charAt(0)}</span>
        </div>
    );
};

const toKebabCase = (str) => {
    if (!str) return '';
    return str.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
};

const ProblemList = () => {
    const {
        tabs, activeTab, setActiveTab, searchTerm, setSearchTerm, sortBy, setSortBy,
        sortedProblems, problemsData, resetPagination, setResetPagination
    } = useProblemData();

    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const problemsPerPage = 15;

    useEffect(() => {
        setIsLoading(true);
        // Simulate a network/processing delay to show the skeleton loader
        const timer = setTimeout(() => {
            if (resetPagination) {
                setCurrentPage(1);
                setResetPagination(false);
            }
            setIsLoading(false);
        }, 300);
        return () => clearTimeout(timer);
    }, [activeTab, searchTerm, sortBy, resetPagination, setResetPagination]);

    const indexOfLastProblem = currentPage * problemsPerPage;
    const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
    const currentProblems = useMemo(() => sortedProblems.slice(indexOfFirstProblem, indexOfLastProblem), [sortedProblems, indexOfFirstProblem, indexOfLastProblem]);
    const totalPages = Math.ceil(sortedProblems.length / problemsPerPage);
    
    const currentProblemTitles = useMemo(() => currentProblems.map(p => p.title), [currentProblems]);
    const { completedProblems, handleCheckChange, handleSelectAll } = useProblemCompletion(currentProblemTitles);

    const openLeetCodeProblem = useCallback((problemTitle) => {
        const url = `https://leetcode.com/problems/${toKebabCase(problemTitle)}/description/`;
        window.open(url, '_blank', 'noopener,noreferrer');
    }, []);

    const openResourceGuide = useCallback((problemTitle) => {
        const urlFriendlyTitle = encodeURIComponent(problemTitle);
        const url = `/resource/${urlFriendlyTitle}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    }, []);

    const openVisualization = useCallback((visualizationUrl) => {
        if (visualizationUrl) {
            window.open(visualizationUrl, '_blank', 'noopener,noreferrer');
        }
    }, []);

    const openYouTube = useCallback((youtubeUrl) => {
        if(youtubeUrl) {
            window.open(youtubeUrl, '_blank', 'noopener,noreferrer');
        }
    }, []);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const allOnPageSelected = useMemo(() => currentProblemTitles.length > 0 && currentProblemTitles.every(title => completedProblems.has(title)), [completedProblems, currentProblemTitles]);
    const someOnPageSelected = useMemo(() => currentProblemTitles.some(title => completedProblems.has(title)), [completedProblems, currentProblemTitles]);

    return (
        <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Coding <span className="text-blue-600">Problems</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Practice coding problems from top tech companies and improve your problem-solving skills.
                    </p>
                </div>

                <div className="mb-8">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-3">
                        <nav className="flex flex-wrap justify-center gap-3" aria-label="Tabs">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex items-center px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ease-in-out transform hover:scale-105 ${
                                        activeTab === tab 
                                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25' 
                                            : 'text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200'
                                    }`}
                                >
                                    <CompanyLogo company={tab} isActive={activeTab === tab} />
                                    <span className="ml-3">{tab}</span>
                                    <span className={`ml-3 px-2.5 py-1 text-xs font-bold rounded-full ${
                                        activeTab === tab 
                                            ? 'bg-blue-500 text-white' 
                                            : 'bg-gray-200 text-gray-700'
                                    }`}>
                                        {(problemsData[tab] || []).length}
                                    </span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-xl mb-8 overflow-hidden">
                    <div className="px-8 py-6 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex-shrink-0">
                                <p className="text-sm font-medium text-gray-700">
                                    Showing <span className="font-bold text-gray-900">{Math.min(indexOfFirstProblem + 1, sortedProblems.length)}</span>-<span className="font-bold text-gray-900">{Math.min(indexOfLastProblem, sortedProblems.length)}</span> of <span className="font-bold text-gray-900">{sortedProblems.length}</span> problems
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                                <div className="relative w-full sm:w-80">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search problems..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md bg-white"
                                    />
                                </div>
                                <div className="relative">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md w-full"
                                    >
                                        <option value="difficulty">Sort by Difficulty</option>
                                        <option value="title">Sort by Title (A-Z)</option>
                                    </select>
                                    <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
                    <ProblemTable
                        isLoading={isLoading}
                        problemsPerPage={problemsPerPage}
                        currentProblems={currentProblems}
                        checkedProblems={completedProblems}
                        handleCheckChange={handleCheckChange}
                        onSolve={openLeetCodeProblem}
                        onGuide={openResourceGuide}
                        onVisualize={openVisualization}
                        onYouTube={openYouTube}
                        onSelectAll={handleSelectAll}
                        allSelected={allOnPageSelected}
                        someSelected={someOnPageSelected}
                    />
                </div>

                {!isLoading && sortedProblems.length === 0 && (
                    <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 mt-8">
                        <XCircle className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">No Problems Found</h3>
                        <p className="text-gray-600 text-lg mb-6">Your search for "{searchTerm}" did not return any results.</p>
                        <button
                            onClick={() => setSearchTerm('')}
                            className="inline-flex items-center px-6 py-3 text-sm font-bold text-white bg-blue-600 border border-transparent rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            Clear Search
                        </button>
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <button
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className="inline-flex items-center px-6 py-3 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                                <ChevronLeft className="w-5 h-5 mr-2" /> Previous
                            </button>
                            
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-700">
                                    Page <span className="font-bold text-gray-900">{currentPage}</span> of <span className="font-bold text-gray-900">{totalPages}</span>
                                </span>
                            </div>
                            
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="inline-flex items-center px-6 py-3 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                                Next <ChevronRight className="w-5 h-5 ml-2" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProblemList;