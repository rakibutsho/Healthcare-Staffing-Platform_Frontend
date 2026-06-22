import dayjs from "dayjs";

export const toBackendStateEnum = (label: string) =>
  label ? label.toUpperCase().replace(/\s+/g, "_") : label;

export const toUpper = (v: string | undefined) => (v ? v.toUpperCase() : v);

export function getISODateForSchedule(item: any, idx: number) {
  if (item.isoDate && dayjs(item.isoDate).isValid()) return item.isoDate;
  const year = dayjs().year();
  const parsed = dayjs(`${item.date} ${year}`, "dddd, MMMM D YYYY", true);
  if (parsed.isValid()) return parsed.startOf("day").format();
  return dayjs().startOf("week").add(idx, "day").startOf("day").format();
}

/**
 * buildProviderAvailability is exported for testability but the hook uses an inline
 * variant that references getISODateForSchedule. Kept here for unit tests if needed.
 */
export function buildProviderAvailability(schedule: any[]) {
  return schedule.map((item, i) => {
    const isoDate = getISODateForSchedule(item, i);

    if (!item.available || !item.startTime || !item.endTime) {
      return {
        date: isoDate,
        startTime: isoDate,
        endTime: isoDate,
        availability: false,
      };
    }

    const dateLocal = dayjs(isoDate);

    const startTimeParsed = dayjs(
      `${dateLocal.format("YYYY-MM-DD")} ${item.startTime}`,
      "YYYY-MM-DD hh:mm A"
    );
    const endTimeParsed = dayjs(
      `${dateLocal.format("YYYY-MM-DD")} ${item.endTime}`,
      "YYYY-MM-DD hh:mm A"
    );

    if (!endTimeParsed.isAfter(startTimeParsed)) {
      throw new Error(`End time must be after start time for ${item.date}`);
    }

    return {
      date: isoDate,
      startTime: startTimeParsed.format(),
      endTime: endTimeParsed.format(),
      availability: true,
    };
  });
}
