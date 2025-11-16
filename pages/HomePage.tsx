import React, { useState, useEffect } from 'react';
import { SubjectListItem } from '../types';
import SubjectCard from '../components/SubjectCard';
import Loader from '../components/Loader';

const HomePage: React.FC = () => {
  const [subjects, setSubjects] = useState<SubjectListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch('/data/subjects.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: SubjectListItem[] = await response.json();
        setSubjects(data);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#0A1A22] dark:text-white">Welcome to Naiha's Guide</h1>
        <p className="mt-4 text-lg text-[#0A1A22]/80 dark:text-[#A7B9C4]">Your personal guide to mastering the Class 11 Kerala & NCERT syllabus.</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {subjects.map((subject) => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;