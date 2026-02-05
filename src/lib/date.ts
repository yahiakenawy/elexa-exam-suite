 // Date utilities with timezone support
 
 // Get user's timezone
 export const getUserTimezone = (): string => {
   return Intl.DateTimeFormat().resolvedOptions().timeZone;
 };
 
 // Convert UTC date string to local date
 export const utcToLocal = (utcDateString: string): Date => {
   return new Date(utcDateString);
 };
 
 // Format date for display (respects user's locale)
 export const formatDateTime = (dateString: string, locale: string = 'en'): string => {
   const date = utcToLocal(dateString);
   const options: Intl.DateTimeFormatOptions = {
     year: 'numeric',
     month: 'short',
     day: 'numeric',
     hour: '2-digit',
     minute: '2-digit',
     hour12: locale !== 'ar',
   };
   return date.toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US', options);
 };
 
 // Format date only
 export const formatDate = (dateString: string, locale: string = 'en'): string => {
   const date = utcToLocal(dateString);
   const options: Intl.DateTimeFormatOptions = {
     year: 'numeric',
     month: 'short',
     day: 'numeric',
   };
   return date.toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US', options);
 };
 
 // Format time only
 export const formatTime = (dateString: string, locale: string = 'en'): string => {
   const date = utcToLocal(dateString);
   const options: Intl.DateTimeFormatOptions = {
     hour: '2-digit',
     minute: '2-digit',
     hour12: locale !== 'ar',
   };
   return date.toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US', options);
 };
 
 // Format duration in minutes to readable string
 export const formatDuration = (minutes: number, locale: string = 'en'): string => {
   if (minutes < 60) {
     return locale === 'ar' ? `${minutes} دقيقة` : `${minutes} min`;
   }
   const hours = Math.floor(minutes / 60);
   const mins = minutes % 60;
   if (locale === 'ar') {
     return mins > 0 ? `${hours} ساعة ${mins} دقيقة` : `${hours} ساعة`;
   }
   return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
 };
 
 // Format remaining time for timer
 export const formatTimeRemaining = (seconds: number): string => {
   const hours = Math.floor(seconds / 3600);
   const minutes = Math.floor((seconds % 3600) / 60);
   const secs = seconds % 60;
 
   if (hours > 0) {
     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
   }
   return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
 };
 
 // Check if exam is currently active based on time
 export const isExamActive = (startTime: string, deadline: string): boolean => {
   const now = new Date();
   const start = utcToLocal(startTime);
   const end = utcToLocal(deadline);
   return now >= start && now <= end;
 };
 
 // Get time until exam starts
 export const getTimeUntilStart = (startTime: string): number => {
   const now = new Date();
   const start = utcToLocal(startTime);
   return Math.max(0, Math.floor((start.getTime() - now.getTime()) / 1000));
 };
 
 // Get remaining time for exam
 export const getRemainingTime = (deadline: string, durationMinutes: number, startedAt?: Date): number => {
   const now = new Date();
   const deadlineDate = utcToLocal(deadline);
   
   // If we have a start time, use duration from that
   if (startedAt) {
     const endTime = new Date(startedAt.getTime() + durationMinutes * 60 * 1000);
     const minEnd = endTime < deadlineDate ? endTime : deadlineDate;
     return Math.max(0, Math.floor((minEnd.getTime() - now.getTime()) / 1000));
   }
   
   // Otherwise use deadline
   return Math.max(0, Math.floor((deadlineDate.getTime() - now.getTime()) / 1000));
 };
 
 // Convert local datetime to ISO string for API
 export const localToUTC = (date: Date): string => {
   return date.toISOString();
 };