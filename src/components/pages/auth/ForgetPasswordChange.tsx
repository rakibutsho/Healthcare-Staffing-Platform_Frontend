"use client";
import { useResetPasswordMutation } from "@/redux/features/auth/authApi";
import { Button, Form, Input } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";
import { toast } from "sonner";
import logo from "../../../assets/images/logo.png";

function ForgetPasswordChange() {
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const router = useRouter();
  const handleConfirmPassword = async (values: any) => {
    const { password } = values;
    try {
      const res = await resetPassword({
        newPassword: password,
        reason: "RESET_PASSWORD_SECRET",
      }).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Password changed successfully!");
        router.push("/auth/login");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to change password!");
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
        <h1 className="text-2xl font-semibold text-gray-800 mb-1">
          Change Password!
        </h1>
        <p className="text-gray-500 mb-5">Please enter your new password.</p>
        <Form
          layout="vertical"
          className="space-y-4 text-left"
          onFinish={handleConfirmPassword}
        >
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                validator: (_, value) => {
                  if (!value) {
                    return Promise.reject("Password is required!");
                  }

                  const pattern = /^(?=.*[a-z])(?=.*\d).+$/;
                  if (!pattern.test(value)) {
                    return Promise.reject(
                      "Password must include lowercase and numbers!"
                    );
                  }

                  if (value.length < 8) {
                    return Promise.reject(
                      "Password must be at least 8 characters long!"
                    );
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input.Password
              placeholder="Enter your password"
              className="h-12"
            />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={["password"]}
            hasFeedback
            rules={[
              ({ getFieldValue }) => ({
                required: true,
                validator(_, value) {
                  if (!value) {
                    return Promise.reject("Confirm Password is required!");
                  }

                  const pattern = /^(?=.*[a-z])(?=.*\d).+$/;
                  if (!pattern.test(value)) {
                    return Promise.reject(
                      "Password must include lowercase and numbers!"
                    );
                  }

                  if (value.length < 8) {
                    return Promise.reject(
                      "Password must be at least 8 characters long!"
                    );
                  }

                  if (value !== getFieldValue("password")) {
                    return Promise.reject(
                      "new password and confirm password do not match!"
                    );
                  }

                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Enter your confirm password"
              className="h-12"
            />
          </Form.Item>

          <Form.Item>
            <Button
              htmlType="submit"
              style={{
                width: "100%",
                height: "48px",
                backgroundColor: "teal",
                color: "white",
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <FaSpinner className="animate-spin w-5 h-5" />
                  Loading...
                </span>
              ) : (
                "Create Account"
              )}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default ForgetPasswordChange;
