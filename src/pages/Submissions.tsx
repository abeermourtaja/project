// 📁 src/pages/Submissions.tsx
import { useState, useEffect } from "react";
import { Layout, Card, Row, Col, Typography, Button, InputNumber, message, Space, Spin, Modal, Form, Input } from "antd";
import { FileTextOutlined, SearchOutlined } from "@ant-design/icons";
import { getSubmissions, gradeSubmission } from "../API/api"; // تأكد من إضافة هذه الدوال في api.ts
import { COLORS } from "../constants/colors";
import NotificationsDrawer from "./Notifications";

const { Content } = Layout;
const { Title, Text } = Typography;

function Submissions() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingSubmission, setEditingSubmission] = useState<any>(null);
  const [gradeInput, setGradeInput] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [form] = Form.useForm();
const [paddingTop, setPaddingTop] = useState(450); // default padding top
  
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      message.error("الرجاء تسجيل الدخول أولاً");
      return;
    }

    getSubmissions(token)
      .then((data) => {
        const list = Array.isArray(data) ? data : data.results || [];
        // Log raw response to help debugging missing fields
        console.log("Submissions API response:", list);

        // normalize fields so frontend can rely on consistent keys
        const normalized = (list as any[]).map((s: any) => {
          const displayName =
            s.user?.name || s.user?.full_name || s.student_name || s.user?.username || s.user?.email || null;

          const displayId =
            s.user?.id ?? s.user?.pk ?? s.user?.uid ?? s.student_id ?? s.student?.id ?? null;

          const displayAssignmentId =
            s.assignment?.id ?? s.assignment ?? s.assignment_id ?? s.assignmentId ?? null;

          const displayAssignmentTitle = s.assignment_title || s.assignment?.title || s.assignment_title || s.title || null;

          return {
            ...s,
            displayName: displayName ?? `#${s.user?.id ?? s.student_id ?? s.id}`,
            displayId: displayId ?? "-",
            displayAssignmentId: displayAssignmentId ?? "-",
            displayAssignmentTitle: displayAssignmentTitle ?? "-",
          };
        });

        setSubmissions(normalized);
        setFilteredSubmissions(normalized);
      })
      .catch(() => message.error("فشل في تحميل التسليمات"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const filtered = submissions.filter((sub) =>
      sub.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.assignment_title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSubmissions(filtered);
  }, [searchTerm, submissions]);

  const openEditGradeModal = (submission: any) => {
    setEditingSubmission(submission);
    setGradeInput(submission.grade ?? 0);
    form.setFieldsValue({ grade: submission.grade ?? 0 });
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

  const handleSaveGrade = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token || !editingSubmission) return;

    try {
      const values = await form.validateFields();
      await gradeSubmission(token, editingSubmission.id, values.grade);
      message.success("✅ تم تحديث الدرجة بنجاح!");

      setSubmissions((prev) =>
        prev.map((sub) => (sub.id === editingSubmission.id ? { ...sub, grade: values.grade } : sub))
      );
      setEditingSubmission(null);
    } catch (error) {
      console.error(error);
      message.error("❌ حدث خطأ أثناء تحديث الدرجة");
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
    <Layout style={{ backgroundColor: COLORS.background, marginLeft: 220, padding: 30, width: "100%",     paddingTop: `${paddingTop}px`,transition: 'padding-top 0.3s ease'  }}>
      <Content style={{ width: "100%" }}>
        <div style={{ padding: "20px 24px", maxWidth: 1000 }}>
          <div style={{ position: "fixed", top: 0, left: 220, right: 0, backgroundColor: COLORS.background, zIndex: 1000, padding: "20px 24px", borderBottom: "1px solid #ddd" }}>
            <Title level={3} style={{ color: "#21629B", marginBottom: 10, fontWeight: 700 }}>
              Submissions
            </Title>
            <Input
              placeholder="Search by student name or assignment title"
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 700, marginBottom: 10 ,backgroundColor: "#EDEDED", }}
            />
            <NotificationsDrawer open={open} onClose={() => setOpen(false)} setOpen={setOpen} />

          </div>
          <div style={{ paddingTop: 120 }}>
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
              {filteredSubmissions.map((sub) => (
                <Card
                  key={sub.id}
                  style={{ borderRadius: 10, backgroundColor: "#F5F5F5", position: "relative", width: '100%' }}
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
                  <Row justify="space-between" align="middle" style={{width:"800px"}}>
                    <Col flex="auto">
                      <Text style={{ color: "#2B2B2B", display: 'block', marginTop: 0, fontWeight: 700, fontSize: 16 }}>
                        Student Name: {sub.displayName}
                      </Text>
                      <Text style={{ color: "#9AB7D0", display: 'block', marginTop: 6 }}>
                        <FileTextOutlined /> Student ID: {sub.student}
                      </Text>
                      <Title level={5} style={{ margin: '8px 0 0 0', fontWeight: 700 }}>
                        Assignment Title: {sub.assignment_title}
                      </Title>
                      <Text style={{ fontSize: 13, display: 'block', marginTop: 8 }}>
                        <b>Grade:</b> {sub.grade ?? "Not graded"} %
                      </Text>
                    </Col>
                    <Col style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                      { (sub.file_url || sub.file?.url) ? (
                        <Button
                          type="default"
                          onClick={() => window.open(getPreviewUrl(sub.file_url || sub.file?.url), "_blank", "noopener,noreferrer")}
                          style={{ borderRadius: 8 }}
                        >
                          View File
                        </Button>
                      ) : (
                        <Text type="secondary">No file</Text>
                      )}

                      <Button
                        type="primary"
                        style={{ backgroundColor: "#81B1E7", border: "none", borderRadius: 8, color: "#000", fontWeight: 600 }}
                        onClick={() => openEditGradeModal(sub)}
                      >
                        Add Grade
                      </Button>
                    </Col>
                  </Row>
                </Card>
              ))}
            </Space>
          </div>

          {/* Modal لتعديل الدرجة */}
          <Modal
            open={!!editingSubmission}
            title={`Edit Grade for ${editingSubmission?.assignment_title}`}
            onCancel={() => setEditingSubmission(null)}
            onOk={handleSaveGrade}
            okText="Save"
          >
            <Form form={form} layout="vertical">
              <Form.Item
                label="Grade"
                name="grade"
                rules={[{ required: true, message: "Please enter a grade" }]}
              >
                <InputNumber min={0} max={100} style={{ width: "100%" }} />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </Content>
    </Layout>
  );
}

export default Submissions;
