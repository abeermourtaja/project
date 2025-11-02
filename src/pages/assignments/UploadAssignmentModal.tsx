// 📁 src/components/UploadAssignmentModal.tsx
import {
  Modal,
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Typography,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import { getLectures, addAssignment } from "../../API/api";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;

interface UploadAssignmentModalProps {
  isModalVisible: boolean;
  handleCancel: () => void;
  setAssignments: React.Dispatch<React.SetStateAction<any[]>>;
}

const UploadAssignmentModal: React.FC<UploadAssignmentModalProps> = ({
  isModalVisible,
  handleCancel,
  setAssignments,
}) => {
  const [form] = Form.useForm();
  const [lectures, setLectures] = useState<any[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loadingLectures, setLoadingLectures] = useState(true);

  // ✅ جلب المحاضرات + التحقق من دور المستخدم
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserRole(user.role);
    }

    getLectures(token)
      .then((data) => {
        const lectureList = Array.isArray(data) ? data : data.results || [];
        setLectures(lectureList);
      })
      .catch(() => message.error("فشل في تحميل المحاضرات 😢"))
      .finally(() => setLoadingLectures(false));
  }, []);

// ✅ عند الضغط على "Upload"
const handleOk = async () => {
  const token = localStorage.getItem("accessToken"); // أو من authStore إذا موجود
  if (!token) {
    message.error("الرجاء تسجيل الدخول أولاً");
    return;
  }

  if (userRole !== "teacher") {
    message.warning("فقط المعلم يمكنه إضافة الواجبات!");
    return;
  }

  try {
    const values = await form.validateFields();

    if (!values.link) {
      message.error("يرجى إدخال رابط!");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const assignmentData = {
      title: values.title,
      description: values.description,
      due_date: dayjs(values.dueDate).format("YYYY-MM-DD"), // الصيغة الصحيحة
      lecture: values.lecture, // رقم lecture id
      file_url: values.fileLink,
      created_by: user.id,
    };

    const newAssignment = await addAssignment(token, assignmentData);

    message.success("✅ تم إضافة الواجب بنجاح!");
    setAssignments((prev: any[]) => [newAssignment, ...prev]);

    form.resetFields();
    handleCancel();
  } catch (error: any) {
    console.error("❌ Error adding assignment:", error);
    message.error("حدث خطأ أثناء إضافة الواجب.");
  }
};
  return (
    <Modal
      open={isModalVisible}
      footer={null}
      onCancel={handleCancel}
      centered
      width={400}
      style={{ borderRadius: 12, overflow: "hidden" }}
    >
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

      <div style={{ padding: "25px 35px" }}>
        <Form form={form} layout="vertical">
          <Form.Item
            label={<b>Assignment Title</b>}
            name="title"
            rules={[{ required: true, message: "Please enter assignment title" }]}
          >
            <Input
              placeholder="Enter assignment title"
              size="large"
              style={{ borderRadius: 10 }}
            />
          </Form.Item>

          <Form.Item
            label={<b>Assignment Description</b>}
            name="description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea
              placeholder="Write a short description"
              rows={2}
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

          <Form.Item
            label={<b>Select Lecture</b>}
            name="lecture"
            rules={[{ required: true, message: "Please select a lecture" }]}
          >
            <Select
              placeholder="Select lecture"
              loading={loadingLectures}
              style={{ borderRadius: 10 }}
            >
              {lectures.map((lec) => (
                <Option key={lec.id} value={lec.id}>
                  {lec.title}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={<b>Enter Link</b>}
            name="link"
            rules={[{ required: true, message: "Please enter a link" }]}
          >
            <Input
              placeholder="Enter a link (e.g., Google Drive, etc.)"
              size="large"
              style={{ borderRadius: 10 }}
            />
          </Form.Item>

          <Button
            type="primary"
            icon={<UploadOutlined />}
            block
            size="large"
            onClick={handleOk}
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
