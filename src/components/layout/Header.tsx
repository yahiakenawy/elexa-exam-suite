 import { Moon, Sun, Globe, LogOut, Menu, X } from 'lucide-react';
 import { useState } from 'react';
 import { Link, useLocation } from 'react-router-dom';
 import { useTheme } from '@/contexts/ThemeContext';
 import { useLanguage } from '@/contexts/LanguageContext';
 import { useAuth } from '@/contexts/AuthContext';
 import { Button } from '@/components/ui/button';
 import { motion, AnimatePresence } from 'framer-motion';
 
 export const Header = () => {
   const { theme, toggleTheme } = useTheme();
   const { language, setLanguage, t } = useLanguage();
   const { user, isAuthenticated, logout } = useAuth();
   const location = useLocation();
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
 
   const navLinks = [
     { href: '/exams', label: t('nav.exams') },
     { href: '/submissions', label: t('nav.submissions') },
   ];
 
   const isActive = (path: string) => location.pathname.startsWith(path);
 
   return (
     <header className="sticky top-0 z-50 glass-card border-b">
       <div className="container mx-auto px-4">
         <div className="flex h-16 items-center justify-between">
           {/* Logo */}
           <Link to="/" className="flex items-center gap-2">
             <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
               <span className="text-xl font-bold text-white">Z</span>
             </div>
             <span className="text-xl font-bold text-gradient hidden sm:block">
               Zakerai
             </span>
           </Link>
 
           {/* Desktop Navigation */}
           <nav className="hidden md:flex items-center gap-1">
             {navLinks.map((link) => (
               <Link
                 key={link.href}
                 to={link.href}
                 className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                   isActive(link.href)
                     ? 'bg-primary/10 text-primary'
                     : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                 }`}
               >
                 {link.label}
               </Link>
             ))}
           </nav>
 
           {/* Actions */}
           <div className="flex items-center gap-2">
             {/* Language Toggle */}
             <Button
               variant="ghost"
               size="icon"
               onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
               className="rounded-lg"
               title={t('language.toggle')}
             >
               <Globe className="h-5 w-5" />
             </Button>
 
             {/* Theme Toggle */}
             <Button
               variant="ghost"
               size="icon"
               onClick={toggleTheme}
               className="rounded-lg"
               title={t('theme.toggle')}
             >
               {theme === 'light' ? (
                 <Moon className="h-5 w-5" />
               ) : (
                 <Sun className="h-5 w-5" />
               )}
             </Button>
 
             {/* User Info & Logout */}
             {isAuthenticated && user && (
               <div className="hidden sm:flex items-center gap-2">
                 <div className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium">
                   {user.username}
                   <span className="mx-1.5 text-muted-foreground">•</span>
                   <span className="capitalize text-primary">{user.role}</span>
                 </div>
                 <Button
                   variant="ghost"
                   size="icon"
                   onClick={logout}
                   className="rounded-lg text-destructive hover:text-destructive"
                   title={t('nav.logout')}
                 >
                   <LogOut className="h-5 w-5" />
                 </Button>
               </div>
             )}
 
             {/* Mobile Menu Toggle */}
             <Button
               variant="ghost"
               size="icon"
               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
               className="md:hidden rounded-lg"
             >
               {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
             </Button>
           </div>
         </div>
       </div>
 
       {/* Mobile Menu */}
       <AnimatePresence>
         {mobileMenuOpen && (
           <motion.div
             initial={{ opacity: 0, height: 0 }}
             animate={{ opacity: 1, height: 'auto' }}
             exit={{ opacity: 0, height: 0 }}
             className="md:hidden border-t"
           >
             <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
               {navLinks.map((link) => (
                 <Link
                   key={link.href}
                   to={link.href}
                   onClick={() => setMobileMenuOpen(false)}
                   className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                     isActive(link.href)
                       ? 'bg-primary/10 text-primary'
                       : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                   }`}
                 >
                   {link.label}
                 </Link>
               ))}
               {isAuthenticated && user && (
                 <>
                   <div className="px-4 py-3 rounded-lg bg-muted text-sm font-medium">
                     {user.username}
                     <span className="mx-1.5 text-muted-foreground">•</span>
                     <span className="capitalize text-primary">{user.role}</span>
                   </div>
                   <button
                     onClick={() => {
                       logout();
                       setMobileMenuOpen(false);
                     }}
                     className="px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 text-left font-medium"
                   >
                     {t('nav.logout')}
                   </button>
                 </>
               )}
             </nav>
           </motion.div>
         )}
       </AnimatePresence>
     </header>
   );
 };