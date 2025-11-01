import {
  Modal,
  Form,
  Input,
  Button,
  Typography,
  message,
  Spin,
} from "antd";
import { useState } from "react";
import { addSubmission } from "../../API/api";


interface AddSubmissionModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (submission: any) => void;
  assignment: { id: number; title: string } | null;
}

const AddSubmissionModal: React.FC<AddSubmissionModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  assignment,
}) => {
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [paddingTop, setPaddingTop] = useState(450); // default padding top

  const handleOk = async () => {
    if (!assignment) {
      message.error("يرجى اختيار الواجب أولاً!");
      return;
    }

    try {
      const values = await form.validateFields();

      if (!values.link) {
        message.error("يرجى إدخال رابط!");
        return;
      }

      setUploading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Token not found");

      // 2️⃣ Prepare submission payload
      const submissionData = {
        assignment: assignment.id,
        file_url: values.link,
        grade: null,
      };

      // 3️⃣ Add submission
      const newSubmission = await addSubmission(token, submissionData);

      message.success("✅ تم إضافة التسليم بنجاح!");
      onSubmit(newSubmission);
      setPaddingTop((prev) => prev + 70);

// Scroll to top so the lecture appears immediately
    window.scrollTo({ top: 0, behavior: "smooth" });
      form.resetFields();
      onCancel();
    } catch (err) {
      console.error(err);
      message.error("حدث خطأ أثناء إضافة التسليم!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      title={`Submit to ${assignment?.title || "Assignment"}`}
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Submit"
      centered
      width={400}
      bodyStyle={{ padding: "25px 35px" }}
    >
      {uploading ? (
        <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
      ) : (
        <Form form={form} layout="vertical">
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
        </Form>
      )}
    </Modal>
  );
};

export default AddSubmissionModal;
