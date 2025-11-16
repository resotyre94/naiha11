
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Subject, StudyLinks, SubjectListItem, Chapter } from '../types';
import Loader from '../components/Loader';
import Icon from '../components/Icon';

const linkMetadata: { [key in keyof StudyLinks]: { name: string; icon: string } } = {
  scertEbook: { name: 'Kerala SCERT e-book', icon: 'AcademicCapIcon' },
  ncertEbook: { name: 'NCERT e-book', icon: 'BookOpenIcon' },
  videoLessons: { name: 'Video Lessons', icon: 'PlayCircleIcon' },
  notes: { name: 'Free Notes', icon: 'ClipboardDocumentIcon' },
  practiceQuestions: { name: 'Practice Questions', icon: 'PencilIcon' },
  previousYearQuestions: { name: 'Previous Year Questions', icon: 'ArchiveBoxIcon' },
  solvedExamples: { name: 'Solved Examples', icon: 'CheckBadgeIcon' },
};

const SubjectPage: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjectData = async () => {
      if (!subjectId) return;
      try {
        setLoading(true);
        const subjectsListRes = await fetch('/data/subjects.json');
        const subjectsList: SubjectListItem[] = await subjectsListRes.json();
        const subjectInfo = subjectsList.find(s => s.id === subjectId);

        if (!subjectInfo) {
          throw new Error("Subject not found");
        }
        
        const response = await fetch(subjectInfo.dataUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Subject = await response.json();
        setSubject(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch subject data:", err);
        setError("Could not load subject data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectData();
  }, [subjectId]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!subject) {
    return <div className="text-center">Subject not found.</div>;
  }

  return (
    <div>
      <div className="flex items-center mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
        <Icon name={subject.icon} className="h-10 w-10 text-indigo-600 dark:text-indigo-400 mr-4"/>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{subject.name}</h1>
      </div>

      <div className="space-y-6">
        {subject.chapters.map((chapter, index) => (
          <div key={chapter.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white">
                Chapter {index + 1}: {chapter.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{chapter.description}</p>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">Study Resources</h3>
                <ul className="space-y-1">
                  {(Object.keys(linkMetadata) as Array<keyof StudyLinks>).map((key) => {
                      const url = chapter.studyLinks[key];
                      const meta = linkMetadata[key];
                      if (!url) return null;
                      return (
                        <li key={key}>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 -mx-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 group"
                          >
                            <Icon name={meta.icon} className="h-6 w-6 mr-4 text-indigo-500 dark:text-indigo-400"/>
                            <span className="text-gray-700 dark:text-gray-300 font-medium">{meta.name}</span>
                            <Icon name="ArrowTopRightOnSquareIcon" className="h-5 w-5 ml-auto text-gray-400 dark:text-gray-500 group-hover:text-indigo-500 transition-colors"/>
                          </a>
                        </li>
                      );
                  })}
                </ul>
              </div>

              <div className="text-right">
                <Link 
                  to={`/exam/${subjectId}/${chapter.id}`} 
                  className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
                >
                  <Icon name="PencilSquareIcon" className="h-5 w-5 mr-2" />
                  Take Model Exam
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectPage;
