import { Layout, Typography, Input, Button, Form, Space, Row, message, Modal, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { COLORS } from "../../constants/colors";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserProfile, updateUserProfile, deleteUserAccount } from "../../API/api";

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
        setUserData(data);
        form.setFieldsValue({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
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

  const handleDelete = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    try {
      await deleteUserAccount(token);
      message.success("✅ تم حذف الحساب بنجاح!");
      localStorage.clear();
      navigate("/login");
    } catch (error: any) {
      console.error("❌ Error deleting account:", error);
      message.error("حدث خطأ أثناء حذف الحساب.");
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

            <Form.Item label="Phone Number" name="phone">
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

              <Button
                block
                onClick={() => setDeleteModalVisible(true)}
                style={{
                  height: 45,
                  borderRadius: 6,
                  backgroundColor: "#fff",
                  border: "1px solid #9AB7D0",
                  color: "#21629B",
                  fontWeight: 500,
                }}
              >
                Delete My Account
              </Button>
            </Space>
          </Form>
        </div>
      </Content>

      {/* Delete Account Confirmation Modal */}
      <Modal
        title="Confirm Account Deletion"
        open={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setDeleteModalVisible(false)}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete your account? This action cannot be undone.</p>
      </Modal>
    </Layout>
  );
}

export default AccountInformation;
