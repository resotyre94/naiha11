import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Subject, Chapter, Question, QuestionType, UserAnswer, SubjectListItem } from '../types';
import Loader from '../components/Loader';
import Icon from '../components/Icon';

const QuestionCard: React.FC<{ question: Question; userAnswer: string; onAnswerChange: (questionId: string, answer: string) => void; isSubmitted: boolean; }> = ({ question, userAnswer, onAnswerChange, isSubmitted }) => {
    const isCorrect = isSubmitted && userAnswer.toLowerCase() === question.correctAnswer.toLowerCase();

    const getBorderColor = () => {
        if (!isSubmitted) return 'border-gray-200 dark:border-[#0F2734]';
        return isCorrect ? 'border-[#D8F3E9]' : 'border-red-500';
    };

    return (
        <div className={`bg-white dark:bg-[#0A1A22] p-6 rounded-lg shadow-md border-2 ${getBorderColor()}`}>
            <p className="font-semibold text-lg mb-4 text-[#0A1A22] dark:text-white">{question.question}</p>
            {question.type === QuestionType.MCQ && question.options && (
                <div className="space-y-3">
                    {question.options.map((option, index) => (
                        <label key={index} className="flex items-center p-3 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-[#0F2734]">
                            <input
                                type="radio"
                                name={question.id}
                                value={option}
                                checked={userAnswer === option}
                                onChange={(e) => onAnswerChange(question.id, e.target.value)}
                                disabled={isSubmitted}
                                className="h-4 w-4 text-[#0A1A22] border-gray-300 focus:ring-[#C9FF66] disabled:opacity-50"
                            />
                            <span className="ml-3 text-[#0A1A22] dark:text-[#A7B9C4]">{option}</span>
                        </label>
                    ))}
                </div>
            )}
            {(question.type === QuestionType.SHORT_ANSWER || question.type === QuestionType.LONG_ANSWER) && (
                <textarea
                    value={userAnswer}
                    onChange={(e) => onAnswerChange(question.id, e.target.value)}
                    disabled={isSubmitted}
                    rows={question.type === QuestionType.SHORT_ANSWER ? 3 : 6}
                    className="w-full mt-2 p-2 border border-gray-300 rounded-md dark:bg-[#0F2734] dark:border-gray-600 focus:ring-[#C9FF66] focus:border-[#C9FF66] disabled:opacity-50"
                />
            )}
            {isSubmitted && (
                <div className={`mt-4 p-3 rounded-md ${isCorrect ? 'bg-[#D8F3E9] dark:bg-[#D8F3E9]/10' : 'bg-red-100 dark:bg-red-900/50'}`}>
                    {isCorrect ? (
                        <p className="text-[#0A1A22] dark:text-[#D8F3E9]"><Icon name="CheckCircleIcon" className="h-5 w-5 inline mr-2"/>Correct!</p>
                    ) : (
                         <>
                            <p className="text-red-800 dark:text-red-300"><Icon name="XCircleIcon" className="h-5 w-5 inline mr-2"/>Incorrect.</p>
                            <p className="text-sm mt-2 text-[#0A1A22] dark:text-[#A7B9C4]"><strong>Correct Answer:</strong> {question.correctAnswer}</p>
                         </>
                    )}
                </div>
            )}
        </div>
    );
};


const ExamPage: React.FC = () => {
    const { subjectId, chapterId } = useParams<{ subjectId: string; chapterId: string }>();
    const [chapter, setChapter] = useState<Chapter | null>(null);
    const [subjectName, setSubjectName] = useState('');
    const [loading, setLoading] = useState<boolean>(true);
    const [userAnswers, setUserAnswers] = useState<UserAnswer>({});
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

    useEffect(() => {
        const fetchExamData = async () => {
            if (!subjectId || !chapterId) return;
            try {
                setLoading(true);
                const subjectsListRes = await fetch('/data/subjects.json');
                const subjectsList: SubjectListItem[] = await subjectsListRes.json();
                const subjectInfo = subjectsList.find(s => s.id === subjectId);

                if (!subjectInfo) throw new Error("Subject not found");

                const response = await fetch(subjectInfo.dataUrl);
                const subjectData: Subject = await response.json();
                const currentChapter = subjectData.chapters.find(c => c.id === chapterId);
                
                if (currentChapter) {
                    // Shuffle all questions from the chapter
                    const shuffledQuestions = [...currentChapter.questions].sort(() => Math.random() - 0.5);

                    // Select up to 25 questions for the exam. If fewer than 25, use all.
                    const examQuestions = shuffledQuestions.length >= 25
                        ? shuffledQuestions.slice(0, 25)
                        : shuffledQuestions;
                    
                    // Create a temporary chapter object for this exam instance
                    const examChapter = { ...currentChapter, questions: examQuestions };

                    setChapter(examChapter);
                    setSubjectName(subjectData.name);

                    // Initialize answers for the selected questions
                    const initialAnswers = examChapter.questions.reduce((acc, q) => {
                        acc[q.id] = '';
                        return acc;
                    }, {} as UserAnswer);
                    setUserAnswers(initialAnswers);
                }
            } catch (error) {
                console.error("Failed to fetch exam data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExamData();
    }, [subjectId, chapterId]);
    
    const handleAnswerChange = (questionId: string, answer: string) => {
        setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
        window.scrollTo(0, 0);
    };
    
    const score = useMemo(() => {
        if (!isSubmitted || !chapter) return 0;
        return chapter.questions
            .filter(q => q.type === QuestionType.MCQ)
            .reduce((total, q) => {
                return userAnswers[q.id]?.toLowerCase() === q.correctAnswer.toLowerCase() ? total + 1 : total;
            }, 0);
    }, [isSubmitted, chapter, userAnswers]);
    
    const mcqCount = useMemo(() => chapter?.questions.filter(q => q.type === QuestionType.MCQ).length ?? 0, [chapter]);

    if (loading) return <Loader />;
    if (!chapter) return <div className="text-center">Exam not found.</div>;
    
    if (chapter.questions.length === 0) {
        return (
            <div>
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-[#0A1A22] dark:text-white">{subjectName} - Model Exam</h1>
                    <p className="text-xl mt-2 text-[#0A1A22]/80 dark:text-[#A7B9C4]">{chapter.name}</p>
                </div>
                <div className="text-center bg-white dark:bg-[#0A1A22] p-8 rounded-lg shadow-md">
                    <Icon name="ExclamationTriangleIcon" className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
                    <h2 className="text-2xl font-semibold text-[#0A1A22] dark:text-white mb-2">No Questions Yet</h2>
                    <p className="text-[#0A1A22]/80 dark:text-[#A7B9C4] mb-6">
                        Model exam questions for this chapter are not available at the moment. Please check back later.
                    </p>
                    <Link to={`/subject/${subjectId}`} className="px-8 py-3 bg-[#C9FF66] text-[#0A1A22] font-bold rounded-lg shadow-lg hover:bg-opacity-90 transition-colors">
                        Back to Chapters
                    </Link>
                </div>
            </div>
        );
    }
    
    const questionsByType = (type: QuestionType) => chapter.questions.filter(q => q.type === type);

    return (
        <div>
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-[#0A1A22] dark:text-white">{subjectName} - Model Exam</h1>
                <p className="text-xl mt-2 text-[#0A1A22]/80 dark:text-[#A7B9C4]">{chapter.name}</p>
                <p className="text-sm mt-1 text-[#A7B9C4]">{`Showing ${chapter.questions.length} random questions`}</p>
            </div>
            
            {isSubmitted && (
                 <div className="bg-[#D8F3E9] dark:bg-[#0A1A22] border-l-4 border-[#CFC3FA] text-[#0A1A22] dark:text-white p-4 rounded-md mb-8" role="alert">
                    <h2 className="font-bold text-xl">Exam Submitted!</h2>
                    <p className="mt-1">You scored {score} out of {mcqCount} on Multiple Choice Questions. Review your answers below.</p>
                </div>
            )}

            <div className="space-y-8">
                {questionsByType(QuestionType.MCQ).length > 0 && (
                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-[#0A1A22] dark:text-white">Multiple Choice Questions</h2>
                        <div className="space-y-6">
                            {questionsByType(QuestionType.MCQ).map(q => <QuestionCard key={q.id} question={q} userAnswer={userAnswers[q.id]} onAnswerChange={handleAnswerChange} isSubmitted={isSubmitted} />)}
                        </div>
                    </section>
                )}
                {questionsByType(QuestionType.SHORT_ANSWER).length > 0 && (
                     <section>
                        <h2 className="text-2xl font-semibold mb-4 text-[#0A1A22] dark:text-white">Short Answer Questions</h2>
                        <div className="space-y-6">
                            {questionsByType(QuestionType.SHORT_ANSWER).map(q => <QuestionCard key={q.id} question={q} userAnswer={userAnswers[q.id]} onAnswerChange={handleAnswerChange} isSubmitted={isSubmitted} />)}
                        </div>
                    </section>
                )}
                {questionsByType(QuestionType.LONG_ANSWER).length > 0 && (
                     <section>
                        <h2 className="text-2xl font-semibold mb-4 text-[#0A1A22] dark:text-white">Long Answer Questions</h2>
                         <div className="space-y-6">
                            {questionsByType(QuestionType.LONG_ANSWER).map(q => <QuestionCard key={q.id} question={q} userAnswer={userAnswers[q.id]} onAnswerChange={handleAnswerChange} isSubmitted={isSubmitted} />)}
                        </div>
                    </section>
                )}
            </div>

            <div className="mt-12 text-center">
                {!isSubmitted ? (
                    <button onClick={handleSubmit} className="px-8 py-3 bg-[#C9FF66] text-[#0A1A22] font-bold rounded-lg shadow-lg hover:bg-opacity-90 transition-colors">
                        Submit Exam
                    </button>
                ) : (
                    <Link to={`/subject/${subjectId}`} className="px-8 py-3 bg-[#C9FF66] text-[#0A1A22] font-bold rounded-lg shadow-lg hover:bg-opacity-90 transition-colors">
                        Back to Chapters
                    </Link>
                )}
            </div>
        </div>
    );
};

export default ExamPage;