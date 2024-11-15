import axios from 'axios';

export const fetchNotices = async () => {
  try {
    const response = await axios.get("/api/notices");
    return response.data;
  } catch (error) {
    console.error("Error fetching notices:", error);
    throw error;
  }
};

// 특정 공지사항 항목의 상세 정보를 가져오는 API
export const fetchNoticeDetail = async (notice_seq) => {
  try {
    const response = await axios.get(`/api/noticeDetail?notice_seq=${notice_seq}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching book report detail:", error);
    throw error;
  }
};


export const fetchSuggests = async () => {
  try {
    const response = await axios.get("/api/suggests");
    return response.data;
  } catch (error) {
    console.error("Error fetching suggests:", error);
    throw error;
  }
};

export const writeSubmit = async (postData) => {
  // 기본 폼 제출 동작을 막기 위해 event.preventDefault() 호출

  try {
    // 서버로 formData를 비동기 요청으로 보냄
    const response = await axios.post("/api/write", postData);

    // 서버에서 받은 응답에서 메시지를 반환
    return response.data.message;
  } catch (error) {
    console.error("Error saving data:", error);
    throw error;
  }
};

export const fetchWishbook = async(event, wishbook) => {
  event.preventDefault();
  console.log("wishbook",wishbook);
  
  try {
    // 서버로 formData를 비동기 요청으로 보냄
    const response = await axios.put("/api/wishbook", wishbook);

    // 서버에서 받은 응답에서 메시지를 반환
    return response.data.message;
  } catch (error) {
    console.error("Error saving data:", error);
    throw error;
  }
}

// 특정 독서노트 항목의 상세 정보를 가져오는 API
export const fetchSuggestDetail = async (notice_seq) => {
  try {
    const response = await axios.get(`/api/suggestDetail?notice_seq=${notice_seq}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching book report detail:", error);
    throw error;
  }
};

export const fetchSuggestDelete = async (notice_seq) => {
  try {
    const response = await axios.get(`/api/suggestDelete?notice_seq=${notice_seq}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching book report detail:", error);
    throw error;
  }
};

export const fetchSuggestModify = async (postData, notice_seq) => {
  try {
    const response = await axios.post(`/api/suggestModify?notice_seq=${notice_seq}`, postData, notice_seq);
    return response.data;
  } catch (error) {
    console.error("Error fetching book report detail:", error);
    throw error;
  }
};
