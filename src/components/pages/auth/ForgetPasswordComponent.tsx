"use client";

import { Container } from "@/components/ui-library/container";
import { useForgotPasswordMutation } from "@/redux/features/auth/authApi";
import { Form, Input, Button } from "antd";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/auth/authSlice";
import logo from "../../../assets/images/logo.png";
import Image from "next/image";
import { FaSpinner } from "react-icons/fa";

function ForgetPasswordComponent() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const dispatch = useAppDispatch();
  const handleFinishEmail = async (values: { email: string }) => {
    try {
      const res = await forgotPassword(values).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Verification code sent to your email!");
        router.push(
          "/auth/verify_otp?reason=FORGET_PASSWORD_SECRET&email=" + values.email
        );
        dispatch(
          setUser({
            user: null,
            access_token: res?.result?.token,
            refresh_token: null,
          })
        );
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send verification code!");
    }
  };

  return (
    <div className="flex w-full h-screen items-center justify-center">
      <div className="w-xl mx-auto text-center border border-gray-200 p-6 rounded-lg">
        <Image
          width={1000}
          height={1000}
          alt="logo"
          src={logo}
          className="w-[250px] object-fill mx-auto pb-6"
        />
        <h1 className="text-2xl font-semibold text-gray-700 pb-2">
          Forgot Password
        </h1>
        <p className="text-gray-500 mb-4">
          No worries! Enter your email address below and we will send you a code
          to reset password.
        </p>
        <Form
          form={form}
          onFinish={handleFinishEmail}
          layout="vertical"
          className="w-full text-left"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input placeholder="example@email.com" size="large" className="h-12"/>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              style={{
                backgroundColor: "#14b8a6",
                borderColor: "#14b8a6",
                borderRadius: "8px",
                fontWeight: 500,
                height: "48px",
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <FaSpinner className="animate-spin w-6 h-6" /> Loading...
                </span>
              ) : (
                "Continue"
              )}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default ForgetPasswordComponent;
