import axios from 'axios';

export const fetchNoticeWrite = async (postData) => {
    console.log("postData",postData);
    
  try {
    const response = await axios.post('/api/admin/noticeWrite', postData);
    console.log("response",response);
    return response.data;
  } catch (error) {
    console.error('Error fetching wishbook data:', error);
    throw error;
  }
};

// 최근 공지사항 가져오는 API
export const fetchRecentNotices = async () => {
  try {
      const response = await axios.get('/api/admin/recent-notices'); // 백엔드 엔드포인트 경로
      return response.data;
  } catch (error) {
      console.error('Error fetching recent notices:', error);
      throw error;
  }
};

// 공지사항 업데이트 API
export const updateNotice = async (updatedData) => {
  try {
    const response = await axios.put(`/api/admin/update-notice/${updatedData.noticeSeq}`, updatedData);
    console.log("response", response);
    return response.data;
  } catch (error) {
    console.error('Error updating notice:', error);
    throw error;
  }
};

// 공지사항 삭제 API
export const deleteNotice = async (noticeSeq) => {
  try {
      const response = await axios.delete(`/api/admin/delete-notice/${noticeSeq}`);
      console.log("response", response);
      return response.data;
  } catch (error) {
      console.error('Error deleting notice:', error);
      throw error;
  }
};