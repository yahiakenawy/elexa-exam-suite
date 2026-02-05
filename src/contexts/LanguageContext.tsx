 import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
 
 type Language = 'en' | 'ar';
 type Direction = 'ltr' | 'rtl';
 
 interface LanguageContextType {
   language: Language;
   direction: Direction;
   setLanguage: (lang: Language) => void;
   t: (key: string) => string;
 }
 
 const translations: Record<Language, Record<string, string>> = {
   en: {
     // Navigation
     'nav.exams': 'Exams',
     'nav.submissions': 'Submissions',
     'nav.logout': 'Logout',
     'nav.login': 'Login',
     
     // Exams Page
     'exams.title': 'Exams',
     'exams.allExams': 'All Exams',
     'exams.myExams': 'My Exams',
     'exams.upcoming': 'Upcoming',
     'exams.active': 'Active',
     'exams.completed': 'Completed',
     'exams.filterByStatus': 'Filter by Status',
     'exams.filterByCreator': 'Filter by Creator',
     'exams.filterByDifficulty': 'Difficulty',
     'exams.search': 'Search exams...',
     'exams.noExams': 'No exams found',
     'exams.takeExam': 'Take Exam',
     'exams.editExam': 'Edit',
     'exams.deleteExam': 'Delete',
     'exams.startExam': 'Start',
     'exams.endExam': 'End',
     'exams.viewSubmission': 'View Submission',
     'exams.createExam': 'Create Exam',
     'exams.duration': 'Duration',
     'exams.minutes': 'minutes',
     'exams.questions': 'Questions',
     'exams.points': 'Points',
     'exams.startsAt': 'Starts at',
     'exams.deadline': 'Deadline',
     'exams.createdBy': 'Created by',
     'exams.all': 'All',
     
     // Exam Session
     'session.question': 'Question',
     'session.of': 'of',
     'session.timeRemaining': 'Time Remaining',
     'session.next': 'Next',
     'session.previous': 'Previous',
     'session.submit': 'Submit Exam',
     'session.submitting': 'Submitting...',
     'session.confirmSubmit': 'Are you sure you want to submit?',
     'session.submitSuccess': 'Exam submitted successfully!',
     'session.autoSubmit': 'Time is up! Auto-submitting...',
     'session.saveProgress': 'Progress saved',
     'session.typeAnswer': 'Type your answer here...',
     'session.uploadImage': 'Upload Image',
     'session.selectOption': 'Select an option',
     'session.instructions': 'Instructions',
     
     // Submission View
     'submission.title': 'Submission Review',
     'submission.score': 'Score',
     'submission.showAnswer': 'Show Correct Answer',
     'submission.hideAnswer': 'Hide Answer',
     'submission.showExplanation': 'Show Explanation',
     'submission.hideExplanation': 'Hide Explanation',
     'submission.yourAnswer': 'Your Answer',
     'submission.correctAnswer': 'Correct Answer',
     'submission.explanation': 'Explanation',
     'submission.correct': 'Correct',
     'submission.incorrect': 'Incorrect',
     'submission.totalScore': 'Total Score',
     'submission.feedback': 'Feedback',
     'submission.attemptNumber': 'Attempt',
     'submission.timeSpent': 'Time Spent',
     'submission.submittedAt': 'Submitted at',
     
     // Edit Exam
     'edit.title': 'Edit Exam',
     'edit.examTitle': 'Exam Title',
     'edit.instructions': 'Instructions',
     'edit.duration': 'Duration (minutes)',
     'edit.startTime': 'Start Time',
     'edit.deadline': 'Deadline',
     'edit.difficulty': 'Difficulty',
     'edit.save': 'Save Changes',
     'edit.cancel': 'Cancel',
     'edit.addQuestion': 'Add Question',
     'edit.removeQuestion': 'Remove',
     'edit.saveSuccess': 'Exam updated successfully!',
     
     // Common
     'common.loading': 'Loading...',
     'common.error': 'An error occurred',
     'common.retry': 'Retry',
     'common.confirm': 'Confirm',
     'common.cancel': 'Cancel',
     'common.save': 'Save',
     'common.delete': 'Delete',
     'common.edit': 'Edit',
     'common.view': 'View',
     'common.back': 'Back',
     'common.close': 'Close',
     
     // Status
     'status.waiting': 'Upcoming',
     'status.active': 'Active',
     'status.completed': 'Completed',
     
     // Difficulty
     'difficulty.easy': 'Easy',
     'difficulty.medium': 'Medium',
     'difficulty.hard': 'Hard',
     
     // Theme
     'theme.light': 'Light',
     'theme.dark': 'Dark',
     'theme.toggle': 'Toggle Theme',
     
     // Language
     'language.toggle': 'العربية',
   },
   ar: {
     // Navigation
     'nav.exams': 'الاختبارات',
     'nav.submissions': 'التسليمات',
     'nav.logout': 'تسجيل الخروج',
     'nav.login': 'تسجيل الدخول',
     
     // Exams Page
     'exams.title': 'الاختبارات',
     'exams.allExams': 'جميع الاختبارات',
     'exams.myExams': 'اختباراتي',
     'exams.upcoming': 'القادمة',
     'exams.active': 'النشطة',
     'exams.completed': 'المكتملة',
     'exams.filterByStatus': 'تصفية حسب الحالة',
     'exams.filterByCreator': 'تصفية حسب المنشئ',
     'exams.filterByDifficulty': 'الصعوبة',
     'exams.search': 'البحث عن الاختبارات...',
     'exams.noExams': 'لا توجد اختبارات',
     'exams.takeExam': 'أداء الاختبار',
     'exams.editExam': 'تعديل',
     'exams.deleteExam': 'حذف',
     'exams.startExam': 'بدء',
     'exams.endExam': 'إنهاء',
     'exams.viewSubmission': 'عرض التسليم',
     'exams.createExam': 'إنشاء اختبار',
     'exams.duration': 'المدة',
     'exams.minutes': 'دقيقة',
     'exams.questions': 'أسئلة',
     'exams.points': 'نقاط',
     'exams.startsAt': 'يبدأ في',
     'exams.deadline': 'الموعد النهائي',
     'exams.createdBy': 'أنشأه',
     'exams.all': 'الكل',
     
     // Exam Session
     'session.question': 'السؤال',
     'session.of': 'من',
     'session.timeRemaining': 'الوقت المتبقي',
     'session.next': 'التالي',
     'session.previous': 'السابق',
     'session.submit': 'تسليم الاختبار',
     'session.submitting': 'جاري التسليم...',
     'session.confirmSubmit': 'هل أنت متأكد من التسليم؟',
     'session.submitSuccess': 'تم تسليم الاختبار بنجاح!',
     'session.autoSubmit': 'انتهى الوقت! جاري التسليم التلقائي...',
     'session.saveProgress': 'تم حفظ التقدم',
     'session.typeAnswer': 'اكتب إجابتك هنا...',
     'session.uploadImage': 'رفع صورة',
     'session.selectOption': 'اختر إجابة',
     'session.instructions': 'التعليمات',
     
     // Submission View
     'submission.title': 'مراجعة التسليم',
     'submission.score': 'الدرجة',
     'submission.showAnswer': 'إظهار الإجابة الصحيحة',
     'submission.hideAnswer': 'إخفاء الإجابة',
     'submission.showExplanation': 'إظهار التفسير',
     'submission.hideExplanation': 'إخفاء التفسير',
     'submission.yourAnswer': 'إجابتك',
     'submission.correctAnswer': 'الإجابة الصحيحة',
     'submission.explanation': 'التفسير',
     'submission.correct': 'صحيح',
     'submission.incorrect': 'خاطئ',
     'submission.totalScore': 'الدرجة الكلية',
     'submission.feedback': 'الملاحظات',
     'submission.attemptNumber': 'المحاولة',
     'submission.timeSpent': 'الوقت المستغرق',
     'submission.submittedAt': 'تم التسليم في',
     
     // Edit Exam
     'edit.title': 'تعديل الاختبار',
     'edit.examTitle': 'عنوان الاختبار',
     'edit.instructions': 'التعليمات',
     'edit.duration': 'المدة (بالدقائق)',
     'edit.startTime': 'وقت البدء',
     'edit.deadline': 'الموعد النهائي',
     'edit.difficulty': 'الصعوبة',
     'edit.save': 'حفظ التغييرات',
     'edit.cancel': 'إلغاء',
     'edit.addQuestion': 'إضافة سؤال',
     'edit.removeQuestion': 'إزالة',
     'edit.saveSuccess': 'تم تحديث الاختبار بنجاح!',
     
     // Common
     'common.loading': 'جاري التحميل...',
     'common.error': 'حدث خطأ',
     'common.retry': 'إعادة المحاولة',
     'common.confirm': 'تأكيد',
     'common.cancel': 'إلغاء',
     'common.save': 'حفظ',
     'common.delete': 'حذف',
     'common.edit': 'تعديل',
     'common.view': 'عرض',
     'common.back': 'رجوع',
     'common.close': 'إغلاق',
     
     // Status
     'status.waiting': 'قادم',
     'status.active': 'نشط',
     'status.completed': 'مكتمل',
     
     // Difficulty
     'difficulty.easy': 'سهل',
     'difficulty.medium': 'متوسط',
     'difficulty.hard': 'صعب',
     
     // Theme
     'theme.light': 'فاتح',
     'theme.dark': 'داكن',
     'theme.toggle': 'تبديل المظهر',
     
     // Language
     'language.toggle': 'English',
   },
 };
 
 const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
 
 export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
   const [language, setLanguageState] = useState<Language>(() => {
     const saved = localStorage.getItem('language');
     return (saved as Language) || 'en';
   });
 
   const direction: Direction = language === 'ar' ? 'rtl' : 'ltr';
 
   const setLanguage = (lang: Language) => {
     setLanguageState(lang);
     localStorage.setItem('language', lang);
   };
 
   const t = (key: string): string => {
     return translations[language][key] || key;
   };
 
   useEffect(() => {
     document.documentElement.dir = direction;
     document.documentElement.lang = language;
   }, [language, direction]);
 
   return (
     <LanguageContext.Provider value={{ language, direction, setLanguage, t }}>
       {children}
     </LanguageContext.Provider>
   );
 };
 
 export const useLanguage = () => {
   const context = useContext(LanguageContext);
   if (!context) {
     throw new Error('useLanguage must be used within a LanguageProvider');
   }
   return context;
 };