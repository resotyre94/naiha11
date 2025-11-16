export interface StudyLinks {
  scertEbook: string;
  ncertEbook: string;
  videoLessons: string;
  notes: string;
  practiceQuestions: string;
  previousYearQuestions: string;
  solvedExamples: string;
}

export enum QuestionType {
  MCQ = 'mcq',
  SHORT_ANSWER = 'short-answer',
  LONG_ANSWER = 'long-answer',
}

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[]; // For MCQ
  correctAnswer: string; // For MCQ, this is the option text. For others, it's the model answer.
}

export interface Chapter {
  id: string;
  name: string;
  description: string;
  studyLinks: StudyLinks;
  questions: Question[];
}

export interface Subject {
  id: string;
  name: string;
  icon: string; // Heroicon name
  chapters: Chapter[];
}

export interface SubjectListItem {
  id: string;
  name: string;
  icon: string;
  dataUrl: string;
}

export interface ExamAnalysis {
  importantChapters: { chapter: string; reason: string; }[];
  questionTypes: { type: string; description: string; }[];
  weightage: { chapter: string; percentage: number; }[];
  modelPapers: { name: string; url: string; type: 'pdf' | 'text' }[];
}

export interface UserAnswer {
    [questionId: string]: string;
}

export interface GroundingChunk {
  web?: {
    // FIX: Made uri and title optional to match the @google/genai library's type definition.
    uri?: string;
    title?: string;
  };
}