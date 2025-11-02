import { useState, useEffect } from "react";
import {Card,Row,Col,Input,Button,Typography,Space,Form,Badge,Layout,message,Spin,Modal,DatePicker,Dropdown,Menu,} from "antd";
import {SearchOutlined,FilePdfOutlined,BellFilled,PlusOutlined,EyeOutlined,EditOutlined,DeleteOutlined,MoreOutlined,} from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import { COLORS } from "../../constants/colors";
import { useNavigate } from "react-router-dom";
import UploadAssignmentModal from "./UploadAssignmentModal";
import NotificationsDrawer from "../Notifications";
import AddSubmissionModal from "./AddSubmissionModal";
import {addAssignment,getAssignments,getSubmissionsForAssignment,updateAssignment,deleteAssignment,} from "../../API/api";
import dayjs from "dayjs";

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
  const [open, setOpen] = useState(false);
  const [paddingTop, setPaddingTop] = useState(140);

  // ✅ Delete assignment
  const handleDeleteAssignment = async (assignmentId: number) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      await deleteAssignment(token, assignmentId);
      message.success("✅ تم حذف الواجب");
      setAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
      setFilteredAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
      setPaddingTop((prev) => Math.max(140, prev - 70));
    } catch (e) {
      console.error(e);
      message.error("فشل في حذف الواجب");
    }
  };

  // ✅ Save edited assignment
  const handleSaveEditAssignment = async () => {
    if (!editingAssignment) return;
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const values = await form.validateFields();
      const payload: any = {
        title: values.title,
        description: values.description,
        due_date: values.dueDate
          ? values.dueDate.toISOString().split("T")[0]
          : editingAssignment.due_date,
      };

      const updated = await updateAssignment(token, editingAssignment.id, payload);
      setAssignments((prev) =>
        prev.map((a) => (a.id === editingAssignment.id ? updated : a))
      );
      setFilteredAssignments((prev) =>
        prev.map((a) => (a.id === editingAssignment.id ? updated : a))
      );

      message.success("✅ تم تحديث الواجب");
      setIsEditAssignmentVisible(false);
      setEditingAssignment(null);
      form.resetFields();
    } catch (e) {
      console.error(e);
      message.error("فشل في تحديث الواجب");
    }
  };

  // ✅ Fetch assignments
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

        try {
          const userData = localStorage.getItem("user");
          const user = userData ? JSON.parse(userData) : null;
          if (user && user.id) {
            Promise.all(
              assignmentList.map(async (a: any) => {
                try {
                  const subs = await getSubmissionsForAssignment(token, a.id);
                  const list = Array.isArray(subs) ? subs : subs.results || [];
                  const mine = list.find(
                    (s: any) => s.user?.id === user.id || s.student_id === user.id
                  );
                  return { assignmentId: a.id, grade: mine?.grade ?? null };
                } catch {
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

  // ✅ Search filter
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  useEffect(() => {
    const filtered = assignments.filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAssignments(filtered);
  }, [assignments, searchTerm]);

  // ✅ Modal control
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
        due_date: values.dueDate.toISOString().split("T")[0],
        lecture: values.lecture,
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
    <Layout style={{ backgroundColor: COLORS.background, marginLeft: 220, width: "100%" }}>
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

        <Row align="middle" gutter={15} style={{ width: "100%" }}>
          <Col>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search for your Assignments"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              style={{
                width: 800,
                height: 40,
                backgroundColor: "#EDEDED",
                borderRadius: 10,
              }}
            />
          </Col>

          {userRole === "teacher" && (
            <Col>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={showModal}
                style={{
                  backgroundColor: "#EDEDED",
                  color: "#000",
                  border: "none",
                  height: 40,
                  borderRadius: 10,
                  fontWeight: 600,
                }}
              >
                New Assignment
              </Button>
            </Col>
          )}

          <Col>
            <NotificationsDrawer open={open} onClose={() => setOpen(false)} setOpen={setOpen} />
          </Col>
        </Row>
      </div>

      <Content
        style={{
          width: "100%",
          padding: `${paddingTop}px 50px 50px 50px`,
          transition: "padding-top 0.3s ease",
        }}
      >
        <Space direction="vertical" style={{ width: 1000 }} size="middle">
          {filteredAssignments.map((item) => (
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
                    Assignment :{item.title}
                  </Title>
                  <Text style={{ color: "#9AB7D0" }}>
                    <FilePdfOutlined /> Lecture : {item.lecture || "Lecture"}
                  </Text>
                  <br />
                  <Text style={{ fontSize: 13 }}>
                    <b>Description:</b> {item.description}
                  </Text>
                  
                  <br />
                  <Text style={{ fontSize: 13 }}>
                    <b>Due Date:</b> {dayjs(item.due_date).format("DD MMM YYYY")}
                  </Text>
                  <br />
                      <Button
                        type="text"
                        icon={<EyeOutlined />}
                        href="https://drive.google.com/file/d/1kjiOCMKZb8gIh7J6amBqaY_5dB9HYUcB/view?usp=drive_link"
                        target="_blank"
                        style={{ padding:"0", fontWeight: 600 ,color: "#9AB7D0" }}
                      >
                        View Assignment File
                      </Button>
                   
                </Col>

                <Col>
                  <Space direction="vertical">
                    

                    {!item.has_submitted && userRole=="student" ? (
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
                  ) : (
                    <Button
                      type="text"
                      target="_blank"
                      style={{ padding: "0", fontWeight: 600, color: "#9AB7D0" }}
                    >
                    </Button>
                  )}  
                    {userRole === "teacher" && (
                      <Dropdown
                        overlay={
                          <Menu>
                            <Menu.Item
                              key="edit"
                              icon={<EditOutlined />}
                              onClick={() => {
                                setEditingAssignment(item);
                                form.setFieldsValue({
                                  title: item.title,
                                  description: item.description,
                                });
                                setIsEditAssignmentVisible(true);
                              }}
                            >
                              Edit
                            </Menu.Item>
                            <Menu.Item
                              key="delete"
                              icon={<DeleteOutlined />}
                              onClick={() => handleDeleteAssignment(item.id)}
                            >
                              Delete
                            </Menu.Item>
                          </Menu>
                        }
                        trigger={["click"]}
                      >
                        <Button type="text" icon={<MoreOutlined />} />
                      </Dropdown>
                    )}

                    {userRole === "student" && (
                      <Space>
                        <Text style={{ fontSize: 13, color: "#9AB7D0" }}>
                        </Text>
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

        <Modal
          open={isEditAssignmentVisible}
          title={
            editingAssignment
              ? `Edit Assignment — ${editingAssignment.title}`
              : "Edit Assignment"
          }
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
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
}

export default Assignments;
