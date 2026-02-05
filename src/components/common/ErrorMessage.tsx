 import { AlertCircle, RefreshCw } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { useLanguage } from '@/contexts/LanguageContext';
 
 interface ErrorMessageProps {
   message?: string;
   onRetry?: () => void;
 }
 
 export const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
   const { t } = useLanguage();
 
   return (
     <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
       <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
         <AlertCircle className="w-8 h-8 text-destructive" />
       </div>
       <div>
         <h3 className="text-lg font-semibold">{t('common.error')}</h3>
         <p className="text-muted-foreground mt-1">
           {message || 'Something went wrong. Please try again.'}
         </p>
       </div>
       {onRetry && (
         <Button onClick={onRetry} variant="outline" className="gap-2">
           <RefreshCw className="w-4 h-4" />
           {t('common.retry')}
         </Button>
       )}
     </div>
   );
 };