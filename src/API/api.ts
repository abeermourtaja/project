// 📁 src/api/api.ts
import axios from "axios";
import { ENDPOINTS } from "./endpoints"; // ✅ استيراد كل الروابط من مكان واحد

// ✅ تسجيل الدخول
export async function loginUser(email: string, password: string) {
  const response = await axios.post(ENDPOINTS.login, {
    email,
    password,
  });
  return response.data; // فيه access و refresh tokens
}

// ✅ إنشاء حساب جديد (تسجيل مستخدم)
export async function registerUser(username: string, email: string, password: string) {
  try {
    const response = await axios.post(ENDPOINTS.register, {
      name: username, // ✳️ الاسم المطلوب من الـ backend
      email: email,
      password: password,
      password_confirm: password, // 🔹 إذا السيرفر يتطلب تأكيد كلمة المرور
    });

    console.log("✅ Backend response:", response.data);
    return response.data;
  }   catch (error: any) {
    console.error("🔴 Backend error (detailed):", JSON.stringify(error.response?.data, null, 2));
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

// ✅ جلب المحاضرات (مثال للربط القادم)
export async function getLectures(token: string) {
  const response = await axios.get(ENDPOINTS.lectures, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

// ✅ جلب الواجبات (مثال ثاني)
export async function getAssignments(token: string) {
  const response = await axios.get(ENDPOINTS.assignments, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}