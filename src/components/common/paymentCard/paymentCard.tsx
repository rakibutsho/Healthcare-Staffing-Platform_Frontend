// components/common/paymentCard/StripePaymentForm.tsx
"use client";

import { useConfirmPaymentMutation } from "@/redux/features/(Providers)/subscriptionProvider/subscriptionProviderApi";
import { RootState } from "@/redux/store";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";

interface StripePaymentFormProps {
  planId?: string | null;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({ planId }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [MakePayment, { isLoading }] = useConfirmPaymentMutation();
  const router = useRouter();

  const userRole = useSelector((state: RootState) => state.auth.user?.role);

  const [cardholderName, setCardholderName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError("Stripe has not loaded yet. Please try again.");
      return;
    }

    if (!planId) {
      setError("Missing subscription plan ID.");
      return;
    }

    if (!cardholderName.trim()) {
      setError("Please enter the cardholder name.");
      return;
    }

    setError(null);

    const cardElement = elements.getElement(CardNumberElement);
    if (!cardElement) {
      setError("Payment form not initialized.");
      return;
    }

    // Step 1: Create Payment Method
    const { error: stripeError, paymentMethod } =
      await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: { name: cardholderName.trim() },
      });

    if (stripeError) {
      setError(stripeError?.message || "Failed to create payment method.");
      return;
    }

    console.log("✅ Created PaymentMethod:", paymentMethod?.id);

    try {
      // Step 2: Call Redux mutation
      const res: any = await MakePayment({
        subscriptionId: planId,
        paymentMethodId: paymentMethod?.id,
      }).unwrap();

      console.log("✅ Backend Response:", res);

      if (res?.error) {
        setError(res.error);
      } else {
        setSucceeded(true);

        // ✅ Redirect after 2 seconds
        setTimeout(() => {
          if (userRole === "PROVIDER") {
            router.push("/dashboard/profile/manage_plan");
          } else if (userRole === "FACILITY") {
            router.push("/facility/profile/manage_plan");
          }
        }, 2000);
      }
    } catch (err: any) {
      console.error("❌ Payment Error:", err);
      setError(
        err?.data?.message || "Failed to process payment. Please try again."
      );
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-8 bg-white shadow-lg rounded-2xl">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        Complete Your Payment
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Cardholder Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cardholder Name
          </label>
          <div className="relative">
            <input
              type="text"
              value={cardholderName}
              onChange={(e) => setCardholderName(e?.target?.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                         outline-none transition"
              required
            />
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Number
          </label>
          <div
            className="relative px-4 py-3 border rounded-xl border-gray-300 
                          focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200"
          >
            <CardNumberElement
              options={{
                showIcon: true,
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    fontFamily: "monospace",
                    "::placeholder": { color: "#aab7c4" },
                  },
                  invalid: { color: "#9e2146" },
                },
              }}
            />
          </div>
        </div>

        {/* Expiry + CVV */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date
            </label>
            <div
              className="relative px-4 py-3 border rounded-xl border-gray-300 
                            focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200"
            >
              <CardExpiryElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      fontFamily: "monospace",
                      "::placeholder": { color: "#aab7c4" },
                    },
                    invalid: { color: "#9e2146" },
                  },
                }}
              />
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CVV
            </label>
            <div
              className="relative px-4 py-3 border rounded-xl border-gray-300 
                            focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200"
            >
              <CardCvcElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      fontFamily: "monospace",
                      "::placeholder": { color: "#aab7c4" },
                    },
                    invalid: { color: "#9e2146" },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="text-red-600 text-sm p-3 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        {/* Button */}
        <button
          type="submit"
          disabled={!stripe || isLoading || succeeded}
          className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 cursor-pointer
            hover:from-blue-700 hover:to-blue-800 text-white font-semibold 
            py-4 px-6 rounded-xl shadow-md transition 
            ${
              !stripe || isLoading || succeeded
                ? "opacity-70 cursor-not-allowed"
                : ""
            }`}
        >
          {isLoading
            ? "Processing..."
            : succeeded
            ? "✅ Payment Successful"
            : "Complete Payment"}
        </button>
      </form>

      <div className="flex items-center justify-center mt-6 text-sm text-gray-500">
        <Lock className="w-4 h-4 mr-2" />
        Your payment information is secure and encrypted
      </div>
    </div>
  );
};

export default StripePaymentForm;
