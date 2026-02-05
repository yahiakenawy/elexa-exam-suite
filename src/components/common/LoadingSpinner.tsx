 import { motion } from 'framer-motion';
 
 interface LoadingSpinnerProps {
   size?: 'sm' | 'md' | 'lg';
   text?: string;
 }
 
 export const LoadingSpinner = ({ size = 'md', text }: LoadingSpinnerProps) => {
   const sizeClasses = {
     sm: 'w-6 h-6',
     md: 'w-10 h-10',
     lg: 'w-16 h-16',
   };
 
   return (
     <div className="flex flex-col items-center justify-center gap-4 py-12">
       <motion.div
         className={`${sizeClasses[size]} rounded-full border-4 border-primary/20 border-t-primary`}
         animate={{ rotate: 360 }}
         transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
       />
       {text && <p className="text-muted-foreground font-medium">{text}</p>}
     </div>
   );
 };