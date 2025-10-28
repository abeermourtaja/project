import React, { useState } from "react";
import { Button, Col, Form, Input, Row, message } from "antd";
import SignupImage from "../assets/signup.png";
import { COLORS } from "../constants/colors";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../API/api"; // ✅ تأكدي إن المسار كله lowercase

function Signup() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [passwordValue, setPasswordValue] = useState("");

  // ✅ فحص الشروط
  const checks = {
    length: passwordValue.length >= 8,
    upper: /[A-Z]/.test(passwordValue),
    lower: /[a-z]/.test(passwordValue),
    number: /[0-9]/.test(passwordValue),
    special: /[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]/.test(passwordValue),
  };

  const onFinish = async (values: any) => {
    const allOk = Object.values(checks).every(Boolean);
    if (!allOk) {
      message.error("كلمة المرور لا تستوفي الشروط المطلوبة. الرجاء مراجعة القائمة.");
      return;
    }

    try {
      const { username, email, password } = values;
      const result = await registerUser(username, email, password);

      console.log("✅ Backend response:", result);

      // ✅ رسالة نجاح واضحة
      message.success("🎉 تم إنشاء الحساب بنجاح! سيتم تحويلك لتسجيل الدخول...");
      form.resetFields();

      // ⏳ تحويل بعد 1.5 ثانية
      setTimeout(() => navigate("/login"), 1500);

    } catch (error: any) {
      console.error("❌ Error during signup:", error);
      const backendError = error.response?.data;

      if (backendError) {
        if (backendError.username) {
          message.error(backendError.username[0]);
        } else if (backendError.email) {
          message.error(backendError.email[0]);
        } else if (backendError.password) {
          message.error(backendError.password[0]);
        } else if (backendError.password_confirm) {
          message.error(backendError.password_confirm[0]);
        } else {
          message.error("حدث خطأ أثناء إنشاء الحساب. حاول مرة أخرى.");
        }
      } else {
        message.error("تعذر الاتصال بالخادم. تأكد من الإنترنت أو حاول لاحقًا.");
      }
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
        {/* ✅ الصورة الجانبية */}
        <Col
          xs={0}
          sm={0}
          md={12}
          style={{
            height: "100%",
            backgroundColor: COLORS.primary,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={SignupImage}
            alt="Signup Illustration"
            style={{ maxWidth: "80%", height: "100%", objectFit: "contain" }}
          />
        </Col>

        {/* ✅ نموذج التسجيل */}
        <Col
          xs={24}
          sm={24}
          md={12}
          style={{
            height: "100%",
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
              Sign up
            </h2>

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              onFinishFailed={() => message.error("تأكدي من ملء جميع الحقول بشكل صحيح")}
            >
              {/* 🟩 الاسم */}
              <Form.Item
                label="Name"
                name="username"
                rules={[{ required: true, message: "Please enter your Name!" }]}
              >
                <Input placeholder="Enter your Name" />
              </Form.Item>

              {/* 🟩 البريد الإلكتروني */}
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter your Email!" },
                  { type: "email", message: "Please enter a valid Email!" },
                ]}
              >
                <Input placeholder="Enter your Email" />
              </Form.Item>

              {/* 🟩 كلمة المرور */}
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please enter your Password!" },
                  () => ({
                    validator(_, value) {
                      if (!value) return Promise.reject(new Error("Please enter your Password!"));
                      const pass = value as string;
                      const ok =
                        pass.length >= 8 &&
                        /[A-Z]/.test(pass) &&
                        /[a-z]/.test(pass) &&
                        /[0-9]/.test(pass) &&
                        /[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]/.test(pass);
                      return ok ? Promise.resolve() : Promise.reject(new Error("كلمة المرور لا تستوفي الشروط الأمنية"));
                    },
                  }),
                ]}
                hasFeedback
              >
                <Input.Password
                  placeholder="Enter your Password"
                  onChange={(e) => setPasswordValue(e.target.value)}
                />
              </Form.Item>

              {/* 🟩 الشروط */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 14, marginBottom: 6 }}>شروط كلمة المرور:</div>
                <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
                  <li style={{ color: checks.length ? "green" : "#666", marginBottom: 4 }}>
                    {checks.length ? "✅" : "⬜️"} على الأقل 8 أحرف
                  </li>
                  <li style={{ color: checks.number ? "green" : "#666", marginBottom: 4 }}>
                    {checks.number ? "✅" : "⬜️"} يحتوي على رقم واحد على الأقل
                  </li>
                  <li style={{ color: checks.upper ? "green" : "#666", marginBottom: 4 }}>
                    {checks.upper ? "✅" : "⬜️"} يحتوي على حرف كبير واحد على الأقل
                  </li>
                  <li style={{ color: checks.lower ? "green" : "#666", marginBottom: 4 }}>
                    {checks.lower ? "✅" : "⬜️"} يحتوي على حرف صغير واحد على الأقل
                  </li>
                  <li style={{ color: checks.special ? "green" : "#666", marginBottom: 4 }}>
                    {checks.special ? "✅" : "⬜️"} يحتوي على رمز خاص واحد على الأقل (مثل @ # $ !)
                  </li>
                </ul>
              </div>

              {/* 🟩 تأكيد كلمة المرور */}
              <Form.Item
                label="Confirm password"
                name="confirmPassword"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  { required: true, message: "Please confirm your Password!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("كلمتا المرور غير متطابقتين ⚠️"));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm your Password" />
              </Form.Item>

              {/* 🟩 زر التسجيل */}
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  style={{
                    fontWeight: 700,
                    fontFamily: "Roboto",
                    fontSize: "16px",
                    backgroundColor: COLORS.primary,
                  }}
                >
                  Sign up
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Signup;


