 import { useLanguage } from '@/contexts/LanguageContext';
 import { ExamStatus, Difficulty } from '@/types/exam';
 
 interface StatusBadgeProps {
   status: ExamStatus;
 }
 
 export const StatusBadge = ({ status }: StatusBadgeProps) => {
   const { t } = useLanguage();
   
   const statusClasses: Record<ExamStatus, string> = {
     waiting: 'badge-waiting',
     active: 'badge-active',
     completed: 'badge-completed',
   };
 
   return (
     <span
       className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusClasses[status]}`}
     >
       {t(`status.${status}`)}
     </span>
   );
 };
 
 interface DifficultyBadgeProps {
   difficulty: Difficulty;
 }
 
 export const DifficultyBadge = ({ difficulty }: DifficultyBadgeProps) => {
   const { t } = useLanguage();
   
   const difficultyClasses: Record<Difficulty, string> = {
     easy: 'difficulty-easy',
     medium: 'difficulty-medium',
     hard: 'difficulty-hard',
   };
 
   return (
     <span
       className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${difficultyClasses[difficulty]}`}
     >
       {t(`difficulty.${difficulty}`)}
     </span>
   );
 };