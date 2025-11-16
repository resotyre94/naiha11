import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-inner mt-auto py-6">
      <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} ALI, m.nharakkat@eleganciagroup.com All Rights Reserved.</p>
        <p className="mt-1">My study companion for Class 11.</p>
      </div>
    </footer>
  );
};

export default Footer;
