import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Input,
  Button,
  Typography,
  Space,
  Modal,
  Form,
  Badge,
  Layout,
  message,
  Spin,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  FilePdfOutlined,
  BellFilled,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import { COLORS } from "../../constants/colors";
import { useNavigate } from "react-router-dom";
import DropdownMenu from "./DropdownMenu";
import NotificationsDrawer from "../Notifications";
import { getLectures, addLecture } from "../../API/api"; // ✅ ربط مع الباك

const { Title, Text } = Typography;

function Lectures() {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [lectures, setLectures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  // ✅ تحميل بيانات المستخدم والمحاضرات عند الدخول
  useEffect(() => {
    const token = localStorage.getItem("accessToken"); // ✅ تصحيح اسم التوكن
    if (!token) {
      message.error("الرجاء تسجيل الدخول أولاً");
      navigate("/login");
      return;
    }

    // 🔹 جلب بيانات المستخدم من localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserRole(user.role);
    }

    // 🔹 جلب المحاضرات
    getLectures(token)
      .then((data) => {
        setLectures(Array.isArray(data) ? data : data.lectures || []);

      })
      .catch(() => {
        message.error("فشل في تحميل المحاضرات 😢");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  // ✅ فتح/إغلاق المودال
  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  // ✅ رفع محاضرة جديدة (للمعلم فقط)
  const handleOk = async () => {
    const token = localStorage.getItem("accessToken"); // ✅ تصحيح اسم التوكن
    if (!token) {
      message.error("الرجاء تسجيل الدخول أولاً");
      return;
    }

    if (userRole !== "teacher") {
      message.warning("فقط المعلم يمكنه إضافة محاضرات!");
      return;
    }

    try {
      setLoading(true);
      const values = await form.validateFields();

      const lectureData = {
        title: values.title,
        description: values.description,
        video: values.video || "",
      };

      const newLecture = await addLecture(token, lectureData);
      message.success("✅ تمت إضافة المحاضرة بنجاح!");

      // ✅ أضف المحاضرة الجديدة بدون إعادة تحميل الكل
      setLectures((prev) => [newLecture, ...prev]);

      form.resetFields();
      setIsModalVisible(false);
    } catch (error: any) {
      console.error("❌ Error adding lecture:", error);
      message.error("حدث خطأ أثناء رفع المحاضرة.");
    } finally {
      setLoading(false);
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
        padding: "30px",
        width: "100%",
        paddingTop: "150px",
      }}
    >
      <Content style={{ width: "100%" }}>
        <div style={{ padding: "30px 50px" }}>
          {/* Title */}
          <Title
            level={3}
            style={{
              color: "#21629B",
              marginBottom: 20,
              fontWeight: 700,
              fontFamily: "Segoe UI, sans-serif",
            }}
          >
            Lectures
          </Title>

          {/* Search + Add Button */}
          <Row
            align="middle"
            justify="space-between"
            style={{ marginBottom: 25, width: "1000px" }}
          >
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search for your lectures"
              style={{
                width: "80%",
                height: 40,
                backgroundColor: "#EDEDED",
                borderRadius: 10,
              }}
            />
            <Space>
              {/* ✅ الزر يظهر فقط للمعلم */}
              {userRole === "teacher" && (
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
                  New Lecture
                </Button>
              )}

              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  backgroundColor: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Badge
                  count={1}
                  size="small"
                  style={{ backgroundColor: "#9AB7D0" }}
                >
                  <>
                    <BellFilled
                      style={{
                        fontSize: 22,
                        color: "#000",
                        cursor: "pointer",
                      }}
                      onClick={() => setOpen(true)}
                    />
                    <NotificationsDrawer
                      open={open}
                      onClose={() => setOpen(false)}
                    />
                  </>
                </Badge>
              </div>
            </Space>
          </Row>

          {/* ✅ Cards */}
          <Space direction="vertical" style={{ width: "100%" }} size="middle">
            {lectures.map((lecture) => (
              <Card
                key={lecture.id}
                style={{
                  borderRadius: 10,
                  backgroundColor: "#F5F5F5",
                  padding: 0,
                }}
                bodyStyle={{ padding: 0 }}
              >
                <Row align="middle" style={{ padding: 20 }}>
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 12,
                      background: "#9AB7D0",
                      borderTopLeftRadius: 14,
                      borderBottomLeftRadius: 14,
                    }}
                  />
                  <Col style={{ marginRight: "480px" }}>
                    <Title level={5} style={{ margin: 0, fontWeight: "bold" }}>
                      {lecture.title}
                    </Title>
                    <Text style={{ color: "#9AB7D0" }}>
                      {lecture.description}
                    </Text>
                    <br />
                    <Text style={{ fontSize: 13 }}>
                      <b>Date:</b> {lecture.date || "غير محدد"}
                    </Text>
                    <br />
                    <Text style={{ fontSize: 13 }}>
                      <b>By:</b> {lecture.teacher_name || "Unknown"}
                    </Text>
                  </Col>

                  <Col flex={"auto"}>
                    <Space direction="vertical" align="end">
                      {lecture.video && (
                        <Button
                          type="link"
                          icon={<EyeOutlined />}
                          href={lecture.video}
                          target="_blank"
                          style={{ color: "#000", fontWeight: 600 }}
                        >
                          Watch Video
                        </Button>
                      )}
                      <Button
                        type="link"
                        icon={<FilePdfOutlined />}
                        style={{ color: "#000", fontWeight: 600 }}
                      >
                        Lecture File
                      </Button>
                    </Space>
                  </Col>
                  {userRole === "teacher" && (
                    <Col>
                      <DropdownMenu />
                    </Col>
                  )}
                </Row>
              </Card>
            ))}
          </Space>

          {/* ✅ Modal */}
          <Modal
            open={isModalVisible}
            footer={null}
            onCancel={handleCancel}
            centered
            width={"400px"}
            style={{
              borderRadius: 12,
              overflow: "hidden",
              padding: 0,
            }}
            bodyStyle={{
              padding: 0,
            }}
          >
            <div
              style={{
                backgroundColor: "#B8CDE0",
                padding: "10px 0",
                textAlign: "center",
                borderRadius: 10,
              }}
            >
              <Title level={4} style={{ margin: 0, fontSize: 20 }}>
                Add Lecture
              </Title>
            </div>

            <div style={{ padding: "20px 25px" }}>
              <Form form={form} layout="vertical">
                <Form.Item
                  label={<b>Lecture Title</b>}
                  name="title"
                  rules={[
                    { required: true, message: "Please enter lecture title" },
                  ]}
                >
                  <Input placeholder="Lecture Title" size="large" />
                </Form.Item>

                <Form.Item
                  label={<b>Lecture Description</b>}
                  name="description"
                  rules={[
                    { required: true, message: "Please enter description" },
                  ]}
                >
                  <Input.TextArea rows={3} />
                </Form.Item>

                <Form.Item name="video">
                  <Input placeholder="Video URL (اختياري)" />
                </Form.Item>

                <div style={{ display: "flex", justifyContent: "end" }}>
                  <Button
                    type="primary"
                    icon={<UploadOutlined />}
                    onClick={handleOk}
                    style={{
                      backgroundColor: "#B8CDE0",
                      border: "none",
                      color: "#000",
                      borderRadius: 10,
                      fontWeight: 600,
                      width: 150,
                      height: 45,
                    }}
                  >
                    Upload
                  </Button>
                </div>
              </Form>
            </div>
          </Modal>
        </div>
      </Content>
    </Layout>
  );
}

export default Lectures;
