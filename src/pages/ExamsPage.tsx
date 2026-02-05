 import { useState } from 'react';
 import { motion } from 'framer-motion';
 import { FileText, ChevronLeft, ChevronRight } from 'lucide-react';
 import { Layout } from '@/components/layout/Layout';
 import { ExamCard } from '@/components/exams/ExamCard';
 import { ExamFilters } from '@/components/exams/ExamFilters';
 import { LoadingSpinner } from '@/components/common/LoadingSpinner';
 import { ErrorMessage } from '@/components/common/ErrorMessage';
 import { Button } from '@/components/ui/button';
 import { useExams } from '@/hooks/useExams';
 import { useLanguage } from '@/contexts/LanguageContext';
 import { examApi } from '@/lib/api';
 import { toast } from 'sonner';
 
 const ExamsPage = () => {
   const { t } = useLanguage();
   const {
     exams,
     isLoading,
     error,
     totalCount,
     currentPage,
     hasNextPage,
     hasPrevPage,
     filters,
     setFilters,
     nextPage,
     prevPage,
     refetch,
   } = useExams();
 
   const [actionLoading, setActionLoading] = useState<number | null>(null);
 
   const handleDelete = async (id: number) => {
     setActionLoading(id);
     try {
       await examApi.delete(id);
       toast.success('Exam deleted successfully');
       refetch();
     } catch (err) {
       toast.error('Failed to delete exam');
     } finally {
       setActionLoading(null);
     }
   };
 
   const handleStart = async (id: number) => {
     setActionLoading(id);
     try {
       await examApi.start(id);
       toast.success('Exam started successfully');
       refetch();
     } catch (err) {
       toast.error('Failed to start exam');
     } finally {
       setActionLoading(null);
     }
   };
 
   const handleEnd = async (id: number) => {
     setActionLoading(id);
     try {
       await examApi.kill(id);
       toast.success('Exam ended successfully');
       refetch();
     } catch (err) {
       toast.error('Failed to end exam');
     } finally {
       setActionLoading(null);
     }
   };
 
   return (
     <Layout>
       <div className="space-y-6">
         {/* Page Header */}
         <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="flex items-center justify-between"
         >
           <div>
             <h1 className="text-3xl font-bold text-gradient">{t('exams.title')}</h1>
             <p className="text-muted-foreground mt-1">
               {totalCount > 0
                 ? `${totalCount} ${t('exams.title').toLowerCase()}`
                 : t('exams.noExams')}
             </p>
           </div>
         </motion.div>
 
         {/* Filters */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
         >
           <ExamFilters filters={filters} onFiltersChange={setFilters} />
         </motion.div>
 
         {/* Content */}
         {isLoading ? (
           <LoadingSpinner text={t('common.loading')} />
         ) : error ? (
           <ErrorMessage message={error} onRetry={refetch} />
         ) : exams.length === 0 ? (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="glass-card rounded-xl p-12 text-center"
           >
             <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
               <FileText className="w-10 h-10 text-muted-foreground" />
             </div>
             <h3 className="text-xl font-semibold">{t('exams.noExams')}</h3>
             <p className="text-muted-foreground mt-2">
               Try adjusting your filters or check back later.
             </p>
           </motion.div>
         ) : (
           <>
             {/* Exam Grid */}
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
               {exams.map((exam, index) => (
                 <motion.div
                   key={exam.id}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: index * 0.05 }}
                 >
                   <ExamCard
                     exam={exam}
                     onDelete={handleDelete}
                     onStart={handleStart}
                     onEnd={handleEnd}
                   />
                 </motion.div>
               ))}
             </div>
 
             {/* Pagination */}
             {(hasNextPage || hasPrevPage) && (
               <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="flex items-center justify-center gap-4 pt-4"
               >
                 <Button
                   variant="outline"
                   onClick={prevPage}
                   disabled={!hasPrevPage}
                   className="gap-2"
                 >
                   <ChevronLeft className="w-4 h-4" />
                   {t('session.previous')}
                 </Button>
                 <span className="text-sm text-muted-foreground">
                   Page {currentPage}
                 </span>
                 <Button
                   variant="outline"
                   onClick={nextPage}
                   disabled={!hasNextPage}
                   className="gap-2"
                 >
                   {t('session.next')}
                   <ChevronRight className="w-4 h-4" />
                 </Button>
               </motion.div>
             )}
           </>
         )}
       </div>
     </Layout>
   );
 };
 
 export default ExamsPage;