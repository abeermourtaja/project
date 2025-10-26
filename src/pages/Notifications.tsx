import React from "react";
import { Drawer, Input, List, Typography, Space } from "antd";
import { CloseOutlined, MessageOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface NotificationsDrawerProps {
  open: boolean;
  onClose: () => void;
}

const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({ open, onClose }) => {
  const todayNotifications = [
    {
      title: "Motivation",
      message: "Learning is the key to success. Just keep going and be your best!",
      time: "Today · 13 minutes ago",
    },
    {
      title: "New Lecture",
      message: "A new lecture is waiting for you! Start now and check out the new course content.",
      time: "Today · 13 minutes ago",
    },
    {
      title: "Progress",
      message: "You're close to reaching the next level! Keep practicing!",
      time: "Today · 13 minutes ago",
    },
  ];

  const previousNotifications = [
    {
      title: "Achievement",
      message: "Great job! You’ve completed 50% of the course. Keep it up!",
      time: "15th Apr, 2025 · 13 minutes ago",
    },
    {
      title: "New Assignment",
      message: "A new assignment is available! Test your skills and achieve high grades.",
      time: "15th Apr, 2025 · 13 minutes ago",
    },
    {
      title: "New Exam",
      message: "Your next exam has been scheduled. Don’t forget to prepare!",
      time: "15th Apr, 2025 · 13 minutes ago",
    },
  ];

  return (
    <Drawer
      title={null}
      placement="right"
      onClose={onClose}
      open={open}
      width={360}
      closeIcon={false}
      bodyStyle={{ padding: 0, backgroundColor: "#f9f9f9" }}
    >
      {/* Header */}
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

      {/* Search bar */}
      <div style={{ padding: "12px 20px", borderBottom: "1px solid #eee" }}>
        <Input.Search
          placeholder="Search people and message"
          allowClear
          style={{
            borderRadius: 8,
            backgroundColor: "#fff",
          }}
        />
      </div>

      {/* Notification List */}
      <div style={{ padding: "10px 20px", overflowY: "auto", height: "calc(100vh - 150px)" }}>
        {/* Today Section */}
        <Title level={5} style={{ color: "#888", marginTop: 10 }}>
          Today
        </Title>
        <List
          itemLayout="horizontal"
          dataSource={todayNotifications}
          renderItem={(item) => (
            <List.Item style={{ borderBottom: "1px solid #f2f2f2", padding: "12px 0" }}>
              <Space align="start">
                <MessageOutlined style={{ fontSize: 20, color: "#333" }} />
                <div>
                  <Text strong>{item.title}</Text>
                  <br />
                  <Text style={{ color: "#666" }}>{item.message}</Text>
                  <br />
                  <Text style={{ fontSize: 12, color: "#aaa" }}>{item.time}</Text>
                </div>
              </Space>
            </List.Item>
          )}
        />

        {/* Previous Section */}
        <Title level={5} style={{ color: "#888", marginTop: 20 }}>
          15th Apr , 2025
        </Title>
        <List
          itemLayout="horizontal"
          dataSource={previousNotifications}
          renderItem={(item) => (
            <List.Item style={{ borderBottom: "1px solid #f2f2f2", padding: "12px 0" }}>
              <Space align="start">
                <MessageOutlined style={{ fontSize: 20, color: "#333" }} />
                <div>
                  <Text strong>{item.title}</Text>
                  <br />
                  <Text style={{ color: "#666" }}>{item.message}</Text>
                  <br />
                  <Text style={{ fontSize: 12, color: "#aaa" }}>{item.time}</Text>
                </div>
              </Space>
            </List.Item>
          )}
        />
      </div>
    </Drawer>
  );
};

export default NotificationsDrawer;
