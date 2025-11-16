
import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          My Guidens
        </Link>
        <nav className="flex items-center space-x-4 md:space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-base font-medium transition-colors ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400'
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/analysis"
            className={({ isActive }) =>
              `text-base font-medium transition-colors ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400'
              }`
            }
          >
            Exam Analysis
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
