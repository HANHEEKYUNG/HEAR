import axios from 'axios';

export const fetchBookRequests = async () => {
  try {
    const response = await axios.get('/api/admin/wishbooks');
    return response.data;
  } catch (error) {
    console.error('Error fetching wishbook data:', error);
    throw error;
  }
};

// 승인 또는 거절 API 호출 함수
export const updateBookRequestStatus = async (bookId, status, comment) => {
  try {
    const response = await axios.put(`/api/admin/wishbooks/${bookId}/status`, { status, comment });
    return response.data;
  } catch (error) {
    console.error('Error updating wishbook status:', error);
    throw error;
  }
};

// 도서 승인 이력 데이터 가져오기
export const fetchApprovalHistory = async () => {
  try {
    const response = await axios.get('/api/admin/book-approval-history');
    return response.data;
  } catch (error) {
    console.error('Error fetching approval history:', error);
    throw error;
  }
};