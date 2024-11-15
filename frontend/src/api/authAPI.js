import axios from 'axios';

// 장애등록 코드 인증 API 호출 함수
export const verifyDisabilityCode = async (code) => {
  try {
    const response = await axios.post('/api/verify-disability-code', { code });
    return response.data; // 인증 결과 반환
  } catch (error) {
    console.error('장애등록 코드 인증 중 오류가 발생했습니다:', error);
    throw error;
  }
};
