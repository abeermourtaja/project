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
// ✅ إضافة محاضرة جديدة (للمعلم فقط)
export async function addLecture(token: string, lectureData: any) {
  try {
    // 🧠 تجهيز البيانات لرفع ملف (FormData)
    const formData = new FormData();
    formData.append("title", lectureData.title);
    formData.append("description", lectureData.description);
    formData.append("video", lectureData.video);
    if (lectureData.file) {
      formData.append("file", lectureData.file); // 🔹 الملف اللي المعلم يختاره
    }

    const response = await axios.post(
      ENDPOINTS.lectures, // ✅ نستخدم الرابط من endpoints.ts
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // ✅ ضروري لرفع الملفات
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

