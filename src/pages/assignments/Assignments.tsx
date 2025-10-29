import { useState } from "react";
import {Card,Row,Col,Input,Button,Typography,Space,Form,Badge,Layout} from "antd";
import {SearchOutlined,FilePdfOutlined,BellFilled,PlusOutlined} from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import { COLORS } from "../../constants/colors";
import { useNavigate } from "react-router-dom";
import UploadAssignmentModal from "./UploadAssignmentModal";
import NotificationsDrawer from "../Notifications";
import AddSubmissionModal from "./AddSubmissionModal";

const { Title, Text } = Typography;

function Assignments() {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  // ✅ Static Assignments Data
  const assignments = [
    {
      id: 1,
      title: "Assignment 1: Writing Assignment",
      lab: "Lab 1",
      color: "#81B1E7",
      date: "15 Jun 2025",
      status: "Not modified",
      grading: "...",
      buttonColor: "#81B1E7",
    },
    {
      id: 2,
      title: "Assignment 1: Writing Assignment",
      lab: "Lab 1",
      color: "#A8D5BA",
      date: "15 Jun 2025",
      status: "Late",
      grading: "...",
      buttonColor: "#A8D5BA",
    },
    {
      id: 3,
      title: "Assignment 1: Writing Assignment",
      lab: "Lab 1",
      color: "#E7C88E",
      date: "15 Jun 2025",
      status: "Modified",
      grading: "Not Graded",
      buttonColor: "#E7C88E",
    },
    {
      id: 4,
      title: "Assignment 1: Writing Assignment",
      lab: "Lab 1",
      color: "#D7A9E3",
      date: "15 Jun 2025",
      status: "Not modified",
      grading: "...",
      buttonColor: "#D7A9E3",
    },
  ];

  // ✅ Modal handlers
  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);
  const handleOk = () => {
    form.validateFields().then((values) => {
      console.log("New Assignment:", values);
      form.resetFields();
      setIsModalVisible(false);
    });
  };

  return (
    <Layout
      style={{
        backgroundColor: COLORS.background,
        marginLeft: 220,
        padding: "30px",
        width: "100%",
        paddingTop: "200px",
      }}
    >
      <Content style={{ width: "100%" }}>
        <div style={{ padding: "30px 50px" }}>
          {/* 🏷️ Page Title */}
          <Title
            level={3}
            style={{
              color: "#21629B",
              marginBottom: 20,
              fontWeight: 700,
              fontFamily: "Segoe UI, sans-serif",
            }}
          >
            Assignments
          </Title>

          {/* 🔍 Search Bar + New Assignment Button + Notification */}
          <Row
            align="middle"
            justify="space-between"
            style={{ marginBottom: 25, width: "1000px" }}
          >
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search for your Assignments"
              style={{
                width: "78%",
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
                New Assignments
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

          {/* 📘 Assignment Cards */}
          <Space direction="vertical" style={{ width: "100%" }} size="middle">
            {assignments.map((item) => (
              <Card
                key={item.id}
                style={{
                  borderRadius: 10,
                  backgroundColor: "#F5F5F5",
                  position: "relative",
                }}
                bodyStyle={{ padding: 20 }}
              >
                {/* Colored Side Bar */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 10,
                    background: item.color,
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10,
                  }}
                />
                <Row justify="space-between" align="middle">
                  <Col flex="auto">
                    <Title level={5} style={{ margin: 0, fontWeight: "bold" }}>
                      {item.title}
                    </Title>
                    <Text style={{ color: "#9AB7D0" }}>
                      <FilePdfOutlined /> {item.lab}
                    </Text>
                    <br />
                    <Text style={{ fontSize: 13 }}>
                      <b>Due Date:</b> {item.date}
                    </Text>
                    <br />
                    <Text style={{ fontSize: 13 }}>
                      <b>Submission Status:</b>{" "}
                      <span
                        style={{
                          color:
                            item.status === "Late"
                              ? "red"
                              : item.status === "Modified"
                              ? "green"
                              : "black",
                        }}
                      >
                        {item.status}
                      </span>
                    </Text>
                    <br />
                    <Text style={{ fontSize: 13 }}>
                      <b>Grading Status:</b> {item.grading}
                    </Text>
                  </Col>

                  {/* Add Submission Button */}
                  <Col>
                    <Button
                      icon={<PlusOutlined />}
                      style={{
                        backgroundColor: item.buttonColor,
                        border: "none",
                        borderRadius: 10,
                        color: "#000",
                        fontWeight: 600,
                        height: 40,
                        width: 150,
                      }}
                      onClick={() => setIsAddModalVisible(true)}
                    >
                      Add Submission
                    </Button>
                  </Col>
                </Row>
              </Card>
            ))}
          </Space>

          {/* 🧩 Modal for Adding Assignment */}
          <UploadAssignmentModal
            isModalVisible={isModalVisible}
            handleOk={handleOk}
            handleCancel={handleCancel}
          />
          <AddSubmissionModal
            visible={isAddModalVisible}
            onCancel={() => setIsAddModalVisible(false)}
            onSubmit={(files) => {
              console.log("Submitted files:", files);
              setIsAddModalVisible(false);
            }}
/>

        </div>
      </Content>
    </Layout>
  );
}

export default Assignments;
