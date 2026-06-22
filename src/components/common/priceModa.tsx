"use client";

import { useState } from "react";
import {
  useConfirmPaymentMutation,
  useGetProviderSubscriptionPlanQuery,
} from "@/redux/features/(Providers)/subscriptionProvider/subscriptionProviderApi";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import Spinner from "./Spinner";
import { useGetProviderProfileQuery } from "@/redux/features/(Providers)/profileProvider/profileProviderApi";
import { toast } from "sonner";

interface SubscriptionPlanProps {
  onClose?: () => void;
}

interface Plan {
  id: string;
  title: string;
  price: number;
  interval: string;
  interval_count: number;
  features: { key: string; value: string }[];
}

export default function SubscriptionPlan({ onClose }: SubscriptionPlanProps) {
  const router = useRouter();
  const { data: subscriptionPlan, isLoading } =
    useGetProviderSubscriptionPlanQuery(undefined);
  const { data: userData } = useGetProviderProfileQuery(undefined);

  const [confirmPayment] = useConfirmPaymentMutation();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatPrice = (price: number, interval: string) => {
    return price === 0 ? "Free" : `$${price.toFixed(2)}/${interval}`;
  };

  // Use user's subscription if it exists
  const currentSubscription = userData?.result?.UserSubscription?.[0] || null;

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  const handleSubscription = async () => {
    if (!selectedPlan) {
      toast.error("Please select a plan first");
      return;
    }

    if (selectedPlan.id === currentSubscription?.id) {
      toast.warning("You are already subscribed to this plan");
      return;
    }

    setIsProcessing(true);

    // ===============================
    //  FREE PLAN → Direct API Call
    // ===============================

    if (selectedPlan?.title === "FREE") {
      try {
        const res: any = await confirmPayment({
          subscriptionId: selectedPlan.id,
        }).unwrap();
        toast.success("You have successfully subscribed to the Free plan!");
        setIsProcessing(false);
        // 🚀 CLOSE MODAL AFTER SUCCESS
        if (onClose) onClose();
      } catch (err: any) {
        console.error("❌ Payment Error:", err);
        toast.error(
          err?.data?.message ||
            "Failed to process Free subscription. Please try again."
        );
        setIsProcessing(false);
      }
      return;
    }

    // ===============================
    //  PAID PLAN → Redirect to Payment
    // ===============================
    try {
      router.push(`/payment?planId=${selectedPlan?.id}`);
      toast.success(
        `Redirecting to payment for ${selectedPlan?.title} plan...`
      );
    } catch (err) {
      console.error("Error redirecting to payment:", err);
      toast.error("Failed to initiate payment process");
    }
    setIsProcessing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto bg-gray-50 p-8">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Choose Your Plan
        </h3>
        <p className="text-sm text-gray-600">
          Find more jobs, faster — with tools that elevate your career.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {subscriptionPlan?.result?.map((plan: Plan) => {
          const isCurrentPlan = currentSubscription?.id === plan?.id;
          const isSelected = selectedPlan?.id === plan?.id;

          return (
            <div
              key={plan?.id}
              onClick={() => handlePlanSelect(plan)}
              className={`relative p-6 rounded-lg border cursor-pointer transition-all ${
                isCurrentPlan
                  ? "border-teal-500 bg-teal-50 ring-2 ring-teal-200"
                  : isSelected
                  ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              {isCurrentPlan && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <span className="bg-teal-500 text-white text-xs font-medium px-2 py-1 rounded">
                    Current Plan
                  </span>
                </div>
              )}

              <div className="absolute top-3 left-3">
                <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded">
                  {plan.title}
                </span>
              </div>

              <div className="absolute top-4 right-4">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected || isCurrentPlan
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {(isSelected || isCurrentPlan) && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </div>

              <div className="mt-8 mb-4 text-center">
                <div className="text-2xl font-semibold text-gray-900">
                  {formatPrice(plan?.price, plan?.interval)}
                </div>
                {plan?.interval_count > 1 && (
                  <div className="text-sm text-gray-500 mt-1">
                    Billed every {plan?.interval_count} {plan?.interval}s
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Benefits:
                </h4>
                <div className="space-y-2">
                  {plan?.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <svg
                        className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-gray-600">
                        {feature?.key}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {isCurrentPlan && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <p className="text-xs text-teal-600 text-center">
                    You&apos;re currently subscribed to this plan
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h4 className="font-medium text-gray-900">Selected Plan</h4>
            <p className="text-sm text-gray-600">
              {selectedPlan
                ? `${selectedPlan?.title} - ${formatPrice(
                    selectedPlan?.price,
                    selectedPlan?.interval
                  )}`
                : "No plan selected"}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="w-full sm:w-fit border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
              disabled={!selectedPlan || isProcessing}
              onClick={() => setSelectedPlan(null)}
            >
              Clear Selection
            </Button>

            <Button
              className="w-full sm:w-fit bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              loading={isProcessing}
              disabled={
                !selectedPlan || selectedPlan?.id === currentSubscription?.id
              }
              onClick={handleSubscription}
            >
              {selectedPlan?.id === currentSubscription?.id
                ? "Current Plan"
                : "Subscribe Now"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
