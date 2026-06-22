import Image from "next/image";
import hero1 from "../../../../assets/images/profile-photo-attractive.png";
import hero2 from "../../../../assets/images/group2.png";
import shield from "../../../../assets/icons/Shield.svg";
import Link from "next/link";
import { MoveRight, Users } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { Button } from "antd";
import { useRouter } from "next/navigation";

export default function FacilityHome() {
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
  return (
    <section className="pt-10 lg:pt-16">
      <div className="relative flex flex-col items-start justify-start gap-10 w-full h-full">
        <div className="flex flex-col-reverse xl:flex-row items-start lg:items-center gap-10 lg:gap-[75px] w-full">
          {/* Left Content */}
          <div className="flex flex-col items-start justify-start gap-8 lg:gap-12 flex-1 max-w-full xl:max-w-none relative">
            {/* Tag + Heading + Subtext */}
            <div className="relative flex flex-col items-start justify-start gap-4 lg:gap-6 w-full max-w-[683px]">
              {/* Tag */}
              {/* <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full border border-[#D1D6DB] backdrop-blur-sm bg-white/50">
                <Image alt="provider" src={shield} className="w-8 h-8" />
                <span className="text-[#193E58] text-sm lg:text-[16px] font-medium opacity-80">
                  Connecting 10,000+ Healthcare Professionals & 2,000+
                  Facilities
                </span>
              </div> */}

              {/* Heading */}
              <div className="flex flex-wrap opacity-80">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[64px] leading-tight lg:leading-[80px] font-bold text-[#101010]">
                  Your Bridge to{" "}
                  <span className="font-extrabold text-[#193E58]">Trusted</span>{" "}
                  <span className="font-extrabold text-[#193E58]">
                    Healthcare
                  </span>{" "}
                  Partnerships
                </h1>
              </div>

              {/* Subtext */}
              <p className="text-[#666666] text-base lg:text-[18px] leading-relaxed lg:leading-[28px] max-w-full lg:w-[670px]">
                Whether you&#39;re a doctor seeking your next opportunity or a
                hospital looking for top talent, create profiles, share
                credentials, and find the perfect match — all in one trusted
                platform.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              {/* Provider */}
              <button
                onClick={handelRedirect}
                className="flex items-center gap-3 px-4 lg:px-6 py-3 lg:py-4 bg-[#4B9FA3] rounded-md text-white text-lg lg:text-[20px] font-medium w-full sm:w-auto justify-center sm:justify-start hover:bg-[#3a7a7d] transition-colors cursor-pointer"
              >
                <Users /> Go To Dashboard <MoveRight />
              </button>
            </div>

            {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 w-full max-w-4xl py-5">
              <div className="text-left border-r-2 border-[rgba(25,62,88,0.20)]">
                <div className="text-2xl lg:text-3xl font-bold text-[#193E58]">
                  10k+
                </div>
                <div className="text-sm lg:text-base text-[#666666]">
                  Healthcare Providers
                </div>
              </div>
              <div className="text-left border-r-2 border-[rgba(25,62,88,0.20)]">
                <div className="text-2xl lg:text-3xl font-bold text-[#193E58]">
                  2k+
                </div>
                <div className="text-sm lg:text-base text-[#666666]">
                  Medical Facilities
                </div>
              </div>
              <div className="text-left border-r-2 border-[rgba(25,62,88,0.20)]">
                <div className="text-2xl lg:text-3xl font-bold text-[#193E58]">
                  4k+
                </div>
                <div className="text-sm lg:text-base text-[#666666]">
                  Successful Placement
                </div>
              </div>
              <div className="text-left">
                <div className="text-2xl lg:text-3xl font-bold text-[#193E58]">
                  1k+
                </div>
                <div className="text-sm lg:text-base text-[#666666]">
                  Facility Open
                </div>
              </div>
            </div> */}
          </div>

          {/* Right Images */}
          <div className="relative flex-shrink-0 w-full lg:w-auto mt-8 lg:mt-0">
            <div className="relative w-full max-w-md lg:max-w-xl mx-auto lg:mx-0">
              <div className="relative">
                <Image
                  width={600}
                  height={600}
                  src={hero1}
                  alt="Healthcare professionals illustration"
                  className="w-full h-auto max-w-sm lg:max-w-none z-50"
                />
              </div>

              <div className="absolute -right-8 sm:-right-12 lg:-right-48 xl:-right-0 top-0 lg:top-0">
                <Image
                  width={400}
                  height={400}
                  src={hero2}
                  alt="Hospital building illustration"
                  className="w-32 sm:w-48 lg:w-96 h-auto"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
      </div>
    </section>
  );
}
