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
  Upload,
  Empty,
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
import { getLectures, addLecture } from "../../API/api";

const { Title, Text } = Typography;

function Lectures() {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [lectures, setLectures] = useState<any[]>([]);
  const [filteredLectures, setFilteredLectures] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [fileObj, setFileObj] = useState<File | null>(null); // ✅ الملف الحقيقي

  // ✅ تحميل بيانات المستخدم والمحاضرات
  useEffect(() => {
    const token = localStorage.getItem("access_token"); // ✅ تأكدنا من الاسم الصحيح
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

    getLectures(token)
      .then((data) => {
        const lectureList = Array.isArray(data) ? data : data.lectures || [];
        setLectures(lectureList);
        setFilteredLectures(lectureList);
      })
      .catch(() => {
        message.error("فشل في تحميل المحاضرات 😢");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  // ✅ فلترة البحث
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = lectures.filter(
      (lecture) =>
        lecture.title.toLowerCase().includes(value.toLowerCase()) ||
        lecture.description.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredLectures(filtered);
  };

  // ✅ المودال
  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setFileObj(null);
  };

  // ✅ رفع الملف (بدون رفع تلقائي)
  const handleUpload = (file: File) => {
    setFileObj(file);
    return false;
  };

  // ✅ إضافة محاضرة جديدة
  const handleOk = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      message.error("الرجاء تسجيل الدخول أولاً");
      return;
    }

    if (userRole !== "teacher") {
      message.warning("فقط المعلم يمكنه إضافة محاضرات!");
      return;
    }

    try {
      const values = await form.validateFields();

      if (!fileObj) {
        message.error("يرجى رفع ملف المحاضرة!");
        return;
      }

      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const lectureData = {
        title: values.title,
        description: values.description,
        video: values.video,
        file: fileObj,
        date: new Date().toLocaleDateString("en-GB"),
        teacher_name: user.name || "Unknown Teacher",
      };

      const newLecture = await addLecture(token, lectureData);
      message.success("✅ تمت إضافة المحاضرة بنجاح!");
      const updated = [newLecture, ...lectures];
      setLectures(updated);
      setFilteredLectures(updated);
      setIsModalVisible(false);
      form.resetFields();
      setFileObj(null);
    } catch (error: any) {
      console.error("❌ Error adding lecture:", error);
      message.error("حدث خطأ أثناء رفع المحاضرة.");
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
          {/* ✅ العنوان + البحث + الإشعارات */}
          <Row
            align="middle"
            justify="space-between"
            style={{
              position: "sticky",
              top: 0,
              background: COLORS.background,
              zIndex: 10,
              paddingBottom: 20,
              marginBottom: 30,
            }}
          >
            <Col flex="auto">
              <Title
                level={3}
                style={{
                  color: "#21629B",
                  fontWeight: 700,
                  fontFamily: "Segoe UI, sans-serif",
                }}
              >
                Lectures
              </Title>
              <Input
                prefix={<SearchOutlined />}
                placeholder="Search for your lectures"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                style={{
                  width: "90%",
                  height: 40,
                  backgroundColor: "#EDEDED",
                  borderRadius: 10,
                }}
              />
            </Col>

            <Space>
              {userRole === "teacher" && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={showModal}
                  style={{
                    backgroundColor: "#fff",
                    color: "#000",
                    border: "1px solid #000",
                    height: 40,
                    borderRadius: 10,
                    fontWeight: 600,
                  }}
                >
                  New Lecture
                </Button>
              )}
              <Badge count={1} size="small" style={{ backgroundColor: "#9AB7D0" }}>
                <BellFilled
                  style={{ fontSize: 22, color: "#000", cursor: "pointer" }}
                  onClick={() => setOpen(true)}
                />
                <NotificationsDrawer open={open} onClose={() => setOpen(false)} />
              </Badge>
            </Space>
          </Row>

          {/* ✅ عرض المحاضرات */}
          {filteredLectures.length === 0 ? (
            <div style={{ textAlign: "center", marginTop: 100 }}>
              <Empty
                description={
                  searchTerm
                    ? "No lectures found matching your search."
                    : userRole === "teacher"
                    ? "No lectures yet! Add your first lecture so students can start learning and following your course."
                    : "No lectures yet!"
                }
              />
            </div>
          ) : (
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
              {filteredLectures.map((lecture) => (
                <Card
                  key={lecture.id}
                  style={{
                    borderRadius: 10,
                    backgroundColor: "#F5F5F5",
                    padding: 0,
                  }}
                  bodyStyle={{ padding: 0 }}
                >
                  <Row align="middle" style={{ padding: 20, position: "relative" }}>
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
                      <Text style={{ color: "#9AB7D0" }}>{lecture.description}</Text>
                      <br />
                      <Text style={{ fontSize: 13 }}>
                        <b>Date:</b> {lecture.date}
                      </Text>
                      <br />
                      <Text style={{ fontSize: 13 }}>
                        <b>By:</b> {lecture.teacher_name}
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
                        {lecture.file && (
                          <Button
                            type="link"
                            icon={<FilePdfOutlined />}
                            href={lecture.file}
                            target="_blank"
                            style={{ color: "#000", fontWeight: 600 }}
                          >
                            Lecture File
                          </Button>
                        )}
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
          )}

          {/* ✅ المودال */}
          <Modal
            open={isModalVisible}
            footer={null}
            onCancel={handleCancel}
            centered
            width={"400px"}
            style={{ borderRadius: 12, overflow: "hidden" }}
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
                  rules={[{ required: true, message: "Please enter lecture title" }]}
                >
                  <Input placeholder="Lecture Title" size="large" />
                </Form.Item>

                <Form.Item
                  label={<b>Lecture Description</b>}
                  name="description"
                  rules={[{ required: true, message: "Please enter description" }]}
                >
                  <Input.TextArea rows={3} />
                </Form.Item>

                <Form.Item
                  label={<b>Lecture Video Link</b>}
                  name="video"
                  rules={[{ required: true, message: "Please enter video link" }]}
                >
                  <Input placeholder="Enter lecture video link" />
                </Form.Item>

                <Form.Item
                  label={<b>Lecture File</b>}
                  name="file"
                  rules={[{ required: true, message: "Please upload a file" }]}
                >
                  <Upload beforeUpload={handleUpload} accept=".pdf,.doc,.docx,.ppt,.pptx">
                    <Button icon={<UploadOutlined />}>Select File</Button>
                  </Upload>
                  {fileObj && (
                    <p style={{ marginTop: 8, color: "green" }}>
                      ✔ {fileObj.name} جاهز للرفع
                    </p>
                  )}
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
