import { useEffect, useState } from "react";
import { Dropdown, Space, type MenuProps } from "antd";
import {
  MoreOutlined,
  UploadOutlined,
  ShareAltOutlined,
  DownloadOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  LinkOutlined,
  MailOutlined,
} from "@ant-design/icons";

const DropdownMenu = () => {
  const [userRole, setUserRole] = useState<string | null>(null);

  // ✅ نقرأ الدور من localStorage (teacher أو student)
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserRole(user.role);
    }
  }, []);

  // ✅ نحدد إذا المستخدم معلم
  const isTeacher = userRole === "teacher";

  // ✅ القائمة
  const items: MenuProps["items"] = [
    {
      key: "open-with",
      label: (
        <span style={{ display: "flex", alignItems: "center" }}>
          <UploadOutlined style={{ marginRight: 8 }} /> Open with
        </span>
      ),
      children: [
        {
          key: "word",
          label: (
            <span style={{ display: "flex", alignItems: "center" }}>
              <FileTextOutlined style={{ marginRight: 8 }} /> Microsoft Word
            </span>
          ),
        },
        {
          key: "drive",
          label: (
            <span style={{ display: "flex", alignItems: "center" }}>
              <FolderOpenOutlined style={{ marginRight: 8 }} /> Google Drive
            </span>
          ),
        },
      ],
    },
    {
      key: "share",
      label: (
        <span style={{ display: "flex", alignItems: "center" }}>
          <ShareAltOutlined style={{ marginRight: 8 }} /> Share
        </span>
      ),
      children: [
        {
          key: "copy-link",
          label: (
            <span style={{ display: "flex", alignItems: "center" }}>
              <LinkOutlined style={{ marginRight: 8 }} /> Copy Link
            </span>
          ),
        },
        {
          key: "email",
          label: (
            <span style={{ display: "flex", alignItems: "center" }}>
              <MailOutlined style={{ marginRight: 8 }} /> Send via Email
            </span>
          ),
        },
      ],
    },
    {
      key: "download",
      label: (
        <span style={{ display: "flex", alignItems: "center" }}>
          <DownloadOutlined style={{ marginRight: 8 }} /> Download
        </span>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "edit",
      label: (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            color: isTeacher ? "#000" : "#bbb",
          }}
        >
          <EditOutlined style={{ marginRight: 8 }} /> Edit
        </span>
      ),
      disabled: !isTeacher, // 👈 الطالب ما يقدر يضغط
    },
    {
      key: "delete",
      label: (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            color: isTeacher ? "#d32029" : "#bbb",
          }}
        >
          <DeleteOutlined style={{ marginRight: 8 }} /> Delete
        </span>
      ),
      disabled: !isTeacher, // 👈 الطالب ما يقدر يحذف
    },
  ];

  return (
    <Dropdown
      menu={{
        items,
        style: {
          borderRadius: 10,
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          padding: "6px 0",
          width: 200,
        },
      }}
      trigger={["click"]}
      placement="bottomRight"
    >
      <Space>
        <MoreOutlined
          style={{
            fontSize: 20,
            color: "#888",
            cursor: "pointer",
          }}
        />
      </Space>
    </Dropdown>
  );
};

export default DropdownMenu;
