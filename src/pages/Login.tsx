import { Row, Col, Form, Input, Button, Divider, message } from 'antd';
import SignupImage from '../assets/signup.png';
import { FaFacebook } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { useAuthStore } from '../store/useAuthStore';
import { useState } from 'react';
import axios from 'axios';
import { COLORS } from '../constants/colors';

function Login() {
  const login = useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      const response = await axios.post(
        "https://english-learning-app-backend-1-yrx3.onrender.com/api/token/",
        {
          email: values.email,
          password: values.password,
        }
      );

      const { access, refresh } = response.data;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      login(values.email, access);

      const userResponse = await axios.get(
        "https://english-learning-app-backend-1-yrx3.onrender.com/api/v1/users/me/",
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );

      const user = userResponse.data;

      message.success("Logged in successfully!");

      if (user.role === "student") {
        window.location.href = "/student/dashboard";
      } else if (user.role === "teacher") {
        window.location.href = "/teacher/dashboard";
      } else {
        message.error("Unknown role");
      }
    } catch (error: any) {
      console.error(error);
      message.error(error.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        margin: 0,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Row gutter={0} style={{ flex: 1, width: '100%', margin: 0 }}>
        <Col
          xs={0}
          sm={0}
          md={12}
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: COLORS.primary,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img
            src={SignupImage}
            alt="Login Illustration"
            style={{ maxWidth: '80%', height: '100%', objectFit: 'contain' }}
          />
        </Col>

        <Col
          xs={24}
          sm={24}
          md={12}
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: COLORS.background,
            padding: '2rem',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 400,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <h2
              style={{
                color: 'black',
                textAlign: 'start',
                marginBottom: '2rem',
                fontWeight: 700,
                fontFamily: 'Poppins',
                fontSize: '32',
              }}
            >
              Login
            </h2>

            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Email"
                name="email"
                style={{ fontFamily: 'Inter' }}
                rules={[{ required: true, message: 'Please enter your email!' }]}
              >
                <Input placeholder="Enter Your Email" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                style={{ fontFamily: 'Inter' }}
                rules={[{ required: true, message: 'Please enter your password!' }]}
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
                    fontFamily: 'Roboto',
                    fontSize: '16',
                    backgroundColor: COLORS.primary,
                  }}
                >
                  Log in
                </Button>
                <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
                  <a
                    href="/forget-password"
                    style={{
                      fontSize: '13px',
                      textDecoration: 'underline',
                      color: '#2E2E2E',
                    }}
                  >
                    Forget password?
                  </a>
                </div>
              </Form.Item>
            </Form>

            <Divider>Or</Divider>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <Button
                icon={<FcGoogle size={20} />}
                shape="circle"
                style={{ fontSize: '20px', padding: '8px' }}
              />
              <Button
                icon={<FaFacebook size={20} color="white" />}
                shape="circle"
                style={{
                  backgroundColor: '#3b5998',
                  borderColor: '#3b5998',
                  padding: '8px',
                }}
              />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Login;
