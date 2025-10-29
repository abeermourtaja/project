import { Layout, Typography, Input, Button, Form, Space, Row } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { COLORS } from "../../constants/colors";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;
const { Title } = Typography;

function AccountInformation() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleUpdate = (values: any) => {
    console.log("Updated info:", values);
  };

  const handleDelete = () => {
    console.log("Account deleted");
  };

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
            initialValues={{
              name: "Ahmed Ali",
              email: "Ahmed.Ali@gmail.com",
              phone: "+972592894561",
            }}
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
                onClick={handleDelete}
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
    </Layout>
  );
}

export default AccountInformation;
