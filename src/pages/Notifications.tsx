import React, { useEffect, useState } from "react";
import { Drawer, Input, List, Typography, Space, Spin, message, Badge } from "antd";
import { CloseOutlined, MessageOutlined, BellFilled } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

interface NotificationsDrawerProps {
  open: boolean;
  onClose: () => void;
  setOpen: (open: boolean) => void;
}

interface Notification {
  id: number;
  title: string;
  body: string;
  action_type: string;
  target_type: string;
  target_id: number;
  is_read: boolean;
  created_at: string;
}

const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({ open, onClose, setOpen }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { t } = useTranslation();

  // 🟢 يتم جلب الإشعارات من السيرفر كل مرة يتم فتح Drawer
  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open]);

  // 🟢 دالة جلب الإشعارات من الـ backend
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken"); // 🔐 جلب التوكين من التخزين
      const res = await fetch(
        "https://english-learning-app-backend-1-yrx3.onrender.com/api/v1/notifications/",
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ تمرير التوكين مع الطلب
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();

      // السيرفر أحياناً يرجع البيانات داخل results
      if (Array.isArray(data)) {
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => !n.is_read).length);
      } else if (data.results) {
        setNotifications(data.results);
        setUnreadCount(data.results.filter((n: Notification) => !n.is_read).length);
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (err) {
      console.error(err);
      message.error("حدث خطأ أثناء تحميل الإشعارات");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Badge count={unreadCount} size="small" style={{ backgroundColor: "#9AB7D0" }}>
      <BellFilled
        style={{
          fontSize: 22,
          color: "#000",
          cursor: "pointer",
        }}
        onClick={() => setOpen(true)}
      />
      <Drawer
        title={null}
        placement="right"
        onClose={onClose}
        open={open}
        width={360}
        closeIcon={false}
        bodyStyle={{ padding: 0, backgroundColor: "#f9f9f9" }}
      >
      {/* 🔹 Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 20px",
          borderBottom: "1px solid #eee",
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Notifications
        </Title>
        <CloseOutlined onClick={onClose} style={{ fontSize: 18, cursor: "pointer" }} />
      </div>

      {/* 🔹 Search bar */}
      <div style={{ padding: "12px 20px", borderBottom: "1px solid #eee" }}>
        <Input.Search
          placeholder="Search notifications"
          allowClear
          style={{
            borderRadius: 8,
            backgroundColor: "#fff",
          }}
        />
      </div>

      {/* 🔹 Notification List */}
      <div
        style={{
          padding: "10px 20px",
          overflowY: "auto",
          height: "calc(100vh - 150px)",
          textAlign: notifications.length === 0 ? "center" : "left",
        }}
      >
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 80 }}>
            <Spin size="large" />
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ marginTop: 100 }}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
              alt="No Notifications"
              style={{ width: 120, opacity: 0.5 }}
            />
            <Title level={5} style={{ color: "#999", marginTop: 20 }}>
              No Notification yet!
            </Title>
          </div>
        ) : (
          <>
            <Title level={5} style={{ color: "#888", marginTop: 10 }}>
              Today
            </Title>
            <List
              itemLayout="horizontal"
              dataSource={notifications}
              renderItem={(item) => (
                <List.Item
                  style={{
                    borderBottom: "1px solid #f2f2f2",
                    padding: "12px 0",
                  }}
                >
                  <Space align="start">
                    <MessageOutlined style={{ fontSize: 20, color: "#333" }} />
                    <div>
                      <Text strong>{item.title}</Text>
                      <br />
                      <Text style={{ color: "#666" }}>{item.body}</Text>
                      <br />
                      <Text style={{ fontSize: 12, color: "#aaa" }}>
                        {new Date(item.created_at).toLocaleString()}
                      </Text>
                    </div>
                  </Space>
                </List.Item>
              )}
            />
          </>
        )}
      </div>
    </Drawer>
    </Badge>
  );
};

export default NotificationsDrawer;