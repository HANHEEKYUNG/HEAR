import axios from "axios";

// 희망 도서 목록을 가져오는 API
export const fetchWishBooks = async (userSeq) => {
  try {
    const response = await axios.get(`/api/wishbooks`, { params: { userSeq } });
    return response.data;
  } catch (error) {
    console.error("Error fetching wish books:", error);
    throw error;
  }
};

// 희망 도서를 취소하는 API
export const cancelWishBook = async (wishBookId) => {
  try {
    const response = await axios.put(`/api/wishbooks/${wishBookId}/cancel`);
    return response.data;
  } catch (error) {
    console.error("Error cancelling wish book:", error);
    throw error;
  }
};

// 독서노트 데이터를 가져오는 API
export const fetchBookReports = async (userSeq) => {
  try {
    const response = await axios.get(`/api/bookreport`, { params: { userSeq } });
    return response.data;
  } catch (error) {
    console.error("독서노트를 가져오는 중 오류가 발생했습니다:", error);
    throw error;
  }
};

// 독서노트를 저장하는 API
export const submitBookReport = async (reportData) => {
  try {
    const response = await axios.post(`/api/bookreport`, reportData);
    return response.data;
  } catch (error) {
    console.error("독서노트를 저장하는 중 오류가 발생했습니다:", error);
    throw error;
  }
};

// STT API 호출 (음성 파일을 텍스트로 변환)
export const convertSpeechToText = async (audioFile) => {
  const formData = new FormData();
  formData.append('file', audioFile);
  
  try {
    const response = await axios.post(`/api/stt`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.text; // 백엔드에서 반환하는 텍스트 값
  } catch (error) {
    console.error("STT 변환 오류가 발생했습니다:", error);
    throw error;
  }
};

// 특정 독서노트 항목의 상세 정보를 가져오는 API
export const fetchBookReportById = async (reportId) => {
  try {
    const response = await axios.get(`/api/bookreport/${reportId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching book report detail:", error);
    throw error;
  }
};

// 기존 독서노트 수정 API
export const updateBookReport = async (reportId, reportData) => {
  try {
    const response = await axios.put(`/api/bookreport/${reportId}`, reportData);
    return response.data;
  } catch (error) {
    console.error("Error updating book report:", error);
    throw error;
  }
};

// 특정 독서노트 항목을 삭제하는 API
export const deleteBookReport = async (reportId) => {
  try {
    await axios.delete(`/api/bookreport/${reportId}`);
  } catch (error) {
    console.error("Error deleting book report:", error);
    throw error;
  }
};

export const fetchHistory = async (userSeq) => {
  try {
    const response = await axios.get("/api/historys", {
      params: { userSeq },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching history:", error);
    return []; // 에러 발생 시 빈 배열 반환
  }
};

// Highlight 데이터를 가져오는 API 함수
export const fetchHighlight = async (userSeq) => {
  try {
    const response = await axios.get("/api/highlights", {
      params: { userSeq },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching highlight:", error);
    return []; // 에러 발생 시 빈 배열 반환
  }
};

// 하이라이트 오디오 파일을 가져오는 API 함수
export const fetchHighlightAudio = async (highlightId) => {
  try {
    const response = await axios.get(`/api/highlight/audio/${highlightId}`, { responseType: "blob" });
    return URL.createObjectURL(response.data); // 오디오 파일 URL 생성
  } catch (error) {
    console.error("Error fetching highlight audio:", error);
    return null; // 에러 발생 시 null 반환
  }
};

// 코멘트 수정 API 함수
export const updateHighlightComment = async (highlightId, comment) => {
  try {
    const response = await axios.put(`/api/highlight/comment/${highlightId}`, { comment });
    return response.data;
  } catch (error) {
    console.error("Error updating highlight comment:", error);
    return null;
  }
};

// 특정 Highlight 삭제 API 함수
export const deleteHighlight = async (highlightId) => {
  try {
    const response = await axios.delete(`/api/highlight/${highlightId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting highlight:", error);
    return null;
  }
};