import {
  Modal,
  Form,
  Upload,
  Button,
  Typography,
  message,
  Spin,
} from "antd";
import { FileAddOutlined } from "@ant-design/icons";
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
  const [fileObj, setFileObj] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = ({ fileList }: any) => {
    setFileObj(fileList[0]?.originFileObj || null);
  };


  const handleOk = async () => {
    if (!assignment) {
      message.error("يرجى اختيار الواجب أولاً!");
      return;
    }
    if (!fileObj) {
      message.error("يرجى رفع الملف أولاً!");
      return;
    }

    try {
      setUploading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Token not found");

      // 1️⃣ Upload file to backend
      // const fileUrl = await uploadFile(fileObj);

      // 2️⃣ Prepare submission payload
      const submissionData = {
        assignment: assignment.id,
        file_url: "https://example.com/file.pdf",
        grade: null,
      };

      // 3️⃣ Add submission
      const newSubmission = await addSubmission(token, submissionData);

      message.success("✅ تم إضافة التسليم بنجاح!");
      onSubmit(newSubmission);
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
        <Form layout="vertical">
          <Form.Item label={<b>Attach File</b>} name="file">
            <Upload
              beforeUpload={() => false} // Prevent auto upload
              onChange={handleFileChange}
              maxCount={1}
              accept=".pdf,.doc,.docx,.zip,.txt"
            >
              <Button
                icon={<FileAddOutlined />}
                style={{ borderRadius: 10, width: "100%", height: 50, fontWeight: 600 }}
              >
                Select File
              </Button>
            </Upload>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default AddSubmissionModal;
