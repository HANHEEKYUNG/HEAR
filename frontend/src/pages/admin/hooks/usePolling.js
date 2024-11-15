// usePolling.js
import { useEffect, useCallback } from 'react';
import { fetchNotifications } from '../api/notificationApi';

export const usePolling = (setNotifications) => {
 const fetchData = useCallback(async () => {
   try {
     const notifications = await fetchNotifications();
     setNotifications(notifications);
   } catch (error) {
     console.error('Failed to fetch notifications:', error);
   }
 }, [setNotifications]);

 useEffect(() => {
   // 초기 fetch
   fetchData();

   // 5초마다 폴링
   const intervalId = setInterval(fetchData, 5000);

   return () => clearInterval(intervalId);
 }, [fetchData]);
};