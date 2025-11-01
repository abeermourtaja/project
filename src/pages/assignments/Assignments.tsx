import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Input,
  Button,
  Typography,
  Space,
  Layout,
  message,
  Spin,
} from "antd";
import {
  SearchOutlined,
  FilePdfOutlined,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { COLORS } from "../../constants/colors";
import { Content } from "antd/es/layout/layout";
import { useNavigate } from "react-router-dom";
import AddSubmissionModal from "./AddSubmissionModal";
import { getAssignments, getSubmissions } from "../../API/api";
import dayjs from "dayjs";

const { Title, Text } = Typography;

function Assignments() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [submissionStatus, setSubmissionStatus] = useState<
    Record<number, { has_submitted: boolean; file?: string | null }>
  >({});

  // ✅ Fetch Assignments + Submission Status
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      message.error("Please log in first.");
      navigate("/login");
      return;
    }

    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserRole(user.role);
    }

    const loadData = async () => {
      try {
        const [assignmentsData, submissionsData] = await Promise.all([
          getAssignments(token),
          getSubmissions(token),
        ]);

        const assignmentList = Array.isArray(assignmentsData) ? assignmentsData : assignmentsData.results || [];
        const submissionList = Array.isArray(submissionsData) ? submissionsData : submissionsData.results || [];

        // Get current user ID
        const userData = localStorage.getItem("user");
        const userId = userData ? JSON.parse(userData).id : null;

        // Map submissions to assignments for the current user
        const assignmentsWithSubmissions = assignmentList.map((assignment: any) => {
          const userSubmission = submissionList.find(
            (sub: any) => sub.assignment?.id === assignment.id && sub.student?.id === userId
          );

          return {
            ...assignment,
            has_submitted: !!userSubmission,
            file_url: userSubmission?.file_url || userSubmission?.file?.url || null,
            grade: userSubmission?.grade || null,
          };
        });

        setAssignments(assignmentsWithSubmissions);
        setFilteredAssignments(assignmentsWithSubmissions);
      } catch (err) {
        message.error("Failed to load assignments");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  // ✅ Search Function
  useEffect(() => {
    const filtered = assignments.filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAssignments(filtered);
  }, [assignments, searchTerm]);

  // ✅ Update status after submission
  const handleSubmissionSuccess = (assignmentId: number, fileUrl: string) => {
    setSubmissionStatus((prev) => ({
      ...prev,
      [assignmentId]: { has_submitted: true, file: fileUrl },
    }));
  };

  // Convert various Google Drive sharing links to a previewable URL.
  const getPreviewUrl = (url?: string) => {
    if (!url) return "";
    try {
      // Match /d/FILE_ID/ style
      const dMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (dMatch && dMatch[1]) return `https://drive.google.com/file/d/${dMatch[1]}/preview`;

      // Match ?id=FILE_ID style
      const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (idMatch && idMatch[1]) return `https://drive.google.com/file/d/${idMatch[1]}/preview`;

      // If it's already a preview/download link or any other URL, return as-is
      return url;
    } catch (e) {
      return url;
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "5rem" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout
      style={{
        backgroundColor: COLORS.background,
        marginLeft: 220,
        width: "100%",
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 220,
          right: 0,
          zIndex: 100,
          backgroundColor: COLORS.background,
          padding: "20px 50px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <Row>
          <Col>
            <Title level={3} style={{ color: "#21629B", fontWeight: 700, margin: 0 }}>
              Assignments
            </Title>
          </Col>
        </Row>

        <Row align="middle" gutter={15}>
          <Col>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search for your Assignments"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: 800,
                height: 40,
                backgroundColor: "#EDEDED",
                borderRadius: 10,
              }}
            />
          </Col>
        </Row>
      </div>

      {/* Content */}
      <Content
        style={{
          width: "100%",
          padding: "140px 50px 50px 50px",
          transition: "padding-top 0.3s ease",
        }}
      >
        <Space direction="vertical" style={{ width: 1000 }} size="middle">
          {filteredAssignments.map((item) => {
            const hasSubmitted = item?.has_submitted;
            const fileUrl = item?.file_url;
            const grade = item?.grade;
            return (
              <Card
                key={item.id}
                style={{
                  borderRadius: 10,
                  backgroundColor: "#F5F5F5",
                  position: "relative",
                }}
                bodyStyle={{ padding: 20 }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 10,
                    background: "#81B1E7",
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10,
                  }}
                />
                <Row justify="space-between" align="middle">
                  <Col flex="auto">
                    <Title level={5} style={{ margin: 0, fontWeight: "bold" }}>
                      <b>Assignment Title:</b> {item.title}
                    </Title>
                    <Text style={{ color: "#9AB7D0" }}>
                      <FilePdfOutlined /> <b>Lecture Title:</b> {item.lecture_title || "Lecture"}
                    </Text>
                    <br />
                    <Text><b>Description:</b> {item.description}</Text>
                    <Text style={{ fontSize: 13 }}>
                      <b>Due Date:</b> {dayjs(item.due_date).format("DD MMM YYYY")}
                    </Text>
                    <br />
                    { grade!==null && (
                      <Text style={{ fontSize: 13 }}>
                        <b>Grade:</b> {grade ?? "Not graded"} 
                      </Text>
                    )}
                  </Col>
                  <Col>
                    <Space direction="vertical">
                      {userRole === "student" && (
                        <>
                          {hasSubmitted ? (
                            <Button
                              type="default"
                              onClick={() => window.open(getPreviewUrl(fileUrl), "_blank", "noopener,noreferrer")}
                              style={{ borderRadius: 8 }}
                            >
                              View File
                            </Button>
                          ) : (
                            <Button
                              icon={<PlusOutlined />}
                              style={{
                                backgroundColor: "#81B1E7",
                                border: "none",
                                borderRadius: 10,
                                color: "#000",
                                fontWeight: 600,
                                height: 40,
                                width: 150,
                              }}
                              onClick={() => {
                                setSelectedAssignment(item);
                                setIsAddModalVisible(true);
                              }}
                            >
                              Add Submission
                            </Button>
                          )}
                        </>
                      )}
                    </Space>
                  </Col>
                </Row>
              </Card>
            );
          })}
        </Space>

        {selectedAssignment && (
          <AddSubmissionModal
            visible={isAddModalVisible}
            onCancel={() => setIsAddModalVisible(false)}
            onSubmit={(fileUrl: string) => {
              handleSubmissionSuccess(selectedAssignment.id, fileUrl);
              setIsAddModalVisible(false);
            }}
            assignment={selectedAssignment}
          />
        )}
      </Content>
    </Layout>
  );
}

export default Assignments;
