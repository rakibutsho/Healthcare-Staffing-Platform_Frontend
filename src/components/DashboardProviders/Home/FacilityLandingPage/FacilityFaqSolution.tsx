"use client";
import { Container } from "@/components/ui-library/container";
import Image from "next/image";
import healthcare from "../../../../assets/images/CompleteHealthcare-2.jpg";
import video from "../../../../assets/imge67.jpg";
import { Hospital, MoveRight, Play } from "lucide-react";

import { useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";

function FacilityFaqSolution() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const role = useAppSelector(selectCurrentUser)?.role;
  const router = useRouter();

  const handelRedirect = () => {
    if (!role) {
      router.push("/auth/login"); // or show a toast
      return;
    }

    if (role === "PROVIDER") {
      router.push("/dashboard");
    } else if (role === "FACILITY") {
      router.push("/facility");
    } else {
      router.push("/"); // fallback home
    }
  };

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  const faqItems = [
    {
      title: "Advanced Job Search?",
      content:
        "Find healthcare positions that match your specialization, location preferences, and career goals.",
    },
    {
      title: "Verified Opportunities?",
      content:
        "Every job listing is carefully reviewed and verified to ensure authenticity and reliability.",
    },
    {
      title: "Smart Job Alerts?",
      content:
        "Receive real-time notifications when new roles matching your preferences become available.",
    },
  ];

  return (
    <>
      <section className="py-20 bg-teal-50">
        <Container>
          <div className=" px-4">
            <div className="pb-20 space-y-2    ">
              <h1 className="text-center text-4xl font-semibold text-gray-700">
                Complete Healthcare Recruitment Solution
              </h1>
              <p className="text-center max-w-2xl mx-auto text-lg">
                Whether you&apos;re healthcare professional seeking
                opportunities or a facility looking to hire qualified
                candidates, our platform provides all the tools you neet
              </p>
            </div>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative order-2 lg:order-1">
                <div className="relative overflow-hidden rounded-xl shadow-xl">
                  <Image
                    src={healthcare}
                    alt="Healthcare professional working with patient"
                    width={600}
                    height={500}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>

              <div className="space-y-6 order-1 lg:order-2">
                <div className="space-y-2">
                  <h3 className=" flex gap-2 text-[#303d47] border  border-gray-200 rounded-3xl w-fit px-4 py-2 items-center">
                    <Hospital />
                    For Healthcare Facilities
                  </h3>
                  <h1 className="text-2xl text-gray-700">
                    Hire Qualified Professionals
                  </h1>

                  <p className="text-lg text-gray-600 leading-relaxed">
                    Post job vacancies and connect with top healthcare talent
                  </p>
                </div>

                <div className="space-y-4">
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
          </div>
        </Container>
      </section>
      <Container>
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
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
            </div>
          </div>
        </section>
      </Container>
      <section className="py-20 bg-gray-100">
        <Container>
          <div className="space-y-6">
            <h2 className="text-5xl font-bold text-gray-900 text-center">
              Find the Right Provider, Faster.
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-center">
              Easily post shifts, set credential requirements, and connect with
              qualified, available healthcare professionals who are ready to
              work all in one secure, intelligent platform
            </p>

            <div className="flex items-center justify-center">
              <button
                onClick={handelRedirect}
                className="w-fit px-6 py-4 rounded-[8px] font-medium whitespace-nowrap text-white bg-teal-500 hover:bg-teal-600 flex items-center justify-center gap-5 cursor-pointer"
              >
                Go to Dashboard <MoveRight />
              </button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

export default FacilityFaqSolution;
