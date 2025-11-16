
import React, { useState, useEffect } from 'react';
import { ExamAnalysis } from '../types';
import Loader from '../components/Loader';
import Icon from '../components/Icon';

const AnalysisPage: React.FC = () => {
  const [analysis, setAnalysis] = useState<ExamAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await fetch('/data/examAnalysis.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ExamAnalysis = await response.json();
        setAnalysis(data);
      } catch (error) {
        console.error("Failed to fetch exam analysis:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (!analysis) {
    return <div className="text-center">Could not load exam analysis.</div>;
  }

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">Final Exam Analysis</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Based on previous 5 years of Kerala Board + NCERT question patterns.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-800 dark:text-white"><Icon name="StarIcon" className="h-6 w-6 mr-3 text-yellow-500" />Important Chapters</h2>
          <ul className="space-y-3">
            {analysis.importantChapters.map((item, index) => (
              <li key={index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                <p className="font-semibold text-gray-900 dark:text-gray-100">{item.chapter}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.reason}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-800 dark:text-white"><Icon name="ClipboardDocumentListIcon" className="h-6 w-6 mr-3 text-blue-500"/>Expected Question Types</h2>
          <ul className="space-y-3">
            {analysis.questionTypes.map((item, index) => (
              <li key={index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                <p className="font-semibold text-gray-900 dark:text-gray-100">{item.type}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-800 dark:text-white"><Icon name="ChartPieIcon" className="h-6 w-6 mr-3 text-green-500"/>Chapter Weightage Analysis</h2>
          <div className="space-y-4">
            {analysis.weightage.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-base font-medium text-gray-700 dark:text-gray-300">{item.chapter}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-800 dark:text-white"><Icon name="DocumentTextIcon" className="h-6 w-6 mr-3 text-purple-500"/>Model Papers</h2>
          <ul className="space-y-3">
             {analysis.modelPapers.map((paper, index) => (
                <li key={index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md flex justify-between items-center">
                    <span className="font-medium text-gray-800 dark:text-gray-200">{paper.name}</span>
                    <a href={paper.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 dark:text-indigo-300 dark:bg-indigo-900/50 dark:hover:bg-indigo-900">
                        <Icon name={paper.type === 'pdf' ? 'ArrowDownTrayIcon' : 'ArrowTopRightOnSquareIcon'} className="h-5 w-5 mr-2"/>
                        {paper.type === 'pdf' ? 'Download' : 'View'}
                    </a>
                </li>
             ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
