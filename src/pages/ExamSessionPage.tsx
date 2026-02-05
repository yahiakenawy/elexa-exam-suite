 import { useEffect, useState } from 'react';
 import { useParams, useNavigate } from 'react-router-dom';
 import { motion, AnimatePresence } from 'framer-motion';
 import { ChevronLeft, ChevronRight, Send, AlertCircle, BookOpen } from 'lucide-react';
 import { Layout } from '@/components/layout/Layout';
 import { TimerBar } from '@/components/exam-session/TimerBar';
 import { QuestionRenderer } from '@/components/exam-session/QuestionRenderer';
 import { QuestionNavigation } from '@/components/exam-session/QuestionNavigation';
 import { LoadingSpinner } from '@/components/common/LoadingSpinner';
 import { ErrorMessage } from '@/components/common/ErrorMessage';
 import { Button } from '@/components/ui/button';
 import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
 } from '@/components/ui/alert-dialog';
 import { useExamSession } from '@/hooks/useExamSession';
 import { useLanguage } from '@/contexts/LanguageContext';
 import { toast } from 'sonner';
 
 const ExamSessionPage = () => {
   const { id } = useParams<{ id: string }>();
   const navigate = useNavigate();
   const { t } = useLanguage();
   const [showSubmitDialog, setShowSubmitDialog] = useState(false);
   const [autoSubmitting, setAutoSubmitting] = useState(false);
 
   const {
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
   } = useExamSession(parseInt(id || '0'));
 
   // Auto-submit when time runs out
   useEffect(() => {
     if (timeRemaining === 0 && exam && !isSubmitting && !autoSubmitting) {
       setAutoSubmitting(true);
       toast.warning(t('session.autoSubmit'));
       handleSubmit();
     }
   }, [timeRemaining, exam, isSubmitting, autoSubmitting]);
 
   const handleSubmit = async () => {
     const success = await submitExam();
     if (success) {
       toast.success(t('session.submitSuccess'));
       navigate('/exams');
     } else {
       toast.error('Failed to submit exam. Please try again.');
       setAutoSubmitting(false);
     }
     setShowSubmitDialog(false);
   };
 
   const currentQuestion = exam?.questions[currentQuestionIndex];
   const progress = getProgress();
   const answeredIndices = new Set(
     exam?.questions
       .map((eq, idx) => (answers[eq.question.id]?.text || answers[eq.question.id]?.file ? idx : -1))
       .filter((idx) => idx >= 0) || []
   );
 
   if (isLoading) {
     return (
       <Layout>
         <LoadingSpinner size="lg" text={t('common.loading')} />
       </Layout>
     );
   }
 
   if (error || !exam) {
     return (
       <Layout>
         <ErrorMessage message={error || 'Exam not found'} onRetry={() => navigate('/exams')} />
       </Layout>
     );
   }
 
   return (
     <Layout>
       <div className="max-w-4xl mx-auto">
         {/* Exam Title & Instructions */}
         <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="mb-6"
         >
           <h1 className="text-2xl font-bold">{exam.title}</h1>
           {exam.instructions && (
             <div className="mt-3 p-4 rounded-lg bg-muted/50 border flex items-start gap-3">
               <BookOpen className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
               <div>
                 <span className="font-medium text-sm">{t('session.instructions')}:</span>
                 <p className="text-sm text-muted-foreground mt-1">{exam.instructions}</p>
               </div>
             </div>
           )}
         </motion.div>
 
         {/* Timer Bar */}
         <TimerBar timeRemaining={timeRemaining} totalDuration={exam.duration_minutes} />
 
         <div className="grid lg:grid-cols-[1fr,200px] gap-6">
           {/* Question Area */}
           <div className="space-y-6">
             <AnimatePresence mode="wait">
               {currentQuestion && (
                 <QuestionRenderer
                   key={currentQuestion.question.id}
                   examQuestion={currentQuestion}
                   answer={answers[currentQuestion.question.id]}
                   onAnswerChange={(text, file) =>
                     setAnswer(currentQuestion.question.id, text, file)
                   }
                   questionNumber={currentQuestionIndex + 1}
                   totalQuestions={exam.questions.length}
                 />
               )}
             </AnimatePresence>
 
             {/* Navigation Buttons */}
             <div className="flex items-center justify-between pt-4">
               <Button
                 variant="outline"
                 onClick={prevQuestion}
                 disabled={currentQuestionIndex === 0}
                 className="gap-2"
               >
                 <ChevronLeft className="w-4 h-4" />
                 {t('session.previous')}
               </Button>
 
               <div className="flex items-center gap-4">
                 <span className="text-sm text-muted-foreground">
                   {progress.answered} / {progress.total} answered
                 </span>
 
                 {currentQuestionIndex === exam.questions.length - 1 ? (
                   <Button
                     onClick={() => setShowSubmitDialog(true)}
                     disabled={isSubmitting}
                     className="gap-2 bg-gradient-primary hover:opacity-90"
                   >
                     <Send className="w-4 h-4" />
                     {isSubmitting ? t('session.submitting') : t('session.submit')}
                   </Button>
                 ) : (
                   <Button onClick={nextQuestion} className="gap-2">
                     {t('session.next')}
                     <ChevronRight className="w-4 h-4" />
                   </Button>
                 )}
               </div>
             </div>
           </div>
 
           {/* Sidebar - Question Navigation */}
           <div className="hidden lg:block">
             <div className="sticky top-36">
               <QuestionNavigation
                 totalQuestions={exam.questions.length}
                 currentIndex={currentQuestionIndex}
                 answeredQuestions={answeredIndices}
                 onNavigate={goToQuestion}
               />
             </div>
           </div>
         </div>
 
         {/* Submit Confirmation Dialog */}
         <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
           <AlertDialogContent>
             <AlertDialogHeader>
               <AlertDialogTitle className="flex items-center gap-2">
                 <AlertCircle className="w-5 h-5 text-warning" />
                 {t('session.submit')}
               </AlertDialogTitle>
               <AlertDialogDescription>
                 {t('session.confirmSubmit')}
                 <br />
                 <span className="mt-2 block text-sm">
                   {progress.answered} of {progress.total} questions answered.
                 </span>
               </AlertDialogDescription>
             </AlertDialogHeader>
             <AlertDialogFooter>
               <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
               <AlertDialogAction
                 onClick={handleSubmit}
                 disabled={isSubmitting}
                 className="bg-gradient-primary hover:opacity-90"
               >
                 {isSubmitting ? t('session.submitting') : t('common.confirm')}
               </AlertDialogAction>
             </AlertDialogFooter>
           </AlertDialogContent>
         </AlertDialog>
       </div>
     </Layout>
   );
 };
 
 export default ExamSessionPage;