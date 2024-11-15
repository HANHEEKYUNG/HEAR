import axios from 'axios';

export const fetchLibrary = async (bookSeq, elId, isSummary = false) => {
  try {
    const response = await axios.get("/api/library", {
      params: {
        BOOK_SEQ: bookSeq,
        EL_ID: elId,
        isSummary: isSummary, // 요약 요청 여부를 추가
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching library:", error);
    throw error;
  }
};

export const fetchLibrarySave = async (userSeq, bookSeq, histDiv, time) => {
  try {

    const response = await axios.post("/api/library-save", { userSeq, bookSeq, histDiv, time } );
    console.log(response, "response");
    
   
    return response.data;
  } catch (error) {
    console.error("Error fetching librarySave:", error);
    throw error;
  }
};

export const highlight = async (startPoint, endPoint, userSeq, bookSeq, test) => {
  try {
    const response = await axios.post("/api/highlight", {startPoint,endPoint, userSeq, bookSeq, test})
    console.log(response, "응답하라 ");
    
  }catch (error){
    console.error("Error fetching highlight:", error);
    throw error;
  }
}

// getLastPosition 함수 추가
export const getLastPosition = async (bookSeq, userSeq) => {
  try {
    const response = await axios.get("/api/history/last-position", {
      params: {
        BOOK_SEQ: bookSeq,
        USER_SEQ: userSeq,
      },
    });
    return response.data.lastPosition; // 마지막 재생 위치 반환
  } catch (error) {
    console.error("Error fetching last position:", error);
    throw error;
  }
};