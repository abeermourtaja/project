import { Badge, Card, Col, Input, Layout, Row, Space, Typography } from "antd";
import {
  FileTextOutlined,
  SearchOutlined,
  BellFilled,
  VideoCameraOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import lecture from "../assets/lecture.png";
import { Content } from "antd/es/layout/layout";
import { COLORS } from "../constants/colors";
import { useNavigate } from "react-router-dom";
import NotificationsDrawer from "./Notifications";
import { useEffect, useState } from "react";

function Home() {
  const { Title, Text } = Typography;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // ✅ تحميل بيانات المستخدم من localStorage عند فتح الصفحة
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <Layout
      style={{
        backgroundColor: COLORS.background,
        marginLeft: 220,
        padding: "30px",
        width: "100%",
      }}
    >
      <Content style={{ width: "100%" }}>
        {/* Page Title */}
        <Title
          level={3}
          style={{
            fontSize: "27px",
            fontFamily: "Segoe UI, sans-serif",
            fontWeight: 700,
            color: "#21629B",
            margin: 0,
          }}
        >
          Home
        </Title>

        {/* Search + Notification */}
        <Row align="middle">
          <Input
            placeholder="Search"
            prefix={<SearchOutlined />}
            allowClear
            style={{
              width: "1000px",
              backgroundColor: "#EDEDED",
              height: "40px",
              borderRadius: "12px",
            }}
          />
          <div
            style={{
              width: 56,
              height: 56,
              backgroundColor: "#fff",
              borderRadius: 4,
              marginLeft: 16,
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Badge count={1} size="small" style={{ backgroundColor: "#9AB7D0" }}>
              <>
                <BellFilled
                  style={{
                    fontSize: 22,
                    color: "#000",
                    cursor: "pointer",
                  }}
                  onClick={() => setOpen(true)} // ✅ FIXED
                />
                <NotificationsDrawer open={open} onClose={() => setOpen(false)} />
              </>
            </Badge>
          </div>
        </Row>

        {/* Welcome Card */}
        <Card
          style={{
            borderRadius: 12,
            backgroundColor: "#9AB7D0",
            padding: 20,
            marginBottom: 30,
            marginTop: 17,
            height: "181px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Row align="middle" justify="space-between">
            <Col span={16}>
              <Title level={3} style={{ margin: 0 }}>
                Hi, {user?.name || "Student"}
              </Title>
              <Text style={{ fontSize: 16 }}>
                Welcome to your course! Stay focused and keep going until the end.
              </Text>
            </Col>
            <Col span={8}>
              <img
                src={lecture}
                alt="student illustration"
                style={{ width: "100%", maxWidth: 400 }}
              />
            </Col>
          </Row>
        </Card>

        {/* Announcements */}
        <div
          style={{
            marginTop: 40,
            marginBottom: 40,
            padding: "20px 25px",
            backgroundColor: "#f7f9fb",
            borderRadius: 12,
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          }}
        >
          <Title
            level={4}
            style={{
              fontWeight: "bold",
              fontSize: "22px",
              marginBottom: 20,
              color: "#21629B",
            }}
          >
            Announcements:
          </Title>
          <Space direction="vertical" size="large" style={{ fontSize: "17px" }}>
            <Text>
              <FileTextOutlined style={{ marginRight: 8, color: "#000" }} />
              <b>New Assignment:</b> Assignment Lab 1 has been uploaded.
            </Text>
            <Text>
              <CalendarOutlined style={{ marginRight: 8, color: "#e74c3c" }} />
              <b>Upcoming Exam:</b> Exam lab 1 is scheduled for Monday.
            </Text>
            <Text>
              <VideoCameraOutlined style={{ marginRight: 8, color: "#000" }} />
              <b>New Lecture:</b> Lecturer lab 2 has been uploaded.
            </Text>
          </Space>
        </div>
      </Content>
    </Layout>
  );
}

export default Home;
