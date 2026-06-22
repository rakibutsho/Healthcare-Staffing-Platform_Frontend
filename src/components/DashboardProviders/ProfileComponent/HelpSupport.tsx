'use client'
import { useState } from "react";

function HelpSupport() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  const faqItems = [
    {
      title: "How do I reset my password?",
      content:
        "Go to your account settings, click 'Change Password', and follow the instructions to create a new one.",
    },
    {
      title: "How can I contact customer support?",
      content:
        "You can reach us via email at support@example.com or use the in-app chat for faster assistance.",
    },
    {
      title: "Where can I view my invoices?",
      content:
        "Invoices are available in your Billing section under 'Account Settings'. You can download them anytime.",
    },
    {
      title: "How do I change my subscription plan?",
      content:
        "Go to 'Manage Plan' in your dashboard to upgrade, downgrade, or cancel your current subscription.",
    },
    {
      title: "Can I use the service on multiple devices?",
      content:
        "Yes, your account can be used across multiple devices as long as you sign in with the same credentials.",
    },
    {
      title: "How do I delete my account?",
      content:
        "Please contact our support team to request account deletion. We'll verify your identity before processing.",
    },
    {
      title: "Why am I not receiving verification emails?",
      content:
        "Check your spam folder and ensure notifications@example.com is whitelisted in your email settings.",
    },
    {
      title: "Is my data secure?",
      content:
        "We use industry-standard encryption and regular security audits to protect your data and privacy.",
    },
    {
      title: "Can I recover deleted data?",
      content:
        "Depending on the type of data, you may request recovery within 30 days by contacting support.",
    },
    {
      title: "Do you offer a free trial?",
      content:
        "Yes! New users get a 14-day free trial with access to all premium features.",
    },
  ];

  return (
    <div className="p-5">
      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <div key={index} className="rounded-md shadow-sm bg-gray-200">
            <button
              onClick={() => toggle(index)}
              className="w-full flex justify-between items-center px-4 py-3 text-left font-semibold text-[#474747] focus:outline-none"
            >
              <span>{item.title}</span>
              <svg
                className={`w-5 h-5 transform transition-transform duration-300 ${
                  activeIndex === index ? "rotate-90" : "text-gray-500"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            <div
              className={`px-4 overflow-hidden transition-max-height duration-300 ${
                activeIndex === index ? "max-h-40 py-2" : "max-h-0"
              }`}
            >
              <p className="text-gray-600 text-sm">{item.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HelpSupport;
