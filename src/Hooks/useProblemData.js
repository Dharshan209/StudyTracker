// hooks/useProblemData.js
import { useState, useMemo, useEffect } from 'react';
import problemDataFromJson from '../Data/Problem.json'; // Adjust the import path as needed

// Helper function to process the raw JSON data
const processProblems = (problems) => {
    const companyMap = {
        'All': [],
        'Google': [],
        'Amazon': [],
        'Meta': [],
        'Microsoft': []
    };

    problems.forEach(problem => {
        // Ensure every problem has a topics array, even if empty
        const problemWithTopics = { ...problem, topics: problem.topics || [] };
        companyMap['All'].push(problemWithTopics);
        if (problem.company.includes('Google')) companyMap['Google'].push(problemWithTopics);
        if (problem.company.includes('Amazon')) companyMap['Amazon'].push(problemWithTopics);
        if (problem.company.includes('Facebook') || problem.company.includes('Meta')) companyMap['Meta'].push(problemWithTopics);
        if (problem.company.includes('Microsoft')) companyMap['Microsoft'].push(problemWithTopics);
    });

    return companyMap;
};

export const useProblemData = () => {
    const [activeTab, setActiveTab] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('difficulty');

    // Memoize the processed data so it's not re-calculated on every render
    const problemsData = useMemo(() => processProblems(problemDataFromJson), []);

    const tabs = useMemo(() => ['All', 'Google', 'Amazon', 'Meta', 'Microsoft'], []);

    // Filter problems based on the active tab and search term
    const filteredProblems = useMemo(() => {
        const problemsToShow = problemsData[activeTab] || [];
        if (!searchTerm) {
            return problemsToShow;
        }
        return problemsToShow.filter(problem =>
            problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            problem.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [activeTab, searchTerm, problemsData]);

    // Sort the filtered problems
    const sortedProblems = useMemo(() => {
        return [...filteredProblems].sort((a, b) => {
            if (sortBy === 'difficulty') {
                const order = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
                return order[a.difficulty] - order[b.difficulty];
            }
            // Default to sorting by title
            return a.title.localeCompare(b.title);
        });
    }, [filteredProblems, sortBy]);
    
    // Reset page to 1 when filters change
    const [resetPagination, setResetPagination] = useState(false);

    useEffect(() => {
        setResetPagination(true);
    }, [activeTab, searchTerm, sortBy]);


    return {
        tabs,
        activeTab,
        setActiveTab,
        searchTerm,
        setSearchTerm,
        sortBy,
        setSortBy,
        sortedProblems,
        problemsData,
        resetPagination,
        setResetPagination
    };
};