import work_1 from "../../../assets/icons/Illustration.svg";
import work_2 from "../../../assets/icons/Group.svg";
import work_3 from "../../../assets/icons/Group.png";
import work_4 from "../../../assets/icons/group1.svg";
import { Container } from "@/components/ui-library/container";
import Image from "next/image";
function HowToWork() {
  return (
    <Container>
      <section className="py-20 bg-white">
        <div className="mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              How AnestheLink Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We’ve simplified healthcare staffing into four easy steps — fast,
              transparent, and built on trust.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center space-y-6 border border-gray-100 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] px-20 py-10">
              <div className="relative mx-auto w-48 h-48">
                <Image
                  src={work_1}
                  alt="Medical Equipment & Drug Store"
                  width={200}
                  height={200}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-[#303d47]">
                  Create Your Profile
                </h3>
                <p className="text-gray-600">
                  Providers upload their licenses, DEA, and certifications once
                  — verified and securely stored for hospital access.
                </p>
              </div>
            </div>

            <div className="text-center space-y-6 border border-gray-100 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] px-20 py-10">
              <div className="relative mx-auto w-48 h-48">
                <Image
                  src={work_2}
                  alt="Quality & Safety Assurance"
                  width={200}
                  height={200}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-[#303d47]">
                  Post or Discover Shifts
                </h3>
                <p className="text-gray-600">
                  Hospitals post anesthesia openings, and providers instantly
                  see matching roles based on specialty, location, and
                  availability.
                </p>
              </div>
            </div>

            <div className="text-center space-y-6 border border-gray-100 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] px-20 py-10">
              <div className="relative mx-auto w-48 h-48">
                <Image
                  src={work_3}
                  alt="Easy Booking & Scheduling"
                  width={200}
                  height={200}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-[#303d47]">
                  Direct Chat & Credential Share
                </h3>
                <p className="text-gray-600 text-sm">
                  Connect, communicate, and exchange credentials instantly — no
                  recruiters or paperwork delays.
                </p>
              </div>
            </div>

            <div className="text-center space-y-6 border border-gray-100 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] px-20 py-10">
              <div className="relative mx-auto w-48 h-48">
                <Image
                  src={work_4}
                  alt="Budget Optimization & Cost Saving"
                  width={200}
                  height={200}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-[#303d47]">
                  Hire in Hours, Not Weeks
                </h3>
                <p className="text-gray-600 text-sm">
                  Confirm matches, manage contracts, and start work quickly —
                  saving time and cost for everyone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
}

export default HowToWork;
