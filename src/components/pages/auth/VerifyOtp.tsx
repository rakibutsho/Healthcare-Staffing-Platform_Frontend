"use client";

import {
  useOtpMutation,
  useResendOtpMutation,
} from "@/redux/features/auth/authApi";
import { setUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Button } from "antd";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "sonner";
import logo from "../../../assets/images/logo.png";

function VerifyOtpComponent() {
  const router = useRouter();
  const reason = useSearchParams().get("reason");
  const email = useSearchParams().get("email");
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.access_token);
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [countdown, setCountdown] = useState<number>(0);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, "").slice(0, otp.length).split("");
      const newOtp = [...otp];

      digits.forEach((digit, idx) => {
        newOtp[idx] = digit;
        if (inputRefs.current[idx]) {
          inputRefs.current[idx]!.value = digit;
        }
      });
      setOtp(newOtp);

      if (inputRefs.current[digits.length - 1]) {
        inputRefs.current[digits.length - 1]!.focus();
      }
    } else {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };
  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputRefs.current[index - 1]!.value = "";
    }
  };

  const [verifyOtp, { isLoading: isOtpLoading }] = useOtpMutation();
  const handleVerifyOtp = async () => {
    try {
      const res = await verifyOtp({
        reason: reason!,
        otp: otp.join(""),
        token: token,
      }).unwrap();
      if (res?.success) {
        if (reason === "SIGNUP_OTP_SECRET") {
          dispatch(
            setUser({
              user: null,
              access_token: res?.result,
              refresh_token: null,
            }),
          );
          router.push("/auth/login");
        } else if (reason === "FORGET_PASSWORD_SECRET") {
          dispatch(
            setUser({
              user: null,
              access_token: res?.result,
              refresh_token: null,
            }),
          );
          router.push("/auth/password_set");
        }
        toast.success("OTP verified successfully!");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to verify OTP!");
    }
  };

  const [resendOtp, { isLoading: isResendOtpLoading }] = useResendOtpMutation();
  const handleResendOtp = async () => {
    try {
      const res = await resendOtp({
        reason: reason!,
        email: email!,
      }).unwrap();
      if (res?.success) {
        setCountdown(60);
        toast.success("OTP sent successfully!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to send OTP!");
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) clearInterval(timer);
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    if (email && reason) {
      setCountdown(60);
    }
  }, [email, reason]);
  return (
    <div className="flex w-full h-screen items-center justify-center">
      <div className="w-xl mx-auto text-center space-y-5 border border-gray-200 p-6 rounded-lg">
        <Image
          width={1000}
          height={1000}
          alt="logo"
          src={logo}
          className="w-62.5 object-fill mx-auto pb-6"
        />
        <h1 className="text-2xl font-semibold text-gray-800">
          Please check your email
        </h1>
        <p className="text-gray-500">We sent a code to {email}</p>
        <div className="flex justify-center space-x-2 mt-4">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              maxLength={1}
              defaultValue={digit}
              ref={(el) => {
                if (el) {
                  inputRefs.current[idx] = el;
                }
              }}
              onChange={(e) => handleOtpChange(idx, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(idx, e)}
              className={`w-14 h-14 border rounded-lg text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                digit
                  ? "bg-teal-500 text-white border-teal-500"
                  : " border-[#E5E7EB]"
              }`}
            />
          ))}
        </div>
        <p className="text-gray-500 text-xl mt-2">
          Code expires in <span className="text-yellow-500 ">{countdown}</span>
        </p>
        <p className="text-gray-500 mt-1">
          Didn&apos;t get code?{" "}
          <span
            onClick={handleResendOtp}
            className="text-blue-500 cursor-pointer"
          >
            Click to resend
          </span>
        </p>
        <Button
          onClick={() => {
            if (countdown > 0) {
              handleVerifyOtp();
            }
          }}
          style={{
            width: "100%",
            height: "48px",
            backgroundColor: "teal",
            color: "white",
          }}
          disabled={
            isOtpLoading || countdown === 0 ? true : false || isResendOtpLoading
          }
        >
          {isOtpLoading || isResendOtpLoading ? (
            <span className="flex items-center gap-2">
              <FaSpinner className="animate-spin w-5 h-5" /> Loading...
            </span>
          ) : (
            "Verify"
          )}
        </Button>
      </div>
    </div>
  );
}

export default VerifyOtpComponent;
