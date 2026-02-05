 import { motion } from 'framer-motion';
 import { Clock, AlertTriangle } from 'lucide-react';
 import { formatTimeRemaining } from '@/lib/date';
 import { useLanguage } from '@/contexts/LanguageContext';
 
 interface TimerBarProps {
   timeRemaining: number;
   totalDuration: number;
 }
 
 export const TimerBar = ({ timeRemaining, totalDuration }: TimerBarProps) => {
   const { t } = useLanguage();
   
   const totalSeconds = totalDuration * 60;
   const progress = (timeRemaining / totalSeconds) * 100;
   const isWarning = timeRemaining <= 180 && timeRemaining > 0; // Last 3 minutes
   const isDanger = timeRemaining <= 180; // Last 3 minutes turns red
 
   const getTimerClass = () => {
     if (isDanger) return 'timer-bar-danger';
     if (isWarning) return 'timer-bar-warning';
     return 'timer-bar-normal';
   };
 
   return (
     <div className="sticky top-16 z-40 glass-card-elevated rounded-xl p-4 mb-6">
       <div className="flex items-center justify-between mb-3">
         <div className="flex items-center gap-2">
           {isDanger ? (
             <AlertTriangle className="w-5 h-5 text-destructive animate-pulse-soft" />
           ) : (
             <Clock className="w-5 h-5 text-primary" />
           )}
           <span className="font-medium">{t('session.timeRemaining')}</span>
         </div>
         <motion.span
           key={timeRemaining}
           initial={{ scale: 1.1 }}
           animate={{ scale: 1 }}
           className={`text-2xl font-bold font-mono ${
             isDanger ? 'text-destructive' : 'text-foreground'
           }`}
         >
           {formatTimeRemaining(timeRemaining)}
         </motion.span>
       </div>
       
       <div className="h-2 bg-muted rounded-full overflow-hidden">
         <motion.div
           className={`h-full timer-bar ${getTimerClass()} rounded-full`}
           initial={{ width: '100%' }}
           animate={{ width: `${progress}%` }}
           transition={{ duration: 0.5 }}
         />
       </div>
     </div>
   );
 };