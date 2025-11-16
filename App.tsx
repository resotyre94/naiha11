import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import SubjectPage from './pages/SubjectPage';
import ExamPage from './pages/ExamPage';
import AnalysisPage from './pages/AnalysisPage';
import Footer from './components/Footer';
import AskPage from './pages/AskPage';

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col font-sans text-[#0A1A22] dark:text-[#FFFFFF]">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/subject/:subjectId" element={<SubjectPage />} />
            <Route path="/exam/:subjectId/:chapterId" element={<ExamPage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/ask" element={<AskPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}

export default App;