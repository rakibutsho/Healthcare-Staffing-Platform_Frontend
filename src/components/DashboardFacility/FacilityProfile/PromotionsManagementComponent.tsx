"use client";

import {
  useCreatePromotionsRunningMutation,
  useGetPromotionsHistoryQuery,
  useGetPromotionsRunningQuery,
} from "@/redux/features/(Facility)/profileFacility/promotionsManagementFacilityApi";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Select, Upload, UploadFile } from "antd";
import Link from "next/link";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import StripePaymentModal from "./StripePaymentModal";

function PromotionsManagementComponent() {
  const [createPromotionRunning, { isLoading }] =
    useCreatePromotionsRunningMutation();
  const { data: promotionsRunningData } = useGetPromotionsRunningQuery({});
  const { data: promotionsHistoryData } = useGetPromotionsHistoryQuery({});

  console.log("Promotions Running Data:", promotionsHistoryData);

  const promotions = promotionsRunningData?.result?.data ?? [];
  const promotionsHistory = promotionsHistoryData?.result?.data ?? [];

  const [form] = Form.useForm();
  const [createPromotion, setCreatePromotion] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("Running");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  // Only store non-sensitive promotion data
  const [promotionFormData, setPromotionFormData] = useState<any>(null);
  const [submittingPromotion, setSubmittingPromotion] =
    useState<boolean>(false);

  const tabs: string[] = ["Running", "History"];

  const formatDateToISO = (dateString: string, isEnd: boolean = false) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isEnd) date.setHours(23, 59, 59, 999);
    return date.toISOString();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Only store non-payment related data
      const nonSensitiveData = {
        promotionType: values?.promotion_type,
        caption: values?.caption,
        startTime: formatDateToISO(values?.startTime, false),
        endTime: formatDateToISO(values?.endTime, false),
        value: parseFloat(values?.value) || 20.0,
      };

      console.log("Promotion Data (non-sensitive):", nonSensitiveData);

      // Store only business logic data, no payment info
      setPromotionFormData({
        formData: nonSensitiveData,
        file: fileList.length > 0 ? fileList[0].originFileObj : null,
      });

      setCreatePromotion(false);
      setShowPaymentModal(true);
    } catch (error) {
      toast.error("Please fill in all required fields");
    }
  };

  const handlePaymentSuccess = useCallback(
    async (paymentMethodId: string) => {
      setSubmittingPromotion(true);
      try {
        const formData = new FormData();

        const completePromotionData = {
          ...promotionFormData?.formData,
          paymentMethodId,
        };

        formData?.append("bodyData", JSON.stringify(completePromotionData));
        if (promotionFormData?.file) {
          formData?.append("promotionImage", promotionFormData?.file);
        }

        const res = await createPromotionRunning(formData).unwrap();

        if (res.success) {
          toast.success(res.message || "Promotion created successfully!");

          // Clear all data immediately after successful submission
          setShowPaymentModal(false);
          setPromotionFormData(null);
          form.resetFields();
          setFileList([]);
        } else {
          toast.error(res.message || "Failed to create promotion");
        }
      } catch (error) {
        toast.error("An error occurred while creating the promotion");
        console.error("Promotion creation error:", error);
      } finally {
        setSubmittingPromotion(false);
      }
    },
    [promotionFormData, createPromotionRunning, form],
  );

  const handlePaymentCancel = useCallback(() => {
    setShowPaymentModal(false);
    setCreatePromotion(true);
    // Don't clear promotionFormData so user can modify and retry
    toast.info(
      "Payment cancelled. You can modify your promotion and try again.",
    );
  }, []);

  const handleUploadChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
  };

  const beforeUpload = (file: UploadFile) => {
    const isImage = file.type ? file.type.startsWith("image/") : false;
    if (!isImage) {
      toast.error("You can only upload image files!");
      return false;
    }
    const isSmallEnough = (file.size ?? 0) / 1024 / 1024 < 2;
    if (!isSmallEnough) {
      toast.error("Image must be smaller than 2MB!");
      return false;
    }
    return false;
  };

  const calculateDuration = (start: string, end: string) => {
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // Clear sensitive data when component unmounts
  const clearSensitiveData = useCallback(() => {
    setPromotionFormData(null);
    setFileList([]);
    form.resetFields();
  }, [form]);

  return (
    <div className=" p-4 sm:p-6 space-y-4">
      <div className="absolute top-4 right-4 z-50">
        <Button
          type="primary"
          size="large"
          onClick={() => setCreatePromotion(true)}
          style={{
            backgroundColor: "#14b8a6",
            borderColor: "#14b8a6",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          Create Promotion
        </Button>
      </div>

      <div className="p-2 bg-white rounded-4xl flex items-center flex-wrap gap-4">
        {tabs.map((item, index) => (
          <h1
            key={index}
            onClick={() => setActiveTab(item)}
            className={`px-6 py-3 rounded-4xl cursor-pointer ${
              activeTab === item ? "bg-[#193E58] text-white" : "bg-gray-100"
            }`}
          >
            {item}
          </h1>
        ))}
      </div>

      <div className="gap-4 p-5 border border-white bg-white rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
          {activeTab === "Running" ? (
            promotions.length > 0 ? (
              promotions.map((item: any) => (
                <div
                  key={item.id}
                  className="max-w-md p-6 mb-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-lg font-bold text-gray-800 mb-2">
                        {new Date(item.startTime).toLocaleDateString()} -{" "}
                        {new Date(item.endTime).toLocaleDateString()}
                      </h1>
                      <p className="text-gray-600 mb-4">{item.caption}</p>
                      <div className="mb-4">
                        <p className="text-gray-600">
                          <span>Promotions Duration: </span>
                          {calculateDuration(item.startTime, item.endTime)} days
                        </p>
                        <p className="text-gray-600">
                          <span>Promotions Type: </span> {item.promotionType}
                        </p>
                      </div>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-600">
                      ${item.value}
                    </h1>
                  </div>
                  {item.promotionImage && (
                    <div className="my-4">
                      <img
                        src={item.promotionImage}
                        alt="promotion"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div className="flex gap-4">
                    <Link
                      href={`/facility/profile/promotions_management/${item?.id}`}
                    >
                      <Button
                        size="large"
                        className="h-12"
                        style={{
                          borderRadius: 8,
                          fontSize: 14,
                          fontWeight: 500,
                        }}
                      >
                        View Content
                      </Button>
                    </Link>

                    <Link
                      href={`/facility/profile/promotions_management/stop-promotions/${item?.id}`}
                    >
                      <Button
                        type="primary"
                        size="large"
                        className="h-12"
                        style={{
                          backgroundColor: "#14b8a6",
                          borderColor: "#14b8a6",
                          borderRadius: 8,
                          fontSize: 14,
                          fontWeight: 500,
                        }}
                      >
                        Stop Promotion
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No running promotions found.</p>
            )
          ) : promotionsHistory.length > 0 ? (
            promotionsHistory.map((item: any) => (
              <div
                key={item.id}
                className="grid gird-cols-2 max-w-md p-6 mb-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-lg font-bold text-gray-800 mb-2">
                      {new Date(item.startTime).toLocaleDateString()} -{" "}
                      {new Date(item.endTime).toLocaleDateString()}
                    </h1>
                    <p className="text-gray-600 mb-4">{item.caption}</p>
                    <div className="mb-4">
                      <p className="text-gray-600">
                        <span>Promotions Duration: </span>
                        {calculateDuration(item.startTime, item?.endTime)} days
                      </p>
                      <p className="text-gray-600">
                        <span>Promotions Type: </span> {item.promotionType}
                      </p>
                      {/* Never display any payment information from history */}
                    </div>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-600">
                    ${item.value}
                  </h1>
                </div>
                {item.promotionImage && (
                  <div className="my-4">
                    <img
                      src={item.promotionImage}
                      alt="promotion"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="my-4">
                  <Link
                    href={`/facility/profile/promotions_management/re-promotions/${item.id}`}
                  >
                    <Button
                      size="large"
                      className="h-12"
                      variant="solid"
                      style={{
                        borderRadius: 8,
                        fontSize: 14,
                        fontWeight: 500,
                        backgroundColor: "#14b8a6",
                        color: "white",
                        borderColor: "#14b8a6",
                      }}
                    >
                      Re-Promotion
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No history promotions found.</p>
          )}
        </div>
      </div>

      <Modal
        title="Create Promotion"
        open={createPromotion}
        onCancel={() => {
          setCreatePromotion(false);
          // Clear form data when modal is cancelled
          clearSensitiveData();
        }}
        footer={null}
        centered
        closable={false}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          className="space-y-4"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Promotion Type"
            name="promotion_type"
            rules={[
              { required: true, message: "Please select promotion type" },
            ]}
          >
            <Select placeholder="Select promotion type" style={{ height: 48 }}>
              <Select.Option value="POST">POST</Select.Option>
              <Select.Option value="BANNER">BANNER</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Add Post Caption"
            name="caption"
            rules={[
              { required: true, message: "Please enter your post caption" },
            ]}
          >
            <Input placeholder="Enter your post caption" className="h-12" />
          </Form.Item>

          <Form.Item
            label="Start Time"
            name="startTime"
            rules={[{ required: true, message: "Please select start time" }]}
          >
            <Input type="datetime-local" className="h-12" />
          </Form.Item>

          <Form.Item
            label="End Time"
            name="endTime"
            rules={[{ required: true, message: "Please select end time" }]}
          >
            <Input type="datetime-local" className="h-12" />
          </Form.Item>

          <Form.Item
            label="Value"
            name="value"
            rules={[{ required: true, message: "Please enter value" }]}
          >
            <Input type="number" placeholder="Enter value" className="h-12" />
          </Form.Item>

          <Form.Item label="Company Logo">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={beforeUpload}
              onRemove={() => setFileList([])}
            >
              {fileList.length >= 1 ? null : (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Button
            htmlType="submit"
            type="primary"
            className="w-full"
            style={{
              backgroundColor: "#14b8a6",
              borderColor: "#14b8a6",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              height: "40px",
            }}
          >
            Continue to Payment
          </Button>
        </Form>
      </Modal>

      <StripePaymentModal
        open={showPaymentModal}
        onSuccess={handlePaymentSuccess}
        onCancel={handlePaymentCancel}
        loading={submittingPromotion}
        promotionData={promotionFormData} // Only non-sensitive data
      />
    </div>
  );
}

export default PromotionsManagementComponent;
