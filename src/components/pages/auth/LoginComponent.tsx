"use client";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { setUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { setCookie } from "@/utils/cookies";
import { verifyToken } from "@/utils/verifyToken";
import { Button, Form, Input } from "antd";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";
import { toast } from "sonner";
import logo from "../../../assets/images/logo.png";

function LoginComponent() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleFormSubmit = async (value: any) => {
    const loginData = {
      email: value.email,
      password: value.password,
    };
    try {
      const res = await login(loginData).unwrap();

      if (res?.success) {
        const token = res?.result?.accessToken;
        if (!token) {
          toast.error("Token missing from response");
          return;
        }
        // Do not block navigation on cookie write latency.
        setCookie(token).catch(() => {
          toast.error("Session cookie could not be saved.");
        });
        toast.success("Login successful!");

        const decodedUser: any = verifyToken(token);
        const apiUser = res?.result?.userInfo;
        const mergedUser = {
          ...decodedUser,
          ...apiUser,
        };

        const role = String(mergedUser?.role || "").toUpperCase();
        const isProfile =
          mergedUser?.isProfile === true ||
          mergedUser?.isProfile === "true" ||
          mergedUser?.isProfile === 1 ||
          mergedUser?.isProfile === "1";

        dispatch(
          setUser({
            user: {
              ...mergedUser,
              role,
              isProfile,
            },
            access_token: token,
            refresh_token: null,
          }),
        );

        let redirectPath = "";

        if (role === "PROVIDER") {
          redirectPath = isProfile
            ? "/dashboard"
            : "/auth/provider-profile-setup";
        } else if (role === "FACILITY") {
          redirectPath = isProfile
            ? "/facility"
            : "/auth/fecility-profile-setup";
        }

        if (!redirectPath) {
          toast.error("Unable to determine redirect route.");
          return;
        }

        router.replace(redirectPath);
        router.refresh();
      } else {
        toast.error("Invalid user state, please contact support.");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to login!");
    }
  };
  return (
    <div className="flex w-full h-screen items-center justify-center">
      <div className="w-xl mx-auto text-center border border-gray-200 p-6 rounded-lg">
        {/* ✅ Fixed Back Button Alignment */}
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
          className="w-62.5 object-fill mx-auto pb-6"
        />

        <div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-1">Log in</h1>
          <p className="text-gray-500 mb-5">
            Log in to your account to continue.
          </p>
        </div>

        <Form
          layout="vertical"
          className="space-y-4 text-left"
          onFinish={handleFormSubmit}
        >
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
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                validator: (_, value) => {
                  if (!value) return Promise.reject("Password is required!");
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

          <div className="text-right">
            <Link href="/auth/forget-password">Forgot Password?</Link>
          </div>

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
                "Continue"
              )}
            </Button>
          </Form.Item>
        </Form>

        <div className="flex flex-col gap-1">
          <p>or</p>
          <Link
            href="/auth/singup"
            className="cursor-pointer hover:text-teal-600"
          >
            Create New Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginComponent;
