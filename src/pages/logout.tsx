import React, { useState } from "react";
import { Modal, Button, Typography } from "antd";

const { Text } = Typography;

interface LogoutModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

function LogoutModal({ visible, onCancel, onConfirm }: LogoutModalProps) {
  return (
    <Modal
      open={visible}
      centered
      footer={null}
      closable={false}
      width={400}
      bodyStyle={{
        textAlign: "center",
        padding: "30px 20px",
        borderRadius: "10px",
      }}
    >
      <h2 style={{ fontWeight: "bold", marginBottom: 15 }}>
        Are you sure you want to logout?
      </h2>
      <p style={{ fontSize: 15, color: "#666", marginBottom: 0 }}>
        You are about to be logged out of your account. This will end your current session. Do you want to proceed?
      </p>

      <div style={{ marginTop: 30, display: "flex", justifyContent: "center", gap: 10 }}>
        <Button
          onClick={onCancel}
          style={{
            width: 120,
            height: 40,
            backgroundColor: "#e5e5e5",
            border: "none",
            fontWeight: 500,
          }}
        >
          Cancel
        </Button>
        <Button
          type="primary"
          onClick={onConfirm}
          style={{
            width: 120,
            height: 40,
            backgroundColor: "#a5c4dc",
            border: "none",
            fontWeight: 500,
            color: "#000",
          }}
        >
          Logout
        </Button>
      </div>
    </Modal>
  );
}

export default LogoutModal;
