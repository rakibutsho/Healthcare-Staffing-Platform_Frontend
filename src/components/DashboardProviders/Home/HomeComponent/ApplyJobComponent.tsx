"use client";

import { useState, useEffect, useMemo } from "react";
import { Button, Radio, Space, Typography, Upload, message, Modal } from "antd";
import type { RadioChangeEvent, UploadProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import Image from "next/image";
import pdf_file from "../../../../assets/icons/bxs_file-pdf.png";
import congratulations from "@/assets/images/congratulations.png";

import {
  useApplyJobMutation,
  useGetJobByIdQuery,
} from "@/redux/features/(Providers)/profileProvider/providerJobApi";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useGetProviderProfileQuery,
  useSelectUploadedResumeMutation,
  useUpdateProviderDocumentMutation,
} from "@/redux/features/(Providers)/profileProvider/profileProviderApi";
import { toast } from "sonner";
import Spinner from "@/components/common/Spinner";

const { Title, Text } = Typography;

export default function ApplyJobComponent() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("id");
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [submitMessage, setSubmitMessage] = useState(false); // Modal state

  const {
    data,
    isLoading: profileLoading,
    refetch,
  } = useGetProviderProfileQuery("");
  const [selectResumeApi] = useSelectUploadedResumeMutation();
  const [updateDocumentApi] = useUpdateProviderDocumentMutation();

  const { data: jobData, isLoading: jobLoading } = useGetJobByIdQuery(jobId);
  const [apply_job] = useApplyJobMutation();

  const [selectedResume, setSelectedResume] = useState<string | null>(null);

  // ✅ Filter documents to include only those with valid URL & fileName
  const documents = useMemo(() => {
    const docs = data?.result?.providerProfile?.document || [];
    return docs.filter(
      (doc: any) => doc?.url?.trim() !== "" && doc?.fileName?.trim() !== ""
    );
  }, [data]);

  // Set selected resume if one is marked as selected
  useEffect(() => {
    const selectedDoc = documents.find((doc: any) => doc.isSelected);
    if (selectedDoc) {
      setSelectedResume(selectedDoc.url);
    } else {
      setSelectedResume(null); // No valid document selected
    }
  }, [documents]);

  // Handle resume selection
  const handleResumeChange = async (e: RadioChangeEvent) => {
    const selectedUrl = e.target.value;
    setSelectedResume(selectedUrl);

    try {
      await selectResumeApi({ url: selectedUrl }).unwrap();
      toast.success("Resume selected successfully!");
    } catch {
      message.error("Failed to select resume");
    }
  };

  // Clock update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle resume upload
  const handleUpload: UploadProps["customRequest"] = async (options) => {
    const { file, onSuccess, onError } = options;
    try {
      const rcFile = file as RcFile;
      const formData = new FormData();
      formData.append("document", rcFile);

      const res = await updateDocumentApi(formData).unwrap();
      toast.success("Resume uploaded successfully!");
      refetch();

      // Select newly uploaded resume if it has URL
      const newDoc = res?.result?.document?.slice(-1)[0];
      if (newDoc?.url?.trim() !== "") {
        setSelectedResume(newDoc.url);
        await selectResumeApi({ url: newDoc.url }).unwrap();
      }

      if (onSuccess) onSuccess("ok");
    } catch (error) {
      if (onError) onError(error as Error);
      message.error("Upload failed!");
    }
  };

  // Handle job application
  const handleSubmit = async () => {
    if (!selectedResume) {
      toast.warning("Please select or upload a resume before applying");
      return;
    }

    try {
      const payload = {
        jobId: jobId as string,
        facilityUserId: job?.user?.id,
      };

      await apply_job(payload).unwrap();
      toast.success("Applied successfully!");
      setSubmitMessage(true); // Show congratulations modal
    } catch (err: any) {
      console.error("Apply job error:", err);
      const errorMessage =
        err?.data?.message ||
        err?.error ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => router.push("/dashboard");

  const handleHomePage = () => router.push("/dashboard");

  if (profileLoading || jobLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  const job = jobData?.result;

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <Title
          level={2}
          style={{ margin: 0, fontSize: "24px", fontWeight: 600 }}
        >
          Apply to {job?.user?.facilityProfile?.facilityName || "Facility"}
        </Title>
        <div className="text-right bg-white px-5 py-3 rounded shadow">
          <div className="text-sm font-semibold text-gray-900">
            {currentTime.toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div className="text-xs text-gray-500">
            {currentTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </div>
        </div>
      </div>

      {/* Resume Section */}
      <div className="p-6 w-full md:w-md mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 max-w-2xl mx-auto">
          <div className="mb-6">
            <Title
              level={3}
              style={{
                margin: 0,
                marginBottom: "8px",
                fontSize: "20px",
                fontWeight: 600,
              }}
            >
              Resume
            </Title>
            <Text type="secondary" style={{ fontSize: "14px" }}>
              Be sure to include an updated resume
            </Text>
          </div>

          {/* Resume Selection */}
          <div className="space-y-4 mb-8">
            {documents.length > 0 ? (
              <Radio.Group
                value={selectedResume}
                onChange={handleResumeChange}
                className="w-full"
              >
                <Space direction="vertical" className="w-full" size={16}>
                  {documents.map((doc: any) => (
                    <div key={doc?.url} className="w-full">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded flex items-center justify-center">
                            <Image
                              width={40}
                              height={40}
                              src={pdf_file}
                              alt="pdf"
                              className="w-8 h-8 object-contain"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm break-words max-w-full">
                              {doc?.fileName}
                            </div>
                          </div>
                        </div>
                        <Radio value={doc?.url} />
                      </div>
                    </div>
                  ))}
                </Space>
              </Radio.Group>
            ) : (
              <Text type="secondary" className="text-gray-500">
                No resumes uploaded yet. Please upload a resume to apply.
              </Text>
            )}
          </div>

          {/* Upload Button */}
          <div className="mb-8 w-full">
            <Upload
              customRequest={handleUpload}
              showUploadList={false}
              accept=".pdf,.doc,.docx"
              className="w-full"
            >
              <Button
                type="default"
                icon={<UploadOutlined />}
                className="w-full border-2 border-dashed border-blue-300 text-blue-600 hover:border-blue-400 hover:text-blue-700"
                style={{
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 500,
                  height: "42px",
                  width: "100%",
                }}
              >
                Upload resume
              </Button>
            </Upload>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button
              size="large"
              onClick={handleCancel}
              className="flex-1 h-12 w-full"
              style={{ borderRadius: "8px", fontSize: "14px", fontWeight: 500 }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              size="large"
              onClick={handleSubmit}
              className="flex-1 h-12"
              style={{
                backgroundColor: "#14b8a6",
                borderColor: "#14b8a6",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>

      {/* Congratulations Modal */}
      <Modal
        open={submitMessage}
        onCancel={() => setSubmitMessage(false)}
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
            You have successfully applied for the job.
          </p>
        </div>

        <Button
          type="primary"
          block
          size="large"
          onClick={handleHomePage}
          style={{
            height: "48px",
            fontSize: "16px",
            fontWeight: "500",
            borderRadius: "8px",
            backgroundColor: "#14b8a6",
            borderColor: "#14b8a6",
          }}
        >
          Go To Dashboard
        </Button>
      </Modal>
    </div>
  );
}
