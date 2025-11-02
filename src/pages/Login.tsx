import { Row, Col, Form, Input, Button, Divider, message } from "antd";
import SignupImage from "../assets/signup.png";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";
import { COLORS } from "../constants/colors";
import { Link, useNavigate } from "react-router-dom";

// ✅ استيراد الدوال الجاهزة من ملف الـ API
import { loginUser, getUserProfile } from "../API/api";

function Login() {
  const login = useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ دالة تسجيل الدخول
  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      // 🔹 تسجيل الدخول باستخدام الـ API
      const data = await loginUser(values.email, values.password);
      const { access, refresh } = data;

      // 🔹 حفظ التوكنات في localStorage (نفس الأسماء المستخدمة في Lectures.tsx)
     localStorage.setItem("accessToken", access);
     localStorage.setItem("refreshToken", refresh);


      // 🔹 تحديث الحالة في store
      login(values.email, access);

      // 🔹 جلب بيانات المستخدم لتحديد الدور
      const user = await getUserProfile(access);

      // 🔹 حفظ بيانات المستخدم في localStorage حتى نستخدمها لاحقًا في المحاضرات
      localStorage.setItem("user", JSON.stringify(user));

      message.success("✅ Logged in successfully!");



      // ✅ التوجيه حسب الدور
      if (user.role === "student") {
        navigate("/home");
      } else if (user.role === "teacher") {
        navigate("/home");
      } else {
        message.warning("⚠️ Role not recognized, redirecting to home...");
        navigate("/home");
      }
    } catch (error: any) {
      console.error("❌ Error during login:", error);
      message.error(error.response?.data?.detail || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        margin: 0,
        padding: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Row gutter={0} style={{ flex: 1, width: "100%", margin: 0 }}>
        {/* القسم الأيسر - الصورة */}
        <Col
          xs={0}
          sm={0}
          md={12}
          style={{
            height: "100%",
            width: "100%",
            backgroundColor: COLORS.primary,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={SignupImage}
            alt="Login Illustration"
            style={{ maxWidth: "80%", height: "100%", objectFit: "contain" }}
          />
        </Col>

        {/* القسم الأيمن - الفورم */}
        <Col
          xs={24}
          sm={24}
          md={12}
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: COLORS.background,
            padding: "2rem",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 400,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <h2
              style={{
                color: "black",
                textAlign: "start",
                marginBottom: "2rem",
                fontWeight: 700,
                fontFamily: "Poppins",
                fontSize: "32px",
              }}
            >
              Login
            </h2>



            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Please enter your email!" }]}
              >
                <Input placeholder="Enter Your Email" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please enter your password!" }]}
              >
                <Input.Password placeholder="Enter Your Password" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  style={{
                    fontWeight: 700,
                    fontFamily: "Roboto",
                    fontSize: "16px",
                    backgroundColor: COLORS.primary,
                  }}
                >
                  Log in
                </Button>
                
              </Form.Item>
            </Form>
            <div style={{alignContent:"center", marginTop: "1rem"}}>
              <Link style={{color:"black"}} to="/signup">Don't have an account ? Signup</Link>
            </div>


            
           
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Login;

