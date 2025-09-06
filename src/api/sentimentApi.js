import axios from "axios";

const sentimentApi = axios.create({
  baseURL: "http://127.0.0.1:8000", // FastAPI backend
});

// export const analyzeReview = async (text) => {
//   const response = await sentimentApi.post("/analyze", { text });
//   return response.data; 
// };
