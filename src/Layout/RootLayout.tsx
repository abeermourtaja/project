import { Avatar, Divider, Layout, Menu, message } from "antd";
import Sider from "antd/es/layout/Sider";
import { Outlet, useNavigate } from "react-router-dom";
import Logo from "../components/logo";
import { COLORS } from "../constants/colors";
import profile from "../assets/profile.png";
import {
  HomeOutlined,
  FileTextOutlined,
  SettingOutlined,
  PoweroffOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";

function RootLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [logoutVisible, setLogoutVisible] = useState(false);

  // ✅ عند تحميل الصفحة نجلب بيانات المستخدم من localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate("/login"); // إذا ما في مستخدم، يرجعه لتسجيل الدخول
    }
  }, [navigate]);

  // ✅ تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    message.success("You have been logged out successfully!");
    navigate("/login");
  };

  // ✅ عرض البطاقة الخاصة بالطالب فقط
  const renderUserInfo = () => {
    if (!user) return null;

    if (user.role === "student") {
      return (
        <div style={{ textAlign: "center", marginBottom: 20, marginTop: 20 }}>
          <Avatar size={70} style={{ backgroundColor: "#F1F1F1" }}>
            <img src={user?.profile_image || profile}alt="profile"
            style={{
             width: "74%",
             borderRadius: "50%",
             objectFit: "cover",
  }}
/>

          </Avatar>
          <h3 style={{ margin: "10px 0 0" }}>{user.name}</h3>
          <p style={{ fontSize: 12, color: "#888" }}>{user.email}</p>
        </div>
      );
    } else if (user.role === "teacher") {
      return (
        <div
          style={{
            textAlign: "center",
            marginBottom: 20,
            marginTop: 30,
            color: "#fff",
          }}
        >
          <h2 style={{ fontWeight: "bold", fontSize: "20px" }}>
            👋 Welcome back,
          </h2>
          <h3 style={{ color: "#F5F5F5", marginTop: 8 }}>{user.name}</h3>
        </div>
      );
    }

    return null;
  };

  return (
    <Layout>
      {/* --- Sider --- */}
      <Sider
        width={220}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          backgroundColor: COLORS.secondary,
          height: "100vh",
          padding: "30px 5px",
          fontFamily: "Segoe UI, sans-serif",
          fontWeight: "600",
        }}
      >
        <Logo />
        {renderUserInfo()}
        <Divider />
        <Menu
          mode="inline"
          style={{
            backgroundColor: COLORS.secondary,
            borderRight: "none",
            fontWeight: "bold",
            marginTop: "0",
          }}
          defaultSelectedKeys={["home"]}
        >
          <Menu.Item
            key="home"
            icon={<HomeOutlined />}
            onClick={() => navigate("/home")}
          >
            Home
          </Menu.Item>
          <Menu.Item
            key="lectures"
            icon={<YoutubeOutlined />}
            onClick={() => navigate("/lectures")}
          >
            Lectures
          </Menu.Item>
          <Menu.Item
            key="assignments"
            icon={<FileTextOutlined />}
            onClick={() => navigate("/assignments")}
          >
            Assignments
          </Menu.Item>
          <Menu.Item
            key="settings"
            icon={<SettingOutlined />}
            onClick={() => navigate("/settings")}
          >
            Settings
          </Menu.Item>
          <Menu.Item
            key="signout"
            icon={<PoweroffOutlined />}
            onClick={handleLogout}
          >
            Sign out
          </Menu.Item>
        </Menu>
      </Sider>

      {/* --- Main content --- */}
      <Outlet />
    </Layout>
  );
}

export default RootLayout;
