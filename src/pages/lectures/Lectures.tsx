
import { useState } from "react";
import {Card,Row,Col,Input,Button,Typography,Space,Modal,Form,Badge, Layout, Upload} from "antd";
import {SearchOutlined,EyeOutlined,FilePdfOutlined,BellFilled,PlusOutlined, VideoCameraAddOutlined, UploadOutlined} from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import { COLORS } from "../../constants/colors";
import { useNavigate } from "react-router-dom";
import DropdownMenu from "./DropdownMenu";
import NotificationsDrawer from "../Notifications";
const { Title, Text } = Typography;
function Lectures() {
  const navigate=useNavigate()
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  // ✅ Static Lecture Data
  const lectures = [
    {
      id: 1,
      title: "Lesson 1: Basics",
      description: "Introduction to English grammar",
      color: "#81B1E7",
      date: "15 Jun 2025",
      by: "Mr. Ahmed Omar",
    },
    {
      id: 2,
      title: "Lesson 2: Phrases",
      description: "Common phrases and expressions",
      color: "#A8D5BA",
      date: "15 Jun 2025",
      by: "Mr. Ahmed Omar",
    },
    {
      id: 3,
      title: "Lesson 3: Sentences",
      description: "Building sentences & paragraphs",
      color: "#E7C88E",
      date: "15 Jun 2025",
      by: "Mr. Ahmed Omar",
    },
    {
      id: 4,
      title: "Lesson 4: Advanced",
      description: "Advanced grammar and vocabulary",
      color: "#D7A9E3",
      date: "15 Jun 2025",
      by: "Mr. Ahmed Omar",
    },
  ];

  // ✅ Open/Close Modal
  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);
  const handleOk = () => {
    form.validateFields().then((values) => {
      console.log("New Lecture:", values);
      form.resetFields();
      setIsModalVisible(false);
    });
  };

  return (
    <Layout  style={{ backgroundColor:COLORS.background,marginLeft: 220, padding: "30px" , width: "100%",paddingTop:"150px"}}>
      <Content style={{ width: "100%" }}>
        <div style={{ padding: "30px 50px" }}>
          {/* Page Title */}
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

          {/* Search and Add Button */}
          <Row align="middle" justify="space-between" style={{ marginBottom: 25 ,width:"1000px"}}>
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
                New Lectures
              </Button>
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
                    <NotificationsDrawer
                      open={open}
                      onClose={() => setOpen(false)}
                    />
                </>
                </Badge>
              </div>
            </Space>
          </Row>

          {/* Lecture Cards */}
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
                  {/* Colored Side Bar */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 12,
                      background: lecture.color,
                      borderTopLeftRadius: 14,
                      borderBottomLeftRadius: 14,
                    }}
                  />
                  <Col style={{marginRight:"480px"}}>
                    <Title level={5} style={{ margin: 0 ,fontWeight:"bold"}}>
                      {lecture.title}
                    </Title>
                    <Text style={{ color: "#9AB7D0" }}>{lecture.description}</Text>
                    <br />
                    <Text style={{ fontSize: 13 }}>
                      <b>Last modified:</b> {lecture.date}
                    </Text>
                    <br />
                    <Text style={{ fontSize: 13 }}>
                      <b>By:</b> {lecture.by}
                    </Text>
                  </Col>

                  {/* Actions */}
                  <Col flex={"auto"}>
                    <Space direction="vertical" align="end">
                      <Button
                        type="link"
                        icon={<EyeOutlined />}
                        style={{ color: "#000", fontWeight: 600 }}
                      >
                        Watch Video
                      </Button>
                      <Button
                        type="link"
                        icon={<FilePdfOutlined />}
                        style={{ color: "#000", fontWeight: 600 }}
                      >
                        Lecture File
                      </Button>
                    </Space>
                  </Col>
                  <Col>
                    <DropdownMenu></DropdownMenu>
                  </Col>

                </Row>
              </Card>
            ))}
          </Space>
          {/* 🧩 Custom Modal */}
          <Modal
            open={isModalVisible}
            footer={null}
            onCancel={handleCancel}
            centered
            width={"400px"}
            height={"450px"} 
            style={{
              borderRadius: 12,
              overflow: "hidden",
              padding: 0,
            }}
            bodyStyle={{
              padding: 0,
            }}
          >
            {/* Header */}
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
            {/* Body */}
            <div style={{ padding: "20px 25px" }}>
              <Form form={form} layout="vertical">
                <Form.Item
                  label={<b>Lecture Title</b>}
                  name="title"
                  rules={[{ required: true, message: "Please enter lecture title" }]}
                  style={{ marginBottom: 15 }}
                >
                  <Input
                    placeholder="Lecture Title"
                    size="large"
                    style={{
                      borderRadius: 10,
                      height: 42,
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label={<b>Lecture Description</b>}
                  name="description"
                  rules={[{ required: true, message: "Please enter description" }]}
                  style={{ marginBottom: 15 }}
                >
                  <Input.TextArea
                    placeholder="Lecture Description"
                    rows={3}
                    style={{
                      borderRadius: 10,
                      resize: "none",
                      height: 70,
                    }}
                  />
                </Form.Item>

                <Form.Item name="video" style={{ marginBottom: 15 }}>
                  <Upload beforeUpload={() => false} showUploadList={false}>
                    <Button
                      icon={<VideoCameraAddOutlined />}
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: 10,
                        height: 50,
                        width: "100%",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                    >
                      Add Video
                    </Button>
                  </Upload>
                </Form.Item>

                <div style={{display:"flex",justifyContent:"end"}}>
                  <Button
                    type="primary"
                    icon={<UploadOutlined />}
                    block
                    onClick={handleOk}
                    style={{
                      alignItems:"center",
                      backgroundColor: "#B8CDE0",
                      border: "none",
                      color: "#000",
                      borderRadius: 10,
                      fontWeight: 600,
                      width:150,
                      height: 45, // 🔹 reduced height to match your picture
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
