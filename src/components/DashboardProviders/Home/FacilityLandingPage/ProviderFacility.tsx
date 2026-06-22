"use client";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Container } from "@/components/ui-library/container";
import {
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Hospital,
  MapPin,
} from "lucide-react";
import { Button } from "antd";
import Image from "next/image";
import logo from "../../../../assets/images/Ellipse 2157.png";
import { useGetProviderProfileQuery } from "@/redux/features/(Providers)/profileProvider/profileProviderApi";
import { useGetSearchJobsQuery } from "@/redux/features/(Providers)/profileProvider/providerJobApi";
import { useGetProvidersByFacilityQuery } from "@/redux/features/(Facility)/profileFacility/jobManagementFacilityApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Spinner from "@/components/common/Spinner";

function ProviderFacility() {
  const swiperRef = useRef<any>(null);
  const router = useRouter();

  // Fetch profile
  const { data: profile, isLoading: profileLoading } =
    useGetProviderProfileQuery("");
  const userRole = profile?.result?.role;
  const userData = profile?.result;

  // Fetch jobs/providers
  const { data: matchingFacility, isLoading: facilityLoading } =
    useGetSearchJobsQuery("", {
      skip: userRole !== "PROVIDER",
    });
  const { data: matchingProvider, isLoading: providerLoading } =
    useGetProvidersByFacilityQuery("", {
      skip: userRole !== "FACILITY",
    });

  const goNext = () => swiperRef.current?.slideNext();
  const goPrev = () => swiperRef.current?.slidePrev();

  const jobs =
    userRole === "PROVIDER"
      ? matchingFacility?.result?.data || []
      : matchingProvider?.result?.data || [];

  // Combined loading
  const isLoading = profileLoading || facilityLoading || providerLoading;

  return (
    <Container>
      <div className="py-14">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap">
          <h1 className="text-4xl font-semibold text-gray-700">
            {userRole === "PROVIDER"
              ? "Your Matching Facility"
              : "Matching Providers"}
          </h1>
          {userRole && (
            <Link
              href={
                userRole === "PROVIDER" ? "/dashboard" : "/facility/providers"
              }
            >
              <p className="text-lg font-medium">View All</p>
            </Link>
          )}
        </div>

        {/* Show Loading Spinner */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : (
          <>
            {/* Show Complete Profile Button if profile is incomplete */}
            {userData?.isProfile === false ? (
              <div className="flex justify-center py-20">
                <Link
                  href={
                    userRole === "PROVIDER"
                      ? "/auth/provider-profile-setup"
                      : "/auth/facility-profile-setup"
                  }
                >
                  <Button
                    type="primary"
                    size="large"
                    className="bg-teal-600 hover:bg-teal-700 text-white font-medium h-12 px-6"
                  >
                    Complete Your Profile
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="py-10 relative">
                {/* Show empty state if no jobs/providers */}
                {jobs.length === 0 ? (
                  <div className="flex justify-center py-20 text-gray-500 font-medium">
                    {userRole === "PROVIDER"
                      ? "No matching facilities found."
                      : "No matching providers found."}
                  </div>
                ) : (
                  <Swiper
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    modules={[Navigation]}
                    spaceBetween={20}
                    slidesPerView={1}
                    loop={true}
                    breakpoints={{
                      640: { slidesPerView: 1, spaceBetween: 20 },
                      768: { slidesPerView: 2, spaceBetween: 20 },
                      1024: { slidesPerView: 3, spaceBetween: 30 },
                      1280: { slidesPerView: 3, spaceBetween: 40 },
                    }}
                    className="w-full px-2 md:px-0"
                  >
                    {jobs.map((item: any) => {
                      const isProvider = userRole === "PROVIDER";
                      const facility = isProvider
                        ? item.user?.facilityProfile
                        : null;
                      const provider = !isProvider
                        ? item.providerProfile
                        : null;
                      const schedule = isProvider ? item.schedule?.[0] : null;
                      const alreadyApplied = item.JobApplication?.length > 0;

                      return (
                        <SwiperSlide key={item.id}>
                          <div className="bg-white rounded-xl shadow border border-white p-4 space-y-3 m-2">
                            <Image
                              width={1000}
                              height={1000}
                              alt="profile"
                              src={
                                isProvider
                                  ? facility?.profileImage || logo
                                  : provider?.profileImage || logo
                              }
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-lg text-gray-700">
                                {isProvider
                                  ? facility?.facilityName
                                  : provider?.fullName}
                              </span>
                            </div>

                            {isProvider && (
                              <h1 className="text-teal-600 font-semibold text-lg hover:underline cursor-pointer">
                                {item.jobRole}
                              </h1>
                            )}

                            <div className="flex items-center justify-between gap-2">
                              {isProvider ? (
                                <>
                                  <p className="text-gray-600 flex items-center gap-1">
                                    <Hospital size={18} />{" "}
                                    {facility?.facilityName}
                                  </p>
                                  <p className="text-gray-600 flex items-center gap-1">
                                    <CircleDollarSign size={18} />{" "}
                                    {item.minPriceRange} - {item.maxPriceRange}
                                  </p>
                                </>
                              ) : (
                                <>
                                  <p className="text-gray-600 flex items-center gap-1">
                                    <MapPin size={18} />{" "}
                                    {provider?.address?.fullAddress}
                                  </p>
                                  <p className="text-gray-600 flex items-center gap-1">
                                    Rating: {provider?.averageRating || 0}
                                  </p>
                                </>
                              )}
                            </div>

                            {isProvider && (
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-gray-600 flex items-center gap-1">
                                  <MapPin size={18} />{" "}
                                  {facility?.address?.fullAddress}
                                </p>
                                <p className="text-gray-600 text-sm">
                                  per shift
                                </p>
                              </div>
                            )}

                            <div className="flex flex-wrap gap-2 text-sm text-gray-600 py-2">
                              {schedule?.startTime && schedule?.endTime && (
                                <span className="bg-gray-100 px-2 py-1 rounded">
                                  {new Date(
                                    schedule.startTime
                                  ).toLocaleTimeString()}{" "}
                                  -{" "}
                                  {new Date(
                                    schedule.endTime
                                  ).toLocaleTimeString()}
                                </span>
                              )}
                              {isProvider ? (
                                <>
                                  <span className="bg-gray-100 px-2 py-1 rounded">
                                    Experience: {item.experience}
                                  </span>
                                  <span className="bg-gray-100 px-2 py-1 rounded">
                                    Candidates: {item.totalCandidate}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className="bg-gray-100 px-2 py-1 rounded">
                                    Case Preference:{" "}
                                    {provider?.caseTypePreference?.join(", ")}
                                  </span>
                                  <span className="bg-gray-100 px-2 py-1 rounded">
                                    Certifications:{" "}
                                    {provider?.certification?.join(", ")}
                                  </span>
                                </>
                              )}
                            </div>

                            <div className="flex items-center justify-between gap-5">
                              {isProvider ? (
                                <>
                                  <Button
                                    type="primary"
                                    block
                                    color="cyan"
                                    variant="outlined"
                                    className="h-12"
                                    size="large"
                                    onClick={() =>
                                      router.push(`/dashboard/${item.id}`)
                                    }
                                  >
                                    View Details
                                  </Button>

                                  {alreadyApplied ? (
                                    <Button
                                      type="primary"
                                      disabled
                                      variant="solid"
                                      size="large"
                                      className="flex-1 h-12 text-center bg-gray-300 text-gray-500 px-4 py-2.5 rounded-md text-sm font-medium cursor-not-allowed"
                                    >
                                      Already Applied
                                    </Button>
                                  ) : (
                                    <Button
                                      type="primary"
                                      block
                                      color="cyan"
                                      variant="solid"
                                      className="h-12"
                                      size="large"
                                      onClick={() =>
                                        router.push(
                                          `/dashboard/apply_job?id=${item.id}`
                                        )
                                      }
                                    >
                                      Apply Job
                                    </Button>
                                  )}
                                </>
                              ) : (
                                <Button
                                  type="primary"
                                  block
                                  color="cyan"
                                  variant="solid"
                                  className="h-12"
                                  size="large"
                                >
                                  Request to Chat
                                </Button>
                              )}
                            </div>
                          </div>
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                )}

                {/* Swiper Navigation Buttons */}
                {jobs.length > 0 && (
                  <div className="flex justify-end gap-4 mt-4">
                    <button
                      onClick={goPrev}
                      className="w-10 h-10 flex items-center justify-center text-2xl bg-teal-500 text-white rounded-full hover:bg-teal-600 transition cursor-pointer"
                    >
                      <ChevronLeft size={35} />
                    </button>
                    <button
                      onClick={goNext}
                      className="w-10 flex items-center justify-center h-10 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition cursor-pointer"
                    >
                      <ChevronRight size={35} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </Container>
  );
}

export default ProviderFacility;
