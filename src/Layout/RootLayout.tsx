import { Avatar, Divider, Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
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
import { useState } from "react";
import LogoutModal from "../pages/logout"; // if your modal file is here

function RootLayout() {
  const navigate = useNavigate();
  const location = useLocation(); // 👈 get current route
  const [logoutVisible, setLogoutVisible] = useState(false);

  // Determine which menu item should be active based on the URL
  const selectedKey = location.pathname.split("/")[1] || "home";

  const handleLogout = () => {
    console.log("User logged out");
    setLogoutVisible(false);
    navigate("/login");
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
        <div style={{ textAlign: "center", marginBottom: 20, marginTop: 20 }}>
          <Avatar size={70} style={{ backgroundColor: "#F1F1F1" }}>
            <img src={profile} alt="profile" style={{ width: "74%" }} />
          </Avatar>
          <h3 style={{ margin: "10px 0 0" }}>Sara</h3>
          <p style={{ fontSize: 12, color: "#888" }}>Sara.Mo@gmail.com</p>
        </div>
        <Divider />
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]} // 👈 dynamic highlight
          style={{
            backgroundColor: COLORS.secondary,
            borderRight: "none",
            fontWeight: "bold",
          }}
          onClick={(e) => {
            const { key } = e;
            if (key === "signout") {
              setLogoutVisible(true);
            } else {
              navigate(`/${key}`);
            }
          }}
        >
          <Menu.Item key="home" icon={<HomeOutlined />}>
            Home
          </Menu.Item>
          <Menu.Item key="lectures" icon={<YoutubeOutlined />}>
            Lectures
          </Menu.Item>
          <Menu.Item key="assignments" icon={<FileTextOutlined />}>
            Assignments
          </Menu.Item>
          <Menu.Item key="settings" icon={<SettingOutlined />}>
            Settings
          </Menu.Item>
          <Menu.Item key="signout" icon={<PoweroffOutlined />}>
            Sign out
          </Menu.Item>
        </Menu>
      </Sider>

      {/* --- Main content --- */}
      <Outlet />

      {/* --- Logout Modal --- */}
      <LogoutModal
        visible={logoutVisible}
        onCancel={() => setLogoutVisible(false)}
        onConfirm={handleLogout}
      />
    </Layout>
  );
}

export default RootLayout;
