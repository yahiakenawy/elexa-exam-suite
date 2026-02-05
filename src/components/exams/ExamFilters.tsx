 import { Search, Filter, X } from 'lucide-react';
 import { Input } from '@/components/ui/input';
 import { Button } from '@/components/ui/button';
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from '@/components/ui/select';
 import { useLanguage } from '@/contexts/LanguageContext';
 import { useAuth } from '@/contexts/AuthContext';
 import { ExamFilters as ExamFiltersType, ExamStatus, Difficulty } from '@/types/exam';
 
 interface ExamFiltersProps {
   filters: ExamFiltersType;
   onFiltersChange: (filters: ExamFiltersType) => void;
 }
 
 export const ExamFilters = ({ filters, onFiltersChange }: ExamFiltersProps) => {
   const { t } = useLanguage();
   const { user } = useAuth();
 
   const handleSearchChange = (value: string) => {
     onFiltersChange({ ...filters, search: value, page: 1 });
   };
 
   const handleStatusChange = (value: string) => {
     onFiltersChange({
       ...filters,
       status: value === 'all' ? '' : (value as ExamStatus),
       page: 1,
     });
   };
 
   const handleDifficultyChange = (value: string) => {
     onFiltersChange({
       ...filters,
       difficulty: value === 'all' ? '' : (value as Difficulty),
       page: 1,
     });
   };
 
   const handleCreatorChange = (value: string) => {
     onFiltersChange({
       ...filters,
       creator: value === 'all' ? '' : value === 'mine' ? user?.user_id : '',
       page: 1,
     });
   };
 
   const clearFilters = () => {
     onFiltersChange({ page: 1, page_size: 10 });
   };
 
   const hasActiveFilters = filters.search || filters.status || filters.difficulty || filters.creator;
 
   return (
     <div className="glass-card rounded-xl p-4 space-y-4">
       {/* Search */}
       <div className="relative">
         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
         <Input
           placeholder={t('exams.search')}
           value={filters.search || ''}
           onChange={(e) => handleSearchChange(e.target.value)}
           className="pl-10 bg-background/50"
         />
       </div>
 
       {/* Filter Row */}
       <div className="flex flex-wrap gap-3 items-center">
         <div className="flex items-center gap-2 text-sm text-muted-foreground">
           <Filter className="w-4 h-4" />
           <span className="hidden sm:inline">{t('exams.filterByStatus')}</span>
         </div>
 
         {/* Status Filter */}
         <Select
           value={filters.status || 'all'}
           onValueChange={handleStatusChange}
         >
           <SelectTrigger className="w-[140px] bg-background/50">
             <SelectValue placeholder={t('exams.filterByStatus')} />
           </SelectTrigger>
           <SelectContent>
             <SelectItem value="all">{t('exams.all')}</SelectItem>
             <SelectItem value="waiting">{t('status.waiting')}</SelectItem>
             <SelectItem value="active">{t('status.active')}</SelectItem>
             <SelectItem value="completed">{t('status.completed')}</SelectItem>
           </SelectContent>
         </Select>
 
         {/* Difficulty Filter */}
         <Select
           value={filters.difficulty || 'all'}
           onValueChange={handleDifficultyChange}
         >
           <SelectTrigger className="w-[130px] bg-background/50">
             <SelectValue placeholder={t('exams.filterByDifficulty')} />
           </SelectTrigger>
           <SelectContent>
             <SelectItem value="all">{t('exams.all')}</SelectItem>
             <SelectItem value="easy">{t('difficulty.easy')}</SelectItem>
             <SelectItem value="medium">{t('difficulty.medium')}</SelectItem>
             <SelectItem value="hard">{t('difficulty.hard')}</SelectItem>
           </SelectContent>
         </Select>
 
         {/* Creator Filter */}
         <Select
           value={filters.creator ? 'mine' : 'all'}
           onValueChange={handleCreatorChange}
         >
           <SelectTrigger className="w-[140px] bg-background/50">
             <SelectValue placeholder={t('exams.filterByCreator')} />
           </SelectTrigger>
           <SelectContent>
             <SelectItem value="all">{t('exams.allExams')}</SelectItem>
             <SelectItem value="mine">{t('exams.myExams')}</SelectItem>
           </SelectContent>
         </Select>
 
         {/* Clear Filters */}
         {hasActiveFilters && (
           <Button
             variant="ghost"
             size="sm"
             onClick={clearFilters}
             className="gap-1.5 text-muted-foreground hover:text-foreground"
           >
             <X className="w-4 h-4" />
             Clear
           </Button>
         )}
       </div>
     </div>
   );
 };