"use client";

import Spinner from "@/components/common/Spinner";
import {
  useGetProviderProfileQuery,
  useUpdateProviderProfileMutation,
} from "@/redux/features/(Providers)/profileProvider/profileProviderApi";
import { Switch } from "antd";
import { ChevronLeft, ChevronRight } from "lucide-react";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import DateTimeAddEdit from "./DateTimeAddEdit";

export interface DaySchedule {
  isoDate: string; // YYYY-MM-DD (stable key)
  label: string;
  dayName: string;
  dayNumber: number;
  available: boolean;
  startTime?: string; // hh:mm A
  endTime?: string; // hh:mm A
}

const DEFAULT_START = "09:00 AM";
const DEFAULT_END = "01:00 PM";

export default function MyAvailability() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedIsoDate, setSelectedIsoDate] = useState<string>("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [editingDay, setEditingDay] = useState<DaySchedule | null>(null);
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);

  const {
    data,
    isLoading: isGetProfile,
    refetch,
    isFetching,
  } = useGetProviderProfileQuery("");

  const [update_availability, { isLoading: isUpdating }] =
    useUpdateProviderProfileMutation();

  const currentMonthYear = useMemo(() => {
    const m = moment(currentDate);
    return m.format("MMMM, YYYY");
  }, [currentDate]);

  const weekDays = useMemo(
    () => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    [],
  );

  // Calendar grid with leading blanks (Mon-first)
  const calendarCells = useMemo(() => {
    const m = moment(currentDate).startOf("month");
    const daysInMonth = m.daysInMonth();

    const firstDayIsoWeekday = m.isoWeekday(); // Mon=1..Sun=7
    const leadingBlanks = firstDayIsoWeekday - 1;

    const blanks = Array.from({ length: leadingBlanks }, () => null);

    const days = Array.from({ length: daysInMonth }, (_, i) => {
      const dayMoment = moment(currentDate).startOf("month").add(i, "days");
      return {
        isoDate: dayMoment.format("YYYY-MM-DD"),
        dayNumber: dayMoment.date(),
        dayName: dayMoment.format("ddd"),
        label: dayMoment.format("ddd, MMMM D"),
        fullMoment: dayMoment,
      };
    });

    return [...blanks, ...days];
  }, [currentDate]);

  // Populate schedule whenever data or month changes
  useEffect(() => {
    if (!data?.result?.providerProfile) return;

    const profile = data.result.providerProfile;

    const monthDaysOnly = calendarCells.filter(Boolean) as Array<{
      isoDate: string;
      dayNumber: number;
      dayName: string;
      label: string;
      fullMoment: moment.Moment;
    }>;

    const tempSchedule: DaySchedule[] = monthDaysOnly.map((d) => {
      const availability = profile.providerAvailability?.find((av: any) =>
        moment(av.date).isSame(d.fullMoment, "day"),
      );

      return {
        isoDate: d.isoDate,
        label: d.label,
        dayName: d.dayName,
        dayNumber: d.dayNumber,
        available: availability ? availability.availability : false,
        startTime: availability
          ? moment(availability.startTime).format("hh:mm A")
          : DEFAULT_START,
        endTime: availability
          ? moment(availability.endTime).format("hh:mm A")
          : DEFAULT_END,
      };
    });

    setSchedule(tempSchedule);

    const todayIso = moment().format("YYYY-MM-DD");
    const inThisMonth = tempSchedule.some((s) => s.isoDate === todayIso);
    setSelectedIsoDate(
      inThisMonth ? todayIso : (tempSchedule[0]?.isoDate ?? ""),
    );
  }, [data, currentDate, calendarCells]);

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setMonth(
      direction === "prev" ? newDate.getMonth() - 1 : newDate.getMonth() + 1,
    );
    setCurrentDate(newDate);
  };

  /**
   * ✅ Build payload safely without date shifting:
   * - Use moment.utc(isoDate) so "YYYY-MM-DD" doesn't become previous day in UTC
   * - Ensure default times exist when toggling availability
   */
  const buildProviderAvailabilityPayload = (
    updatedSchedule: DaySchedule[],
    profileData: any,
  ) => {
    return updatedSchedule.map((item) => {
      const existing = profileData.providerAvailability?.find((p: any) =>
        moment(p.date).isSame(moment(item.isoDate, "YYYY-MM-DD"), "day"),
      );

      const safeStart = item.startTime || DEFAULT_START;
      const safeEnd = item.endTime || DEFAULT_END;

      // Build UTC datetimes by combining the ISO date with the time string,
      // then parsing as UTC to avoid timezone shifts that move the time to previous day.
      const startDT = moment.utc(
        `${item.isoDate} ${safeStart}`,
        "YYYY-MM-DD hh:mm A",
      );
      const endDT = moment.utc(
        `${item.isoDate} ${safeEnd}`,
        "YYYY-MM-DD hh:mm A",
      );

      return {
        id: existing?.id,
        date: moment.utc(item.isoDate, "YYYY-MM-DD").toISOString(),
        startTime: startDT.toISOString(),
        endTime: endDT.toISOString(),
        availability: item.available,
      };
    });
  };

  /**
   * ✅ When toggle "Available", ALSO hit API immediately,
   * and if turning on availability, send default times.
   */
  const toggleAvailabilityAndSave = async (isoDate: string) => {
    if (!data?.result?.providerProfile) return;

    const profileData = data.result.providerProfile;
    // snapshot previous schedule for rollback
    const prevSchedule = schedule;

    // compute the next schedule (do NOT rely on setState timing)
    const updatedSchedule = schedule.map((item) => {
      if (item.isoDate !== isoDate) return item;

      const nextAvailable = !item.available;

      return {
        ...item,
        available: nextAvailable,
        // ✅ ensure default times exist when switching ON
        startTime: item.startTime ?? DEFAULT_START,
        endTime: item.endTime ?? DEFAULT_END,
      };
    });

    // Optimistic UI update
    setSchedule(updatedSchedule);

    const providerAvailabilityPayload = buildProviderAvailabilityPayload(
      updatedSchedule,
      profileData,
    );

    const bodyData = {
      ...profileData,
      providerAvailability: providerAvailabilityPayload,
    };

    try {
      await update_availability({ bodyData }).unwrap();
      toast.success("Availability updated");
      await refetch();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update availability");
      // rollback (optional but recommended)
      setSchedule(prevSchedule);
    }
  };

  /**
   * ✅ When user submits times, save with correct date (UTC-safe)
   */
  const handleSubmitTime = async (startTime: string, endTime: string) => {
    if (!editingDay || !data?.result?.providerProfile) return;

    const updatedSchedule = schedule.map((item) =>
      item.isoDate === editingDay.isoDate
        ? { ...item, available: true, startTime, endTime }
        : item,
    );

    setSchedule(updatedSchedule);

    const profileData = data.result.providerProfile;

    const providerAvailabilityPayload = buildProviderAvailabilityPayload(
      updatedSchedule,
      profileData,
    );

    const bodyData = {
      ...profileData,
      providerAvailability: providerAvailabilityPayload,
    };

    try {
      await update_availability({ bodyData }).unwrap();
      toast.success("Provider Profile Availability updated successfully");
      await refetch();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update availability");
    }

    setShowTimePicker(false);
    setEditingDay(null);
  };

  if (isGetProfile || isFetching || isUpdating) {
    return (
      <div className="flex mx-auto justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  const selectedDay = schedule.find((s) => s.isoDate === selectedIsoDate);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-normal text-gray-900">
          {currentMonthYear}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateMonth("prev")}
            className="p-1 hover:bg-teal-50 hover:text-teal-600 rounded cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigateMonth("next")}
            className="p-1 hover:bg-teal-50 hover:text-teal-600 rounded cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Month view */}
      <div className="grid grid-cols-7 gap-1 mb-8 border border-gray-100 rounded-2xl bg-white p-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}

        {calendarCells.map((cell, idx) => {
          if (!cell) return <div key={`blank-${idx}`} />;

          const dayInfo = schedule.find((s) => s.isoDate === cell.isoDate);
          const isAvailable = !!dayInfo?.available;
          const isSelected = cell.isoDate === selectedIsoDate;

          return (
            <div key={cell.isoDate}>
              <div
                onClick={() => setSelectedIsoDate(cell.isoDate)}
                className={`rounded cursor-pointer flex items-center flex-col py-2 transition
                  ${
                    isSelected
                      ? "bg-teal-500 text-white"
                      : isAvailable
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "text-gray-900 hover:bg-gray-100"
                  }`}
              >
                <h1>{cell.dayNumber}</h1>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected day schedule */}
      {selectedDay && (
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-900">
                  {selectedDay.label}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 ml-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400 font-normal">
                  Available
                </span>

                <Switch
                  checked={selectedDay.available}
                  onChange={() =>
                    toggleAvailabilityAndSave(selectedDay.isoDate)
                  }
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200" />

          <div className="flex items-center justify-between">
            {selectedDay.available ? (
              <>
                <div className="text-sm text-gray-600 font-normal">
                  Start: {selectedDay.startTime || DEFAULT_START} &nbsp;&nbsp;
                  End: {selectedDay.endTime || DEFAULT_END}
                </div>

                <button
                  onClick={() => {
                    setEditingDay({
                      ...selectedDay,
                      startTime: selectedDay.startTime || DEFAULT_START,
                      endTime: selectedDay.endTime || DEFAULT_END,
                    });
                    setShowTimePicker(true);
                  }}
                  className="text-blue-500 text-sm font-normal hover:underline ml-4"
                >
                  Edit Time
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setEditingDay({
                    ...selectedDay,
                    startTime: selectedDay.startTime || DEFAULT_START,
                    endTime: selectedDay.endTime || DEFAULT_END,
                  });
                  setShowTimePicker(true);
                }}
                className="text-blue-500 text-sm font-normal hover:underline"
              >
                + Add/Edit Time
              </button>
            )}
          </div>
        </div>
      )}

      <DateTimeAddEdit
        showTimePicker={showTimePicker}
        setShowTimePicker={setShowTimePicker}
        editingDayIndex={editingDay}
        setEditingDayIndex={setEditingDay}
        handleSubmitTime={handleSubmitTime}
      />
    </div>
  );
}
