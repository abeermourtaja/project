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
export async function deleteLecture(token: string, id: number) {
  try {
    const response = await axios.delete(`${ENDPOINTS.lectures}${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error deleting lecture:", error.response?.data || error);
    throw error;
  }
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

// ✅ إضافة واجب جديد (للمعلم فقط)
export async function addAssignment(token: string, assignmentData: any) {
  try {
    const formData = new FormData();
    formData.append("title", assignmentData.title);
    formData.append("description", assignmentData.description);
    formData.append("due_date", assignmentData.due_date); // YYYY-MM-DD
    formData.append("lecture", assignmentData.lecture.toString()); // رقم
    formData.append("created_by", assignmentData.created_by.toString());

    if (assignmentData.file) {
      formData.append("file", assignmentData.file);
    }

    const response = await axios.post(ENDPOINTS.assignments, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("✅ Assignment added successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("🔴 Error adding assignment:", error.response?.data || error);
    throw error;
  }
}
export async function addSubmission(
  token: string,
  submissionData: { assignment: number; file_url: string; grade?: number | null }
) {
  try {
    const response = await axios.post(ENDPOINTS.submissions, submissionData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("✅ Submission added successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("🔴 Error adding submission:", error.response?.data || error);
    throw error;
  }
}
export async function getSubmissions(token: string) {
  const res = await axios.get(ENDPOINTS.submissions, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function getSubmissionsForAssignment(token: string, assignmentId: number) {
  const res = await axios.get(`${ENDPOINTS.submissions}?assignment=${assignmentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// Update and delete helpers for assignments and lectures
export async function updateAssignment(token: string, assignmentId: number, data: any) {
  const res = await axios.patch(`${ENDPOINTS.assignments}${assignmentId}/`, data, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  return res.data;
}

export async function deleteAssignment(token: string, assignmentId: number) {
  const res = await axios.delete(`${ENDPOINTS.assignments}${assignmentId}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function updateLecture(token: string, lectureId: number, data: any) {
  // If data contains file (File), send as multipart/form-data
  if (data instanceof FormData) {
    const res = await axios.patch(`${ENDPOINTS.lectures}${lectureId}/`, data, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    });
    return res.data;
  }

  const res = await axios.patch(`${ENDPOINTS.lectures}${lectureId}/`, data, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  return res.data;
}



export async function gradeSubmission(token: string, submissionId: number, grade: number) {
  const res = await axios.patch(`${ENDPOINTS.submissions}${submissionId}/`, { grade }, {
    headers: {
      Authorization: `Bearer ${token}` ,
      "Content-Type": "application/json",
    },
  });
  return res.data;
}

// ✅ تحديث بيانات المستخدم
export async function updateUserProfile(token: string, userData: { name?: string; email?: string; phone?: string }) {
  const response = await axios.post(ENDPOINTS.userProfile, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

// ✅ حذف حساب المستخدم
export async function deleteUserAccount(token: string) {
  const response = await axios.delete(ENDPOINTS.deleteUser, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
