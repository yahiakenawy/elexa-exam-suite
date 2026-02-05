 import { useState, useEffect, useCallback } from 'react';
 import { submissionApi, examApi } from '@/lib/api';
 import { Submission, ExamDetail } from '@/types/exam';
 
 interface UseSubmissionReturn {
   submission: Submission | null;
   examDetails: ExamDetail | null;
   isLoading: boolean;
   error: string | null;
   refetch: () => void;
 }
 
 export const useSubmission = (examId: number): UseSubmissionReturn => {
   const [submission, setSubmission] = useState<Submission | null>(null);
   const [examDetails, setExamDetails] = useState<ExamDetail | null>(null);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
 
   const fetchData = useCallback(async () => {
     setIsLoading(true);
     setError(null);
 
     try {
       // Fetch both submission and exam answers in parallel
       const [submissionRes, examRes] = await Promise.all([
         submissionApi.getSubmission(examId),
         examApi.getAnswers(examId),
       ]);
 
       setSubmission(submissionRes.data);
       setExamDetails(examRes.data);
     } catch (err) {
       setError(err instanceof Error ? err.message : 'Failed to load submission');
     } finally {
       setIsLoading(false);
     }
   }, [examId]);
 
   useEffect(() => {
     fetchData();
   }, [fetchData]);
 
   return {
     submission,
     examDetails,
     isLoading,
     error,
     refetch: fetchData,
   };
 };