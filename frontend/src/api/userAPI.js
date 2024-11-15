import axios from "axios";

export const checkUserId = async (userid) => {
  try {
    console.log("userid", userid);

    const response = await axios.post("/api/check-userid", { userid });
    return response.data.exists;
  } catch (error) {
    console.error("Error checking User ID:", error);
    throw error;
  }
};

export const joinSubmit = async (event, formData) => {
  // 기본 폼 제출 동작을 막기 위해 event.preventDefault() 호출
  event.preventDefault();

  try {
    // 서버로 formData를 비동기 요청으로 보냄
    const response = await axios.post("/api/join", formData);

    // 서버에서 받은 응답에서 메시지를 반환
    return response.data.message;
  } catch (error) {
    console.error("Error saving data:", error);
    throw error;
  }
};

export const UserLogin = async (userid, userpw) => {
  try {
      console.log('userid', userid);
      console.log('userpw', userpw);
      
      const response = await axios.post('/api/login', { userid, userpw });
      console.log('userLogin response', response);
      
      return response.data;
  } catch (error) {
      console.error('Error checking User ID:', error);
      throw error;
  }
};

export const checkNickName = async (nickname) => {
  try {
   

    const response = await axios.post("/api/check-nickname", { nickname });
    
    return response.data.exists;
  } catch (error) {
    console.error("Error checking User nickName:", error);
    throw error;
  }
};

export const userModify = async (formData) => {
  try {
    const response = await axios.post("/api/user-modify", {formData});
    console.log("formData", formData);
    return response.data; // 서버에서 success 여부를 반환하도록 기대
  } catch (error) {
    console.error("Error modifying user:", error);

    // 예외 처리를 위해 사용자에게 의미 있는 메시지 전달
    throw new Error("사용자 정보를 수정하는 중 오류가 발생했습니다. 다시 시도해주세요.");
  }
};
