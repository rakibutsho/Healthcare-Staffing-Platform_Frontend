// src/types/scheduleTypes.ts
export interface ScheduleJobPost {
  _id: { $oid: string };
  userId: { $oid: string };
  jobRole: string;
  about: string;
  qualification: string;
  minPriceRange: number;
  maxPriceRange: number;
  experience: string;
  totalCandidate: number;
  createdAt: { $date: string };
  updatedAt: { $date: string };
  totalClicks?: string[];
}

export interface ScheduleJob {
  jobPost: ScheduleJobPost;
  schedule: {
    startTime: { $date: string };
    endTime: { $date: string };
  };
  facilityLocation: {
    long: string;
    lat: string;
    fullAddress: string;
  };
  facilityName: string;
}

export interface ScheduleDay {
  status: "Day Off" | "Available" | "Scheduled";
  jobs: ScheduleJob[];
}

export interface ScheduleCalendar {
  [date: string]: ScheduleDay;
}

export interface UpcomingScheduleResponse {
  success: boolean;
  message: string;
  result: {
    cursor: {
      firstBatch: Array<{
        _id: { $oid: string };
        calendar: ScheduleCalendar;
      }>;
    };
  };
}
