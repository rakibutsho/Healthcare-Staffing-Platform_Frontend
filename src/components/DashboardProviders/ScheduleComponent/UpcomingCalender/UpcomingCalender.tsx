"use client";
import Spinner from "@/components/common/Spinner";
import { useGetUpcomingProviderScheduleQuery } from "@/redux/features/(Providers)/scheduleProvider/scheduleProviderApi";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { ScheduleItem } from "../RequestComponent";
import ScheduleCardItem from "../ScheduleCardItem";
import TimeCalendar from "./TimeCalendar";

function UpcomingCalender() {
  const initialStart = dayjs().startOf("week");
  const initialEnd = dayjs().endOf("week");

  const [currentDate, setCurrentDate] = useState({
    startDate: initialStart,
    endDate: initialEnd,
  });

  const [filterValue, setFilterValue] = useState<"weekly" | "monthly">(
    "weekly",
  );
  const [selectTimeDateYear, setSelectTimeDateYear] = useState<{
    type: "weekly" | "monthly";
    date: string;
    time?: string;
  } | null>(null);

  const { data, isLoading } = useGetUpcomingProviderScheduleQuery(
    filterValue === "weekly"
      ? {
          filter: "weekly",
          weekStart: currentDate.startDate.format("YYYY-MM-DD"),
          weekEnd: currentDate.endDate.format("YYYY-MM-DD"),
        }
      : {
          filter: "monthly",
          month: currentDate.startDate.month() + 1,
          year: currentDate.startDate.year(),
        },
  );

  const normalizedCalendar = useMemo(() => {
    if (!data?.result?.cursor?.firstBatch?.[0]?.calendar) return [];
    const calendar = data.result.cursor.firstBatch[0].calendar;
    return Object.entries(calendar).map(([date, value]: any) => ({
      date,
      status: value.status,
      jobs: value.jobs || [],
    }));
  }, [data]);

  const handleChange = (value: "weekly" | "monthly") => {
    setFilterValue(value);
    setSelectTimeDateYear(null);
    if (value === "weekly") {
      setCurrentDate({
        startDate: dayjs().startOf("week"),
        endDate: dayjs().endOf("week"),
      });
    } else {
      setCurrentDate({
        startDate: dayjs().startOf("month"),
        endDate: dayjs().endOf("month"),
      });
    }
  };

  const navigateDate = (direction: "prev" | "next") => {
    const unit = filterValue === "weekly" ? "week" : "month";
    setCurrentDate((prev) => ({
      startDate: prev.startDate.add(direction === "prev" ? -1 : 1, unit),
      endDate: prev.endDate.add(direction === "prev" ? -1 : 1, unit),
    }));
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );

  return (
    <section className="space-y-6 mt-3 p-5 bg-white rounded-2xl">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        <span>📅</span> Upcoming Schedule
      </h2>

      {selectTimeDateYear?.date ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {normalizedCalendar
            .find(
              (d) =>
                d.date === selectTimeDateYear.date && d.status === "Scheduled",
            )
            ?.jobs?.map((job: any, idx: number) => {
              const item: ScheduleItem = {
                id: job.jobPost?._id?.$oid || `job-${idx}`,
                date: dayjs(job.schedule?.startTime?.$date).format(
                  "DD MMM, YYYY",
                ),
                title: job.jobPost?.jobRole || "Unknown Role",
                status: "Accept",
                company: job.facilityName || "Unknown Facility",
                location:
                  job.facilityLocation?.fullAddress || "Unknown Location",
                price: `${job.jobPost?.minPriceRange || 0} - ${job.jobPost?.maxPriceRange || 0}`,
                time: `${dayjs(job.schedule?.startTime?.$date).format("h:mm A")} to ${dayjs(job.schedule?.endTime?.$date).format("h:mm A")}`,
                duration: "",
                cert: job.jobPost?.qualification || "",
              };
              return <ScheduleCardItem item={item} key={idx} />;
            })}
        </div>
      ) : (
        <TimeCalendar
          filterValue={filterValue}
          currentDate={currentDate}
          navigateDate={navigateDate}
          setSelectTimeDateYear={setSelectTimeDateYear}
          setShowTypeSelectModal={() => {}}
          handleChange={handleChange}
          calendarData={normalizedCalendar}
        />
      )}
    </section>
  );
}

export default UpcomingCalender;