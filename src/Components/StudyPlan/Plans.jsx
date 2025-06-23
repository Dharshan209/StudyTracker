import React, { useState, useMemo, useEffect } from 'react';
import { Search, Clock, BarChart, BookCopy, Eye, Download, Loader, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Add this import
// --- REAL HOOK IMPORT ---
// Import the actual hook from its file. Ensure the path is correct.
import useUpdatePlan from '../../Hooks/useUpdatePlan'; 

// Mock data for study plans. In a real app, this would also be fetched from a backend.
const studyPlans = [
    {
        id: "dsa_30",
        title: "30-Day DSA Plan",
        category: "Data Structures & Algorithms",
        problems: 60,
        daily: "1 hr/day",
        level: "Easy",
        description: "A foundational plan covering key data structures and algorithms over 30 days.",
    },
    {
        id: "adv_algo_1",
        title: "Advanced Algorithms",
        category: "Data Structures & Algorithms",
        problems: 45,
        daily: "1.5 hr/day",
        level: "Hard",
        description: "Tackle complex topics like dynamic programming, graph algorithms, and more.",
    },
     {
        id: "sql_ds_1",
        title: "SQL for Data Science",
        category: "Data Structures & Algorithms",
        problems: 40,
        daily: "1 hr/day",
        level: "Medium",
        description: "Sharpen your SQL skills with challenges focused on data analysis and manipulation.",
    },
    {
        id: "sys_design_fun",
        title: "System Design Fundamentals",
        category: "System Design",
        problems: 25,
        daily: "2 hr/day",
        level: "Medium",
        description: "Learn the basics of designing scalable systems, from load balancing to databases.",
    },
    {
        id: "frontend_roadmap",
        title: "Frontend Developer Roadmap",
        category: "Web Development",
        problems: 70,
        daily: "2 hr/day",
        level: "Medium",
        description: "A comprehensive plan covering HTML, CSS, JavaScript, and a modern framework.",
    },
    {
        id: "full_stack_1",
        title: "Full-Stack Web Dev",
        category: "Web Development",
        problems: 100,
        daily: "3 hr/day",
        level: "Hard",
        description: "Master both frontend and backend technologies to become a full-stack developer.",
    },
];

// Reusable component for displaying an icon with text
const InfoPill = ({ icon: Icon, text, className }) => (
    <div className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${className}`}>
        <Icon className="h-4 w-4" />
        <span>{text}</span>
    </div>
);

// Component for a single study plan card
const PlanCard = ({ plan, onImport, isLoading }) => {
    const { title, problems, daily, level, description } = plan;
    
    const levelColor = {
        Easy: 'bg-green-100 text-green-800',
        Medium: 'bg-yellow-100 text-yellow-800',
        Hard: 'bg-red-100 text-red-800',
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden transform hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
            <div className="p-6 flex-grow">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                    <InfoPill icon={BookCopy} text={`${problems} Problems`} className="bg-gray-100" />
                    <InfoPill icon={Clock} text={daily} className="bg-gray-100" />
                    <InfoPill icon={BarChart} text={level} className={levelColor[level]} />
                </div>
                <p className="text-gray-600 text-sm mb-4">
                    {description}
                </p>
            </div>
            <div className="px-6 py-4 bg-gray-50 mt-auto flex flex-col sm:flex-row gap-3">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                    <Eye className="h-4 w-4" /> Preview
                </button>
                <button 
                    onClick={() => onImport(plan.id)}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed">
                    <Download className="h-4 w-4" /> 
                    {isLoading ? 'Importing...' : 'Import Plan'}
                </button>
            </div>
        </div>
    );
};

// Modal Component for Import Process
const ImportModal = ({ isOpen, status, error, onClose }) => {
    if (!isOpen) return null;

    let content;
    if (status === 'importing') {
        content = (
            <>
                <Loader className="h-16 w-16 text-indigo-600 animate-spin mb-4" />
                <h3 className="text-lg font-medium leading-6 text-gray-900">Planning your schedule...</h3>
                <p className="mt-2 text-sm text-gray-500">Please wait while we import the plan into your schedule.</p>
            </>
        );
    } else if (status === 'success') {
        content = (
            <>
                <CheckCircle className="h-16 w-16 text-green-600 mb-4" />
                <h3 className="text-lg font-medium leading-6 text-gray-900">Import Successful!</h3>
                <p className="mt-2 text-sm text-gray-500">The plan has been added to your dashboard.</p>
                <p className="mt-1 text-xs text-gray-400">Redirecting to dashboard...</p>
            </>
        );
    } else if (status === 'error') {
         content = (
            <>
                <XCircle className="h-16 w-16 text-red-600 mb-4" />
                <h3 className="text-lg font-medium leading-6 text-gray-900">Import Failed</h3>
                <p className="mt-2 text-sm text-gray-500">{error || 'An unexpected error occurred.'}</p>
                <button onClick={onClose} className="mt-4 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:text-sm">
                    Close
                </button>
            </>
        );
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 transition-opacity">
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-white rounded-lg px-4 pt-5 pb-4 text-center overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-sm sm:w-full sm:p-6">
                    {content}
                </div>
            </div>
        </div>
    );
}

// Main component for the study plan import page
function Plans() {
    const navigate = useNavigate(); // Add this hook
    const [view, setView] = useState('import'); // 'import' or 'dashboard'
    
    // State for filters
    const [searchTerm, setSearchTerm] = useState('');
    const [levelFilter, setLevelFilter] = useState('All');
    const [durationFilter, setDurationFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All Categories');

    // State for Modal
    const [modalOpen, setModalOpen] = useState(false);
    const [modalStatus, setModalStatus] = useState('importing'); // 'importing', 'success', 'error'
    
    // Using the real hook
    const { importPlan, isLoading, isSuccess, error } = useUpdatePlan();
    const [activeImportId, setActiveImportId] = useState(null);

    const categories = useMemo(() => {
        const allCategories = studyPlans.map(plan => plan.category);
        return ['All Categories', ...new Set(allCategories)];
    }, []);

    const filteredPlans = useMemo(() => {
        return studyPlans.filter(plan => {
            const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase()) || plan.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesLevel = levelFilter === 'All' || plan.level === levelFilter;
            const matchesCategory = categoryFilter === 'All Categories' || plan.category === categoryFilter;
            const dailyHours = parseFloat(plan.daily);
            const matchesDuration = durationFilter === 'All' || 
                (durationFilter === 'Under 1hr' && dailyHours < 1) ||
                (durationFilter === '1-2hr' && dailyHours >= 1 && dailyHours <= 2) ||
                (durationFilter === 'Over 2hr' && dailyHours > 2);
            
            return matchesSearch && matchesLevel && matchesDuration && matchesCategory;
        });
    }, [searchTerm, levelFilter, durationFilter, categoryFilter]);
    
    const handleImportClick = async (planId) => {
        setActiveImportId(planId);
        setModalStatus('importing');
        setModalOpen(true);
        // The real hook needs a start date. We'll use the current date.
        await importPlan(planId, new Date());
    };

    useEffect(() => {
        if (!isLoading && modalOpen) {
            if (isSuccess) {
                setModalStatus('success');
                setTimeout(() => {
                    setModalOpen(false);
                    setActiveImportId(null);
                    // Redirect to dashboard after successful import
                    navigate('/dashboard');
                }, 2000); // Wait 2 seconds on success message before redirecting
            } else if (error) {
                setModalStatus('error');
                 // The modal now has its own close button for errors
            }
        }
    }, [isLoading, isSuccess, error, modalOpen, navigate]); // Add navigate to dependencies

    const handleCloseModal = () => {
        setModalOpen(false);
        setActiveImportId(null);
    }

    return (
        <div className="bg-white-100 min-h-screen font-sans">
            <ImportModal isOpen={modalOpen} status={modalStatus} error={error} onClose={handleCloseModal} />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
                        Choose a Study Plan to Import
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
                        Browse our curated collection of study plans to kickstart your learning journey.
                    </p>
                </header>
                
                {/* Search and Filter Controls */}
                <div className="mb-10 p-4 bg-white rounded-xl shadow-sm sticky top-4 z-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="relative sm:col-span-2 lg:col-span-1">
                            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-12" placeholder="Search all plans..." />
                             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                        <div className="col-span-1">
                           <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-12 px-3">
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                           </select>
                        </div>
                        <div className="col-span-1">
                           <select value={durationFilter} onChange={(e) => setDurationFilter(e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-12 px-3">
                                <option value="All">All Durations</option>
                                <option value="Under 1hr">Under 1 hr/day</option>
                                <option value="1-2hr">1-2 hr/day</option>
                                <option value="Over 2hr">Over 2 hr/day</option>
                           </select>
                        </div>
                        <div className="col-span-1">
                           <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-12 px-3">
                                <option value="All">All Levels</option>
                                <option>Easy</option>
                                <option>Medium</option>
                                <option>Hard</option>
                           </select>
                        </div>
                    </div>
                </div>

                {/* Grid of Plan Cards */}
                {filteredPlans.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPlans.map(plan => (
                            <PlanCard 
                                key={plan.id} 
                                plan={plan} 
                                onImport={handleImportClick} 
                                isLoading={isLoading && activeImportId === plan.id}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <h3 className="text-xl font-medium text-gray-900">No plans found</h3>
                        <p className="mt-2 text-gray-500">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Plans;