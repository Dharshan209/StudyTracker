import React from 'react';
import { useParams } from 'react-router-dom';

import MainContent from './MainContent';
import AdsPanel from './AdsPanel';
import useGetResources from '../../Hooks/useGetResources';

const Resources = () => {
  const { problemTitle } = useParams();
  const { data: contentData, loading, error } = useGetResources(problemTitle);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 overflow-x-hidden flex">
      {/* Main Container */}
      <div className="flex-1 min-h-screen transition-all duration-500 ease-in-out">
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Loading or Error */}
            {loading && (
              <div className="lg:col-span-3 text-center p-10 font-semibold">Loading...</div>
            )}
            {error && (
              <div className="lg:col-span-3 text-center p-10 text-red-600">
                <strong>Error:</strong> {error}
              </div>
            )}
            {/* Main Content */}
            {contentData && (
              <MainContent contentData={contentData} />
            )}

            <AdsPanel />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Resources;
