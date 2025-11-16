
import React from 'react';
import { Link } from 'react-router-dom';
import { SubjectListItem } from '../types';
import Icon from './Icon';

interface SubjectCardProps {
  subject: SubjectListItem;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject }) => {
  return (
    <Link
      to={`/subject/${subject.id}`}
      className="bg-[#D8F3E9] dark:bg-[#0A1A22] rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col items-center justify-center text-center"
    >
      <div className="bg-[#CFC3FA]/50 p-4 rounded-full mb-4">
        <Icon name={subject.icon} className="h-8 w-8 text-[#0A1A22]" />
      </div>
      <h3 className="text-xl font-semibold text-[#0A1A22] dark:text-white">{subject.name}</h3>
      <p className="text-sm text-[#0A1A22]/70 dark:text-[#A7B9C4] mt-1">View Chapters & Exams</p>
    </Link>
  );
};

export default SubjectCard;