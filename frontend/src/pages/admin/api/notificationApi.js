import axios from 'axios';

// 관리자용 알림 데이터를 DB에서 가져오는 함수
export const fetchNotifications = async () => {
  try {
    const response = await axios.get('/api/notification/notifications');
    return response.data; // 알림 데이터를 반환
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return [];
  }
};

// 알림 데이터 읽음 처리
export const markNotificationAsRead = async (notiSeq) => {
  try {
    const response = await axios.put(`/api/notification/read/${notiSeq}`);
    return response.data;
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    throw error;
  }
};

// 모든 알림 읽음 처리
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await axios.put('/api/notification/read-all');
    return response.data;
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error);
    throw error;
  }
};