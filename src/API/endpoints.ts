// 📁 src/api/endpoints.ts

export const API_BASE_URL = "https://english-learning-app-backend-1-yrx3.onrender.com/api/v1";

export const ENDPOINTS = {
  register: `${API_BASE_URL}/users/`,
  login: `${API_BASE_URL.replace("/api/v1", "")}/api/token/`, // 🔹 خاص بتسجيل الدخول
  userProfile: `${API_BASE_URL}/users/me/`,
  lectures: `${API_BASE_URL}/lectures/`,
  assignments: `${API_BASE_URL}/assignments/`,
  changePassword: `${API_BASE_URL}/users/change_password/`,
  submissions: `${API_BASE_URL}/submissions/`,
  deleteUser: `${API_BASE_URL}/users/me/delete_profile/`,
  updateProfile: `${API_BASE_URL}/users/update_profile/`,
  notifications: `${API_BASE_URL}/notifications/`,
};
