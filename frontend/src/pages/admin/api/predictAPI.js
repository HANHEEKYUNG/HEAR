// admin/api/predictAPI.js
import axios from "axios";

export const fetchResults = async () => {
  try {
    const response = await axios.get("/api/get_results");
    return response.data;
  } catch (error) {
    console.error("Error fetching results:", error);
    throw new Error("결과를 가져오는 중 오류가 발생했습니다.");
  }
};

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    await axios.post("/api/upload_csv", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("파일 업로드 중 오류가 발생했습니다.");
  }
};

export const addBookFromJson = async () => {
  try {
    const response = await axios.post("/api/add-book-from-json", {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding book from JSON:", error);
    throw new Error("json에서 데이터 적재 중 오류가 발생했습니다.");
  }
};

// 진행률 확인 API 호출 함수
export const pollingProgress = async () => {
  try {
    const response = await axios.get("/api/progress_status");
    return response.data.progress;
  } catch (error) {
    console.error("Error fetching progress:", error);
    throw new Error("진행률 조회 중 오류가 발생했습니다.");
  }
};

// 업로드 이력 가져오기 API 함수 추가
export const fetchUploadHistory = async () => {
  try {
    const response = await axios.get("/api/admin/upload-history");
    return response.data;
  } catch (error) {
    console.error("Error fetching upload history:", error);
    throw new Error("업로드 이력을 가져오는 중 오류가 발생했습니다.");
  }
};

// 공유마당 데이터 분류별 건수를 가져오는 API 함수 추가
export const fetchCategoryCounts = async () => {
  try {
    const response = await axios.get("/api/admin/category-counts");
    return response.data;
  } catch (error) {
    console.error("Error fetching category counts:", error);
    throw new Error("데이터 분류별 건수를 가져오는 중 오류가 발생했습니다.");
  }
};

// 공유 마당 업로드 이력 가져오는 API
export const fetchRecentUploads = async () => {
  try {
    const response = await axios.get('/api/admin/recent-uploads'); // 백엔드 엔드포인트 경로
    return response.data;
  } catch (error) {
    console.error('Error fetching recent uploads:', error);
    throw error;
  }
};