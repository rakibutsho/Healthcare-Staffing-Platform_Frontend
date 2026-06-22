"use client";

import {
  useGetFacilityProfileQuery,
  useUpdateFacilityHrProfileMutation,
} from "@/redux/features/(Facility)/profileFacility/hrDetailsFacilityApi";
import { Button, Form, Input, Spin } from "antd";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function HRDetailsComponent() {
  const [updateHrDetails, { isLoading: isUpdating }] =
    useUpdateFacilityHrProfileMutation();
  const { data: profileData, isLoading } = useGetFacilityProfileQuery({});
  const profile = profileData?.result;
  const hrDetails = profile?.facilityProfile?.HrDetails?.[0];

  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    if (hrDetails) {
      form.setFieldsValue({
        name: hrDetails.name || "",
        role: hrDetails.role || "",
        email: hrDetails.email || "",
        phone: hrDetails.phoneNumber || "",
      });
    }
  }, [hrDetails, form]);

  const handleUpdatedProfile = async (values: any) => {
    try {
      const payload = {
        HrDetails: {
          name: values.name,
          role: values.role,
          email: values.email,
          phoneNumber: values.phone,
        },
      };

      console.log("Payload:", payload);

      const formData = new FormData();
      formData.append("bodyData", JSON.stringify(payload));

      const res = await updateHrDetails(formData).unwrap();

      if (res?.success) {
        toast.success(res?.message || "HR details updated successfully!");
      } else {
        toast.error(res?.message || "Failed to update HR details!");
      }

      setIsEditing(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Error updating HR details!");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setIsEditing(false);
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Spin size="large" />
      </div>
    );

  return (
    <div className="p-4 sm:p-6 space-y-4 relative">
      <div className="absolute top-2 right-4 z-50">
        <Button
          type="primary"
          size="large"
          loading={isUpdating}
          icon={!isEditing ? <Edit /> : undefined}
          onClick={() => setIsEditing(!isEditing)}
          style={{
            backgroundColor: "#14b8a6",
            borderColor: "#14b8a6",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          {isEditing ? "Save Change" : "Edit"}
        </Button>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleUpdatedProfile}
        className="space-y-4"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input
            placeholder="Enter your name"
            className="h-12"
            disabled={!isEditing}
          />
        </Form.Item>

        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: "Please enter your role" }]}
        >
          <Input
            placeholder="Enter your role"
            className="h-12"
            disabled={!isEditing}
          />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please enter your email" }]}
        >
          <Input
            placeholder="Enter your email"
            className="h-12"
            disabled={!isEditing}
          />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phone"
          rules={[
            { required: true, message: "Please enter your phone number" },
          ]}
        >
          <Input
            placeholder="Enter your phone number"
            className="h-12"
            disabled={!isEditing}
          />
        </Form.Item>

        {isEditing && (
          <div className="flex gap-4 justify-end">
            <Button
              size="large"
              onClick={handleCancel}
              className="h-12"
              style={{ borderRadius: 8, fontSize: 14, fontWeight: 500 }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              className="h-12"
              style={{
                backgroundColor: "#14b8a6",
                borderColor: "#14b8a6",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Submit
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
}

export default HRDetailsComponent;
