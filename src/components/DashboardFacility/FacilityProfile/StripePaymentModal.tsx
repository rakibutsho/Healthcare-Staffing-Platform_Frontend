"use client";

import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button, Form, Input, Modal, Spin } from "antd";
import React, { useState } from "react";
import { toast } from "sonner";

// Initialize Stripe with the provided publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

interface StripePaymentModalProps {
  open: boolean;
  onSuccess: (paymentMethodId: string) => void;
  onCancel: () => void;
  loading: boolean;
  promotionData: any;
}

const PaymentForm: React.FC<{
  onSuccess: (paymentMethodId: string) => void;
  onCancel: () => void;
  loading: boolean;
  promotionData: any;
}> = ({ onSuccess, onCancel, loading, promotionData }) => {
  console.log("promotionData", promotionData);

  const stripe = useStripe();
  const elements = useElements();
  const [form] = Form.useForm();
  const [processing, setProcessing] = useState(false);
  const [cardNumberComplete, setCardNumberComplete] = useState(false);
  const [cardExpiryComplete, setCardExpiryComplete] = useState(false);
  const [cardCvcComplete, setCardCvcComplete] = useState(false);
  const [cardNumberError, setCardNumberError] = useState<string | null>(null);

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        letterSpacing: "0.025em",
        fontFamily: "Source Code Pro, monospace",
        "::placeholder": { color: "#aab7c4" },
      },
      invalid: { color: "#9e2146" },
    },
  };

  const handleSubmit = async (values: { name: string; email: string }) => {
    if (!stripe || !elements) {
      toast.error("Payment system is not ready. Please try again.");
      return;
    }

    if (!cardNumberComplete || !cardExpiryComplete || !cardCvcComplete) {
      toast.error("Please complete all card details.");
      return;
    }

    setProcessing(true);
    try {
      const cardNumberElement = elements.getElement(CardNumberElement);
      if (!cardNumberElement) {
        toast.error("Card number element not found.");
        setProcessing(false);
        return;
      }

      // Log the card number element state for debugging
      console.log("CardNumberElement state:", {
        complete: cardNumberComplete,
        error: cardNumberError,
      });

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardNumberElement,
        billing_details: { name: values.name, email: values.email },
      });

      if (error) {
        console.error("Error creating payment method:", error);
        toast.error(error.message || "Failed to create payment method");
        setProcessing(false);
        return;
      }

      if (paymentMethod) {
        console.log("PaymentMethod created:", paymentMethod);
        toast.success("Payment method created successfully!");
        onSuccess(paymentMethod.id);
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      toast.error("An error occurred during payment processing");
      setProcessing(false);
    }
  };

  if (!stripe || !elements) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spin size="large" />
        <p className="mt-4 text-gray-600">Loading payment system...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* {promotionData && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Promotion Summary</h3>
          <div className="space-y-1 text-sm">
            <p>
              <strong>Type:</strong> {promotionData?.promotionType}
            </p>
            <p>
              <strong>Caption:</strong> {promotionData?.jsonData?.caption}
            </p>
            <p>
              <strong>Value:</strong> ${promotionData?.jsonData?.value}
            </p>
          </div>
        </div>
      )} */}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="space-y-4"
      >
        <Form.Item
          label="Full Name"
          name="name"
          rules={[{ required: true, message: "Please enter your full name" }]}
        >
          <Input
            placeholder="Enter your full name"
            className="h-12"
            disabled={processing || loading}
          />
        </Form.Item>
        <Form.Item
          label="Email Address"
          name="email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input
            placeholder="Enter your email address"
            className="h-12"
            type="email"
            disabled={processing || loading}
          />
        </Form.Item>
        <Form.Item
          label="Card Number"
          required
          validateStatus={cardNumberError ? "error" : ""}
          help={cardNumberError}
        >
          <div
            className="p-3 border border-gray-300 rounded-lg bg-white"
            style={{ minHeight: "48px", width: "100%" }}
          >
            <CardNumberElement
              options={{
                ...cardElementOptions,
                showIcon: true,
                placeholder: "1234 1234 1234 1234",
              }}
              onChange={(e) => {
                setCardNumberComplete(e.complete);
                setCardNumberError(e.error ? e.error.message : null);
                console.log("CardNumberElement onChange:", e);
              }}
            />
          </div>
        </Form.Item>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item label="Expiry Date" required>
            <div
              className="p-3 border border-gray-300 rounded-lg bg-white"
              style={{ minHeight: "48px", width: "100%" }}
            >
              <CardExpiryElement
                options={{ ...cardElementOptions, placeholder: "MM / YY" }}
                onChange={(e) => {
                  setCardExpiryComplete(e.complete);
                  if (e.error) {
                    toast.error(e.error.message);
                  }
                }}
              />
            </div>
          </Form.Item>
          <Form.Item label="CVC" required>
            <div
              className="p-3 border border-gray-300 rounded-lg bg-white"
              style={{ minHeight: "48px", width: "100%" }}
            >
              <CardCvcElement
                options={{ ...cardElementOptions, placeholder: "123" }}
                onChange={(e) => {
                  setCardCvcComplete(e.complete);
                  if (e.error) {
                    toast.error(e.error.message);
                  }
                }}
              />
            </div>
          </Form.Item>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            onClick={onCancel}
            disabled={processing || loading}
            className="flex-1 h-12"
            style={{ borderRadius: 8 }}
          >
            Cancel
          </Button>
          <Button
            htmlType="submit"
            type="primary"
            loading={processing || loading}
            disabled={
              processing ||
              loading ||
              !cardNumberComplete ||
              !cardExpiryComplete ||
              !cardCvcComplete
            }
            className="flex-1 h-12"
            style={{
              backgroundColor: "#14b8a6",
              borderColor: "#14b8a6",
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 500,
            }}
          >
            {processing
              ? "Processing..."
              : loading
                ? "Creating Promotion..."
                : "Pay & Create Promotion"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

const StripePaymentModal: React.FC<StripePaymentModalProps> = ({
  open,
  onSuccess,
  onCancel,
  loading,
  promotionData,
}) => {
  console.log(
    "Stripe Publishable Key:",
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  );
  return (
    <Modal
      title="Complete Payment"
      open={open}
      onCancel={loading ? undefined : onCancel}
      footer={null}
      centered
      closable={!loading}
      width={600}
      maskClosable={false}
      destroyOnClose={true}
    >
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Creating your promotion...</p>
        </div>
      )}
      {open && (
        <Elements
          stripe={stripePromise}
          options={{
            appearance: {
              theme: "stripe",
              variables: { colorPrimary: "#14b8a6" },
            },
          }}
        >
          <PaymentForm
            onSuccess={onSuccess}
            onCancel={onCancel}
            loading={loading}
            promotionData={promotionData}
          />
        </Elements>
      )}
    </Modal>
  );
};

export default StripePaymentModal;
