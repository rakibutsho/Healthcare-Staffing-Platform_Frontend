// types/AppliedJob.ts (create this file or add to existing)
export interface AppliedJob {
  id: string;
  appliedAt: string;
  statusAfterApproval: "PENDING" | "APPROVED" | "REJECTED"; // enum-like
  jobPost: {
    id: string;
    qualification: string;
    about: string;
    schedule: {
      id: string;
      jobPostId: string;
      date: string;
      startTime: string;
      endTime: string;
      createdAt: string;
      updatedAt: string;
    }[];
    jobRole: string;
    minPriceRange: number;
    maxPriceRange: number;
    user: {
      facilityProfile?: {
        id: string;
        facilityName: string;
        address?: {
          long: string;
          lat: string;
          fullAddress: string;
        };
      } | null;
    };
  };
}