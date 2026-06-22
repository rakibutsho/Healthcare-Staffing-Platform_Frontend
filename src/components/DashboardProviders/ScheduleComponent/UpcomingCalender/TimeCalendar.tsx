"use client";

import React, { useMemo } from "react";
import { Select } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

type CalendarDay = {
  date: string;
  status: "Available" | "Day Off" | "Scheduled";
  jobs: any[];
};

interface TimeCalendarProps {
  filterValue: "weekly" | "monthly";
  currentDate?: { startDate: dayjs.Dayjs; endDate: dayjs.Dayjs };
  navigateDate: (direction: "prev" | "next") => void;
  setSelectTimeDateYear: (value: {
    type: "monthly" | "weekly";
    date: string;
    time?: string;
  }) => void;
  setShowTypeSelectModal: (value: boolean) => void;
  handleChange: (value: "weekly" | "monthly") => void;
  calendarData: CalendarDay[];
}

const HOUR_HEIGHT = 56; // px per hour row (controls the full-day height)
const MIN_BLOCK_HEIGHT = 18; // px

function formatHourLabel(hour24: number) {
  const h = hour24 % 12 || 12;
  const ampm = hour24 < 12 ? "AM" : "PM";
  return `${h}:00 ${ampm}`;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

const TimeCalendar: React.FC<TimeCalendarProps> = ({
  filterValue,
  currentDate,
  navigateDate,
  setSelectTimeDateYear,
  setShowTypeSelectModal, // kept (no change)
  handleChange,
  calendarData,
}) => {
  const startDate = currentDate?.startDate || dayjs().startOf("week");
  const endDate = currentDate?.endDate || dayjs().endOf("week");

  const dayMap = useMemo(() => {
    const m = new Map<string, CalendarDay>();
    for (const d of calendarData || []) m.set(d.date, d);
    return m;
  }, [calendarData]);

  // SAME timeline view for weekly + monthly:
  // - weekly: 7 columns
  // - monthly: all days in month columns (horizontal scroll)
  const rangeDays = useMemo(() => {
    if (filterValue === "weekly") {
      return Array.from({ length: 7 }, (_, i) => startDate.add(i, "day"));
    }
    const start = startDate.startOf("month");
    const end = startDate.endOf("month");
    const days: dayjs.Dayjs[] = [];
    let d = start.clone();
    while (d.isBefore(end) || d.isSame(end, "day")) {
      days.push(d.clone());
      d = d.add(1, "day");
    }
    return days;
  }, [filterValue, startDate]);

  const headerLabel =
    filterValue === "monthly"
      ? startDate.format("MMMM YYYY")
      : `${startDate.format("MMM D")} - ${endDate.format("MMM D")}`;

  const getDayTint = (status?: CalendarDay["status"]) => {
    // subtle modern tint for whole-day status
    if (status === "Day Off") return "bg-red-50";
    if (status === "Available") return "bg-green-50";
    return "bg-white";
  };

  const getBlockStyle = (job: any, dateStr: string) => {
    const rawStart = job?.schedule?.startTime?.$date;
    const rawEnd = job?.schedule?.endTime?.$date;
    if (!rawStart || !rawEnd) return null;

    const start = dayjs(rawStart);
    const end = dayjs(rawEnd);
    if (!start.isValid() || !end.isValid()) return null;

    // Clip job to this day (handles cross-midnight safely)
    const dayStart = dayjs(dateStr).startOf("day");
    const dayEnd = dayjs(dateStr).endOf("day");

    const clippedStart = start.isBefore(dayStart) ? dayStart : start;
    const clippedEnd = end.isAfter(dayEnd) ? dayEnd : end;

    if (clippedEnd.isBefore(dayStart) || clippedStart.isAfter(dayEnd))
      return null;

    const startMin = clippedStart.diff(dayStart, "minute");
    const endMin = clippedEnd.diff(dayStart, "minute");

    const top = (startMin / 60) * HOUR_HEIGHT;
    const height = Math.max(
      ((endMin - startMin) / 60) * HOUR_HEIGHT,
      MIN_BLOCK_HEIGHT,
    );

    return { top, height, start, end };
  };

  const onDayColumnClick = (
    e: React.MouseEvent<HTMLDivElement>,
    dateStr: string,
  ) => {
    // Click empty space -> select closest hour
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const hourFloat = y / HOUR_HEIGHT;
    const hour = clamp(Math.floor(hourFloat), 0, 23);
    const time = formatHourLabel(hour);
    setSelectTimeDateYear({ type: filterValue, date: dateStr, time });
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 gap-3 flex-wrap">
        <div className="flex gap-3 items-center">
          <button
            onClick={() => navigateDate("prev")}
            className="w-9 h-9 bg-gray-100 rounded-full cursor-pointer hover:bg-[#193E58] hover:text-white flex items-center justify-center transition"
            aria-label="Previous"
          >
            <LeftOutlined />
          </button>

          <div className="text-lg font-semibold">{headerLabel}</div>

          <button
            onClick={() => navigateDate("next")}
            className="w-9 h-9 bg-gray-100 rounded-full cursor-pointer hover:bg-[#193E58] hover:text-white flex items-center justify-center transition"
            aria-label="Next"
          >
            <RightOutlined />
          </button>
        </div>

        <Select
          value={filterValue}
          style={{ width: 120, height: "42px" }}
          onChange={handleChange}
          options={[
            { value: "weekly", label: "Weekly" },
            { value: "monthly", label: "Monthly" },
          ]}
        />
      </div>

      {/* Timeline wrapper */}
      <div className="w-full overflow-auto rounded-2xl border border-gray-100">
        <div
          className="min-w-[900px]"
          style={{
            display: "grid",
            gridTemplateColumns: `72px repeat(${rangeDays.length}, minmax(140px, 1fr))`,
          }}
        >
          {/* Sticky-ish header row */}
          <div className="bg-white border-b border-gray-100 h-14 flex items-center justify-end pr-3 text-xs font-semibold text-gray-500">
            Time
          </div>

          {rangeDays.map((d) => {
            const dateStr = d.format("YYYY-MM-DD");
            const dayData = dayMap.get(dateStr);
            const status = dayData?.status;

            return (
              <div
                key={dateStr}
                className="bg-white border-b border-gray-100 h-14 px-3 flex items-center justify-between"
              >
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold text-gray-900">
                    {d.format("ddd")}
                  </span>
                  <span className="text-xs text-gray-500">
                    {d.format("D MMM")}
                  </span>
                </div>

                {status && (
                  <span
                    className={[
                      "text-xs font-semibold px-2 py-1 rounded-full",
                      status === "Day Off"
                        ? "bg-red-100 text-red-700"
                        : status === "Available"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-800",
                    ].join(" ")}
                  >
                    {status}
                  </span>
                )}
              </div>
            );
          })}

          {/* Body: time column */}
          <div className="bg-white">
            {Array.from({ length: 24 }, (_, hour) => (
              <div
                key={hour}
                className="border-b border-gray-100 flex items-start justify-end pr-3 pt-2 text-xs text-gray-500"
                style={{ height: HOUR_HEIGHT }}
              >
                {formatHourLabel(hour)}
              </div>
            ))}
          </div>

          {/* Body: day columns */}
          {rangeDays.map((d) => {
            const dateStr = d.format("YYYY-MM-DD");
            const dayData = dayMap.get(dateStr);
            const status = dayData?.status;

            const blocks =
              dayData?.jobs?.length && status === "Scheduled"
                ? dayData.jobs
                    .map((job: any) => {
                      const st = getBlockStyle(job, dateStr);
                      if (!st) return null;
                      return { job, ...st };
                    })
                    .filter(Boolean)
                : [];

            return (
              <div
                key={dateStr}
                className={[
                  "relative border-l border-gray-100",
                  getDayTint(status),
                ].join(" ")}
                style={{ height: 24 * HOUR_HEIGHT }}
                onClick={(e) => onDayColumnClick(e, dateStr)}
              >
                {/* hour grid lines */}
                {Array.from({ length: 24 }, (_, hour) => (
                  <div
                    key={hour}
                    className="border-b border-gray-100"
                    style={{ height: HOUR_HEIGHT }}
                  />
                ))}

                {/* Day Off overlay */}
                {status === "Day Off" && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="px-3 py-2 rounded-xl bg-white/80 border border-red-100 text-red-700 text-sm font-semibold shadow-sm">
                      Day Off
                    </div>
                  </div>
                )}

                {/* Scheduled blocks (full duration) */}
                {blocks?.map((b: any, idx: number) => {
                  const startLabel = b.start.format("h:mm A");
                  const endLabel = b.end.format("h:mm A");

                  return (
                    <div
                      key={`${dateStr}-${idx}`}
                      className="absolute left-2 right-2 rounded-xl bg-[#193E58] text-white shadow-md cursor-pointer hover:opacity-95 transition"
                      style={{ top: b.top, height: b.height }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectTimeDateYear({
                          type: filterValue,
                          date: dateStr,
                          time: `${startLabel} - ${endLabel}`,
                        });
                      }}
                      title={`${startLabel} - ${endLabel}`}
                    >
                      <div className="h-full px-3 py-2 flex flex-col justify-between">
                        <div className="text-xs font-semibold truncate">
                          {b.job?.jobPost?.jobRole || "Scheduled"}
                        </div>
                        <div className="text-[11px] opacity-90">
                          {startLabel} — {endLabel}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* If status Scheduled but no jobs, show a subtle message */}
                {status === "Scheduled" && (!blocks || blocks.length === 0) && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="px-3 py-2 rounded-xl bg-white/80 border border-yellow-100 text-yellow-800 text-sm font-semibold shadow-sm">
                      Scheduled (no jobs data)
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 text-xs text-gray-600">
        <span className="inline-flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-green-100 border border-green-200" />{" "}
          Available
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-red-100 border border-red-200" />{" "}
          Day Off
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-[#193E58]" /> Scheduled
        </span>
      </div>
    </div>
  );
};

export default TimeCalendar;
