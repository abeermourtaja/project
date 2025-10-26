import { Avatar,  Divider, Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { Outlet, useNavigate } from "react-router-dom";
import Logo from "../components/logo";
import { COLORS } from "../constants/colors";
import profile from "../assets/profile.png";
import {HomeOutlined,FileTextOutlined,SettingOutlined,PoweroffOutlined,YoutubeOutlined} from "@ant-design/icons";
import { useState } from "react";
function RootLayout() {
  const navigate = useNavigate();
  const [logoutVisible, setLogoutVisible] = useState(false);

  const handleLogout = () => {
    // 👉 Do your logout logic here (e.g., clear token, redirect)
    console.log("User logged out");
    setLogoutVisible(false);
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
          style={{
            backgroundColor: COLORS.secondary,
            borderRight: "none",
            fontFamily:"",
            fontSize:"",
            fontWeight: "bold",
            marginTop: "0",
          }}
          selectedKeys={["home"]}
        >
          <Menu.Item key="home" icon={<HomeOutlined />  }onClick={() => navigate('/home')}>
            Home
          </Menu.Item>
          <Menu.Item key="lectures" icon={<YoutubeOutlined />} onClick={() => navigate('/lectures')}>
            Lectures
          </Menu.Item>
          <Menu.Item key="assignments" icon={<FileTextOutlined />} onClick={() => navigate('/assignments')}>
            Assignments
          </Menu.Item>
          <Menu.Item key="settings" icon={<SettingOutlined />} onClick={() => navigate('/settings')}>
            Settings
          </Menu.Item>
          <Menu.Item key="signout" icon={<PoweroffOutlined />} onClick={() => setLogoutVisible(true)}>
            Sign out
          </Menu.Item>
        </Menu>
      </Sider>

      {/* --- Main content --- */}
      <Outlet></Outlet>
    </Layout>
  );
}

export default RootLayout;
