import React from "react";
import { Modal, Button } from "antd";
import Image from "next/image";
import congratulations from "@/assets/images/congratulations.png";

export default function SubmitSuccessModal({
  open,
  onClose,
  onGoHome,
}: {
  open: boolean;
  onClose: () => void;
  onGoHome: () => void;
}) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={500}
      closable={false}
      style={{
        borderRadius: "12px",
        textAlign: "center",
        padding: "30px 20px",
      }}
    >
      <div className="flex items-center justify-center flex-col">
        <Image
          width={1000}
          height={1000}
          src={congratulations}
          alt="congratulations"
          className="w-50 rounded-full object-fill"
        />
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "600",
            marginBottom: "8px",
            color: "#333",
          }}
        >
          Congratulations
        </h2>
        <p style={{ fontSize: "16px", color: "#666", marginBottom: "24px" }}>
          Your account is created successfully.
        </p>
      </div>
      <Button
        type="primary"
        block
        size="large"
        onClick={onGoHome}
        style={{
          height: "48px",
          fontSize: "16px",
          fontWeight: "500",
          borderRadius: "8px",
          backgroundColor: "#14b8a6",
          borderColor: "#14b8a6",
        }}
      >
        Go To Home
      </Button>
    </Modal>
  );
}
