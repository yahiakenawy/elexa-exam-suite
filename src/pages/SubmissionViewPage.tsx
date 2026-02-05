 import { useParams, useNavigate, Link } from 'react-router-dom';
 import { motion } from 'framer-motion';
 import { ArrowLeft, Trophy, Clock, Calendar, Hash } from 'lucide-react';
 import { Layout } from '@/components/layout/Layout';
 import { SubmissionQuestionCard } from '@/components/submission/SubmissionQuestionCard';
 import { LoadingSpinner } from '@/components/common/LoadingSpinner';
 import { ErrorMessage } from '@/components/common/ErrorMessage';
 import { Button } from '@/components/ui/button';
 import { useSubmission } from '@/hooks/useSubmission';
 import { useLanguage } from '@/contexts/LanguageContext';
 import { formatDateTime, formatDuration } from '@/lib/date';
 
 const SubmissionViewPage = () => {
   const { id } = useParams<{ id: string }>();
   const navigate = useNavigate();
   const { t, language } = useLanguage();
 
   const { submission, examDetails, isLoading, error, refetch } = useSubmission(
     parseInt(id || '0')
   );
 
   if (isLoading) {
     return (
       <Layout>
         <LoadingSpinner size="lg" text={t('common.loading')} />
       </Layout>
     );
   }
 
   if (error || !submission || !examDetails) {
     return (
       <Layout>
         <ErrorMessage message={error || 'Submission not found'} onRetry={refetch} />
       </Layout>
     );
   }
 
   // Calculate total score
   const totalPoints = examDetails.questions.reduce((sum, eq) => sum + eq.points, 0);
   const scorePercentage = totalPoints > 0 ? Math.round((submission.total_score || 0) / totalPoints * 100) : 0;
 
   return (
     <Layout>
       <div className="max-w-4xl mx-auto">
         {/* Back Button */}
         <Link to="/exams">
           <Button variant="ghost" className="gap-2 mb-4">
             <ArrowLeft className="w-4 h-4" />
             {t('common.back')}
           </Button>
         </Link>
 
         {/* Header */}
         <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="glass-card-elevated rounded-xl p-6 mb-6"
         >
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
             <div>
               <h1 className="text-2xl font-bold">{examDetails.title}</h1>
               <p className="text-muted-foreground mt-1">{t('submission.title')}</p>
             </div>
 
             {/* Score Display */}
             <div className="flex items-center gap-4">
               <div
                 className={`relative w-24 h-24 rounded-full flex items-center justify-center ${
                   scorePercentage >= 70
                     ? 'bg-success/20'
                     : scorePercentage >= 50
                     ? 'bg-warning/20'
                     : 'bg-destructive/20'
                 }`}
               >
                 <Trophy
                   className={`absolute -top-2 -right-2 w-6 h-6 ${
                     scorePercentage >= 70 ? 'text-success' : 'text-muted-foreground'
                   }`}
                 />
                 <div className="text-center">
                   <span
                     className={`text-2xl font-bold ${
                       scorePercentage >= 70
                         ? 'text-success'
                         : scorePercentage >= 50
                         ? 'text-warning'
                         : 'text-destructive'
                     }`}
                   >
                     {scorePercentage}%
                   </span>
                   <p className="text-xs text-muted-foreground">
                     {submission.total_score} / {totalPoints}
                   </p>
                 </div>
               </div>
             </div>
           </div>
 
           {/* Meta Info */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border/50">
             <div className="flex items-center gap-2 text-sm">
               <Calendar className="w-4 h-4 text-primary" />
               <div>
                 <span className="text-muted-foreground">{t('submission.submittedAt')}</span>
                 <p className="font-medium">{formatDateTime(submission.submitted_at, language)}</p>
               </div>
             </div>
             <div className="flex items-center gap-2 text-sm">
               <Clock className="w-4 h-4 text-primary" />
               <div>
                 <span className="text-muted-foreground">{t('submission.timeSpent')}</span>
                 <p className="font-medium">
                   {formatDuration(submission.time_spent_minutes, language)}
                 </p>
               </div>
             </div>
             <div className="flex items-center gap-2 text-sm">
               <Hash className="w-4 h-4 text-primary" />
               <div>
                 <span className="text-muted-foreground">{t('submission.attemptNumber')}</span>
                 <p className="font-medium">{submission.attempt_number}</p>
               </div>
             </div>
             {submission.feedback && (
               <div className="col-span-2 md:col-span-1 text-sm">
                 <span className="text-muted-foreground">{t('submission.feedback')}</span>
                 <p className="font-medium truncate">{submission.feedback}</p>
               </div>
             )}
           </div>
         </motion.div>
 
         {/* Questions */}
         <div className="space-y-4">
           {submission.questions?.map((question, index) => {
             // Find matching question from exam details to get correct answer & explanation
             const examQuestion = examDetails.questions.find(
               (eq) => eq.question.id === question.id
             );
 
             return (
               <SubmissionQuestionCard
                 key={question.id}
                 question={question}
                 questionNumber={index + 1}
                 correctAnswer={examQuestion?.question.correct_answer}
                 explanation={examQuestion?.question.explanation}
                 mcqOptions={examQuestion?.question.mcq_options}
               />
             );
           })}
         </div>
       </div>
     </Layout>
   );
 };
 
 export default SubmissionViewPage;