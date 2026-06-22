"use client";
import React, { useCallback } from "react";
import { Upload, Button } from "antd";
import {
  InboxOutlined,
  UploadOutlined,
  DeleteOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";

const { Dragger } = Upload;

interface CredentialsUploadProps {
  handleDocumentUpload: () => void;
  fileList: UploadFile[];
  setFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>;
}

const CredentialsUpload = ({
  handleDocumentUpload,
  fileList,
  setFileList,
}: CredentialsUploadProps) => {
  const props: UploadProps = {
    name: "file",
    multiple: true,
    accept: ".jpg,.jpeg,.png,.pdf",
    fileList,
    showUploadList: false, // Disable Ant Design default list
    beforeUpload(file) {
      setFileList((prev) => [...prev, file]);
      return false; // prevent auto upload
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const onClearFiles = useCallback(() => {
    setFileList([]);
  }, [setFileList]);

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Upload your credentials</h2>
      <p className="text-gray-500 mb-6">
        Drag and drop or select files to upload. We&apos;ll automatically tag
        them by type.
      </p>

      <Dragger {...props} className="bg-gray-50 rounded-lg mb-6 p-10">
        <p className="ant-upload-drag-icon flex justify-center text-blue-500 mb-2">
          <InboxOutlined className="text-4xl" />
        </p>
        <p className="ant-upload-text text-base font-semibold text-gray-700 mb-1">
          Upload documents
        </p>
        <p className="ant-upload-hint mb-3 text-gray-500">Choose a file</p>
        <Button icon={<UploadOutlined />}>Select Files</Button>
      </Dragger>

      <div className="text-center text-gray-500 text-sm mt-6">
        Upload your credentials: JPG, PNG, PDF
      </div>

      {fileList.length > 0 && (
        <>
          <div className="mt-6 space-y-2">
            {fileList.map((file) => (
              <div
                key={file.uid}
                className="flex items-center justify-between bg-gray-100 rounded px-3 py-2"
              >
                <span className="truncate text-gray-700 text-sm">
                  📎 {file.name}
                </span>
                <Button
                  type="text"
                  icon={<DeleteOutlined className="text-red-500" />}
                  onClick={() =>
                    setFileList((prev) =>
                      prev.filter((item) => item.uid !== file.uid)
                    )
                  }
                />
              </div>
            ))}
          </div>
        </>
      )}
      <div className="mt-4 flex justify-center gap-4">
        <Button
          htmlType="submit"
          size="large"
          onClick={onClearFiles}
          block
          style={{
            borderColor: "red",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 500,
            color: "red",
          }}
        >
          Clear all files
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          onClick={handleDocumentUpload}
          icon={<CloudUploadOutlined />}
          style={{
            backgroundColor: "#14b8a6",
            borderColor: "#14b8a6",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          Upload Documents{" "}
        </Button>
      </div>
    </div>
  );
};

export default CredentialsUpload;
