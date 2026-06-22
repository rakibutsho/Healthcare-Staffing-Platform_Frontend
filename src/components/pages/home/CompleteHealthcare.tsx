"use client";
import { Container } from "@/components/ui-library/container";
import Image from "next/image";
import healthcare from "../../../assets/images/CompleteHealthcare-1.jpg";
import healthcare2 from "../../../assets/images/CompleteHealthcare-2.jpg";
import video from "../../../assets/imge67.jpg";
import { Hospital, MoveRight, Play, Users } from "lucide-react";

import { useState } from "react";

function CompleteHealthcare() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [activeMedical, setActiveMedical] = useState<number | null>(0);

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  const toggleMedical = (index: number) => {
    setActiveMedical(activeIndex === index ? null : index);
  };
  const faqItems = [
    {
      title: "Verified Hospitals:",
      content: "Work directly with licensed, trusted facilities.",
    },
    {
      title: "Instant Matches:",
      content:
        "Get notified of new opportunities that fit your specialty and schedule.",
    },
    {
      title: "No Hidden Fees:",
      content: "Keep your full earnings — no recruiter cuts.",
    },
    {
      title: "Community & Support:",
      content: "Join a network built by and for anesthesia professionals.",
    },
  ];
  const medical = [
    {
      title: "Faster Hiring:",
      content: "Fill anesthesia needs quickly and reliably.",
    },
    {
      title: "Verified Opportunities",
      content: " Access pre-vetted CRNAs and anesthesiologists.",
    },
    {
      title: "Cost Efficiency:",
      content: "Save up to 50% on staffing costs.",
    },
    {
      title: "Direct Control:",
      content: "Communicate, credential, and manage your hires directly. ",
    },
  ];

  return (
    <>
      <section className="py-20 bg-gray-50">
        <Container>
          <div className=" px-4">
            {/* First Row */}
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
              <div className="relative order-2 lg:order-1">
                <div className="relative overflow-hidden rounded-xl shadow-xl">
                  <Image
                    src={healthcare}
                    alt="Healthcare professional working with patient"
                    width={600}
                    height={500}
                    className="w-full h-auto object-cover"
                  />
                  {/* <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div> */}
                </div>
              </div>

              <div className="space-y-6 order-1 lg:order-2">
                <div className="space-y-4">
                  <h3 className=" flex gap-2 text-[#303d47] border  border-gray-200 rounded-3xl w-fit px-4 py-2 items-center">
                    <Users />
                    For Anesthesia Providers
                  </h3>
                  <h1 className="text-3xl font-medium text-[#2D2D2D]">
                    Find Your Next Anesthesia Opportunity
                  </h1>
                </div>

                <p className="text-lg text-gray-600 leading-relaxed">
                  Take control of your career. Discover verified hospitals,
                  flexible shifts, and better pay — all without agency
                  interference.
                </p>

                <div className="space-y-4">
                  <h3 className="text-xl font-medium text-[#2D2D2D]">
                    Key Benefits:
                  </h3>
                  {faqItems.map((item, index) => (
                    <div
                      key={index}
                      className=" rounded-md shadow-sm bg-gray-200"
                    >
                      <button
                        onClick={() => toggle(index)}
                        className="w-full flex justify-between items-center px-4 py-3 text-left font-semibold text-[#474747] focus:outline-none"
                      >
                        <span>{item.title}</span>
                        <svg
                          className={`w-5 h-5 transform transition-transform duration-300 ${
                            activeIndex === index
                              ? "rotate-90"
                              : "text-gray-500"
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
            </div>

            {/* Second Row */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className=" flex gap-2 text-[#303d47] border  border-gray-200 rounded-3xl w-fit px-4 py-2 items-center">
                    <Hospital />
                    For Hospitals & Surgical Centers
                  </h3>
                  <h1 className="text-3xl font-medium text-[#2D2D2D]">
                    Hire Verified Anesthesia Providers — Fast
                  </h1>
                </div>

                <p className="text-lg text-gray-600 leading-relaxed">
                  Stop waiting weeks for coverage or paying agency markups.
                  AnestheLink lets you connect directly with top anesthesia
                  talent in hours.
                </p>

                <div className="space-y-4">
                  <h3 className="text-xl font-medium text-[#2D2D2D]">
                    Key Benefits:
                  </h3>
                  {medical.map((item, index) => (
                    <div
                      key={index}
                      className=" rounded-md shadow-sm bg-gray-200"
                    >
                      <button
                        onClick={() => toggleMedical(index)}
                        className="w-full flex justify-between items-center px-4 py-3 text-left font-semibold text-[#474747] focus:outline-none"
                      >
                        <span>{item.title}</span>
                        <svg
                          className={`w-5 h-5 transform transition-transform duration-300 ${
                            activeMedical === index
                              ? "rotate-90"
                              : "text-gray-500"
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
                          activeMedical === index ? "max-h-40 py-2" : "max-h-0"
                        }`}
                      >
                        <p className="text-gray-600 text-sm">{item.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="relative overflow-hidden rounded-xl shadow-xl">
                  <Image
                    src={healthcare2}
                    alt="Healthcare team collaboration"
                    width={600}
                    height={500}
                    className="w-full h-auto object-cover"
                  />
                  {/* <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div> */}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
      <Container>
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="relative rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src={video}
                    alt="Healthcare video preview"
                    width={600}
                    height={400}
                    className="w-full h-auto"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-5xl font-bold text-gray-900">
                  Connecting Healthcare Talent with Opportunity — Simply and
                  Securely.
                </h2>

                <p className="text-gray-600 leading-relaxed">
                  We&apos;re building a smarter healthcare staffing platform
                  that connects licensed providers and hospitals. From
                  credentialing to AI matching, we simplify hiring and job
                  discovery with speed and trust.
                </p>

                <button className="w-fit px-6 py-4 rounded-[8px] font-medium whitespace-nowrap text-white bg-teal-500 hover:bg-teal-600 flex items-center justify-center gap-5">
                  Learn more <MoveRight />
                </button>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </>
  );
}

export default CompleteHealthcare;
