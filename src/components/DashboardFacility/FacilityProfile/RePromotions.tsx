"use client";

import {
  useGetSinglePromotionsQuery,
  useRePromitionMutation,
} from "@/redux/features/(Facility)/profileFacility/promotionsManagementFacilityApi";
import { Button, Form, Input } from "antd";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import StripePaymentModal from "./StripePaymentModal";

interface RePromotionsProps {
  id: string;
}

const RePromotions = ({ id }: RePromotionsProps) => {
  const {
    data: singlePromotionResponse,
    isLoading,
    isFetching,
    isError,
  } = useGetSinglePromotionsQuery(id);

  const [rePromition, { isLoading: rePromoting }] = useRePromitionMutation();

  const [form] = Form.useForm();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [promotionFormData, setPromotionFormData] = useState<any>(null);

  // Fixed normalization logic - check for the actual structure in your API response
  const promotion = singlePromotionResponse?.result || null;

  // Friendly console output for debugging shape issues
  console.debug("singlePromotionResponse:", singlePromotionResponse);
  console.debug("normalized promotion:", promotion);

  // util to convert datetime-local value to ISO (end flag set to end-of-day)
  const formatDateToISO = (dateString?: string, isEnd = false) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (isEnd) d.setHours(23, 59, 59, 999);
    return d.toISOString();
  };

  const calculateDuration = (start?: string, end?: string) => {
    if (!start || !end) return 0;
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const startISO = formatDateToISO(values.startTime, false);
      const endISO = formatDateToISO(values.endTime, true);

      if (!startISO || !endISO) {
        toast.error("Please provide valid start and end times.");
        return;
      }

      if (new Date(startISO).getTime() >= new Date(endISO).getTime()) {
        toast.error("End time must be after start time.");
        return;
      }

      const nonSensitiveData = {
        promotionId: promotion?.id ?? id,
        startTime: startISO,
        endTime: endISO,
      };

      // Fix: Structure the data to match what StripePaymentModal expects
      setPromotionFormData({
        formData: nonSensitiveData,
        jsonData: {
          promotionType: promotion?.promotionType || "N/A",
          caption: promotion?.caption || "N/A",
          value: promotion?.value || 0,
        },
      });
      setShowPaymentModal(true);
    } catch (err) {
      toast.error("Please fill in required fields");
    }
  };
  const handlePaymentSuccess = useCallback(
    async (paymentMethodId: string) => {
      if (!promotionFormData?.formData) {
        toast.error("Promotion data missing. Please retry.");
        setShowPaymentModal(false);
        return;
      }

      try {
        const completeData = {
          ...promotionFormData.formData,
          paymentMethodId,
        };

        console.log("Sending re-promotion data:", completeData); // Debug log

        const res = await rePromition({ id, completeData }).unwrap();

        console.log("Re-promotion response:", res); // Debug log

        if (res?.success) {
          toast.success(res.message || "Promotion restarted successfully!");
          setShowPaymentModal(false);
          form.resetFields();
          setPromotionFormData(null);
        } else {
          // Handle case where API returns success: false
          const errorMessage =
            res?.message || res?.error || "Failed to restart promotion";
          console.error("API returned error:", res);
          toast.error(errorMessage);
        }
      } catch (error: any) {
        console.error("re-promotion error details:", error);

        // Enhanced error handling
        let errorMessage = "Error while restarting promotion";

        if (error?.data?.message) {
          errorMessage = error.data.message;
        } else if (error?.data?.error) {
          errorMessage = error.data.error;
        } else if (error?.message) {
          errorMessage = error.message;
        } else if (typeof error === "string") {
          errorMessage = error;
        }

        // Check for specific error types
        if (error?.status === 400) {
          errorMessage = "Invalid request data. Please check your inputs.";
        } else if (error?.status === 401) {
          errorMessage = "Authentication failed. Please login again.";
        } else if (error?.status === 403) {
          errorMessage = "You don't have permission to perform this action.";
        } else if (error?.status === 404) {
          errorMessage = "Promotion not found.";
        } else if (error?.status >= 500) {
          errorMessage = "Server error. Please try again later.";
        }

        toast.error(errorMessage);

        // Don't close modal on error so user can retry
        // setShowPaymentModal(false);
      }
    },
    [promotionFormData?.formData, rePromition, id, form],
  );

  const handlePaymentCancel = useCallback(() => {
    setShowPaymentModal(false);
    toast.info("Payment cancelled. You can try again.");
  }, []);

  if (isLoading || isFetching) return <p>Loading promotion details...</p>;
  if (isError) return <p>Failed to load promotion.</p>;
  if (!promotion) return <p>No promotion found.</p>;

  // Access fields directly since we know the structure now
  const caption = promotion.caption || "-";
  const promotionType = promotion.promotionType || "-";
  const value = promotion.value || 0;
  const promotionImage = promotion.promotionImage || null;
  const startTime = promotion.startTime || null;
  const endTime = promotion.endTime || null;

  return (
    <div className="p-6 space-y-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-gray-800">Re-Promotion</h1>

      <div className="space-y-3">
        <p>
          <strong>Caption:</strong> {caption}
        </p>
        <p>
          <strong>Type:</strong> {promotionType}
        </p>
        <p>
          <strong>Value:</strong> ${value}
        </p>
        <p>
          <strong>Current Duration:</strong>{" "}
          {startTime && endTime
            ? `${calculateDuration(startTime, endTime)} days`
            : "N/A"}
        </p>

        {promotionImage && (
          <img
            src={promotionImage}
            alt="Promotion"
            className="w-full max-w-md rounded-lg shadow"
          />
        )}
      </div>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="New Start Time"
          name="startTime"
          rules={[{ required: true, message: "Please select start time" }]}
        >
          <Input type="datetime-local" className="h-12" />
        </Form.Item>

        <Form.Item
          label="New End Time"
          name="endTime"
          rules={[{ required: true, message: "Please select end time" }]}
        >
          <Input type="datetime-local" className="h-12" />
        </Form.Item>

        <Button
          htmlType="submit"
          type="primary"
          loading={rePromoting}
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

      <StripePaymentModal
        open={showPaymentModal}
        onSuccess={handlePaymentSuccess}
        onCancel={handlePaymentCancel}
        loading={rePromoting}
        promotionData={promotionFormData}
      />
    </div>
  );
};

export default RePromotions;
