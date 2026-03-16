import axios from "axios";
import { ApiError } from "./errors";

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

/** 요청 인터셉터 — Authorization 토큰 주입 */
http.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

/** 응답 인터셉터 — ApiError로 정규화 */
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      throw new ApiError(
        status,
        data?.code ?? "UNKNOWN",
        data?.message ?? error.message
      );
    }
    throw error;
  }
);

export default http;
