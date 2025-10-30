import React, { useState } from "react";
import { Button, Col, Form, Input, Row, message } from "antd";
import SignupImage from "../assets/signup.png";
import { COLORS } from "../constants/colors";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../API/api";
import { useUserStore } from "../store/useUserStore";

function Signup() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  const [showPasswordChecks, setShowPasswordChecks] = useState(false);
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
    const { username, email, password, phone } = values;
    const allOk = Object.values(checks).every(Boolean);

    if (!allOk) {
      setShowPasswordChecks(true);
      message.error("Password does not meet the security requirements.");
      return;
    }

    try {
      const result = await registerUser(username, email, password);
      setUser(result);

      message.success("🎉 Account created successfully! Redirecting to login...");
      form.resetFields();
      setTimeout(() => navigate("/login"), 2000);
    } catch (error: any) {
      console.error("❌ Error during signup:", error);
      const backendError = error.response?.data;

      if (backendError) {
        if (backendError.username) message.error(backendError.username[0]);
        else if (backendError.email) message.error(backendError.email[0]);
        else if (backendError.password) message.error(backendError.password[0]);
        else message.error("An error occurred during signup. Try again.");
      } else {
        message.error("Server connection failed. Check your internet.");
      }
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Row gutter={0} style={{ flex: 1, width: "100%" }}>
        {/* ✅ Left Image Section */}
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

        {/* ✅ Right Form Section */}
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
              onFinishFailed={() =>
                message.error("Please fill all fields correctly.")
              }
            >
              {/* 🟩 Name */}
              <Form.Item
                label="Name"
                name="username"
                rules={[{ required: true, message: "Please enter your Name!" }]}
              >
                <Input placeholder="Enter your Name" />
              </Form.Item>

              {/* 🟩 Email */}
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

              {/* 🟩 Phone Number */}
              <Form.Item
                label="Phone Number"
                name="phone"
                rules={[
                  { required: true, message: "Please enter your Phone Number!" },
                  {
                    pattern: /^[0-9]{9,15}$/,
                    message: "Please enter a valid phone number!",
                  },
                ]}
              >
                <Input placeholder="Enter your Phone Number" />
              </Form.Item>

              {/* 🟩 Password */}
              <Form.Item
  label="Password"
  name="password"
  hasFeedback
  rules={[
    {
      validator: (_, value) => {
        if (!value) {
          return Promise.reject("Please enter your Password!");
        }

        const isValid =
          value.length >= 8 &&
          /[A-Z]/.test(value) &&
          /[a-z]/.test(value) &&
          /[0-9]/.test(value) &&
          /[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]/.test(value);

        return isValid
          ? Promise.resolve()
          : Promise.reject("Password does not meet security requirements.");
      },
    },
  ]}
>
  <Input.Password
    placeholder="Enter your Password"
    onChange={(e) => {
      const value = e.target.value;
      setPasswordValue(value);

      // ✅ Show instructions only if password is invalid
      const invalid =
        !!value &&
        !(
          value.length >= 8 &&
          /[A-Z]/.test(value) &&
          /[a-z]/.test(value) &&
          /[0-9]/.test(value) &&
          /[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]/.test(value)
        );
      setShowPasswordChecks(invalid);
    }}
  />
</Form.Item>
              {/* 🟩 شروط كلمة المرور */}
              {showPasswordChecks && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 14, marginBottom: 6 }}>
                    Password must contain:
                  </div>
                  <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
                    <li style={{ color: checks.length ? "green" : "red" }}>
                      {checks.length ? "✅" : "❌"} At least 8 characters
                    </li>
                    <li style={{ color: checks.upper ? "green" : "red" }}>
                      {checks.upper ? "✅" : "❌"} One uppercase letter
                    </li>
                    <li style={{ color: checks.lower ? "green" : "red" }}>
                      {checks.lower ? "✅" : "❌"} One lowercase letter
                    </li>
                    <li style={{ color: checks.number ? "green" : "red" }}>
                      {checks.number ? "✅" : "❌"} One number
                    </li>
                    <li style={{ color: checks.special ? "green" : "red" }}>
                      {checks.special ? "✅" : "❌"} One special symbol
                    </li>
                  </ul>
                </div>
              )}


              {/* 🟩 Confirm Password */}
              <Form.Item
                label="Confirm Password"
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
                      return Promise.reject(
                        new Error("Passwords do not match ⚠️")
                      );
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

              {/* 🟩 روابط إضافية */}
              <div
                style={{
                  display: "flex",
                  justifyContent:"center",
                  fontSize: "14px",
                }}
              >
                <Link style={{color:"black"}} to="/login">Already have an account ? Login</Link>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Signup;
