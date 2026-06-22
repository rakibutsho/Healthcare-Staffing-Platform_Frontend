"use client";

import { Container } from "@/components/ui-library/container";
import { useContactMessageSendMutation } from "@/redux/features/contactform/contactFormApi";
import { Form, Input } from "antd";
import { Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const { TextArea } = Input;
interface ContactFormValues {
  fullName: string;
  email: string;
  phone?: string;
  message: string;
}

export default function ContactPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [createContact, { isLoading }] = useContactMessageSendMutation();

  const onFinish = async (values: ContactFormValues) => {
    try {
      const res = await createContact(values).unwrap();
      toast.success(res.message || "Message sent successfully!");
      form.resetFields();
    } catch (error) {
      console.log("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="text-center bg-gradient-to-b from-blue-50 to-teal-50 pt-[150px] pb-[50px]">
        <Container>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-gray-600 text-lg">
            We’re here to help with any questions, partnerships, or support
            needs.
          </p>
        </Container>
      </div>
      <Container>
        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl mx-auto my-16">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Send us a Message
          </h2>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="space-y-4"
          >
            <Form.Item
              label="Full Name"
              name="fullName"
              rules={[
                { required: true, message: "Please enter your full name" },
              ]}
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
              <Input placeholder="Enter your email address" className="h-12" />
            </Form.Item>

            <Form.Item label="Phone (Optional)" name="phone">
              <Input placeholder="Enter your phone number" className="h-12" />
            </Form.Item>

            <Form.Item
              label="Message"
              name="message"
              rules={[
                { required: true, message: "Please enter your message" },
                {
                  min: 10,
                  message: "Message must be at least 10 characters long",
                },
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Enter your message"
                className="h-12"
              />
            </Form.Item>
            <Form.Item>
              <button
                type="submit"
                disabled={loading}
                className={`flex items-center justify-center w-full h-12 rounded-lg font-semibold text-lg 
                ${
                  loading
                    ? "cursor-not-allowed bg-teal-500 opacity-70 text-white"
                    : "bg-teal-600 hover:bg-teal-700 cursor-pointer text-white"
                }`}
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin w-5 h-5 mr-2" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </Form.Item>
          </Form>
        </div>
      </Container>
    </div>
  );
}
