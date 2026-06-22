"use client";

import { useGetSingleJobDetailsQuery } from "@/redux/features/(Facility)/profileFacility/jobManagementFacilityApi";
import { Skeleton } from "antd";
import { BriefcaseBusiness, Clock, Tag } from "lucide-react";
import Image from "next/image";
import logo from "../../../assets/images/Ellipse 2157.png";

interface JobProps {
  id: string;
}

const experienceMap: Record<string, string> = {
  NONE: "0 Years",
  ONE_TO_TWO_YEARS: "1-2 Years",
  TWO_TO_THREE_YEARS: "2-3 Years",
  THREE_TO_FOUR_YEARS: "3-4 Years",
  FOUR_TO_FIVE_YEARS: "4-5 Years",
  MORE_THAN_FIVE_YEARS: "5+ Years",
};

/* ---------------- Skeleton ---------------- */
const JobDetailsSkeleton = () => (
  <div className="m-5 space-y-6 rounded-lg border bg-white p-6">
    <Skeleton.Input active className="w-60 h-8" />
    <Skeleton active paragraph={{ rows: 2 }} />
    <Skeleton.Button active className="w-40 h-10" />
    <Skeleton active paragraph={{ rows: 6 }} />
  </div>
);

/* ---------------- Component ---------------- */
const JobDetailsComponent = ({ id }: JobProps) => {
  const { data: jobDetails, isLoading } = useGetSingleJobDetailsQuery({ id });

  if (isLoading) return <JobDetailsSkeleton />;

  const job = jobDetails?.result;
  if (!job) return <div>No job details found.</div>;

  const schedule = job.schedule?.[0];
  const startTime = schedule
    ? new Date(schedule.startTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";
  const endTime = schedule
    ? new Date(schedule.endTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";
  const date = schedule ? new Date(schedule.date).toLocaleDateString() : "N/A";

  const durationLabelMap: Record<string, string> = {
    DAILY: "Per-hour",
    MONTHLY: "Monthly",
  };

  return (
    <div className="m-5 space-y-8 rounded-lg border bg-gray-50 p-6">
      {/* Header */}
      {/* <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Job Details</h1>
        <div className="rounded-md bg-white px-4 py-2 text-right text-sm text-gray-600">
          <p>{new Date(job.createdAt).toLocaleDateString()}</p>
          <p>{new Date(job.createdAt).toLocaleTimeString()}</p>
        </div>
      </div> */}

      {/* Stats */}
      <div className="flex flex-wrap gap-6 text-sm text-gray-700">
        <p>
          Total Applied:{" "}
          <span className="font-semibold">
            {job.totalAppliedCountToThisJob}
          </span>
        </p>
        <p>
          Total Match:{" "}
          <span className="font-semibold">
            {job.totalUserCountMatchedForThisJob}
          </span>
        </p>
        <p>
          Total Click:{" "}
          <span className="font-semibold">{job.totalClicks?.length || 0}</span>
        </p>
      </div>

      {/* Company Info */}
      <div className="flex items-center justify-between rounded-xl bg-white p-5">
        <div className="flex items-center gap-4">
          <Image
            src={logo}
            alt="company logo"
            width={56}
            height={56}
            className="h-14 w-14 rounded-full border object-cover"
          />
          <div>
            <h2 className="font-semibold text-gray-800">
              {job.user?.facilityProfile?.facilityName || "Unknown Facility"}
            </h2>
            <p className="text-sm text-gray-600">{job.jobRole}</p>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {/* <span className="chip">
          <Tag size={14} className="rotate-90" />
          Contact
        </span> */}
        <span className="chip">
          <Clock size={14} />
          {startTime} - {endTime}
        </span>
        <span className="chip">
          <BriefcaseBusiness size={14} />
          {experienceMap[job.experience] || "N/A"}
        </span>
      </div>

      {/* Location & Price */}
      <div className="space-y-2 text-sm text-gray-700">
        <p>
          <span className="font-medium">Location:</span>{" "}
          {job.user?.facilityProfile?.address?.fullAddress || "Unknown"}
        </p>
        <p>
          <span className="font-medium">Date:</span> {date}
        </p>
        <p className="text-lg font-semibold text-gray-800">
          ${job.minPriceRange} – ${job.maxPriceRange}{" "}
          <span className="text-sm font-normal text-gray-500">
            {durationLabelMap[job.duration] || job.duration}
          </span>
        </p>
      </div>

      {/* About */}
      <section className="space-y-2">
        <h2 className="text-xl font-bold text-gray-800">About this role</h2>
        <p className="text-gray-600 leading-relaxed">{job.about}</p>
      </section>

      {/* Qualifications */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Qualifications</h2>

        <div className="space-y-3 text-sm text-gray-700">
          <p>
            <strong>Qualification:</strong> {job?.qualification || "N/A"}
          </p>
          <p>
            <strong>Experience:</strong>{" "}
            {experienceMap[job.experience] || "N/A"}
          </p>
          {job?.user?.facilityProfile?.website && (
            <p>
              <strong>Website:</strong>{" "}
              <a
                href={job.user.facilityProfile.website}
                target="_blank"
                className="text-blue-600 hover:underline"
              >
                {job.user.facilityProfile.website}
              </a>
            </p>
          )}
        </div>
      </section>

      {/* Reviews */}
      <div className="flex items-center gap-3 rounded-xl bg-white p-5">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`h-5 w-5 ${
                i < Math.round(job.user?.averageRating || 0)
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <p className="text-sm text-gray-600">
          {job.user?.averageRating || 0} ({job.user?.totalReviewCount || 0}{" "}
          Reviews)
        </p>
      </div>
    </div>
  );
};

export default JobDetailsComponent;
