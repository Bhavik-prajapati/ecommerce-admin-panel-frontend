import axios from "axios";

const sentimentApi = axios.create({
  baseURL: "http://127.0.0.1:8000/sentiment", // FastAPI backend
});

export default sentimentApi;
