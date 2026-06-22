"use client";

import Spinner from "@/components/common/Spinner";
import { useGetProviderProfileQuery } from "@/redux/features/(Providers)/profileProvider/profileProviderApi";
import {
  useCancelSubscriptionMutation,
  useConfirmPaymentMutation,
  useGetProviderSubscriptionPlanQuery,
} from "@/redux/features/(Providers)/subscriptionProvider/subscriptionProviderApi";
import { Button, Modal } from "antd";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function ManagePlan() {
  const { data: userData, refetch: refetchProfile } =
    useGetProviderProfileQuery("");
  const {
    data: subscriptionPlan,
    refetch: refetchPlans,
    isLoading,
  } = useGetProviderSubscriptionPlanQuery("");
  const [cancelSubscription, { isLoading: isCanceling }] =
    useCancelSubscriptionMutation();
  const [confirmPayment] = useConfirmPaymentMutation();
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const router = useRouter();

  // Map user subscription with global plan details
  const userPlans = useMemo(() => {
    if (!userData?.result?.UserSubscription || !subscriptionPlan?.result)
      return [];

    return userData?.result?.UserSubscription.map((sub: any) => {
      const planDetails = subscriptionPlan?.result?.find(
        (plan: any) => String(plan.id) === String(sub?.subscriptionId)
      );
      return {
        ...planDetails,
        status: sub?.status,
      };
    });
  }, [userData, subscriptionPlan]);

  // Current active subscription (for global Change Plan button)
  const activeSubscription = useMemo(() => {
    return (
      userData?.result?.UserSubscription?.find(
        (sub: any) => sub?.status === "ACTIVE"
      ) || null
    );
  }, [userData]);

  // Global Change/Subscribe button
  const currentPlan = useMemo(() => {
    if (!activeSubscription) return null;
    return subscriptionPlan?.result?.find(
      (plan: any) =>
        String(plan.id) === String(activeSubscription.subscriptionId)
    );
  }, [activeSubscription, subscriptionPlan]);

  const handlePlanSelect = async (plan: any) => {
    const isSamePlan =
      String(activeSubscription?.subscriptionId) === String(plan.id);
    if (isSamePlan) {
      toast.info("You are already subscribed to this plan");
      return;
    }

    if (plan?.title === "FREE") {
      try {
        const res: any = await confirmPayment({
          subscriptionId: plan.id,
        }).unwrap();
        toast.success("You have successfully subscribed to the Free plan!");
        setShowPlanModal(false);
      } catch (err: any) {
        console.error("❌ Payment Error:", err);
        toast.error(
          err?.data?.message ||
            "Failed to process Free subscription. Please try again."
        );
      }
      return;
    }

    // PAID PLAN → REDIRECT
    setShowPlanModal(false);
    router.push(`/payment?planId=${plan.id}`);
  };

  const confirmCancellation = async () => {
    if (!selectedPlanId) return;

    try {
      const res = await cancelSubscription(selectedPlanId).unwrap();
      toast.success(res?.message || "Subscription Cancelled Successfully");
      await refetchProfile();
      await refetchPlans();
      setShowCancelModal(false);
      setSelectedPlanId(null);
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
      toast.error("Failed to cancel subscription");
    }
  };

  if (isLoading) {
    return (
      <div className="flex mx-auto justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-gray-50 p-8 min-h-screen">
      {/* Change Plan Button */}
      <div className="w-full flex items-center gap-5 justify-end mb-6">
        <button
          onClick={() => setShowPlanModal(true)}
          className={`w-fit ${
            activeSubscription
              ? "bg-teal-500 hover:bg-teal-600"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white py-3 px-4 rounded-lg font-medium transition-colors`}
          disabled={isLoading}
        >
          {activeSubscription ? "Change Plan" : "Subscribe"}
        </button>
      </div>

      {/* List of User Plans */}
      <div className="grid grid-cols-2 gap-6">
        {userPlans.map((plan: any) => (
          <div
            key={plan?.id}
            className={`bg-white rounded-lg border p-6 ${
              plan?.status === "ACTIVE" ? "border-teal-500" : "border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-semibold">{plan?.title}</h3>
              <span
                className={`px-2 py-1 rounded text-sm font-medium ${
                  plan.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {plan?.status}
              </span>
            </div>
            <p className="text-gray-700 mb-4">
              ${plan?.price}/{plan?.interval}
            </p>
            {plan?.status === "ACTIVE" && (
              <div className="flex justify-end">
                <Button
                  size="middle"
                  className="h-10"
                  onClick={() => {
                    setSelectedPlanId(plan.id);
                    setShowCancelModal(true);
                  }}
                  loading={isCanceling}
                  style={{
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Plan Selection Modal */}
      <Modal
        open={showPlanModal}
        onCancel={() => setShowPlanModal(false)}
        footer={null}
        centered
        width={896} // ⬅️ 4xl width
        className="max-w-4xl" // optional
      >
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {activeSubscription ? "Change Your Plan" : "Choose Your Plan"}
          </h3>
          <p className="text-sm text-gray-600">
            Find more jobs, faster — with tools that elevate your career.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {subscriptionPlan?.result?.map((plan: any) => (
            <div
              key={plan?.id}
              onClick={() => handlePlanSelect(plan)}
              className={`relative p-4 rounded-lg border cursor-pointer transition-colors ${
                activeSubscription?.subscriptionId === plan?.id
                  ? "border-teal-500 bg-teal-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded">
                  {plan?.title}
                </span>
              </div>

              <div className="mt-6 mb-4">
                <div className="text-2xl font-semibold text-gray-900">
                  ${plan?.price}/{plan?.interval}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Features:
                </h4>
                <ul className="space-y-2">
                  {plan?.features?.map((feature: any, idx: number) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      ✅ {feature?.key.replace(/_/g, " ")}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Cancellation Confirmation Modal */}
      <Modal
        open={showCancelModal}
        onCancel={() => setShowCancelModal(false)}
        footer={null}
        title="Cancel Subscription"
        centered
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to cancel this subscription? You’ll lose access
          to all premium features at the end of your current billing period.
        </p>
        <div className="flex gap-3 justify-end">
          <Button
            size="large"
            className="h-12"
            onClick={confirmCancellation}
            loading={isCanceling}
            disabled={!selectedPlanId}
            style={{ borderRadius: 8, fontSize: 14, fontWeight: 500 }}
          >
            Yes, Cancel
          </Button>
          <Button
            type="primary"
            size="large"
            className="h-12"
            onClick={() => setShowCancelModal(false)}
            style={{
              backgroundColor: "#14b8a6",
              borderColor: "#14b8a6",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Keep Subscription
          </Button>
        </div>
      </Modal>
    </div>
  );
}
