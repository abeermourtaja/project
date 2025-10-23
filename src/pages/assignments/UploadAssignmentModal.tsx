import { Modal, Form, Input, Button, Upload, DatePicker, Typography } from "antd";
import { UploadOutlined, FileAddOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import type { UploadFile } from "antd/es/upload/interface";

const { Title } = Typography;

interface UploadAssignmentModalProps {
  isModalVisible: boolean;
  handleOk: () => void;
  handleCancel: () => void;
}

const UploadAssignmentModal: React.FC<UploadAssignmentModalProps> = ({ isModalVisible, handleOk, handleCancel }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleFileChange = ({ fileList }: { fileList: UploadFile[] }) => setFileList(fileList);

  const handleSubmit = () => {
    form.validateFields().then(values => {
      console.log({
        ...values,
        file: fileList[0],
      });
      form.resetFields();
      setFileList([]);
      handleOk();
    });
  };

  return (
    <Modal
      open={isModalVisible}
      footer={null}
      onCancel={handleCancel}
      centered
      width={400}
      height={550}
      style={{ borderRadius: 12, overflow: "hidden" }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "#B8CDE0",
          padding: "15px",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          textAlign: "center",
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Add Assignment
        </Title>
      </div>

      {/* Form */}
      <div style={{ padding: "25px 35px" }}>
        <Form form={form} layout="vertical">
          <Form.Item
            label={<b>Assignment Title</b>}
            name="title"
            rules={[{ required: true, message: "Please enter assignment title" }]}
          >
            <Input placeholder="Enter assignment title" size="large" style={{ borderRadius: 10 }} />
          </Form.Item>

          <Form.Item
            label={<b>Assignment Description</b>}
            name="description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea

              placeholder="Write a short description"
              rows={1}
              style={{ borderRadius: 10 }}
            />
          </Form.Item>

          <Form.Item
            label={<b>Due Date</b>}
            name="dueDate"
            rules={[{ required: true, message: "Please select due date" }]}
          >
            <DatePicker
              size="large"
              style={{ width: "100%", borderRadius: 10 }}
              placeholder="Select due date"
            />
          </Form.Item>

          <Form.Item label={<b>Attach File</b>} name="file">
            <Upload
              beforeUpload={() => false}
              onChange={handleFileChange}
              fileList={fileList}
              maxCount={1}
              accept=".pdf,.doc,.docx,.zip"
            >
              <Button
                icon={<FileAddOutlined />}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: 10,
                  height: 50,
                  width: "100%",
                  fontWeight: 600,
                }}
              >
                Add File
              </Button>
            </Upload>
          </Form.Item>

          <Button
            type="primary"
            icon={<UploadOutlined />}
            block
            size="large"
            onClick={handleSubmit}
            style={{
              backgroundColor: "#B8CDE0",
              border: "none",
              color: "#000",
              borderRadius: 10,
              fontWeight: 600,
              height: 50,
              marginTop: 10,
            }}
          >
            Upload
          </Button>
        </Form>
      </div>
    </Modal>
  );
};

export default UploadAssignmentModal;
