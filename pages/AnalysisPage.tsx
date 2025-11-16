

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
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#0A1A22] dark:text-white">Final Exam Analysis</h1>
        <p className="mt-4 text-lg text-[#0A1A22]/80 dark:text-[#A7B9C4]">Based on previous 5 years of Kerala Board + NCERT question patterns.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="bg-[#D8F3E9] dark:bg-[#0A1A22] p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 flex items-center text-[#0A1A22] dark:text-white"><Icon name="StarIcon" className="h-6 w-6 mr-3 text-[#CFC3FA]" />Important Chapters</h2>
          <ul className="space-y-3">
            {analysis.importantChapters.map((item, index) => (
              <li key={index} className="p-3 bg-white/50 dark:bg-[#0F2734]/50 rounded-md">
                <p className="font-semibold text-[#0A1A22] dark:text-gray-100">{item.chapter}</p>
                <p className="text-sm text-[#0A1A22]/80 dark:text-[#A7B9C4]">{item.reason}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[#D8F3E9] dark:bg-[#0A1A22] p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 flex items-center text-[#0A1A22] dark:text-white"><Icon name="ClipboardDocumentListIcon" className="h-6 w-6 mr-3 text-[#CFC3FA]"/>Expected Question Types</h2>
          <ul className="space-y-3">
            {analysis.questionTypes.map((item, index) => (
              <li key={index} className="p-3 bg-white/50 dark:bg-[#0F2734]/50 rounded-md">
                <p className="font-semibold text-[#0A1A22] dark:text-gray-100">{item.type}</p>
                <p className="text-sm text-[#0A1A22]/80 dark:text-[#A7B9C4]">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="lg:col-span-2 bg-[#D8F3E9] dark:bg-[#0A1A22] p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 flex items-center text-[#0A1A22] dark:text-white"><Icon name="ChartPieIcon" className="h-6 w-6 mr-3 text-[#CFC3FA]"/>Chapter Weightage Analysis</h2>
          <div className="space-y-4">
            {analysis.weightage.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-base font-medium text-[#0A1A22] dark:text-gray-300">{item.chapter}</span>
                  <span className="text-sm font-medium text-[#0A1A22] dark:text-gray-300">{item.percentage}%</span>
                </div>
                <div className="w-full bg-[#A7B9C4]/30 rounded-full h-2.5">
                  <div className="bg-[#C9FF66] h-2.5 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-[#D8F3E9] dark:bg-[#0A1A22] p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 flex items-center text-[#0A1A22] dark:text-white"><Icon name="DocumentTextIcon" className="h-6 w-6 mr-3 text-[#CFC3FA]"/>Model Papers</h2>
          <ul className="space-y-3">
             {analysis.modelPapers.map((paper, index) => (
                <li key={index} className="p-3 bg-white/50 dark:bg-[#0F2734]/50 rounded-md flex justify-between items-center">
                    <span className="font-medium text-[#0A1A22] dark:text-gray-200">{paper.name}</span>
                    <a href={paper.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-[#0A1A22] bg-[#CFC3FA]/50 hover:bg-[#CFC3FA]/80 dark:text-white dark:bg-[#CFC3FA]/20 dark:hover:bg-[#CFC3FA]/40">
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