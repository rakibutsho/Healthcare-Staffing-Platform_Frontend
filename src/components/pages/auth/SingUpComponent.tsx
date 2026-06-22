"use client";
import { Button, Form, Input, Select } from "antd";
import { toast } from "sonner";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
import logo from "../../../assets/images/logo.png";
import Image from "next/image";
import { FaSpinner } from "react-icons/fa";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const { Option } = Select;

function SignUpComponent() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [createUser, { isLoading }] = useRegisterMutation();

  const handleCreateAccount = async (values: any) => {
    const { name, email, password, role } = values;
    try {
      const data = {
        fullName: name,
        role: role,
        email,
        password,
      };

      const res = await createUser(data).unwrap();
      if (res?.success) {
        dispatch(
          setUser({
            user: res?.result?.user,
            access_token: res?.result?.token,
            refresh_token: null,
          })
        );
        toast.success(res?.message || "Account created successfully!");
        router.push("/auth/verify_otp?reason=SIGNUP_OTP_SECRET&email=" + email);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create account!");
    }
  };

  return (
    <div className="flex w-full h-screen items-center justify-center">
      <div className="w-xl mx-auto text-center border border-gray-200 p-6 rounded-lg">
        
        {/* ✅ Back Button aligned, no design change */}
        <div className="text-left mb-4">
          <button
            onClick={() => router.back()}
            className="flex gap-1 cursor-pointer hover:text-teal-600"
          >
            <ArrowLeft />
            Back
          </button>
        </div>

        <Image
          width={1000}
          height={1000}
          alt="logo"
          src={logo}
          className="w-[250px] object-fill mx-auto pb-6"
        />
        <h1 className="text-2xl font-semibold text-gray-800 mb-1">Sign up!</h1>
        <p className="text-gray-500 mb-5">
          Your path towards flexible job placement with ease.
        </p>

        <Form
          layout="vertical"
          className="space-y-4 text-left"
          onFinish={handleCreateAccount}
        >
          <Form.Item
            label="Full Name"
            name="name"
            rules={[
              { required: true, message: "Please enter your full name." },
            ]}
          >
            <Input placeholder="Enter your full name" className="h-12" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email address." },
              { type: "email", message: "Please enter a valid email address." },
            ]}
          >
            <Input placeholder="Enter your email" className="h-12" />
          </Form.Item>

          <Form.Item
            label="Select Role"
            name="role"
            rules={[{ required: true, message: "Please select your role." }]}
          >
            <Select placeholder="Choose your role" className="h-12">
              <Option value="PROVIDER">Provider</Option>
              <Option value="FACILITY">Facility</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                validator: (_, value) => {
                  if (!value) return Promise.reject("Password is required!");

                  const pattern = /^(?=.*[a-z])(?=.*\d).+$/;
                  if (!pattern.test(value))
                    return Promise.reject("Password must include lowercase and numbers!");

                  if (value.length < 8)
                    return Promise.reject("Password must be at least 8 characters long!");

                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input.Password placeholder="Enter your password" className="h-12" />
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
                  if (!value) return Promise.reject("Confirm Password is required!");

                  if (value !== getFieldValue("password"))
                    return Promise.reject("Passwords do not match!");

                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input.Password placeholder="Enter your confirm password" className="h-12" />
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
                  <FaSpinner className="animate-spin w-6 h-6" /> Loading...
                </span>
              ) : (
                "Create Account"
              )}
            </Button>
          </Form.Item>
        </Form>

        {/* ✅ Corrected Link (no <p> inside) */}
        <div className="flex flex-col gap-1 mt-2">
          <p>or</p>
          <Link href="/auth/login" className="cursor-pointer hover:text-teal-600">
            Already Have an Account?
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUpComponent;
