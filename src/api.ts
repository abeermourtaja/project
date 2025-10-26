import axios from "axios";
import { API_BASE_URL } from "./config";

// ✅ تسجيل الدخول
export async function loginUser(username: string, password: string) {
  const response = await axios.post(`${API_BASE_URL}/api/token/`, {
    username,
    password,
  });
  return response.data; // فيه access و refresh tokens
}

// ✅ مثال: جلب بيانات المستخدم بعد تسجيل الدخول
export async function getUserProfile(token: string) {
  const response = await axios.get(`${API_BASE_URL}/api/user/profile/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
