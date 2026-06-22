"use client";
import Spinner from "@/components/common/Spinner";
import { useGetJobByIdQuery } from "@/redux/features/(Providers)/profileProvider/providerJobApi";
import { Bookmark, Clock, Star, Users } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  format,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  isPast,
} from "date-fns";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";

type DetailsJobComponentProps = {
  job_id: string;
};

// ✅ Safe date formatter to prevent "Invalid time value"
const safeFormat = (dateStr: string | undefined, formatStr: string): string => {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "N/A"; // invalid date string
  return format(d, formatStr);
};

function DetailsJobComponent({ job_id }: DetailsJobComponentProps) {
  const { data: jobData, isLoading } = useGetJobByIdQuery(job_id);

  const { user } = useAppSelector((state) => state.auth);
  const providerId = user?.id;

  const job = jobData?.result;

  // Real-time clock for countdown
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const experienceMap: Record<string, string> = {
    ONE_TO_TWO_YEARS: "1–2 Years",
    TWO_TO_THREE_YEARS: "2–3 Years",
    THREE_TO_FOUR_YEARS: "3–4 Years",
    FOUR_TO_TEN_YEARS: "4–10 Years",
  };

  const durationLabelMap: Record<string, string> = {
    DAILY: "Per-hour",
    MONTHLY: "Monthly",
  };

  const formatExperience = (value: string): string => {
    return experienceMap[value] || "N/A";
  };

  // Helper to calculate and format time left
  const getTimeLeft = (endTime: string | undefined, now: Date): string => {
    if (!endTime) return "N/A";

    const end = new Date(endTime);
    if (isNaN(end.getTime())) return "N/A";

    if (isPast(end)) {
      return "Expired";
    }

    const days = differenceInDays(end, now);
    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} left`;
    }

    const hours = differenceInHours(end, now);
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} left`;
    }

    const minutes = differenceInMinutes(end, now);
    if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} left`;
    }

    return "Ending soon";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  // Extract values
  const schedule = job?.schedule?.[0];
  const formattedDate = safeFormat(schedule?.date, "MMMM d, yyyy");
  const formattedTime =
    schedule?.startTime && schedule?.endTime
      ? `${safeFormat(schedule?.startTime, "h:mm a")} - ${safeFormat(
          schedule?.endTime,
          "h:mm a",
        )}`
      : "N/A";

  const createdDate = safeFormat(job?.createdAt, "MMMM d, yyyy");
  const createdTime = safeFormat(job?.createdAt, "h:mm a");
  const createdFull = safeFormat(job?.createdAt, "PPP");

  return (
    <div className="p-6 space-y-10">
      {/* Header */}
      <div className="flex justify-between items-start">
        <h1 className="text-4xl font-bold text-gray-900">Job Details</h1>

        <div className="text-right text-sm bg-white py-2 px-4 rounded shadow-sm">
          <p className="text-gray-500">Job Posted at:</p>
          <div className="text-gray-700 font-medium">{createdDate}</div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Job Header Section */}
        <div>
          <div className="flex items-center justify-between bg-gray-100 border border-gray-200 rounded-xl p-5">
            <div className="flex items-start space-x-4">
              {/* Logo Placeholder */}
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-700 font-bold text-sm">
                  {job?.user?.facilityProfile?.facilityName?.slice(0, 3) ||
                    "FAC"}
                </span>
              </div>

              {/* Info Section */}
              <div className="space-y-1">
                {/* Facility Name + Type */}
                <div className="flex items-center gap-2 text-gray-500">
                  <span>
                    {job?.user?.facilityProfile?.facilityName ||
                      "Unknown Facility"}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span>
                    {job?.user?.facilityProfile?.facilityType || "Unknown Type"}
                  </span>
                </div>

                {/* Job Role */}
                <h2 className="text-3xl font-semibold text-gray-900">
                  {job?.jobRole}
                </h2>
              </div>
            </div>
          </div>

          {/* Job Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-xs my-5 pt-3">
            {/* Case Type */}
            <div className="flex items-center bg-gray-100 px-4 py-2 rounded-xl whitespace-nowrap">
              <div className="w-2.5 h-2.5 bg-gray-300 rounded-full mr-2"></div>
              <span>
                Case Type: {job?.user?.facilityProfile?.caseType || "N/A"}
              </span>
            </div>

            {/* Time */}
            <div className="flex items-center bg-gray-100 px-4 py-2 rounded-xl whitespace-nowrap">
              <Clock size={12} className="mr-1 text-gray-400" />
              <span>{formattedTime}</span>
            </div>
          </div>

          {/* Location and Date */}
          <div className="mt-4 space-y-3 text-sm">
            {/* Location */}
            <div className="flex items-start space-x-2">
              <span className="text-gray-500 w-32 flex-shrink-0">
                Location:
              </span>
              <span className="text-gray-700 break-words">
                {job?.user?.facilityProfile?.address?.fullAddress || "N/A"}
              </span>
            </div>

            {/* Last Date of Apply */}
            <div className="flex items-center space-x-2">
              <span className="text-gray-500 w-32 flex-shrink-0">
                Last Date of Apply:
              </span>

              <span className="text-gray-700">{formattedDate}</span>

              {schedule?.endTime && (
                <span className="px-2 py-0.5 text-xs font-medium text-orange-600 bg-orange-100 rounded-md">
                  {getTimeLeft(schedule?.endTime, currentTime)}
                </span>
              )}
            </div>
          </div>

          {/* Salary */}
          <div className="mt-4">
            <div className="text-2xl font-bold text-gray-900 flex items-baseline gap-2">
              <span>
                ${job?.minPriceRange} - ${job?.maxPriceRange}
              </span>
              <span className="text-sm text-gray-500 font-medium">
                {durationLabelMap[job.duration] || job.duration}
              </span>
            </div>
          </div>
        </div>

        {/* About this role */}
        <div className="py-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            About this role
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">{job?.about}</p>
        </div>

        {/* Qualifications */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Qualifications
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex">
              <span className="text-gray-500 w-32">• Qualification</span>
              <span className="text-gray-700">: {job?.qualification}</span>
            </div>
            <div className="flex">
              <span className="text-gray-500 w-32">• Experience</span>
              <span className="text-gray-700">
                : {formatExperience(job?.experience)}
              </span>
            </div>
          </div>
        </div>

        {/* Facility Insights */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Facility Insights
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex">
              <span className="text-gray-500 w-32">• Facility</span>
              <span className="text-gray-700">
                : {job?.user?.facilityProfile?.facilityName || "Not provided"}
              </span>
            </div>
            <div className="flex">
              <span className="text-gray-500 w-32">• Website</span>
              {job?.user?.facilityProfile?.website ? (
                <Link
                  href={
                    job.user.facilityProfile.website.startsWith("http")
                      ? job.user.facilityProfile.website
                      : `https://${job.user.facilityProfile.website.trim()}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 cursor-pointer hover:underline"
                >
                  : {job.user.facilityProfile.website.trim()}
                </Link>
              ) : (
                <span className="text-gray-500">N/A</span>
              )}
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-2">
          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />

          <span className="font-semibold text-gray-900">
            {(job?.user?.averageRating ?? 0).toFixed(1)}
          </span>

          <span className="text-gray-500 text-sm">
            ({job?.user?.totalReviewCount ?? 0}{" "}
            {job?.user?.totalReviewCount === 1 ? "Review" : "Reviews"})
          </span>
        </div>

        {/* Apply Button */}
        {job?.jobApplication?.providerUserId === providerId ? (
          <button
            disabled
            className="w-fit bg-gray-400 text-white py-3 px-5 rounded-lg font-medium cursor-not-allowed"
          >
            Already Applied
          </button>
        ) : (
          <Link
            href={`/dashboard/apply_job?id=${job?.id}`}
            className="w-fit bg-teal-600 hover:bg-teal-700 text-white py-3 px-5 rounded-lg font-medium text-center cursor-pointer transition-colors duration-200"
          >
            Apply this job
          </Link>
        )}
      </div>
    </div>
  );
}

export default DetailsJobComponent;
