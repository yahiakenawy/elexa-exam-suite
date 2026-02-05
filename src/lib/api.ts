 import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
 import Cookies from 'js-cookie';
 
 // Get tenant from subdomain
 export const getTenant = (): string => {
   const hostname = window.location.hostname;
   const parts = hostname.split('.');
   
   // For local development: tenant.localhost or just use 'demo'
   if (hostname === 'localhost' || hostname === '127.0.0.1') {
     return 'demo';
   }
   
   // For subdomain.zakerai.org format
   if (parts.length >= 3) {
     return parts[0];
   }
   
   // For subdomain.localhost format
   if (parts.length >= 2 && parts[1] === 'localhost') {
     return parts[0];
   }
   
   return 'demo';
 };
 
 // Create API client with tenant support
 const createApiClient = (): AxiosInstance => {
   const tenant = getTenant();
   const baseURL = `https://${tenant}.zakerai.org/api`;
   
   const client = axios.create({
     baseURL,
     withCredentials: true,
     headers: {
       'Content-Type': 'application/json',
     },
   });
 
   // Request interceptor to add auth token
   client.interceptors.request.use(
     (config: InternalAxiosRequestConfig) => {
       const accessToken = sessionStorage.getItem('access_token');
       if (accessToken && config.headers) {
         config.headers.Authorization = `Bearer ${accessToken}`;
       }
       return config;
     },
     (error) => Promise.reject(error)
   );
 
   // Response interceptor to handle token refresh
   client.interceptors.response.use(
     (response) => response,
     async (error) => {
       const originalRequest = error.config;
       
       if (error.response?.status === 401 && !originalRequest._retry) {
         originalRequest._retry = true;
         
         try {
           const refreshToken = Cookies.get('refresh_token');
           if (refreshToken) {
             const response = await axios.post(`${baseURL}/users/token/refresh/`, {
               refresh: refreshToken,
             });
             
             const { access } = response.data;
             sessionStorage.setItem('access_token', access);
             
             originalRequest.headers.Authorization = `Bearer ${access}`;
             return client(originalRequest);
           }
         } catch (refreshError) {
           // Redirect to login if refresh fails
           sessionStorage.removeItem('access_token');
           Cookies.remove('refresh_token');
           window.location.href = '/';
           return Promise.reject(refreshError);
         }
       }
       
       return Promise.reject(error);
     }
   );
 
   return client;
 };
 
 export const apiClient = createApiClient();
 
 // Auth API
 export const authApi = {
   login: (username: string, password: string) =>
     apiClient.post('/users/token/login/', { username, password }),
   refresh: () => apiClient.post('/users/token/refresh/', {}),
 };
 
 // Exam API
 export const examApi = {
   list: (params?: Record<string, string | number | undefined>) =>
     apiClient.get('/exams/', { params }),
   get: (id: number) => apiClient.get(`/exams/${id}/`),
   create: (data: Record<string, unknown>) => apiClient.post('/exams/', data),
   update: (id: number, data: Record<string, unknown>) =>
     apiClient.patch(`/exams/${id}/`, data),
   delete: (id: number) => apiClient.delete(`/exams/${id}/`),
   start: (id: number) => apiClient.post(`/exams/${id}/start/`),
   kill: (id: number) => apiClient.post(`/exams/${id}/kill/`),
   getAnswers: (id: number) => apiClient.get(`/exams/${id}/answers/`),
   addQuestions: (examId: number, questions: { id: number; points: number }[]) =>
     apiClient.post(`/exams/${examId}/questions/`, { questions }),
   removeQuestions: (examId: number, questionIds: number[]) =>
     apiClient.delete(`/exams/${examId}/questions/`, { data: { question_ids: questionIds } }),
 };
 
 // Submission API
 export const submissionApi = {
   list: (examId: number) => apiClient.get(`/exams/submits/?exam_id=${examId}`),
   submit: (examId: number, data: FormData) =>
     apiClient.post(`/exams/submits/?exam_id=${examId}`, data, {
       headers: { 'Content-Type': 'multipart/form-data' },
     }),
   getSubmission: (examId: number) => apiClient.get(`/exams/${examId}/submit/`),
 };