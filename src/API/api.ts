// 📁 src/api/api.ts
import axios from "axios";
import { ENDPOINTS } from "./endpoints"; // ✅ استيراد كل الروابط من مكان واحد

// ✅ تسجيل الدخول
export async function loginUser(email: string, password: string) {
  const response = await axios.post(ENDPOINTS.login, {
    email,
    password,
  });
  return response.data; // يحتوي على access و refresh tokens
}

// ✅ إنشاء حساب جديد (تسجيل مستخدم)
export async function registerUser(username: string, email: string, password: string) {
  try {
    const response = await axios.post(ENDPOINTS.register, {
      name: username, // ✳️ الباك يتوقعه بهذا الاسم
      email: email,
      password: password,
      password_confirm: password, // 🔹 بعض السيرفرات تتطلبه
    });

    console.log("✅ Backend response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("🔴 Backend error:", error.response?.data || error);
    throw error;
  }
}

// ✅ جلب بيانات المستخدم بعد تسجيل الدخول
export async function getUserProfile(token: string) {
  const response = await axios.get(ENDPOINTS.userProfile, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

// ✅ جلب المحاضرات
export async function getLectures(token: string) {
  const response = await axios.get(ENDPOINTS.lectures, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

// ✅ جلب الواجبات
export async function getAssignments(token: string) {
  const response = await axios.get(ENDPOINTS.assignments, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

// ✅ إضافة محاضرة جديدة (للمعلم فقط)
export async function addLecture(token: string, lectureData: any) {
  try {
    const response = await axios.post(
      "https://english-learning-app-backend-1-yrx3.onrender.com/api/v1/lectures/",
      lectureData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("✅ Lecture added successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("🔴 Error adding lecture:", error.response?.data || error);
    throw error;
  }
}
