import axios from "axios";

export const api = axios.create({
  baseURL: "https://d58b-160-20-35-124.ngrok-free.app",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});
