import React, { useState } from 'react';
import { Bot, Copy, Check, ExternalLink, PlayCircle, Youtube } from 'lucide-react';

const TabbedCodeBlock = ({ codes, title }) => {
  // Default to the first available language if Python isn't present
  const [activeTab, setActiveTab] = useState(Object.keys(codes)[0] || '');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!codes[activeTab]) return;
    try {
      await navigator.clipboard.writeText(codes[activeTab]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const getLanguageColor = (lang, isActive) => {
    const colors = {
      Python: isActive ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200',
      Java: isActive ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-700 hover:bg-orange-200',
      'C++': isActive ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
    };
    return colors[lang] || (isActive ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200');
  };

  const getHeaderGradient = (lang) => {
    const gradients = {
      Python: 'from-blue-500 to-blue-600',
      Java: 'from-orange-500 to-orange-600',
      'C++': 'from-purple-600 to-purple-700'
    };
    return gradients[lang] || 'from-gray-500 to-gray-600';
  };

  const languages = Object.keys(codes);

  return (
    <div className="mb-6 rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      {/* Tab Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveTab(lang)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${getLanguageColor(lang, activeTab === lang)}`}
              >
                {lang}
              </button>
            ))}
          </div>
          {title && <span className="text-sm text-gray-600 font-medium">{title}</span>}
        </div>
      </div>

      {/* Code Header with Language and Copy Button */}
      <div className={`bg-gradient-to-r ${getHeaderGradient(activeTab)} px-4 py-2 flex items-center justify-between`}>
        <div className="flex items-center space-x-2">
          <span className="text-white font-semibold text-sm">{activeTab}</span>
        </div>
        <button
          onClick={handleCopy}
          className="text-white/80 hover:text-white transition-colors duration-200 p-1 rounded"
          title="Copy code"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>

      {/* Code Content */}
      <div className="bg-slate-800 text-white p-4 overflow-x-auto">
        <pre><code className="text-sm leading-relaxed">{codes[activeTab]}</code></pre>
      </div>
    </div>
  );
};


const MainContent = ({ contentData, setIsMentorOpen, isMentorOpen }) => {
  // Defensively check if contentData and its properties are loaded.
  if (!contentData || !contentData.problem || !contentData.approaches) {
    // You can render a loading skeleton here for better UX
    return <div className="lg:col-span-3 text-center p-8">Content is loading or not available.</div>;
  }
  
  const { problem, approaches } = contentData;
  
  // Create a URL-friendly slug from the problem title
  const problemSlug = problem.title.toLowerCase().replace(/\s+/g, '-');
  const leetcodeUrl = `https://leetcode.com/problems/${problemSlug}`;

  return (
    <section className="lg:col-span-3">
      <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 shadow-xl transform transition-all duration-300 hover:shadow-2xl">
        
        {/* --- Problem Header --- */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-4xl font-bold text-slate-900">{problem.title}</h2>
            <div className="flex items-center space-x-3">
              {/* LeetCode Link - Always shown */}
              <a
                href={leetcodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <ExternalLink className="h-5 w-5" />
                <span>LeetCode</span>
              </a>
              
              {/* Visualization Link - Only shown if visualization attribute exists */}
              {problem.visualization && (
                <a
                  href={problem.visualization}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <PlayCircle className="h-5 w-5" />
                  <span>Visualize</span>
                </a>
              )}
              
              {/* YouTube Link - Only shown if youtube attribute exists */}
              {problem.youtube && (
                <a
                  href={problem.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <Youtube className="h-5 w-5" />
                  <span>YouTube</span>
                </a>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {problem.tags.map((tag, index) => (
              <span
                key={index}
                className={`bg-gradient-to-r ${tag.color} ${tag.textColor} text-sm font-semibold px-4 py-2 rounded-full border ${tag.borderColor} transition-all duration-200 hover:shadow-md`}
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>

        {/* --- Content --- */}
        <div className="text-slate-700 space-y-8">
          
          {/* Problem Statement */}
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-slate-800">Problem Statement</h3>
            <blockquote className="border-l-4 border-blue-300 pl-4 py-2 bg-blue-50/50 rounded-r-lg">
              <p className="italic text-slate-600">{problem.statement.description}</p>
            </blockquote>
            <div className="space-y-2 pt-2">
              <h4 className="font-semibold text-lg text-slate-700">{problem.statement.input.title}</h4>
              <p className="text-slate-600">
                {problem.statement.input.description} <code className="bg-gray-100 px-2 py-1 rounded text-sm">{problem.statement.input.example}</code>
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-lg text-slate-700">{problem.statement.output.title}</h4>
              <p className="text-slate-600">
                {problem.statement.output.description} <code className="bg-gray-100 px-2 py-1 rounded text-sm">{problem.statement.output.example}</code>.
              </p>
            </div>
          </div>

          {/* Approaches */}
          {approaches.map((approach) => (
            <div key={approach.id}>
              <hr className="my-6 border-gray-200" />
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-slate-800">{approach.title.replace(/[\uE000-\uF8FF]/g, '').trim()}</h3> {/* Removes special characters */}
                
                <div>
                  <h4 className="font-semibold text-lg text-slate-700 mb-2">{approach.explanation.title}</h4>
                  <blockquote className="border-l-4 border-green-300 pl-4 py-2 bg-green-50/50 rounded-r-lg">
                    <p className="italic text-slate-600 whitespace-pre-line">{approach.explanation.content}</p>
                  </blockquote>
                </div>

                <div>
                  <h4 className="font-semibold text-lg text-slate-700 my-2">Step-by-Step</h4>
                  <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-4">
                    {approach.steps.map((step, stepIndex) => (
                      <li key={stepIndex}>{step}</li>
                    ))}
                  </ol>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg text-slate-700 mb-4">Implementation</h4>
                  <TabbedCodeBlock codes={approach.code} title={approach.title.replace(/[\uE000-\uF8FF]/g, '').trim()} />
                </div>
              </div>
            </div>
          ))}
          
          <hr className="my-6 border-gray-200" />
          
          {/* --- Complexity Comparison --- */}
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-slate-800">Complexity Comparison</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {approaches.map((approach) => (
                <div key={approach.id} className={`bg-${approach.complexity.color}-50 border border-${approach.complexity.color}-200 rounded-lg p-4`}>
                  <h4 className="font-bold text-lg text-slate-800 mb-2">{approach.title.replace(/[\uE000-\uF8FF]/g, '').trim()}</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    <li><strong>Time Complexity:</strong> {approach.complexity.time}</li>
                    <li><strong>Space Complexity:</strong> {approach.complexity.space}</li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainContent;