"use client";

import { Container } from "@/components/ui-library/container";
import video from "../../../assets/images/vidio.jpg";
import { Hospital, Play, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function AboutUsComponent() {
  return (
    <div className="bg-white text-gray-800">
      {/* Header */}
      <section className="text-center bg-gradient-to-b from-blue-50 to-teal-50 pt-36 pb-16">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            🩺 About Us
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Transforming anesthesia staffing through speed, trust, and direct access.
          </p>
        </Container>
      </section>

      <Container>
        {/* Video Section */}
        <section className="max-w-5xl mx-auto py-16 md:py-24">
          {/* <div className="relative mx-auto max-w-2xl rounded-2xl overflow-hidden shadow-xl mb-10">
            <Image
              src={video}
              alt="Healthcare video preview"
              width={800}
              height={500}
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <button className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <Play className="h-6 w-6 md:h-8 md:w-8 text-gray-900 ml-1" />
              </button>
            </div>
          </div> */}

          <h2 className="text-2xl md:text-4xl font-semibold text-[#193E58] mb-8 text-center leading-snug">
            Connecting Hospitals and Anesthesia Providers — Simply and Securely
          </h2>

          <div className="space-y-5 text-center max-w-3xl mx-auto text-gray-700">
            <p>
              At <b>AnestheLink</b>, we’re transforming how anesthesia staffing
              works. Our mission is simple:{" "}
              <b>connect hospitals and anesthesia professionals directly</b> —
              without agencies, delays, or hidden markups.
            </p>
            <p>
              We’re building the bridge between{" "}
              <b>quality care and trusted partnerships</b>, where every
              connection is faster, more transparent, and more rewarding for
              both sides.
            </p>
          </div>
        </section>

        {/* Why We Exist */}
        <section className="py-16 border-t border-gray-200">
          <h2 className="text-2xl md:text-4xl font-semibold text-[#193E58] mb-8 text-center">
            Why We Exist
          </h2>
          <div className="space-y-5 text-center max-w-3xl mx-auto text-gray-700">
            <p>
              For years, hospitals and anesthesia providers have relied on
              staffing agencies that add cost, slow down hiring, and limit
              control. We believe there’s a better way — one built on{" "}
              <b>technology, trust, and transparency</b>.
            </p>
            <p>
              That’s why we created <b>AnestheLink</b>: a platform that gives{" "}
              <b>
                hospitals direct access to credentialed CRNAs Anesthesiologists
                and Anesthesiologist Assistants
              </b>
              , and gives <b>providers more freedom and earning potential</b>.
            </p>
          </div>
        </section>

        {/* Our Vision */}
        <section className="py-16 border-t border-gray-200">
          <h2 className="text-2xl md:text-4xl font-semibold text-[#193E58] mb-8 text-center">
            Our Vision
          </h2>
          <p className="text-center max-w-3xl mx-auto text-gray-700 leading-relaxed">
            To become the leading digital bridge between anesthesia
            professionals and healthcare facilities —{" "}
            <b>
              reducing costs, increasing speed, and strengthening patient care
              through better staffing.
            </b>
          </p>
        </section>

        {/* Our Approach */}
        <section className="py-16 border-t border-gray-200">
          <h2 className="text-2xl md:text-4xl font-semibold text-[#193E58] mb-8 text-center">
            Our Approach
          </h2>
          <div className="space-y-5 text-center max-w-3xl mx-auto text-gray-700">
            <p>
              We combine <b>secure technology</b> with personalized support to
              make every connection smooth and compliant.
            </p>
            <ul className="text-left list-disc list-inside space-y-2 max-w-lg mx-auto">
              <li>
                <b>Verified Providers:</b> Every professional on our platform is
                licensed and vetted.
              </li>
              <li>
                <b>Smart Matching:</b> Instantly connect hospitals with
                providers who meet their exact needs.
              </li>
              <li>
                <b>Direct Communication:</b> Facilities and providers chat,
                share credentials, and hire seamlessly within the app.
              </li>
              <li>
                <b>Trusted Partnerships:</b> Every interaction is transparent,
                rated, and built to last.
              </li>
            </ul>
          </div>
        </section>
        <section className="py-16 border-t border-gray-200">
          <h2 className="text-2xl md:text-4xl font-semibold text-[#193E58] mb-8 text-center">
            Together, We Build Better Care
          </h2>
          <div className="space-y-5 text-center max-w-3xl mx-auto text-gray-700">
            <p>
              Whether you’re a hospital seeking top anesthesia talent or a
              provider looking for your next opportunity, AnestheLink is your
              partner for{" "}
              <b>
                faster connections, lower costs, and stronger clinical teams
              </b>
              .
            </p>
            <p>
              Because when hospitals and anesthesia providers connect directly —{" "}
              <b>patients win</b>.
            </p>
          </div>
        </section>
      </Container>
      <section className="py-20 bg-[#e2e8f0]">
        <Container>
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold text-[2B3A55] leading-tight">
                Join the Network. Build the Future of Anesthesia Staffing.
              </h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-4 w-full sm:w-auto">
                {/* Provider */}
                <Link
                  href="/auth/login"
                  className="flex items-center gap-3 px-4 lg:px-6 py-3 lg:py-4 bg-[#4B9FA3] rounded-md text-white text-lg lg:text-[20px] font-medium w-full sm:w-auto justify-center sm:justify-start hover:bg-[#3a7a7d] transition-colors"
                >
                  <Users />I am a Provider
                </Link>

                {/* Facility */}
                <Link
                  href="/auth/login"
                  className="flex items-center gap-3 px-4 lg:px-6 py-3 lg:py-4 bg-[rgba(125,198,200,0.15)] border border-[rgba(25,62,88,0.20)] rounded-md text-[#193E58] text-lg lg:text-[20px] font-normal w-full sm:w-auto justify-center sm:justify-start hover:bg-[rgba(125,198,200,0.25)] transition-colors"
                >
                  <Hospital />I am a Facility
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

export default AboutUsComponent;
