 import { Clock, Users, Calendar, User, Play, Edit, Trash2, Eye, Square } from 'lucide-react';
 import { Link } from 'react-router-dom';
 import { motion } from 'framer-motion';
 import { ExamListItem } from '@/types/exam';
 import { StatusBadge, DifficultyBadge } from '@/components/common/StatusBadge';
 import { Button } from '@/components/ui/button';
 import { useLanguage } from '@/contexts/LanguageContext';
 import { useAuth } from '@/contexts/AuthContext';
 import { formatDateTime, formatDuration } from '@/lib/date';
 import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
 } from '@/components/ui/alert-dialog';
 
 interface ExamCardProps {
   exam: ExamListItem;
   onDelete?: (id: number) => void;
   onStart?: (id: number) => void;
   onEnd?: (id: number) => void;
 }
 
 export const ExamCard = ({ exam, onDelete, onStart, onEnd }: ExamCardProps) => {
   const { t, language } = useLanguage();
   const { user } = useAuth();
 
   const isCreator = user?.user_id === exam.creator;
   const canEdit = isCreator && exam.status === 'waiting';
   const canDelete = isCreator && exam.status === 'waiting';
   const canStart = isCreator && exam.status === 'waiting';
   const canEnd = isCreator && exam.status === 'active';
   const canTakeExam = exam.status === 'active';
   const canViewSubmission = exam.status === 'completed';
 
   return (
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.3 }}
       className="exam-card"
     >
       <div className="flex flex-col gap-4">
         {/* Header */}
         <div className="flex items-start justify-between gap-4">
           <div className="flex-1 min-w-0">
             <h3 className="text-lg font-semibold truncate">{exam.title}</h3>
             {exam.klass_name && (
               <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                 <Users className="w-4 h-4" />
                 {exam.klass_name}
               </p>
             )}
           </div>
           <div className="flex items-center gap-2 flex-shrink-0">
             <StatusBadge status={exam.status} />
             <DifficultyBadge difficulty={exam.difficulty} />
           </div>
         </div>
 
         {/* Info Grid */}
         <div className="grid grid-cols-2 gap-3 text-sm">
           <div className="flex items-center gap-2 text-muted-foreground">
             <Clock className="w-4 h-4 text-primary" />
             <span>{formatDuration(exam.duration_minutes, language)}</span>
           </div>
           <div className="flex items-center gap-2 text-muted-foreground">
             <User className="w-4 h-4 text-primary" />
             <span className="truncate">{exam.creator_name}</span>
           </div>
           <div className="flex items-center gap-2 text-muted-foreground col-span-2">
             <Calendar className="w-4 h-4 text-primary" />
             <span className="truncate">{formatDateTime(exam.start_time, language)}</span>
           </div>
         </div>
 
         {/* Actions */}
         <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-border/50">
           {canTakeExam && (
             <Link to={`/exams/${exam.id}/session`} className="flex-1 min-w-[120px]">
               <Button className="w-full gap-2 bg-gradient-primary hover:opacity-90">
                 <Play className="w-4 h-4" />
                 {t('exams.takeExam')}
               </Button>
             </Link>
           )}
 
           {canViewSubmission && (
             <Link to={`/exams/${exam.id}/submission`} className="flex-1 min-w-[120px]">
               <Button variant="outline" className="w-full gap-2">
                 <Eye className="w-4 h-4" />
                 {t('exams.viewSubmission')}
               </Button>
             </Link>
           )}
 
           {canStart && onStart && (
             <Button
               variant="outline"
               size="sm"
               onClick={() => onStart(exam.id)}
               className="gap-1.5"
             >
               <Play className="w-4 h-4" />
               {t('exams.startExam')}
             </Button>
           )}
 
           {canEnd && onEnd && (
             <Button
               variant="outline"
               size="sm"
               onClick={() => onEnd(exam.id)}
               className="gap-1.5 text-warning border-warning/50 hover:bg-warning/10"
             >
               <Square className="w-4 h-4" />
               {t('exams.endExam')}
             </Button>
           )}
 
           {canEdit && (
             <Link to={`/exams/${exam.id}/edit`}>
               <Button variant="ghost" size="sm" className="gap-1.5">
                 <Edit className="w-4 h-4" />
                 {t('exams.editExam')}
               </Button>
             </Link>
           )}
 
           {canDelete && onDelete && (
             <AlertDialog>
               <AlertDialogTrigger asChild>
                 <Button
                   variant="ghost"
                   size="sm"
                   className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                 >
                   <Trash2 className="w-4 h-4" />
                   {t('exams.deleteExam')}
                 </Button>
               </AlertDialogTrigger>
               <AlertDialogContent>
                 <AlertDialogHeader>
                   <AlertDialogTitle>{t('common.confirm')}</AlertDialogTitle>
                   <AlertDialogDescription>
                     Are you sure you want to delete "{exam.title}"? This action cannot be undone.
                   </AlertDialogDescription>
                 </AlertDialogHeader>
                 <AlertDialogFooter>
                   <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                   <AlertDialogAction
                     onClick={() => onDelete(exam.id)}
                     className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                   >
                     {t('common.delete')}
                   </AlertDialogAction>
                 </AlertDialogFooter>
               </AlertDialogContent>
             </AlertDialog>
           )}
         </div>
       </div>
     </motion.div>
   );
 };