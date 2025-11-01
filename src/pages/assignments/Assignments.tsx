import { useState, useEffect } from "react";
import { Card, Row, Col, Input, Button, Typography, Space, Form, Badge, Layout, message, Spin, Modal, DatePicker } from "antd";
import { SearchOutlined, FilePdfOutlined, BellFilled, PlusOutlined } from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import { COLORS } from "../../constants/colors";
import { useNavigate } from "react-router-dom";
import UploadAssignmentModal from "./UploadAssignmentModal";
import NotificationsDrawer from "../Notifications";
import AddSubmissionModal from "./AddSubmissionModal";
import { addAssignment, getAssignments, getSubmissionsForAssignment, updateAssignment, deleteAssignment } from "../../API/api";

const { Title, Text } = Typography;

function Assignments() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [form] = Form.useForm();
  const [userGrades, setUserGrades] = useState<Record<number, number | null>>({});
  const [editingAssignment, setEditingAssignment] = useState<any | null>(null);
  const [isEditAssignmentVisible, setIsEditAssignmentVisible] = useState(false);
  const [editFileObj, setEditFileObj] = useState<File | null>(null);

  const handleSaveEditAssignment = async () => {
    if (!editingAssignment) return;
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    try {
      const values = await form.validateFields();
      const payload: any = {
        title: values.title,
        description: values.description,
        due_date: values.dueDate ? values.dueDate.toISOString().split("T")[0] : editingAssignment.due_date,
      };
      const updated = await updateAssignment(token, editingAssignment.id, payload);
      setAssignments((prev) => prev.map((a) => (a.id === editingAssignment.id ? updated : a)));
      setFilteredAssignments((prev) => prev.map((a) => (a.id === editingAssignment.id ? updated : a)));
      message.success("✅ تم تحديث الواجب");
      setIsEditAssignmentVisible(false);
      setEditingAssignment(null);
      form.resetFields();
    } catch (e) {
      console.error(e);
      message.error("فشل في تحديث الواجب");
    }
  };

  // ✅ Fetch assignments on mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      message.error("الرجاء تسجيل الدخول أولاً");
      navigate("/login");
      return;
    }

    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserRole(user.role);
    }

    getAssignments(token)
      .then((data) => {
        const assignmentList = Array.isArray(data) ? data : data.results || [];
        setAssignments(assignmentList);
        setFilteredAssignments(assignmentList);

        // fetch current user's submission for each assignment to show "Your grade"
        try {
          const userData = localStorage.getItem("user");
          const user = userData ? JSON.parse(userData) : null;
          if (user && user.id) {
            Promise.all(
              assignmentList.map(async (a: any) => {
                try {
                  const subs = await getSubmissionsForAssignment(token, a.id);
                  const list = Array.isArray(subs) ? subs : subs.results || [];
                  const mine = list.find((s: any) => s.user?.id === user.id || s.student_id === user.id);
                  return { assignmentId: a.id, grade: mine?.grade ?? null };
                } catch (e) {
                  return { assignmentId: a.id, grade: null };
                }
              })
            ).then((results) => {
              const map: Record<number, number | null> = {};
              results.forEach((r) => (map[r.assignmentId] = r.grade));
              setUserGrades(map);
            });
          }
        } catch (e) {
          console.error("Error fetching user grades:", e);
        }
      })
      .catch(() => message.error("فشل في تحميل الواجبات 😢"))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = assignments.filter(
      (item) =>
        item.title.toLowerCase().includes(value.toLowerCase()) ||
        item.description.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredAssignments(filtered);
  };

  // Modal handlers
  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleOk = async (fileObj: File) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      message.error("الرجاء تسجيل الدخول أولاً");
      return;
    }

    if (userRole !== "teacher") {
      message.warning("فقط المعلم يمكنه إضافة الواجبات!");
      return;
    }

    try {
      const values = await form.validateFields();
      if (!fileObj) {
        message.error("يرجى رفع ملف الواجب!");
        return;
      }

      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const assignmentData = {
        title: values.title,
        description: values.description,
        file: fileObj,
        due_date: values.dueDate.toISOString().split("T")[0], // YYYY-MM-DD
        lecture: values.lecture, // id of the lecture
        created_by: user.id,
      };

      const newAssignment = await addAssignment(token, assignmentData);
      message.success("✅ تم إضافة الواجب بنجاح!");
      const updated = [newAssignment, ...assignments];
      setAssignments(updated);
      setFilteredAssignments(updated);
      setIsModalVisible(false);
      form.resetFields();
    } catch (error: any) {
      console.error("❌ Error adding assignment:", error);
      message.error("حدث خطأ أثناء إضافة الواجب.");
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
    <Layout style={{ backgroundColor: COLORS.background, marginLeft: 220, padding: 30, width: "100%", paddingTop: 200 }}>
      <Content style={{ width: "100%" }}>
        <div style={{ padding: "30px 50px" }}>
          <Title level={3} style={{ color: "#21629B", marginBottom: 20, fontWeight: 700 }}>
            Assignments
          </Title>

          <Row align="middle" justify="space-between" style={{ marginBottom: 25, width: "1000px" }}>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search for your Assignments"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: "78%", height: 40, backgroundColor: "#EDEDED", borderRadius: 10 }}
            />
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={showModal}
                style={{ backgroundColor: "#EDEDED", color: "#000", border: "none", height: 40, borderRadius: 10, fontWeight: 600 }}
              >
                New Assignment
              </Button>
            </Space>
          </Row>

          <Space direction="vertical" style={{ width: "100%" }} size="middle">
            {filteredAssignments.map((item) => (
              <Card key={item.id} style={{ borderRadius: 10, backgroundColor: "#F5F5F5", position: "relative" }} bodyStyle={{ padding: 20 }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 10, background: "#81B1E7", borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }} />
                <Row justify="space-between" align="middle">
                  <Col flex="auto">
                    <Title level={5} style={{ margin: 0, fontWeight: "bold" }}>{item.title}</Title>
                    <Text style={{ color: "#9AB7D0" }}><FilePdfOutlined /> {item.lecture || "Lecture"}</Text>
                    <br />
                    <Text style={{ fontSize: 13 }}><b>Due Date:</b> {item.due_date}</Text>
                  </Col>
                  <Col>
                    <Space direction="vertical">
                      <Button
                        icon={<PlusOutlined />}
                        style={{ backgroundColor: "#81B1E7", border: "none", borderRadius: 10, color: "#000", fontWeight: 600, height: 40, width: 150 }}
                        onClick={() => {
                          setSelectedAssignment(item);
                          setIsAddModalVisible(true);
                        }}
                      >
                        Add Submission
                      </Button>
                      {userRole === "teacher" && (
                        <Space>
                          <Button
                            onClick={() => {
                              setEditingAssignment(item);
                              form.setFieldsValue({ title: item.title, description: item.description });
                              setIsEditAssignmentVisible(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            danger
                            onClick={() => {
                              Modal.confirm({
                                title: "Confirm delete",
                                content: "Are you sure you want to delete this assignment?",
                                onOk: async () => {
                                  const token = localStorage.getItem("accessToken");
                                  if (!token) return;
                                  try {
                                    await deleteAssignment(token, item.id);
                                    message.success("✅ تم حذف الواجب");
                                    setAssignments((prev) => prev.filter((a) => a.id !== item.id));
                                    setFilteredAssignments((prev) => prev.filter((a) => a.id !== item.id));
                                  } catch (e) {
                                    console.error(e);
                                    message.error("فشل في حذف الواجب");
                                  }
                                },
                              });
                            }}
                          >
                            Delete
                          </Button>
                        </Space>
                      )}
                    </Space>
                  </Col>
                </Row>
              </Card>
            ))}
          </Space>

          <UploadAssignmentModal
            isModalVisible={isModalVisible}
            handleCancel={handleCancel}
            setAssignments={setAssignments}
          />

          {selectedAssignment && (
            <AddSubmissionModal
              visible={isAddModalVisible}
              onCancel={() => setIsAddModalVisible(false)}
              onSubmit={() => setIsAddModalVisible(false)}
              assignment={selectedAssignment}
            />
          )}

          {/* Edit Assignment Modal */}
          <Modal
            open={isEditAssignmentVisible}
            title={editingAssignment ? `Edit Assignment — ${editingAssignment.title}` : "Edit Assignment"}
            onCancel={() => {
              setIsEditAssignmentVisible(false);
              setEditingAssignment(null);
              form.resetFields();
            }}
            onOk={handleSaveEditAssignment}
          >
            <Form form={form} layout="vertical">
              <Form.Item label="Title" name="title" rules={[{ required: true }]}> 
                <Input />
              </Form.Item>
              <Form.Item label="Description" name="description" rules={[{ required: true }]}> 
                <Input.TextArea rows={3} />
              </Form.Item>
              <Form.Item label="Due Date" name="dueDate">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </Content>
    </Layout>
  );
}

export default Assignments;
