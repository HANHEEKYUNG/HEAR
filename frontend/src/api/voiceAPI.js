import axios from "axios";

// 사용자별 보이스 목록을 가져오는 함수
export const fetchVoiceList = async (userSeq) => {
  try {
    const response = await axios.post("/api/voices", { user_seq: userSeq });
    return response.data;
  } catch (error) {
    console.error("Error fetching voice list:", error);
    throw error;
  }
};

// 목소리 삭제 API 호출 함수
export const deleteVoice = async (voiceId) => {
  try {
    await axios.delete(`/api/voices/${voiceId}`);
  } catch (error) {
    console.error("Error deleting voice:", error);
    throw error;
  }
};

export const saveUserSettings = async (settings) => {
  try {
    const response = await axios.post("/api/voice/settings", settings);
    return response.data;
  } catch (error) {
    console.error("Error saving user settings:", error);
    throw error;
  }
};

// 녹음 파일 서버에 업로드하고, ElevenLabs에 추가
export const uploadAndAddVoice = async (formData) => {
  try {
    const response = await axios.post("/api/voice/upload-and-add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to upload and add voice:", error);
    throw error;
  }
};
