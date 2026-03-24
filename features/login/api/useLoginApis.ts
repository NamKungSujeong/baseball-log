import axios from "axios";

export async function loginUser(email: string, password: string) {
  return axios.post("/api/auth/login", { email, password });
}
