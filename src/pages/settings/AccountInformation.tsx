import { Layout, Typography, Input, Button, Form, Space, Row, message, Modal, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { COLORS } from "../../constants/colors";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserProfile, updateUserProfile } from "../../API/api";

const { Content } = Layout;
const { Title } = Typography;

function AccountInformation() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      message.error("الرجاء تسجيل الدخول أولاً");
      navigate("/login");
      return;
    }
    getUserProfile(token)
      .then((data) => {
        console.log("Fetched user profile:", data);
        setUserData(data);
        form.setFieldsValue({
          name: data.name || "",
          email: data.email || "",
          phone_number: data.phone_number || "",
        });
      })
      .catch(() => {
        message.error("فشل في تحميل بيانات المستخدم 😢");
      })
      .finally(() => setLoading(false));
  }, [navigate, form]);

  const handleUpdate = async (values: any) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    try {
      await updateUserProfile(token, values);
      message.success("✅ تم تحديث البيانات بنجاح!");
      setUserData({ ...userData, ...values });
    } catch (error: any) {
      console.error("❌ Error updating profile:", error);
      message.error("حدث خطأ أثناء تحديث البيانات.");
    }
  };



  if (loading) {
    return (
      <Layout style={{ backgroundColor: COLORS.background, marginLeft: 220, width: "100%" }}>
        <Content style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <div style={{ textAlign: "center" }}>
            <Spin size="large" />
          </div>
        </Content>
      </Layout>
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
      <Content
        style={{
          width: "800px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <div style={{ width: "100%", maxWidth: 500 }}>
          <Row >
            <Button
            icon={<ArrowLeftOutlined />}
            type="text"
            onClick={() => navigate("/settings")}
            style={{
              color: "#21629B",
              fontWeight: 600,
              marginBottom: 10,
            }}
          />
            <Title
              level={4}
              style={{
                fontWeight: "bold",
                color: "#000",
                marginBottom: 25,
              }}
            >
              Account Information
            </Title>
          </Row>

          {/* Account Info Form */}
          <Form
            layout="vertical"
            form={form}
            onFinish={handleUpdate}
          >
            <Form.Item label="Full Name" name="name">
              <Input
                style={{
                  height: 45,
                  borderRadius: 6,
                  backgroundColor: "#F7F7F7",
                  border: "none",
                }}
              />
            </Form.Item>

            <Form.Item label="Email" name="email">
              <Input
                style={{
                  height: 45,
                  borderRadius: 6,
                  backgroundColor: "#F7F7F7",
                  border: "none",
                }}
              />
            </Form.Item>

            <Form.Item label="Phone Number" name="phone_number">
              <Input
                style={{
                  height: 45,
                  borderRadius: 6,
                  backgroundColor: "#F7F7F7",
                  border: "none",
                }}
              />
            </Form.Item>

            <Space direction="vertical" style={{ width: "100%", marginTop: 20 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                style={{
                  height: 45,
                  borderRadius: 6,
                  backgroundColor: "#9AB7D0",
                  border: "none",
                  fontWeight: 600,
                  color: "#000",
                }}
              >
                Update
              </Button>
            </Space>
          </Form>
        </div>
      </Content>

      
    </Layout>
  );
}

export default AccountInformation;
