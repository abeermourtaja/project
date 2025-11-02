import {
  Badge,
  Card,
  Col,
  Input,
  Layout,
  Row,
  Space,
  Typography,
  Spin,
  message,
  Statistic,
} from "antd";
import {
  FileTextOutlined,
  SearchOutlined,
  BellFilled,
  VideoCameraOutlined,
  CalendarOutlined,
  UserOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import lecture from "../assets/lecture.png";
import { Content } from "antd/es/layout/layout";
import { COLORS } from "../constants/colors";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import NotificationsDrawer from "./Notifications";

const { Title, Text } = Typography;

function Home() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>({
    totalStudents: 0,
    totalAssignments: 0,
    totalLectures: 0,
    totalMarks: 0,
    unsubmittedStudents: 0,
    remainingAssignments: 0,
  });
  const [paddingTop, setPaddingTop] = useState<number>(30);

  // ✅ تحميل بيانات المستخدم
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  // ✅ جلب التعميمات (للجميع)
  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(
        "https://english-learning-app-backend-1-yrx3.onrender.com/api/v1/notifications/",
        {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        }
      );
      if (res.data?.results) setAnnouncements(res.data.results);
      else if (Array.isArray(res.data)) setAnnouncements(res.data);
      else setAnnouncements([]);
    } catch (error) {
      console.error(error);
      message.error("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  // ✅ جلب بيانات المعلم الأكاديمية
  const fetchTeacherStats = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const headers = { Authorization: `Bearer ${token}` };

      const [studentsRes, assignmentsRes, lecturesRes, submissionsRes] = await Promise.all([
        axios.get("https://english-learning-app-backend-1-yrx3.onrender.com/api/v1/users/", { headers }),
        axios.get("https://english-learning-app-backend-1-yrx3.onrender.com/api/v1/assignments/", { headers }),
        axios.get("https://english-learning-app-backend-1-yrx3.onrender.com/api/v1/lectures/", { headers }),
        axios.get("https://english-learning-app-backend-1-yrx3.onrender.com/api/v1/submissions/", { headers }),
      ]);

      const students = studentsRes.data?.results?.filter(
        (u: any) => u.role === "student"
      ) || [];

      // حساب عدد الطلاب الذين لم يسلموا أي واجب
      const unsubmitted = students.filter((student: any) => {
        const studentSubs = submissionsRes.data.results?.filter(
          (s: any) => s.student === student.id && s.is_submitted
        );
        return !studentSubs?.length;
      }).length;

      setStats({
        totalStudents: students.length,
        totalAssignments: assignmentsRes.data?.count || assignmentsRes.data?.length || 0,
        totalLectures: lecturesRes.data?.count || lecturesRes.data?.length || 0,
        unsubmittedStudents: unsubmitted,
      });
    } catch (err) {
      console.error(err);
      message.error("Error loading academic data");
    }
  };

  // ✅ جلب بيانات الطالب
  const fetchStudentStats = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const headers = { Authorization: `Bearer ${token}` };

      const [assignmentsRes, submissionsRes] = await Promise.all([
        axios.get("https://english-learning-app-backend-1-yrx3.onrender.com/api/v1/assignments/", { headers }),
        axios.get("https://english-learning-app-backend-1-yrx3.onrender.com/api/v1/submissions/", { headers }),
      ]);

      const assignments = assignmentsRes.data?.results || assignmentsRes.data;
      const submissions = submissionsRes.data?.results || submissionsRes.data;

      const remainingAssignments = assignments.length - submissions.filter((s: any) => s.is_submitted).length;
      const totalMarks = submissions.reduce((sum: number, s: any) => sum + (s.grade || 0), 0);

      setStats({
        totalMarks,
        remainingAssignments,
      });
    } catch (err) {
      console.error(err);
      message.error("Error loading student stats");
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    if (user?.role === "teacher") fetchTeacherStats();
    else if (user?.role === "student") fetchStudentStats();
  }, [user]);

  return (
    <Layout
      style={{
        backgroundColor: COLORS.background,
        marginLeft: 220,
        padding: `${paddingTop}px 30px 30px 30px`,
        width: "100%",
        transition: 'padding-top 0.3s ease',
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
            <NotificationsDrawer
              open={open}
              onClose={() => {
                setOpen(false);
                setPaddingTop(30);
              }}
              setOpen={(isOpen) => {
                setOpen(isOpen);
                if (isOpen) setPaddingTop(80);
              }}
            />
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
                Hi, {user?.name || "User"}
              </Title>
              <Text style={{ fontSize: 16 }}>
                {user?.role === "teacher"
                  ? "Welcome back, teacher! Here’s your academic overview."
                  : "Welcome to your course! Stay focused and keep going until the end."}
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

        {/* ✅ قسم التعميمات */}
        <div
          style={{
            marginTop: 10,
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

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", margin: "40px 0" }}>
              <Spin size="large" />
            </div>
          ) : announcements.length === 0 ? (
            <Text type="secondary">No announcements yet!</Text>
          ) : (
            <Space direction="vertical" size="large" style={{ fontSize: "17px" }}>
              {announcements.slice(0, 3).map((item) => (
                <Text key={item.id}>
                  {item.title.toLowerCase().includes("assignment") ? (
                    <FileTextOutlined style={{ marginRight: 8, color: "#000" }} />
                  ) : item.title.toLowerCase().includes("exam") ? (
                    <CalendarOutlined style={{ marginRight: 8, color: "#e74c3c" }} />
                  ) : (
                    <VideoCameraOutlined style={{ marginRight: 8, color: "#000" }} />
                  )}
                  <b>{item.title}:</b> {item.body}
                </Text>
              ))}
            </Space>
          )}
        </div>

        {/* 🧩 بيانات المعلم */}
        {user?.role === "teacher" && (
          <div
            style={{
              marginTop: 20,
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: "25px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            }}
          >
            <Title level={4}>Academic Data</Title>
            <Row gutter={16}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Total Assignments"
                    value={stats.totalAssignments}
                    prefix={<FileTextOutlined />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Unsubmitted Students"
                    value={stats.unsubmittedStudents}
                    prefix={<EyeOutlined />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Total Lectures"
                    value={stats.totalLectures}
                    prefix={<VideoCameraOutlined />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Total Students"
                    value={stats.totalStudents}
                    prefix={<UserOutlined />}
                  />
                </Card>
              </Col>
            </Row>
          </div>
        )}

        {/* 🧩 بيانات الطالب */}
        {user?.role === "student" && (
          <div
            style={{
              marginTop: 20,
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: "25px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            }}
          >
            <Title level={4}>Academic Data</Title>
            <Row gutter={16}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Student Status"
                    value="Committed"
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Total Marks"
                    value={stats.totalMarks}
                    prefix={<FileTextOutlined />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Remaining Assignments"
                    value={stats.remainingAssignments}
                    prefix={<CalendarOutlined />}
                  />
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Content>
    </Layout>
  );
}