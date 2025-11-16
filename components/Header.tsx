import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-[#0F2734] shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-[#0A1A22] dark:text-[#C9FF66]">
          Naiha's Guide
        </Link>
        <nav className="flex items-center space-x-4 md:space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-base font-medium transition-colors ${
                isActive
                  ? 'text-[#C9FF66]'
                  : 'text-[#0A1A22] hover:text-[#C9FF66] dark:text-[#FFFFFF] dark:hover:text-[#C9FF66]'
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/ask"
            className={({ isActive }) =>
              `text-base font-medium transition-colors ${
                isActive
                  ? 'text-[#C9FF66]'
                  : 'text-[#0A1A22] hover:text-[#C9FF66] dark:text-[#FFFFFF] dark:hover:text-[#C9FF66]'
              }`
            }
          >
            Ask me
          </NavLink>
          <NavLink
            to="/analysis"
            className={({ isActive }) =>
              `text-base font-medium transition-colors ${
                isActive
                  ? 'text-[#C9FF66]'
                  : 'text-[#0A1A22] hover:text-[#C9FF66] dark:text-[#FFFFFF] dark:hover:text-[#C9FF66]'
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