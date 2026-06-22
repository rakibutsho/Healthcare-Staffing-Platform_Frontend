// app/payment/page.tsx
"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import StripePaymentForm from "@/components/common/paymentCard/paymentCard";
import { useSearchParams } from "next/navigation";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const PaymentPage = () => {
  const searchParams = useSearchParams();
  const planId = searchParams.get("planId");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Elements stripe={stripePromise}>
        <StripePaymentForm planId={planId} />
      </Elements>
    </div>
  );
};

export default PaymentPage;
