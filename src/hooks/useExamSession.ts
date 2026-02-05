 import { useState, useEffect, useCallback, useRef } from 'react';
 import { examApi, submissionApi } from '@/lib/api';
 import { ExamDetail, ExamQuestion, AnswerPayload } from '@/types/exam';
 import { getRemainingTime } from '@/lib/date';
 
 interface StoredProgress {
   examId: number;
   answers: Record<number, { text: string | null; imageDataUrl: string | null }>;
   currentIndex: number;
   startedAt: string;
 }
 
 interface UseExamSessionReturn {
   exam: ExamDetail | null;
   isLoading: boolean;
   error: string | null;
   currentQuestionIndex: number;
   answers: Record<number, { text: string | null; file: File | null }>;
   timeRemaining: number;
   isSubmitting: boolean;
   goToQuestion: (index: number) => void;
   nextQuestion: () => void;
   prevQuestion: () => void;
   setAnswer: (questionId: number, text: string | null, file?: File | null) => void;
   submitExam: () => Promise<boolean>;
   getProgress: () => { answered: number; total: number };
 }
 
 const STORAGE_KEY = 'exam_progress_';
 
 export const useExamSession = (examId: number): UseExamSessionReturn => {
   const [exam, setExam] = useState<ExamDetail | null>(null);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
   const [answers, setAnswers] = useState<Record<number, { text: string | null; file: File | null }>>({});
   const [timeRemaining, setTimeRemaining] = useState(0);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const startedAtRef = useRef<Date | null>(null);
   const timerRef = useRef<NodeJS.Timeout | null>(null);
 
   // Load progress from localStorage
   const loadProgress = useCallback((examData: ExamDetail) => {
     try {
       const stored = localStorage.getItem(STORAGE_KEY + examId);
       if (stored) {
         const progress: StoredProgress = JSON.parse(stored);
         if (progress.examId === examId) {
           // Restore answers (without files - they can't be stored)
           const restoredAnswers: Record<number, { text: string | null; file: File | null }> = {};
           Object.entries(progress.answers).forEach(([qId, ans]) => {
             restoredAnswers[parseInt(qId)] = { text: ans.text, file: null };
           });
           setAnswers(restoredAnswers);
           setCurrentQuestionIndex(progress.currentIndex);
           startedAtRef.current = new Date(progress.startedAt);
           return;
         }
       }
     } catch (e) {
       console.error('Failed to load progress:', e);
     }
     // Start fresh
     startedAtRef.current = new Date();
     saveProgress(examId, {}, 0, startedAtRef.current);
   }, [examId]);
 
   // Save progress to localStorage
   const saveProgress = useCallback((
     id: number,
     ans: Record<number, { text: string | null; file: File | null }>,
     index: number,
     startedAt: Date
   ) => {
     try {
       const progress: StoredProgress = {
         examId: id,
         answers: Object.fromEntries(
           Object.entries(ans).map(([qId, a]) => [qId, { text: a.text, imageDataUrl: null }])
         ),
         currentIndex: index,
         startedAt: startedAt.toISOString(),
       };
       localStorage.setItem(STORAGE_KEY + id, JSON.stringify(progress));
     } catch (e) {
       console.error('Failed to save progress:', e);
     }
   }, []);
 
   // Fetch exam details
   useEffect(() => {
     const fetchExam = async () => {
       setIsLoading(true);
       setError(null);
       try {
         const response = await examApi.get(examId);
         const examData: ExamDetail = response.data;
         setExam(examData);
         loadProgress(examData);
 
         // Initialize timer
         const remaining = getRemainingTime(
           examData.deadline,
           examData.duration_minutes,
           startedAtRef.current || undefined
         );
         setTimeRemaining(remaining);
       } catch (err) {
         setError(err instanceof Error ? err.message : 'Failed to load exam');
       } finally {
         setIsLoading(false);
       }
     };
 
     fetchExam();
   }, [examId, loadProgress]);
 
   // Timer countdown
   useEffect(() => {
     if (!exam || timeRemaining <= 0) return;
 
     timerRef.current = setInterval(() => {
       setTimeRemaining((prev) => {
         if (prev <= 1) {
           clearInterval(timerRef.current!);
           return 0;
         }
         return prev - 1;
       });
     }, 1000);
 
     return () => {
       if (timerRef.current) clearInterval(timerRef.current);
     };
   }, [exam, timeRemaining > 0]);
 
   // Save progress on answer change
   useEffect(() => {
     if (exam && startedAtRef.current) {
       saveProgress(examId, answers, currentQuestionIndex, startedAtRef.current);
     }
   }, [answers, currentQuestionIndex, exam, examId, saveProgress]);
 
   const goToQuestion = (index: number) => {
     if (exam && index >= 0 && index < exam.questions.length) {
       setCurrentQuestionIndex(index);
     }
   };
 
   const nextQuestion = () => {
     if (exam && currentQuestionIndex < exam.questions.length - 1) {
       setCurrentQuestionIndex((prev) => prev + 1);
     }
   };
 
   const prevQuestion = () => {
     if (currentQuestionIndex > 0) {
       setCurrentQuestionIndex((prev) => prev - 1);
     }
   };
 
   const setAnswer = (questionId: number, text: string | null, file: File | null = null) => {
     setAnswers((prev) => ({
       ...prev,
       [questionId]: { text, file },
     }));
   };
 
   const submitExam = async (): Promise<boolean> => {
     if (!exam || isSubmitting) return false;
 
     setIsSubmitting(true);
     try {
       const timeSpent = startedAtRef.current
         ? Math.min(
             Math.floor((Date.now() - startedAtRef.current.getTime()) / 60000),
             exam.duration_minutes
           )
         : exam.duration_minutes;
 
       const formData = new FormData();
       formData.append('time_spent_minutes', timeSpent.toString());
 
       // Build answers array
       const answersArray: { question: number; answer_text: string | null }[] = [];
       
       exam.questions.forEach((eq) => {
         const answer = answers[eq.question.id];
         answersArray.push({
           question: eq.question.id,
           answer_text: answer?.text || null,
         });
 
         // Handle file uploads
         if (answer?.file) {
           formData.append(`answer_image_${eq.question.id}`, answer.file);
         }
       });
 
       formData.append('answers', JSON.stringify(answersArray));
 
       await submissionApi.submit(examId, formData);
 
       // Clear saved progress
       localStorage.removeItem(STORAGE_KEY + examId);
 
       return true;
     } catch (err) {
       console.error('Submit error:', err);
       return false;
     } finally {
       setIsSubmitting(false);
     }
   };
 
   const getProgress = () => {
     if (!exam) return { answered: 0, total: 0 };
     const answered = exam.questions.filter(
       (eq) => answers[eq.question.id]?.text || answers[eq.question.id]?.file
     ).length;
     return { answered, total: exam.questions.length };
   };
 
   return {
     exam,
     isLoading,
     error,
     currentQuestionIndex,
     answers,
     timeRemaining,
     isSubmitting,
     goToQuestion,
     nextQuestion,
     prevQuestion,
     setAnswer,
     submitExam,
     getProgress,
   };
 };