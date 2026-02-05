 import { useState, useEffect, useCallback } from 'react';
 import { examApi } from '@/lib/api';
 import { ExamListItem, PaginatedResponse, ExamFilters } from '@/types/exam';
 
 interface UseExamsReturn {
   exams: ExamListItem[];
   isLoading: boolean;
   error: string | null;
   totalCount: number;
   currentPage: number;
   hasNextPage: boolean;
   hasPrevPage: boolean;
   filters: ExamFilters;
   setFilters: (filters: ExamFilters) => void;
   nextPage: () => void;
   prevPage: () => void;
   refetch: () => void;
 }
 
 export const useExams = (initialFilters?: ExamFilters): UseExamsReturn => {
   const [exams, setExams] = useState<ExamListItem[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [totalCount, setTotalCount] = useState(0);
   const [hasNextPage, setHasNextPage] = useState(false);
   const [hasPrevPage, setHasPrevPage] = useState(false);
   const [filters, setFilters] = useState<ExamFilters>(initialFilters || { page: 1, page_size: 10 });
 
   const fetchExams = useCallback(async () => {
     setIsLoading(true);
     setError(null);
 
     try {
       // Build query params, filtering out empty values
       const params: Record<string, string | number> = {};
       if (filters.search) params.search = filters.search;
       if (filters.status) params.status = filters.status;
       if (filters.difficulty) params.difficulty = filters.difficulty;
       if (filters.klass) params.klass = filters.klass;
       if (filters.page) params.page = filters.page;
       if (filters.page_size) params.page_size = filters.page_size;
 
       const response = await examApi.list(params);
       const data: PaginatedResponse<ExamListItem> = response.data;
 
       setExams(data.results);
       setTotalCount(data.count);
       setHasNextPage(!!data.next);
       setHasPrevPage(!!data.previous);
     } catch (err) {
       setError(err instanceof Error ? err.message : 'Failed to fetch exams');
       setExams([]);
     } finally {
       setIsLoading(false);
     }
   }, [filters]);
 
   useEffect(() => {
     fetchExams();
   }, [fetchExams]);
 
   const nextPage = () => {
     if (hasNextPage) {
       setFilters({ ...filters, page: (filters.page || 1) + 1 });
     }
   };
 
   const prevPage = () => {
     if (hasPrevPage && (filters.page || 1) > 1) {
       setFilters({ ...filters, page: (filters.page || 1) - 1 });
     }
   };
 
   return {
     exams,
     isLoading,
     error,
     totalCount,
     currentPage: filters.page || 1,
     hasNextPage,
     hasPrevPage,
     filters,
     setFilters,
     nextPage,
     prevPage,
     refetch: fetchExams,
   };
 };