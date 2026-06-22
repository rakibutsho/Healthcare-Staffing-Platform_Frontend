import React from "react";
import { Button, Switch } from "antd";
import { ArrowRight } from "lucide-react";

export default function StepSchedule({
  schedule,
  selectedDate,
  setSelectedDate,
  toggleAvailability,
  setEditingDayIndex,
  setShowTimePicker,
  onNext,
}: {
  schedule: any[];
  selectedDate: string;
  setSelectedDate: (d: string) => void;
  toggleAvailability: (i: number) => void;
  setEditingDayIndex: (i: number | null) => void;
  setShowTimePicker: (s: boolean) => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-1 mb-4 border border-gray-100 rounded-2xl bg-white p-2 text-xs sm:text-sm md:text-base">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
        {schedule.map((day) => (
          <div key={day.date}>
            <div
              onClick={() => setSelectedDate(day.date)}
              className={`rounded cursor-pointer flex items-center justify-center py-2 ${
                day.date === selectedDate ? "bg-teal-500 text-white" : "text-gray-900 hover:bg-gray-100"
              }`}
            >
              <span>{day.dayNumber}</span>
            </div>
          </div>
        ))}
      </div>

      {schedule
        .filter((item) => item.date === selectedDate)
        .map((item, index) => {
          const fullIndex = schedule.findIndex((s) => s.date === item.date);
          return (
            <div key={`${item.date}-${index}`} className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-900">{item.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400 font-normal">Available</span>
                    <Switch
                      checked={item.available}
                      onChange={() => toggleAvailability(fullIndex)}
                      className="bg-teal-500"
                    />
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200" />
              <div className="flex items-center justify-between">
                {item.available ? (
                  item.startTime && item.endTime ? (
                    <>
                      <div className="text-sm text-gray-600 font-normal">
                        Start: {item.startTime} &nbsp;&nbsp; End: {item.endTime}
                      </div>
                      <button
                        onClick={() => {
                          setEditingDayIndex(fullIndex);
                          setShowTimePicker(true);
                        }}
                        className="text-blue-500 text-sm font-normal hover:underline ml-4"
                      >
                        Edit Time
                      </button>
                    </>
                  ) : (
                    <div />
                  )
                ) : (
                  <button
                    onClick={() => {
                      setEditingDayIndex(fullIndex);
                      setShowTimePicker(true);
                    }}
                    className="text-blue-500 text-sm font-normal hover:underline"
                  >
                    + Add/Edit Time
                  </button>
                )}
              </div>
            </div>
          );
        })}

      <Button
        type="primary"
        size="large"
        block
        style={{
          backgroundColor: "#14b8a6",
          borderColor: "#14b8a6",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: 500,
        }}
        onClick={onNext}
      >
        Next <ArrowRight />
      </Button>
    </div>
  );
}
