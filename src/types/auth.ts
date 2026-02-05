 export type UserRole = 'admin' | 'head' | 'teacher' | 'student';
 
 export interface User {
   user_id: number;
   username: string;
   role: UserRole;
 }
 
 export interface AuthTokens {
   access: string;
   refresh: string;
 }
 
 export interface AuthState {
   user: User | null;
   isAuthenticated: boolean;
   isLoading: boolean;
   accessToken: string | null;
 }