import { useState } from "react";
import { fetchSummary } from "../api/openaiAPI"; // API 호출 함수 불러오기

const useOpenAISummary = () => {
  const [isLoading, setIsLoading] = useState(false);

  const getSummary = async (text) => {
    setIsLoading(true);
    try {
      const summary = await fetchSummary(text);
      return summary;
    } catch (error) {
      console.error("Error generating summary:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { getSummary, isLoading };
};

export default useOpenAISummary;
