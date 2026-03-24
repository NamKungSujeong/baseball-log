import axios from "axios";

const API_SERVER_URL =
  process.env.NEXT_PUBLIC_API_SERVER_URL ?? "http://localhost:8080";

const client = axios.create({
  baseURL: API_SERVER_URL,
  headers: { "Content-Type": "application/json" },
});

export async function apiFetch(path: string, options?: RequestInit) {
  try {
    const method = (options?.method ?? "GET").toLowerCase();
    const data = options?.body ? JSON.parse(options.body as string) : undefined;
    const response = await client.request({ url: path, method, data });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Request failed");
    }
    throw error;
  }
}
