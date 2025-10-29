import { Modal, Upload, Button, Form, Input } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";

interface AddSubmissionModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (files: any[]) => void;
}

function AddSubmissionModal({ visible, onCancel, onSubmit }: AddSubmissionModalProps) {
  const [fileList, setFileList] = useState<any[]>([]);

  const handleUpload = (info: any) => {
    setFileList(info.fileList);
  };

  const handleOk = () => {
    onSubmit(fileList);
    setFileList([]);
  };

  return (
    <Modal
      title="Add Submission"
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Submit"
      centered
      width={450}
      bodyStyle={{ padding: "25px 30px" }}
    >
      
      <Form layout="vertical">
        <Form.Item label="Upload your file">
          <Upload
            beforeUpload={() => false}
            fileList={fileList}
            onChange={handleUpload}
            multiple={false}
          >
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Form.Item>

      </Form>
    </Modal>
  );
}

export default AddSubmissionModal;
