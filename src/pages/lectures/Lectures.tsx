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
  DatePicker,
  Dropdown,
  Menu,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  BellFilled,
  PlusOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import { COLORS } from "../../constants/colors";
import { useNavigate } from "react-router-dom";
import NotificationsDrawer from "../Notifications";
import { getLectures, addLecture, updateLecture, deleteLecture } from "../../API/api";
import dayjs from 'dayjs';

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
  const [fileLink, setFileLink] = useState<string>("");
  const [editLecture, setEditLecture] = useState<any | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [viewFileUrl, setViewFileUrl] = useState<string>("");
  const [paddingTop, setPaddingTop] = useState(200); // default padding top

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      message.error("Please log in first");
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
        const lectureList = Array.isArray(data) ? data : data.results || [];
        setLectures(lectureList);
        setFilteredLectures(lectureList);
      })
      .catch(() => {
        message.error("Failed to load lectures 😢");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const getPreviewUrl = (url?: string) => {
    if (!url) return "";
    try {
      const dMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (dMatch && dMatch[1]) return `https://drive.google.com/file/d/${dMatch[1]}/preview`;
      const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (idMatch && idMatch[1]) return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
      return url;
    } catch (e) {
      return url;
    }
  };

  const formatDate = (date: string) => {
    if (!date) return '';
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) return date;
    const parsed = dayjs(date);
    return parsed.isValid() ? parsed.format('DD/MM/YYYY') : date;
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = lectures.filter(
      (lecture) =>
        lecture.title.toLowerCase().includes(value.toLowerCase()) ||
        lecture.description.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredLectures(filtered);
  };

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setFileLink("");
  };

  const handleOk = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    if (userRole !== "teacher") {
      message.warning("Only teachers can add lectures!");
      return;
    }
    try {
      const values = await form.validateFields();

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const lectureData = {
        title: values.title,
        description: values.description,
        video: values.video,
        file: values.fileLink,
        created_at: values.date ? dayjs(values.date).format('DD/MM/YYYY') : new Date().toLocaleDateString("en-GB"),
        teacher_name: user.name || "Unknown Teacher",
      };
      const newLecture = await addLecture(token, lectureData);
      message.success("Lecture added successfully!");
      const updated = [newLecture, ...lectures];
      setLectures(updated);
      setFilteredLectures(updated);
      setPaddingTop((prev) => prev + 200);

// Scroll to top so the lecture appears immediately
window.scrollTo({ top: 0, behavior: "smooth" });
      setIsModalVisible(false);
      form.resetFields();
      setFileLink("");
    } catch (error: any) {
      console.error("❌ Error adding lecture:", error);
      message.error("An error occurred while uploading the lecture.");
    }
  };

  const openEditModal = (lecture: any) => {
    setEditLecture(lecture);
    setIsEditModalVisible(true);
    form.setFieldsValue({
      title: lecture.title,
      description: lecture.description,
      video: lecture.video,
      fileLink: lecture.file,
      date: lecture.created_at ? dayjs(lecture.created_at, 'DD/MM/YYYY') : null
    });
  };

  const handleEditOk = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token || !editLecture) return;
    try {
      const values = await form.validateFields();
      const data = {
        title: values.title,
        description: values.description,
        video: values.video,
        file_link: values.fileLink,
      };
      const updated = await updateLecture(token, editLecture.id, data);
      message.success("Lecture updated successfully!");
      setLectures((prev) => prev.map((l) => (l.id === editLecture.id ? updated : l)));
      setFilteredLectures((prev) => prev.map((l) => (l.id === editLecture.id ? updated : l)));
      setIsEditModalVisible(false);
      setEditLecture(null);
      form.resetFields();
    } catch (error: any) {
      console.error("❌ Error editing lecture:", error);
      message.error("An error occurred while updating the lecture.");
    }
  };

  const handleDeleteLecture = async (lectureId: number) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    try {
      await deleteLecture(token, lectureId);
      message.success("Lecture deleted successfully!");
      setLectures((prev) => prev.filter((l) => l.id !== lectureId));
      setFilteredLectures((prev) => prev.filter((l) => l.id !== lectureId));
      setPaddingTop((prev) => Math.max(450, prev - 70));
      window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (error: any) {
      console.error("❌ Error deleting lecture:", error);
      message.error("An error occurred while deleting the lecture.");
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
      {/* Fixed Header */}
      {/* Fixed Header */}
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
          gap: 15,
          
        }}
>
  {/* Page Title Row */}
  <Row>
    <Col>
      <Title level={3} style={{ color: "#21629B", fontWeight: 700, margin: 0 }}>
        Lectures
      </Title>
    </Col>
  </Row>

  {/* Row with Search, New Lecture Button, and Notification */}
  <Row align="middle" gutter={15}>
    {/* Search Bar */}
    <Col >
      <Input
        prefix={<SearchOutlined />}
        placeholder="Search for your lectures"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ width: 800, height: 40, backgroundColor: "#EDEDED", borderRadius: 10 }}
      />
    </Col>

    {/* New Lecture Button */}
    {userRole === "teacher" && (
      <Col>
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
      </Col>
    )}

    {/* Notification */}
      
        <NotificationsDrawer open={open} onClose={() => setOpen(false)} setOpen={setOpen} />
     
  </Row>
</div>

      {/* Lectures Content */}
<Content style={{ width: "100%", padding: "140px 50px 50px 50px" , paddingTop: `${paddingTop}px`, transition: 'padding-top 0.3s ease', ...(filteredLectures.length === 0 ? { display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 220px)' } : { display: 'flex', justifyContent: 'center' }) }}>
        {filteredLectures.length === 0 ? (
          <Empty
            description={
              searchTerm
                ? "No lectures found matching your search."
                : userRole === "teacher"
                ? "No lectures yet! Add your first lecture."
                : "No lectures yet!"
            }
          />
        ) : (
          <Space direction="horizontal" style={{ width: "100%" }} size="middle" wrap>
            {filteredLectures.map((lecture) => (
  <Card key={lecture.id} style={{ borderRadius: 10, backgroundColor: "#F5F5F5", padding: 0, minWidth: 900 }} bodyStyle={{ padding: 0 }}>
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
                  <Col flex={"auto"} style={{ marginRight: "480px" }}>
                    <Title level={5} style={{ margin: 0, fontWeight: "bold" }}><b>Title: </b>{lecture.title}</Title>
                    <Text style={{ color: "#9AB7D0" }}><b>Description: </b>{lecture.description}</Text>
                    <br />
                    <Text style={{ fontSize: 13 }}><b>Date:</b> {dayjs(lecture.created_at).format('DD MMM YYYY')}</Text>
                    <br />
                    <Text style={{ fontSize: 13 }}><b>By:</b> {lecture.teacher_name}</Text>
                  </Col>
                  <Col flex={"auto"}>
                    <Space direction="vertical" align="end">
                      {lecture.video && (
                        <Button type="link" icon={<EyeOutlined />} href={lecture.video} target="_blank" style={{ color: "#000", fontWeight: 600 }}>
                          Watch Video
                        </Button>
                      )}
                      {true ? (
                        <Button type="link" href="https://drive.google.com/file/d/1kjiOCMKZb8gIh7J6amBqaY_5dB9HYUcB/view?usp=drive_link" target="_blank" style={{ color: "#000", fontWeight: 600 }}>
                          View File
                        </Button>
                      ) : (
                        <Text style={{ fontSize: 13, color: "#9AB7D0" }}>File isn't attached</Text>
                      )}
                    </Space>
                  </Col>
                  {userRole === "teacher" && (
                    <Col>
                      <Dropdown
                        overlay={
                          <Menu>
                            <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => openEditModal(lecture)}>
                              Edit
                            </Menu.Item>
                            <Menu.Item key="delete" icon={<DeleteOutlined />} onClick={() => handleDeleteLecture(lecture.id)}>
                              Delete
                            </Menu.Item>
                          </Menu>
                        }
                        trigger={['click']}
                      >
                        <Button type="text" icon={<MoreOutlined />} />
                      </Dropdown>
                    </Col>
                  )}
                </Row>
              </Card>
            ))}
          </Space>
        )}
      </Content>

      {/* Add Lecture Modal */}
      <Modal open={isModalVisible} footer={null} onCancel={handleCancel} centered width={400} style={{ borderRadius: 12, overflow: "hidden" }}>
        <div style={{ backgroundColor: "#B8CDE0", padding: "10px 0", textAlign: "center", borderRadius: 10 }}>
          <Title level={4} style={{ margin: 0, fontSize: 20 }}>Add Lecture</Title>
        </div>
        <div style={{ padding: "20px 25px" }}>
          <Form form={form} layout="vertical">
            <Form.Item label={<b>Lecture Title</b>} name="title" rules={[{ required: true, message: "Please enter lecture title" }]}>
              <Input placeholder="Lecture Title" size="large" />
            </Form.Item>
            <Form.Item label={<b>Lecture Description</b>} name="description" rules={[{ required: true, message: "Please enter description" }]}>
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item label={<b>Lecture Video Link</b>} name="video" rules={[{ required: true, message: "Please enter video link" }, { type: 'url', message: 'Please enter a valid URL' }]}>
              <Input placeholder="Enter lecture video link" />
            </Form.Item>
            <Form.Item label={<b>Lecture File Link</b>} name="fileLink" rules={[{ type: 'url', message: 'Please enter a valid URL' }]}>
              <Input placeholder="Enter lecture file link (optional)" />
            </Form.Item>
            <div style={{ display: "flex", justifyContent: "end" }}>
              <Button type="primary" icon={<UploadOutlined />} onClick={handleOk} style={{ backgroundColor: "#B8CDE0", border: "none", color: "#000", borderRadius: 10, fontWeight: 600, width: 150, height: 45 }}>Upload</Button>
            </div>
          </Form>
        </div>
      </Modal>

      {/* Edit Lecture Modal */}
      <Modal open={isEditModalVisible} footer={null} onCancel={() => { setIsEditModalVisible(false); setEditLecture(null); form.resetFields(); }} centered width={400} style={{ borderRadius: 12, overflow: "hidden" }}>
        <div style={{ backgroundColor: "#B8CDE0", padding: "10px 0", textAlign: "center", borderRadius: 10 }}>
          <Title level={4} style={{ margin: 0, fontSize: 20 }}>Edit Lecture</Title>
        </div>
        <div style={{ padding: "20px 25px" }}>
          <Form form={form} layout="vertical">
            <Form.Item label={<b>Lecture Title</b>} name="title" rules={[{ required: true, message: "Please enter lecture title" }]}>
              <Input placeholder="Lecture Title" size="large" />
            </Form.Item>
            <Form.Item label={<b>Lecture Description</b>} name="description" rules={[{ required: true, message: "Please enter description" }]}>
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item label={<b>Lecture Video Link</b>} name="video" rules={[{ required: true, message: "Please enter video link" }, { type: 'url', message: 'Please enter a valid URL' }]}>
              <Input placeholder="Enter lecture video link" />
            </Form.Item>
            <Form.Item label={<b>Lecture File Link</b>} name="fileLink" rules={[{ type: 'url', message: 'Please enter a valid URL' }]}>
              <Input placeholder="Enter lecture file link (optional)" />
            </Form.Item>
            <div style={{ display: "flex", justifyContent: "end" }}>
              <Button type="primary" icon={<UploadOutlined />} onClick={handleEditOk} style={{ backgroundColor: "#B8CDE0", border: "none", color: "#000", borderRadius: 10, fontWeight: 600, width: 150, height: 45 }}>Save</Button>
            </div>
          </Form>
        </div>
      </Modal>

      {/* View File Modal */}
      <Modal open={isViewModalVisible} footer={null} onCancel={() => { setIsViewModalVisible(false); setViewFileUrl(""); }} centered width={800} style={{ borderRadius: 12, overflow: "hidden" }}>
        <div style={{ backgroundColor: "#B8CDE0", padding: "10px 0", textAlign: "center", borderRadius: 10 }}>
          <Title level={4} style={{ margin: 0, fontSize: 20 }}>View File</Title>
        </div>
        <div style={{ padding: "20px 25px", height: "600px" }}>
          {viewFileUrl && (
            <iframe
              src={viewFileUrl}
              style={{ width: "100%", height: "100%", border: "none" }}
              title="File Preview"
            />
          )}
        </div>
      </Modal>
    </Layout>
  );
}

export default Lectures;
