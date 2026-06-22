"use client";
import React from "react";
import { Calendar, Clock, Heart, MapPin } from "lucide-react";
import Link from "next/link";
import {
  useRemoveSavedJobPostMutation,
  useSavedJobPostMutation,
} from "@/redux/features/(Providers)/homeProvider/homeProvidersApi";
import { toast } from "sonner";

export interface Job {
  id: string;
  jobRole: string;
  about: string;
  duration: string;
  qualification: string;
  minPriceRange: number;
  maxPriceRange: number;
  experience: string;
  createdAt: string;
  JobApplication: any[];
  isSaved: boolean;
  user: {
    facilityProfile?: {
      facilityName?: string;
      address?: {
        fullAddress?: string;
      };
    } | null;
  };
  schedule: {
    startTime: string;
    endTime: string;
  }[];
}

interface JobCardProps {
  job: Job;
  refetch: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, refetch }) => {
  const salary = `$${job.minPriceRange}-${job.maxPriceRange}`;
  const company = job.user?.facilityProfile?.facilityName || "Unknown Facility";
  const posted = job.createdAt ? new Date(job.createdAt).toDateString() : "N/A";

  const experienceMap: Record<string, string> = {
    ONE_TO_TWO_YEARS: "1–2 Years",
    TWO_TO_THREE_YEARS: "2–3 Years",
    THREE_TO_FOUR_YEARS: "3–4 Years",
    FOUR_TO_TEN_YEARS: "4–10 Years",
  };

  const formatExperience = (value: string): string => {
    return experienceMap[value] || "N/A";
  };

  const durationLabelMap: Record<string, string> = {
    DAILY: "Per-hour",
    MONTHLY: "Monthly",
  };

  const jobType: Record<string, string> = {
    MD_DO: "MD/DO",
    CRNA: "CRNA",
    AA: "AA",
  };

  const formatJobType = (value: string): string => {
    return jobType[value] || "N/A";
  };

  const schedule = job.schedule?.[0];
  const [savedJobPost] = useSavedJobPostMutation();
  const [removeSavedJobPost] = useRemoveSavedJobPostMutation();
  const handelSaveJob = async (id: string) => {
    try {
      await savedJobPost(id).unwrap();
      refetch();
    } catch (error) {
      console.error("Error saving job:", error);
    }
  };
  const handelRemoveSavedJob = async (id: string) => {
    try {
      await removeSavedJobPost(id).unwrap();
      toast.success("Job removed from saved list");
      refetch();
    } catch (error) {
      console.error("Error removing saved job:", error);
    }
  };

  const shift =
    schedule && schedule.startTime && schedule.endTime
      ? `${new Date(schedule.startTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })} - ${new Date(schedule.endTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`
      : "N/A";

  const alreadyApplied = job.JobApplication?.length > 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="inline-block bg-teal-50 text-teal-700 text-xs px-3 py-1 rounded-md font-medium">
          {company}
        </div>

        {/* Save Button */}
        <button
          className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 hover:bg-red-50 transition"
          onClick={() =>
            job.isSaved ? handelRemoveSavedJob(job.id) : handelSaveJob(job.id)
          }
        >
          <Heart
            size={18}
            className={`transition ${
              job.isSaved
                ? "text-red-500 fill-red-500"
                : "text-gray-400 hover:text-red-500"
            }`}
          />
        </button>
      </div>

      {/* Job Title */}
      <h3 className="font-semibold text-gray-900 text-lg sm:text-xl mb-3">
        {formatJobType(job.jobRole)}
      </h3>

      {/* Address + Salary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm gap-2 mb-3">
        <div className="flex items-center text-gray-600">
          <MapPin size={14} className="mr-1 text-gray-400" />
          {job?.user?.facilityProfile?.address?.fullAddress ?? "N/A"}
        </div>

        <span className="font-semibold text-gray-700">
          {salary}
          <span className="text-gray-500 text-xs ml-1">
            {durationLabelMap[job.duration] || job.duration}
          </span>
        </span>
      </div>

      {/* Posted + Experience */}
      <div className="flex items-center justify-between text-sm mb-4">
        <div className="flex items-center text-gray-600">
          <Calendar size={14} className="mr-1 text-gray-400" />
          {posted}
        </div>

        <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium">
          EXP: {formatExperience(job.experience)}
        </span>
      </div>

      {/* About */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">About</h2>
        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
          {job.about}
        </p>
      </div>

      {/* Qualification + Shift */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        <div className="flex items-center bg-gray-100 px-3 py-2 rounded text-sm text-gray-700">
          <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
          {job.qualification || "N/A"}
        </div>

        <div className="flex items-center bg-gray-100 px-3 py-2 rounded text-sm text-gray-700">
          <Clock size={12} className="mr-2 text-gray-500" />
          {shift}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href={`/dashboard/${job?.id}`}
          className="flex-1 text-center border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-md text-sm font-medium transition"
        >
          View Details
        </Link>

        {alreadyApplied ? (
          <button
            disabled
            className="flex-1 bg-gray-300 text-gray-600 px-4 py-2.5 rounded-md text-sm font-semibold cursor-not-allowed"
          >
            Already Applied
          </button>
        ) : (
          <Link
            href={`/dashboard/apply_job?id=${job?.id}`}
            className="flex-1 text-center bg-teal-500 hover:bg-teal-600 text-white px-4 py-2.5 rounded-md text-sm font-medium transition"
          >
            Apply this job
          </Link>
        )}
      </div>
    </div>
  );
};

export default JobCard;
