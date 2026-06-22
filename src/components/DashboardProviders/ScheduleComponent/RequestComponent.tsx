"use client";

import Spinner from "@/components/common/Spinner";
import { useGetAllRequestedJobsByProviderQuery } from "@/redux/features/(Providers)/scheduleProvider/scheduleProviderApi";
import { Button, Empty } from "antd";
import ScheduleCardItem from "./ScheduleCardItem";

export interface ScheduleItem {
  id: string;
  date: string;
  title: string;
  status: string;
  location: string;
  company: string;
  price: string;
  time: string;
  duration: string;
  cert: string;
}

export default function RequestComponent() {
  const { data, isLoading, isError, refetch } =
    useGetAllRequestedJobsByProviderQuery({
      page: 1,
      limit: 10,
    });

  if (isLoading)
    return (
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
    );
  if (isError)
    return (
      <div className="flex flex-col items-center">
        <p className="text-red-500 mb-2">Failed to load requested jobs.</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );

  // Transform API response -> ScheduleItem[]
  const jobs: ScheduleItem[] =
    (Array.isArray(data?.result?.data)
      ? data!.result!.data.map((job: any) => {
          const jobPost = job?.jobPost;
          if (!jobPost) return null;

          const schedule = Array.isArray(jobPost.schedule)
            ? jobPost.schedule[0]
            : undefined;

          const startTime = schedule ? new Date(schedule.startTime) : undefined;
          const endTime = schedule ? new Date(schedule.endTime) : undefined;

          const formatTime = (date?: Date) =>
            date
              ? date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "";

          const durationHrs =
            startTime && endTime
              ? (
                  (endTime.getTime() - startTime.getTime()) /
                  (1000 * 60 * 60)
                ).toFixed(1) + " hr"
              : "N/A";

          return {
            id: jobPost.id,
            date: schedule
              ? new Date(schedule?.date).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "",
            title: jobPost.qualification || "",
            status: job.statusAfterApproval || "",
            company: jobPost.user?.facilityProfile?.facilityName || "",
            location: jobPost.user?.facilityProfile?.address?.fullAddress || "",
            price: `${jobPost.minPriceRange || ""} - ${jobPost.maxPriceRange || ""}`,
            time: `${formatTime(startTime)} to ${formatTime(endTime)}`,
            duration: durationHrs,
            cert: jobPost.jobRole || "",
          } as ScheduleItem;
        })
      : []) ?? [];

  return (
    <div className="space-y-6 pt-3">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        <span>📅</span> Requested Jobs
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.length > 0 ? (
          jobs.map((item) => <ScheduleCardItem item={item} key={item.id} />)
        ) : (
          <div className="col-span-full">
            <Empty description="No requested jobs found." />
          </div>
        )}
      </div>
    </div>
  );
}
