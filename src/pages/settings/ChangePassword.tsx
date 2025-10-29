import { Layout, Typography, Input, Button, Form, Row } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { COLORS } from "../../constants/colors";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;
const { Title } = Typography;

function ChangePassword() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = (values: any) => {
    console.log("Password changed:", values);
  };

  return (
    <Layout
      style={{
        backgroundColor: COLORS.background,
        marginLeft: 220,
        width: "100%",
        minHeight: "100vh",
      }}
    >
      <Content
        style={{
          width: "800px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          paddingTop: "100px",
        }}
      >
        <div style={{ width: "100%", maxWidth: 500 }}>
          {/* Back button and title */}
          <Row align="middle">
            <Button
              icon={<ArrowLeftOutlined />}
              type="text"
              onClick={() => navigate("/settings")}
              style={{
                color: "#000",
                fontWeight: 600,
                marginBottom: 10,
                fontSize: 16,
              }}
            />
            <Title
              level={4}
              style={{
                fontWeight: "bold",
                color: "#000",
                marginLeft: 5,
                marginBottom: 25,
              }}
            >
              Change Password
            </Title>
          </Row>

          {/* Change Password Form */}
          <Form
            layout="vertical"
            form={form}
            onFinish={handleSubmit}
            requiredMark={false}
          >
            <Form.Item
              label="Current password"
              name="currentPassword"
              rules={[{ required: true, message: "Please enter your current password" }]}
            >
              <Input.Password
                placeholder="current Password"
                style={{
                  height: 45,
                  borderRadius: 6,
                  backgroundColor: "#F7F7F7",
                  border: "none",
                }}
              />
            </Form.Item>

            <Form.Item
              label="New password"
              name="newPassword"
              rules={[{ required: true, message: "Please enter your new password" }]}
            >
              <Input.Password
                placeholder="New Password"
                style={{
                  height: 45,
                  borderRadius: 6,
                  backgroundColor: "#F7F7F7",
                  border: "none",
                }}
              />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="New Password"
                style={{
                  height: 45,
                  borderRadius: 6,
                  backgroundColor: "#F7F7F7",
                  border: "none",
                }}
              />
            </Form.Item>

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
                marginTop: 10,
              }}
            >
              Confirm
            </Button>
          </Form>
        </div>
      </Content>
    </Layout>
  );
}

export default ChangePassword;
