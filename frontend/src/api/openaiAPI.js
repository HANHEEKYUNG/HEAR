import axios from "axios";

export const fetchSummary = async (text) => {
  try {
    const response = await axios.post("/api/summarize", { text });
    return response.data.summary;
  } catch (error) {
    console.error("Error generating summary:", error);
    throw error;
  }
};
