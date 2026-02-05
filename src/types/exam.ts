 export type ExamStatus = 'waiting' | 'active' | 'completed';
 export type Difficulty = 'easy' | 'medium' | 'hard';
 export type QuestionType = 'mcq' | 'passage' | 'short_answer' | 'essay';
 
 export interface MCQOption {
   id: number;
   option_text: string;
   is_correct?: boolean;
 }
 
 export interface MiniQuestion {
   id: number;
   type_ans: QuestionType;
   question_head: string;
   mcq_options?: { id: number; options: string[] }[];
   correct_answer?: string;
   explanation?: string;
 }
 
 export interface Question {
   id: number;
   question_head: string;
   type_ans: QuestionType;
   difficulty?: Difficulty;
   image?: string | null;
   points: number;
   mcq_options?: MCQOption[];
   mini_questions?: MiniQuestion[];
   correct_answer?: string;
   explanation?: string;
 }
 
 export interface ExamQuestion {
   id: number;
   display_order: number;
   points: number;
   time_limit_minutes?: number;
   question: Question;
 }
 
 export interface ExamListItem {
   id: number;
   title: string;
   creator: number;
   creator_name: string;
   klass_name?: string;
   created_at: string;
   start_time: string;
   deadline: string;
   duration_minutes: number;
   status: ExamStatus;
   difficulty: Difficulty;
 }
 
 export interface ExamDetail {
   id: number;
   title: string;
   instructions?: string;
   klass?: number;
   level: number;
   randomize_order_for_stud: boolean;
   created_at: string;
   duration_minutes: number;
   start_time: string;
   deadline: string;
   status: ExamStatus;
   allowed_attempts: number;
   difficulty: Difficulty;
   auto_grade_release: boolean;
   prevent_cheating: boolean;
   questions: ExamQuestion[];
 }
 
 export interface StudentAnswer {
   answer_text: string | null;
   answer_image: string | null;
   is_correct?: boolean;
   points_awarded?: number;
   feedback?: string;
   delivered_outcomes?: string[];
 }
 
 export interface SubmissionQuestion extends Question {
   student_answer: StudentAnswer;
 }
 
 export interface Submission {
   id: number;
   exam: number;
   student?: number;
   submitted_at: string;
   is_corrected: boolean;
   total_score: number | null;
   feedback?: string;
   time_spent_minutes: number;
   attempt_number: number;
   questions?: SubmissionQuestion[];
   answers?: { question: number; answer_text: string; answer_image: string | null }[];
 }
 
 export interface PaginatedResponse<T> {
   count: number;
   next: string | null;
   previous: string | null;
   results: T[];
 }
 
 export interface ExamFilters {
   search?: string;
   status?: ExamStatus | '';
   difficulty?: Difficulty | '';
   klass?: number;
   creator?: number | '';
   page?: number;
   page_size?: number;
 }
 
 export interface AnswerPayload {
   question: number;
   answer_text: string | null;
   answer_image: File | null;
 }
 
 export interface SubmitPayload {
   time_spent_minutes: number;
   answers: AnswerPayload[];
 }