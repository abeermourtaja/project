import { Layout, Typography, Select, Button, Row, Form, Col, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { COLORS } from "../../constants/colors";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

function LanguageSettings() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { t, i18n } = useTranslation();

  const handleSave = async (values: { language: string }) => {
    try {
      // Change language in i18n
      await i18n.changeLanguage(values.language);
      // Save to localStorage
      localStorage.setItem("preferredLanguage", values.language);
      message.success(t("Preferred language saved!"));
      navigate("/settings");
    } catch (error) {
      console.error("Error saving language:", error);
      message.error(t("An error occurred while saving the language"));
    }
  };

  const handleCancel = () => {
    form.resetFields();
    navigate("/settings");
  };
  return (
    <Layout
      style={{
        backgroundColor: COLORS.background,
        marginLeft: 220,
        width: "calc(100% - 220px)",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Content
        style={{
          width: "100%",
          maxWidth: 500,
          backgroundColor: "#fff",
          padding: "40px 50px",
          borderRadius: 10,
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
        }}
      >
        {/* Back button and title */}
        <Row align="middle" style={{ marginBottom: 25 }}>
          <Button
            icon={<ArrowLeftOutlined />}
            type="text"
            onClick={() => navigate("/settings")}
            style={{
              color: "#000",
              fontWeight: 600,
              fontSize: 16,
              marginRight: 8,
            }}
          />
          <Title
            level={4}
            style={{
              fontWeight: "bold",
              color: "#000",
              margin: 0,
            }}
          >
            {t("Preferred Language")}
          </Title>
        </Row>

        {/* Language Form */}
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSave}
          initialValues={{ language: i18n.language || localStorage.getItem("preferredLanguage") || "en" }}
          requiredMark={false}
        >
          <Form.Item label={t("Select Language")} name="language">
            <Select
              size="large"
              style={{
                width: "100%",
                borderRadius: 6,
              }}
            >
              <Option value="en">English</Option>
              <Option value="ar">Arabic</Option>
            </Select>
          </Form.Item>

         <Form.Item style={{ marginTop: 30 }}>
            <Row gutter={12} justify="center">
              <Col span={12}>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  style={{
                    height: 45,
                    borderRadius: 6,
                    backgroundColor: "#9AB7D0",
                    border: "none",
                    width:"140px",
                    fontWeight: 500,
                    color: "#000",
                  }}
                >
                  {t("Save Changes")}
                </Button>
              </Col>

              <Col span={12}>
                <Button
                  block
                  onClick={handleCancel}
                  style={{
                    height: 45,
                    borderRadius: 6,
                    width:"140px",
                    backgroundColor: "#fff",
                    border: "1px solid #9AB7D0",
                    color: "#21629B",
                    fontWeight: 500,
                  }}
                >
                  {t("Cancel")}
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
}

export default LanguageSettings;
