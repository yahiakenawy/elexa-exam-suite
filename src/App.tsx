import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import ExamsPage from "./pages/ExamsPage";
import ExamSessionPage from "./pages/ExamSessionPage";
import SubmissionViewPage from "./pages/SubmissionViewPage";
import EditExamPage from "./pages/EditExamPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/exams" element={<ExamsPage />} />
                <Route path="/exams/:id/session" element={<ExamSessionPage />} />
                <Route path="/exams/:id/submission" element={<SubmissionViewPage />} />
                <Route path="/exams/:id/edit" element={<EditExamPage />} />
                <Route path="/submissions" element={<ExamsPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
