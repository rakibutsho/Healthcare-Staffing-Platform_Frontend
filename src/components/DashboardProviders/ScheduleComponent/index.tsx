"use client";

import { useState, useMemo } from "react";
import ScheduleCount from "@/components/shared/ScheduleCount/ScheduleCount";
import RequestComponent from "./RequestComponent";
import CompletedComponent from "./CompletedComponent";
import UpcomingCalender from "./UpcomingCalender/UpcomingCalender";

import {
  useGetAllRequestedJobsByProviderQuery,
  useGetCompletedJobsByProviderQuery,
} from "@/redux/features/(Providers)/scheduleProvider/scheduleProviderApi";
import { useGetAllAppliedJobsByProviderQuery } from "@/redux/features/(Providers)/profileProvider/providerJobApi";
import Spinner from "@/components/common/Spinner";

function ScheduleComponent() {
  const [activeTab, setActiveTab] = useState<
    "Upcoming" | "Request" | "Completed"
  >("Upcoming");

  const { data: completeJob, isLoading: completeLoading } =
    useGetCompletedJobsByProviderQuery(undefined);

  const { data: requestJob, isLoading: requestLoading } =
    useGetAllRequestedJobsByProviderQuery("");

  const { data: appliedJob, isLoading: appliedLoading } =
    useGetAllAppliedJobsByProviderQuery("");

  const isAnyLoading = completeLoading || requestLoading || appliedLoading;

  // Extract counts safely
  const counts = useMemo(
    () => [
      {
        value: completeJob?.result?.meta?.total || 0,
        text: "Completed Shift",
      },
      {
        value: requestJob?.result?.meta?.total || 0,
        text: "Pending Request",
      },
      {
        value: appliedJob?.result?.meta?.total || 0,
        text: "Applied Job",
      },
    ],
    [completeJob, requestJob, appliedJob]
  );

  const tabs: Array<"Upcoming" | "Request" | "Completed"> = useMemo(
    () => ["Upcoming", "Request", "Completed"],
    []
  );

  if (isAnyLoading) {
    return (
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="m-5 space-y-6">
      <h1 className="text-4xl font-medium">Schedule</h1>

      {/* Counts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {counts.map((item, index) => (
          <ScheduleCount key={index} value={item.value} text={item.text} />
        ))}
      </div>

      {/* Tabs */}
      <div className="p-2 bg-white rounded-4xl flex flex-wrap items-center gap-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-4xl text-sm font-medium transition-all
              ${
                activeTab === tab
                  ? "bg-[#193E58] text-white shadow"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "Upcoming" && <UpcomingCalender />}
        {activeTab === "Request" && <RequestComponent />}
        {activeTab === "Completed" && <CompletedComponent />}
      </div>
    </div>
  );
}

export default ScheduleComponent;
