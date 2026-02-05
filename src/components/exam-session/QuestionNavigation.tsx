 import { motion } from 'framer-motion';
 import { Check } from 'lucide-react';
 
 interface QuestionNavigationProps {
   totalQuestions: number;
   currentIndex: number;
   answeredQuestions: Set<number>;
   onNavigate: (index: number) => void;
 }
 
 export const QuestionNavigation = ({
   totalQuestions,
   currentIndex,
   answeredQuestions,
   onNavigate,
 }: QuestionNavigationProps) => {
   return (
     <div className="glass-card rounded-xl p-4">
       <h4 className="text-sm font-medium text-muted-foreground mb-3">Questions</h4>
       <div className="grid grid-cols-5 gap-2">
         {Array.from({ length: totalQuestions }, (_, i) => {
           const isAnswered = answeredQuestions.has(i);
           const isCurrent = i === currentIndex;
 
           return (
             <motion.button
               key={i}
               type="button"
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => onNavigate(i)}
               className={`relative w-10 h-10 rounded-lg font-medium text-sm transition-all
                 ${
                   isCurrent
                     ? 'bg-gradient-primary text-white shadow-lg'
                     : isAnswered
                     ? 'bg-success/20 text-success border border-success/30'
                     : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                 }
               `}
             >
               {i + 1}
               {isAnswered && !isCurrent && (
                 <span className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full flex items-center justify-center">
                   <Check className="w-2.5 h-2.5 text-white" />
                 </span>
               )}
             </motion.button>
           );
         })}
       </div>
     </div>
   );
 };