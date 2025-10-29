import { Layout, Typography, Button, Space, Divider } from "antd";
import {
  InfoCircleOutlined,
  LockOutlined,
  GlobalOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { COLORS } from "../../constants/colors";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;
const { Title } = Typography;

function Settings() {
    const navigate = useNavigate();
  return (
    <Layout
      style={{
        backgroundColor: COLORS.background,
        marginLeft: 220,
        padding: "30px",
        width: "100%",
      }}
    >
      <Content style={{ width: "100%" }}>
        <div style={{ padding: "30px " }}>
          {/* 🔹 Page Title */}
          <Title
            level={3}
            style={{
              color: "#21629B",
              marginBottom: 30,
              fontWeight: 700,
              fontFamily: "Segoe UI, sans-serif",
            }}
          >
            Settings
          </Title>

          {/* ================== ACCOUNT DETAILS ================== */}
          <div
            style={{
              borderRadius: 8,
              padding: "10px 20px",
              marginBottom: 20,
            }}
          >
            <Title
              level={4}
              style={{
                color: "#000",
                fontWeight: "bold",
                marginBottom: 15,
                backgroundColor:"#F3F3F3",
                padding:"16px",
                borderRadius:6
              }}
            >
              Account details
            </Title>

            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Button
                icon={<InfoCircleOutlined />}
                type="text"
                block
                style={{
                  justifyContent: "flex-start",
                  fontSize: 16,
                  height: 45,
                  textAlign: "left",
                  width:"1000px",
                }}
                onClick={() => navigate("/settings/account-information")}
              >
                Account Information
              </Button>

              <Button
                icon={<LockOutlined />}
                type="text"
                block
                style={{
                  justifyContent: "flex-start",
                  fontSize: 16,
                  height: 45,
                  textAlign: "left",
                }}
                onClick={() => navigate("/settings/change-password")}
              >
                Change Password
              </Button>
            </Space>
          </div>

          {/* ================== PREFERENCES ================== */}
          <div
            style={{
              borderRadius: 8,
              padding: "10px 20px",
            }}
          >
            <Title
              level={4}
              style={{
                color: "#000",
                fontWeight: "bold",
                marginBottom: 15,
                backgroundColor:"#F3F3F3",
                padding:"16px",
                borderRadius:6
              }}
            >
              Preferences
            </Title>

            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Button
                icon={<GlobalOutlined />}
                type="text"
                block
                style={{
                  justifyContent: "flex-start",
                  fontSize: 16,
                  height: 45,
                  textAlign: "left",
                }}
                onClick={() => navigate("/settings/language")}
              >
                Language
              </Button>

              <Button
                icon={<FileTextOutlined />}
                type="text"
                block
                style={{
                  justifyContent: "flex-start",
                  fontSize: 16,
                  height: 45,
                  textAlign: "left",
                }}
              >
                Terms and Conditions
              </Button>
              <Button
                icon={<SafetyCertificateOutlined />}
                type="text"
                block
                style={{
                  justifyContent: "flex-start",
                  fontSize: 16,
                  height: 45,
                  textAlign: "left",
                }}
              >
                Privacy Policy
              </Button>
            </Space>
          </div>
        </div>
      </Content>
    </Layout>
  );
}

export default Settings;
