"use client";
import React from "react";
import type { UploadFile } from "antd/es/upload/interface";
import CredentialsUpload from "../CredentialsUpload";

interface StepDocumentsProps {
  fileList: UploadFile[];
  setFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>;
  onNext: () => void;
}

export default function StepDocuments({
  fileList,
  setFileList,
  onNext,
}: StepDocumentsProps) {
  return (
    <CredentialsUpload
      fileList={fileList}
      setFileList={setFileList}
      handleDocumentUpload={onNext}
    />
  );
}
