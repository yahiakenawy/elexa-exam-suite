 import { useState, useEffect } from 'react';
 import { useParams, useNavigate, Link } from 'react-router-dom';
 import { motion } from 'framer-motion';
 import { ArrowLeft, Save, Trash2 } from 'lucide-react';
 import { Layout } from '@/components/layout/Layout';
 import { LoadingSpinner } from '@/components/common/LoadingSpinner';
 import { ErrorMessage } from '@/components/common/ErrorMessage';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Textarea } from '@/components/ui/textarea';
 import { Label } from '@/components/ui/label';
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from '@/components/ui/select';
 import { examApi } from '@/lib/api';
 import { ExamDetail, Difficulty } from '@/types/exam';
 import { useLanguage } from '@/contexts/LanguageContext';
 import { toast } from 'sonner';
 
 const EditExamPage = () => {
   const { id } = useParams<{ id: string }>();
   const navigate = useNavigate();
   const { t } = useLanguage();
 
   const [exam, setExam] = useState<ExamDetail | null>(null);
   const [isLoading, setIsLoading] = useState(true);
   const [isSaving, setIsSaving] = useState(false);
   const [error, setError] = useState<string | null>(null);
 
   const [formData, setFormData] = useState({
     title: '',
     instructions: '',
     duration_minutes: 60,
     difficulty: 'medium' as Difficulty,
   });
 
   useEffect(() => {
     const fetchExam = async () => {
       try {
         const response = await examApi.get(parseInt(id || '0'));
         setExam(response.data);
         setFormData({
           title: response.data.title,
           instructions: response.data.instructions || '',
           duration_minutes: response.data.duration_minutes,
           difficulty: response.data.difficulty,
         });
       } catch (err) {
         setError('Failed to load exam');
       } finally {
         setIsLoading(false);
       }
     };
     fetchExam();
   }, [id]);
 
   const handleSave = async () => {
     setIsSaving(true);
     try {
       await examApi.update(parseInt(id || '0'), formData);
       toast.success(t('edit.saveSuccess'));
       navigate('/exams');
     } catch (err) {
       toast.error('Failed to save changes');
     } finally {
       setIsSaving(false);
     }
   };
 
   if (isLoading) return <Layout><LoadingSpinner size="lg" /></Layout>;
   if (error || !exam) return <Layout><ErrorMessage message={error} /></Layout>;
 
   return (
     <Layout>
       <div className="max-w-2xl mx-auto">
         <Link to="/exams">
           <Button variant="ghost" className="gap-2 mb-4">
             <ArrowLeft className="w-4 h-4" />
             {t('common.back')}
           </Button>
         </Link>
 
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="glass-card-elevated rounded-xl p-6"
         >
           <h1 className="text-2xl font-bold mb-6">{t('edit.title')}</h1>
 
           <div className="space-y-4">
             <div>
               <Label>{t('edit.examTitle')}</Label>
               <Input
                 value={formData.title}
                 onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                 className="mt-1"
               />
             </div>
 
             <div>
               <Label>{t('edit.instructions')}</Label>
               <Textarea
                 value={formData.instructions}
                 onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                 className="mt-1 min-h-[100px]"
               />
             </div>
 
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <Label>{t('edit.duration')}</Label>
                 <Input
                   type="number"
                   value={formData.duration_minutes}
                   onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 60 })}
                   className="mt-1"
                 />
               </div>
               <div>
                 <Label>{t('edit.difficulty')}</Label>
                 <Select
                   value={formData.difficulty}
                   onValueChange={(v) => setFormData({ ...formData, difficulty: v as Difficulty })}
                 >
                   <SelectTrigger className="mt-1">
                     <SelectValue />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="easy">{t('difficulty.easy')}</SelectItem>
                     <SelectItem value="medium">{t('difficulty.medium')}</SelectItem>
                     <SelectItem value="hard">{t('difficulty.hard')}</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
             </div>
 
             <div className="flex gap-3 pt-4">
               <Button onClick={handleSave} disabled={isSaving} className="gap-2 bg-gradient-primary">
                 <Save className="w-4 h-4" />
                 {isSaving ? t('common.loading') : t('edit.save')}
               </Button>
               <Button variant="outline" onClick={() => navigate('/exams')}>
                 {t('edit.cancel')}
               </Button>
             </div>
           </div>
         </motion.div>
       </div>
     </Layout>
   );
 };
 
 export default EditExamPage;