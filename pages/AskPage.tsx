import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { GroundingChunk } from '../types';
import Icon from '../components/Icon';
import Loader from '../components/Loader';

const AskPage: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [links, setLinks] = useState<GroundingChunk[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAsk = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setAnswer('');
    setLinks([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const systemInstruction = `You are an expert AI tutor named 'My Guidens AI', specializing in the Kerala State Class 11 syllabus (including NCERT curriculum). Your goal is to provide clear, concise, and accurate answers to student questions. When a student asks a question:
1. Directly answer the question, explaining the concept as if you are talking to an 11th-grade student.
2. Explicitly mention the subject and chapter(s) the question relates to.
3. Provide 2-3 credible and relevant web links as 'Supporting Links' for further study.
4. Format your entire response in clear, easy-to-read Markdown. Use lists, bold text, and paragraphs.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: query,
        config: {
          systemInstruction: systemInstruction,
          tools: [{googleSearch: {}}],
        },
      });

      setAnswer(response.text);

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (groundingChunks) {
        setLinks(groundingChunks.filter(chunk => chunk.web && chunk.web.uri));
      }

    } catch (e) {
      console.error("Failed to get answer from AI:", e);
      setError("Sorry, I couldn't get an answer. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAsk();
  };

  const helplineContacts = [
    { name: 'Ambulance', number: '108', icon: 'TruckIcon' },
    { name: 'Police', number: '112', icon: 'ShieldExclamationIcon' },
    { name: 'Fire Force', number: '101', icon: 'FireIcon' },
    { name: 'Child Helpline', number: '1098', icon: 'UserGroupIcon' },
    { name: 'Cyber Cell (Cyberdome)', number: '9497980900', email: 'ccdm.pol@kerala.gov.in', icon: 'ComputerDesktopIcon' }
  ];

  return (
    <div>
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">Ask me anything</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Get instant help with any question about your Class 11 subjects.</p>
      </div>

      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleFormSubmit}>
          <div className="relative">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="For example: Explain Newton's First Law of Motion..."
              rows={3}
              className="w-full p-4 pr-28 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute top-1/2 right-3 -translate-y-1/2 px-5 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Asking...' : 'Ask'}
            </button>
          </div>
        </form>

        {isLoading && <Loader />}

        {error && <div className="mt-6 text-center text-red-500 bg-red-100 dark:bg-red-900/50 p-4 rounded-lg">{error}</div>}

        {answer && (
          <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Answer</h2>
            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300" style={{ whiteSpace: 'pre-wrap' }}>
                {answer}
            </div>
            
            {links.length > 0 && (
              <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">Supporting Links</h3>
                <ul className="space-y-2">
                  {/* FIX: Check for chunk.web.uri to ensure it's defined before rendering the link, making the code type-safe. */}
                  {links.map((chunk, index) => chunk.web && chunk.web.uri && (
                    <li key={index}>
                      <a 
                        href={chunk.web.uri} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        <Icon name="LinkIcon" className="h-4 w-4 mr-2" />
                        <span>{chunk.web.title || chunk.web.uri}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-white">Kerala Helpline Contacts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {helplineContacts.map(contact => (
            <div key={contact.name} className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md flex items-center">
                <div className="bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-full mr-4">
                    <Icon name={contact.icon} className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                    <p className="font-bold text-lg text-gray-800 dark:text-white">{contact.name}</p>
                    <a href={`tel:${contact.number}`} className="text-indigo-600 dark:text-indigo-400 font-semibold text-base hover:underline">{contact.number}</a>
                    {contact.email && <a href={`mailto:${contact.email}`} className="block text-sm text-gray-500 dark:text-gray-400 hover:underline truncate">{contact.email}</a>}
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AskPage;