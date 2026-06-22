"use client";

import {
  CardCvcElement,
  CardElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Button, Form, Input, message } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

interface PaymentFormData {
  name: string;
  email: string;
}

const StripePaymentForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("planId");

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [paymentMethodId, setPaymentMethodId] = useState<string>("");

  // Card element options for styling
  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
    },
  };

  const handleSubmit = async (values: PaymentFormData) => {
    if (!stripe || !elements) {
      message.error("Stripe has not loaded yet. Please try again.");
      return;
    }

    setLoading(true);

    try {
      // Get the card element
      const cardElement =
        elements.getElement(CardNumberElement) ||
        elements.getElement(CardElement);

      if (!cardElement) {
        message.error("Card information is required");
        setLoading(false);
        return;
      }

      // Create PaymentMethod
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: values.name,
          email: values.email,
        },
      });

      if (error) {
        console.error("Error creating payment method:", error);
        message.error(error.message || "Failed to create payment method");
        setLoading(false);
        return;
      }

      if (paymentMethod) {
        console.log("PaymentMethod created:", paymentMethod.id);
        setPaymentMethodId(paymentMethod.id);
        message.success(`PaymentMethod created: ${paymentMethod.id}`);

        // Option 1: Redirect back to promotions page with paymentMethodId
        router.push(`/promotions?paymentMethodId=${paymentMethod.id}`);

        // Option 2: Or save to localStorage/sessionStorage (if needed)
        localStorage.setItem("paymentMethodId", paymentMethod.id);

        // Option 3: Or make API call to save the paymentMethodId
        // await savePaymentMethod(paymentMethod.id, planId);
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      message.error("An error occurred during payment processing");
    } finally {
      setLoading(false);
    }
  };

  // Optional: Save payment method to your backend
  const savePaymentMethod = async (
    paymentMethodId: string,
    planId: string | null
  ) => {
    try {
      const response = await fetch("/api/save-payment-method", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethodId,
          planId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save payment method");
      }

      const result = await response.json();
      console.log("Payment method saved:", result);
    } catch (error) {
      console.error("Error saving payment method:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Payment Information
      </h2>

      {paymentMethodId && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
          <p className="text-sm text-green-800">
            <strong>Payment Method ID:</strong> {paymentMethodId}
          </p>
        </div>
      )}

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
          <Input placeholder="Enter your full name" className="h-12" />
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
          />
        </Form.Item>

        {/* Card Number */}
        <Form.Item label="Card Number" required>
          <div className="p-3 border border-gray-300 rounded h-12 flex items-center">
            <CardNumberElement options={cardElementOptions} />
          </div>
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          {/* Card Expiry */}
          <Form.Item label="Expiry Date" required>
            <div className="p-3 border border-gray-300 rounded h-12 flex items-center">
              <CardExpiryElement options={cardElementOptions} />
            </div>
          </Form.Item>

          {/* Card CVC */}
          <Form.Item label="CVC" required>
            <div className="p-3 border border-gray-300 rounded h-12 flex items-center">
              <CardCvcElement options={cardElementOptions} />
            </div>
          </Form.Item>
        </div>

        <Button
          htmlType="submit"
          type="primary"
          loading={loading}
          disabled={!stripe || loading}
          className="w-full h-12 mt-6"
          style={{
            backgroundColor: "#14b8a6",
            borderColor: "#14b8a6",
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 500,
          }}
        >
          {loading ? "Processing..." : "Create Payment Method"}
        </Button>
      </Form>

      {planId && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-800">
            <strong>Selected Plan:</strong> {planId}
          </p>
        </div>
      )}
    </div>
  );
};

export default StripePaymentForm;
