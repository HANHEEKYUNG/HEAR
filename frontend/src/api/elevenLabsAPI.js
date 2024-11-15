import axios from 'axios';

export const generateTTSFile = async (voiceId, text, bookSeq, isSummary = false) => {
  console.log('voiceId', voiceId);
  console.log('isSummary', isSummary); // 요약 여부 출력
  
  try {
    const response = await axios.post("/api/tts/generate", {
      voiceId,
      text,
      bookSeq,  // 책 ID
      is_summary: isSummary // 요약 요청 여부 추가
    });
    return response.data; // 백엔드가 반환하는 파일 URL 등 데이터를 그대로 반환
  } catch (error) {
    console.error("Error generating TTS file:", error);
    throw error;
  }
};
