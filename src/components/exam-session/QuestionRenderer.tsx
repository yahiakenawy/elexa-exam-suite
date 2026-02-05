 import { useState, useRef } from 'react';
 import { Upload, X, ImageIcon } from 'lucide-react';
 import { motion } from 'framer-motion';
 import { ExamQuestion } from '@/types/exam';
 import { Textarea } from '@/components/ui/textarea';
 import { Button } from '@/components/ui/button';
 import { useLanguage } from '@/contexts/LanguageContext';
 
 interface QuestionRendererProps {
   examQuestion: ExamQuestion;
   answer: { text: string | null; file: File | null } | undefined;
   onAnswerChange: (text: string | null, file?: File | null) => void;
   questionNumber: number;
   totalQuestions: number;
 }
 
 export const QuestionRenderer = ({
   examQuestion,
   answer,
   onAnswerChange,
   questionNumber,
   totalQuestions,
 }: QuestionRendererProps) => {
   const { t } = useLanguage();
   const { question } = examQuestion;
   const fileInputRef = useRef<HTMLInputElement>(null);
   const [imagePreview, setImagePreview] = useState<string | null>(null);
 
   const handleMCQSelect = (optionText: string) => {
     onAnswerChange(optionText);
   };
 
   const handleTextChange = (value: string) => {
     onAnswerChange(value || null);
   };
 
   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (file) {
       // Create preview
       const reader = new FileReader();
       reader.onload = () => setImagePreview(reader.result as string);
       reader.readAsDataURL(file);
       onAnswerChange(answer?.text || null, file);
     }
   };
 
   const removeImage = () => {
     setImagePreview(null);
     onAnswerChange(answer?.text || null, null);
     if (fileInputRef.current) {
       fileInputRef.current.value = '';
     }
   };
 
   const renderMCQ = () => (
     <div className="space-y-3">
       {question.mcq_options?.map((option) => (
         <motion.button
           key={option.id}
           type="button"
           whileHover={{ scale: 1.01 }}
           whileTap={{ scale: 0.99 }}
           onClick={() => handleMCQSelect(option.option_text)}
           className={`w-full text-left option-card ${
             answer?.text === option.option_text ? 'option-card-selected' : ''
           }`}
         >
           <div className="flex items-center gap-3">
             <div
               className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                 answer?.text === option.option_text
                   ? 'border-primary bg-primary'
                   : 'border-muted-foreground/50'
               }`}
             >
               {answer?.text === option.option_text && (
                 <motion.div
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   className="w-2 h-2 rounded-full bg-primary-foreground"
                 />
               )}
             </div>
             <span className="font-medium">{option.option_text}</span>
           </div>
         </motion.button>
       ))}
     </div>
   );
 
   const renderPassage = () => (
     <div className="space-y-6">
       {/* Passage content */}
       <div className="bg-muted/50 rounded-lg p-4 border">
         <p className="whitespace-pre-wrap">{question.question_head}</p>
       </div>
 
       {/* Mini questions */}
       {question.mini_questions?.map((mini, idx) => (
         <div key={mini.id} className="space-y-3">
           <h4 className="font-medium">
             {idx + 1}. {mini.question_head}
           </h4>
           {mini.type_ans === 'mcq' && mini.mcq_options && (
             <div className="space-y-2 pl-4">
               {mini.mcq_options[0]?.options.map((opt, optIdx) => (
                 <motion.button
                   key={optIdx}
                   type="button"
                   whileHover={{ scale: 1.01 }}
                   whileTap={{ scale: 0.99 }}
                   onClick={() => handleMCQSelect(`${mini.id}:${opt}`)}
                   className={`w-full text-left option-card ${
                     answer?.text?.includes(`${mini.id}:${opt}`)
                       ? 'option-card-selected'
                       : ''
                   }`}
                 >
                   <span className="font-medium">{opt}</span>
                 </motion.button>
               ))}
             </div>
           )}
         </div>
       ))}
     </div>
   );
 
   const renderTextInput = () => (
     <div className="space-y-4">
       <Textarea
         placeholder={t('session.typeAnswer')}
         value={answer?.text || ''}
         onChange={(e) => handleTextChange(e.target.value)}
         className="min-h-[150px] bg-background/50"
       />
 
       {/* Image upload */}
       <div className="space-y-2">
         <input
           ref={fileInputRef}
           type="file"
           accept="image/*"
           onChange={handleFileChange}
           className="hidden"
         />
 
         {imagePreview || answer?.file ? (
           <div className="relative inline-block">
             <img
               src={imagePreview || ''}
               alt="Answer"
               className="max-w-xs max-h-48 rounded-lg border"
             />
             <Button
               type="button"
               variant="destructive"
               size="icon"
               className="absolute -top-2 -right-2 w-6 h-6"
               onClick={removeImage}
             >
               <X className="w-4 h-4" />
             </Button>
           </div>
         ) : (
           <Button
             type="button"
             variant="outline"
             onClick={() => fileInputRef.current?.click()}
             className="gap-2"
           >
             <Upload className="w-4 h-4" />
             {t('session.uploadImage')}
           </Button>
         )}
       </div>
     </div>
   );
 
   return (
     <motion.div
       key={question.id}
       initial={{ opacity: 0, x: 20 }}
       animate={{ opacity: 1, x: 0 }}
       exit={{ opacity: 0, x: -20 }}
       className="question-card"
     >
       {/* Question Header */}
       <div className="flex items-start justify-between gap-4 mb-6">
         <div className="flex-1">
           <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
             <span>
               {t('session.question')} {questionNumber} {t('session.of')} {totalQuestions}
             </span>
             <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
               {examQuestion.points} {t('exams.points')}
             </span>
           </div>
           <h3 className="text-xl font-semibold">
             {question.type_ans !== 'passage' && question.question_head}
           </h3>
         </div>
         {question.image && (
           <div className="w-32 h-32 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
             <img
               src={question.image}
               alt="Question"
               className="w-full h-full object-cover"
               onError={(e) => {
                 (e.target as HTMLImageElement).style.display = 'none';
               }}
             />
           </div>
         )}
       </div>
 
       {/* Question Content */}
       <div className="mt-6">
         {question.type_ans === 'mcq' && renderMCQ()}
         {question.type_ans === 'passage' && renderPassage()}
         {(question.type_ans === 'short_answer' || question.type_ans === 'essay') &&
           renderTextInput()}
       </div>
     </motion.div>
   );
 };