// admin/api/UserAPI.js
import axios from "axios";

// 일별 회원가입 건수를 가져오는 API 함수
export const fetchDailySignUpCounts = async () => {
  try {
    const response = await axios.get("/api/admin/daily-signups");
    return response.data;
  } catch (error) {
    console.error("Error fetching daily sign-up counts:", error);
    throw new Error("일별 회원가입 건수를 가져오는 중 오류가 발생했습니다.");
  }
};

// 유저 독서량 순위를 가져오는 API 함수
export const fetchUserReadingRank = async () => {
  try {
    const response = await axios.get("/api/admin/user-reading-rank");
    return response.data;
  } catch (error) {
    console.error("Error fetching user reading ranks:", error);
    throw new Error("유저 독서량 순위를 가져오는 중 오류가 발생했습니다.");
  }
};