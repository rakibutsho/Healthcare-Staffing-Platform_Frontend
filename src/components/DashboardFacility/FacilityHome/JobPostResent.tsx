"use client";

import { getSafeImageUrl } from "@/utils/getSafeImageUrl";
import { Button } from "antd";
import { CircleDollarSign, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  item: any; // raw job post object from API
  loading?: boolean;
  setRelevantJobApply: (value: string) => void;
}

function JobPostResent({ item, loading, setRelevantJobApply }: Props) {
  const router = useRouter();
  console.log("Item:", item);

  const durationLabelMap: Record<string, string> = {
    DAILY: "Per-hour",
    MONTHLY: "Monthly",
  };

  const handleDetailsPage = (id: string) => {
    return router.push(`/facility/apply_job/${id}`);
  };

  const schedule = item.schedule?.[0];

  console.log("Schedule:", schedule?.startTime);

  const jobRoleLabelMap: Record<string, string> = {
    CRNA: "CRNA",
    AA: "AA",
    MD_DO: "MD/DO",
  };

  const startTime = schedule
    ? new Date(schedule.startTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";
  const endTime = schedule
    ? new Date(schedule.endTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";
  const duration =
    schedule &&
    Math.floor(
      (new Date(schedule.endTime).getTime() -
        new Date(schedule.startTime).getTime()) /
        (1000 * 60 * 60),
    );

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 p-5 space-y-4 hover:shadow-md transition">
      {/* Logo + Company */}
      <div className="flex items-center gap-3">
        <Image
          width={40}
          height={40}
          alt="company logo"
          src={getSafeImageUrl(item.user?.facilityProfile?.profileImage)}
          className="w-10 h-10 rounded-full"
        />
        <span className="font-semibold text-lg text-gray-700">
          {item.user?.facilityProfile?.facilityName ?? "Unknown Facility"}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-teal-600 font-semibold text-xl">
        {jobRoleLabelMap[item.jobRole]}
      </h1>

      {/* Location + Price */}
      <div className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2">
        <p className="flex items-center gap-1 text-sm font-semibold text-gray-700">
          <CircleDollarSign size={16} className="text-green-600" />
          <span>
            ${item.minPriceRange} – ${item.maxPriceRange}
          </span>
        </p>

        <span className="text-xs font-medium text-gray-500">
          {durationLabelMap[item.duration] || item.duration} {}
        </span>
      </div>

      {/* Shift Info */}
      <div className="flex items-center justify-between gap-2">
        <p className="text-gray-600 flex items-center gap-1">
          <MapPin size={18} />
          {item.user?.facilityProfile?.address?.fullAddress ?? "Not Provided"}
        </p>
        {/* <p className="text-gray-500 text-sm">per shift</p> */}
      </div>

      {/* Time / Duration / Cert */}
      <div className="flex flex-wrap gap-2 text-sm text-gray-700 py-2">
        <span className="bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
          <Clock size={14} /> {startTime} - {endTime}
        </span>
        <span className="bg-gray-100 px-2 py-1 rounded">
          Duration: {duration ?? 0} hrs
        </span>
        <span className="bg-gray-100 px-2 py-1 rounded">
          Cert: {item.qualification}
        </span>
      </div>

      {/* View Details */}
      <Button
        block
        type="primary"
        color="cyan"
        variant="outlined"
        className="h-12 rounded-lg "
        size="large"
        onClick={() => handleDetailsPage(item.id)}
        loading={loading}
        disabled={loading}
      >
        View Details
      </Button>

      {/* Stats */}
      <div className="flex items-center justify-between gap-5 mt-5 text-gray-700">
        <div className="text-center flex-1">
          <h1 className="text-sm text-gray-500">Total Match</h1>
          <h1 className="text-xl font-bold">
            {item.totalUserCountForThisJob ?? 0}
          </h1>
        </div>
        <div className="text-center flex-1">
          <h1 className="text-sm text-gray-500">Total Click</h1>
          <h1 className="text-xl font-bold">{item.totalClicks?.length ?? 0}</h1>
        </div>
        <div className="text-center flex-1">
          <h1 className="text-sm text-gray-500">Total Applied</h1>
          <h1 className="text-xl font-bold">
            {item.totalAppliedCountToThisJob ?? 0}
          </h1>
        </div>
      </div>
    </div>
  );
}

export default JobPostResent;
