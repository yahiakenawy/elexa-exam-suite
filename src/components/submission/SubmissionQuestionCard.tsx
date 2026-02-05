 import { useState } from 'react';
 import { motion, AnimatePresence } from 'framer-motion';
 import { Check, X, Eye, EyeOff, Lightbulb, ChevronDown } from 'lucide-react';
 import { SubmissionQuestion, MCQOption } from '@/types/exam';
 import { Button } from '@/components/ui/button';
 import { useLanguage } from '@/contexts/LanguageContext';
 
 interface SubmissionQuestionCardProps {
   question: SubmissionQuestion;
   questionNumber: number;
   correctAnswer?: string;
   explanation?: string;
   mcqOptions?: MCQOption[];
 }
 
 export const SubmissionQuestionCard = ({
   question,
   questionNumber,
   correctAnswer,
   explanation,
   mcqOptions,
 }: SubmissionQuestionCardProps) => {
   const { t } = useLanguage();
   const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
   const [showExplanation, setShowExplanation] = useState(false);
 
   const studentAnswer = question.student_answer;
   const isCorrect = studentAnswer?.is_correct;
   const pointsAwarded = studentAnswer?.points_awarded || 0;
 
   return (
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       className="question-card"
     >
       {/* Header */}
       <div className="flex items-start justify-between gap-4 mb-4">
         <div className="flex-1">
           <div className="flex items-center gap-3 mb-2">
             <span className="text-sm text-muted-foreground">
               {t('session.question')} {questionNumber}
             </span>
             <div
               className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                 isCorrect
                   ? 'bg-success/20 text-success'
                   : 'bg-destructive/20 text-destructive'
               }`}
             >
               {isCorrect ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
               {isCorrect ? t('submission.correct') : t('submission.incorrect')}
             </div>
             <span className="text-sm font-medium text-primary">
               {pointsAwarded} / {question.points} {t('exams.points')}
             </span>
           </div>
           <h3 className="text-lg font-semibold">{question.question_head}</h3>
         </div>
       </div>
 
       {/* MCQ Options */}
       {question.type_ans === 'mcq' && mcqOptions && (
         <div className="space-y-2 mb-4">
           {mcqOptions.map((option) => {
             const isStudentAnswer = studentAnswer?.answer_text === option.option_text;
             const isCorrectOption = option.is_correct;
 
             return (
               <div
                 key={option.id}
                 className={`p-3 rounded-lg border transition-colors ${
                   isStudentAnswer && isCorrectOption
                     ? 'option-card-correct'
                     : isStudentAnswer && !isCorrectOption
                     ? 'option-card-incorrect'
                     : showCorrectAnswer && isCorrectOption
                     ? 'option-card-correct'
                     : 'bg-muted/30'
                 }`}
               >
                 <div className="flex items-center gap-3">
                   <div
                     className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                       isStudentAnswer
                         ? isCorrectOption
                           ? 'border-success bg-success'
                           : 'border-destructive bg-destructive'
                         : showCorrectAnswer && isCorrectOption
                         ? 'border-success bg-success'
                         : 'border-muted-foreground/30'
                     }`}
                   >
                     {(isStudentAnswer || (showCorrectAnswer && isCorrectOption)) && (
                       <Check className="w-3 h-3 text-white" />
                     )}
                   </div>
                   <span className="font-medium">{option.option_text}</span>
                   {isStudentAnswer && (
                     <span className="text-xs text-muted-foreground ml-auto">
                       ({t('submission.yourAnswer')})
                     </span>
                   )}
                 </div>
               </div>
             );
           })}
         </div>
       )}
 
       {/* Text Answer */}
       {(question.type_ans === 'short_answer' || question.type_ans === 'essay') && (
         <div className="space-y-3 mb-4">
           <div>
             <span className="text-sm font-medium text-muted-foreground">
               {t('submission.yourAnswer')}:
             </span>
             <div className="mt-1 p-3 rounded-lg bg-muted/50 border">
               <p className="whitespace-pre-wrap">
                 {studentAnswer?.answer_text || 'No answer provided'}
               </p>
             </div>
           </div>
           {studentAnswer?.answer_image && (
             <img
               src={studentAnswer.answer_image}
               alt="Answer"
               className="max-w-sm rounded-lg border"
             />
           )}
         </div>
       )}
 
       {/* Feedback */}
       {studentAnswer?.feedback && (
         <div className="p-3 rounded-lg bg-info/10 border border-info/20 mb-4">
           <span className="text-sm font-medium text-info">{t('submission.feedback')}:</span>
           <p className="mt-1 text-sm">{studentAnswer.feedback}</p>
         </div>
       )}
 
       {/* Actions */}
       <div className="flex items-center gap-2 pt-4 border-t border-border/50">
         <Button
           variant="outline"
           size="sm"
           onClick={() => setShowCorrectAnswer(!showCorrectAnswer)}
           className="gap-2"
         >
           {showCorrectAnswer ? (
             <>
               <EyeOff className="w-4 h-4" />
               {t('submission.hideAnswer')}
             </>
           ) : (
             <>
               <Eye className="w-4 h-4" />
               {t('submission.showAnswer')}
             </>
           )}
         </Button>
 
         {explanation && (
           <Button
             variant="outline"
             size="sm"
             onClick={() => setShowExplanation(!showExplanation)}
             className="gap-2"
           >
             <Lightbulb className="w-4 h-4" />
             {showExplanation ? t('submission.hideExplanation') : t('submission.showExplanation')}
             <ChevronDown
               className={`w-4 h-4 transition-transform ${showExplanation ? 'rotate-180' : ''}`}
             />
           </Button>
         )}
       </div>
 
       {/* Correct Answer & Explanation Panels */}
       <AnimatePresence>
         {showCorrectAnswer && correctAnswer && question.type_ans !== 'mcq' && (
           <motion.div
             initial={{ opacity: 0, height: 0 }}
             animate={{ opacity: 1, height: 'auto' }}
             exit={{ opacity: 0, height: 0 }}
             className="mt-4 p-3 rounded-lg bg-success/10 border border-success/20"
           >
             <span className="text-sm font-medium text-success">
               {t('submission.correctAnswer')}:
             </span>
             <p className="mt-1 whitespace-pre-wrap">{correctAnswer}</p>
           </motion.div>
         )}
 
         {showExplanation && explanation && (
           <motion.div
             initial={{ opacity: 0, height: 0 }}
             animate={{ opacity: 1, height: 'auto' }}
             exit={{ opacity: 0, height: 0 }}
             className="mt-4 p-3 rounded-lg bg-warning/10 border border-warning/20"
           >
             <span className="text-sm font-medium text-warning flex items-center gap-2">
               <Lightbulb className="w-4 h-4" />
               {t('submission.explanation')}:
             </span>
             <p className="mt-1 whitespace-pre-wrap">{explanation}</p>
           </motion.div>
         )}
       </AnimatePresence>
     </motion.div>
   );
 };