"use client";

import {
  useJobAllJobsByDateQuery,
  useJobCompleteApplicationMutation,
  useSubmitReviewMutation,
} from "@/redux/features/(Facility)/profileFacility/jobManagementFacilityApi";
import { getSafeImageUrl } from "@/utils/getSafeImageUrl";
import { Button, Pagination, Rate, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import Modal from "antd/es/modal/Modal";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

type Provider = {
  id: string;
  name: string;
  specialty: string;
  location: string;
  rating: number;
  image: string;
  reviewCount: number;
  distance: string;
  status: "pending completion" | "complete";
  workingStatus: string;
  originalJob?: JobData;
};

type User = {
  id: string;
  fullName: string;
  profileImage: string;
  providerProfile: {
    provider: string[];
    stateLicenced: string[];
  };
};

type JobApplication = {
  id: string;
  facilityUserId: string;
  providerUserId: string;
  jobPostId: string;
  applier: string;
  cancellationReason?: string;
  status: string;
  statusAfterApproval?: string;
  appliedAt: string;
  user: User;
  jobPost?: {
    schedule: Array<{
      id: string;
      jobPostId: string;
      date: string;
      startTime: string;
      endTime: string;
      createdAt: string;
      updatedAt: string;
    }>;
  };
};

type JobData = {
  id: string;
  userId: string;
  jobRole: string;
  about: string;
  qualification: string;
  minPriceRange: number;
  maxPriceRange: number;
  experience: string;
  totalCandidate: number;
  totalClicks: string[];
  totalApplications: any[];
  createdAt: string;
  updatedAt: string;
  JobApplication: JobApplication[];
  appliedCount: number;
  schedule?: Array<{
    id: string;
    jobPostId: string;
    date: string;
    startTime: string;
    endTime: string;
    createdAt: string;
    updatedAt: string;
  }>;
};

type ApiResponse = {
  success: boolean;
  message: string;
  result: {
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    data: JobData[];
  };
};

function ScheduleFacilityComponent() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const formatDateForAPI = (date: Date): string => {
    const dateOnly = new Date(date);
    dateOnly.setUTCHours(0, 0, 0, 0);
    const formattedDate = dateOnly.toISOString();
    console.log("Formatted date for API:", formattedDate);
    return formattedDate;
  };

  const [completeApplication, { isLoading: isCompletingApplication }] =
    useJobCompleteApplicationMutation();

  const {
    data: jobData,
    isLoading,
    error,
    refetch,
  } = useJobAllJobsByDateQuery({
    page: currentPage,
    limit: pageSize,
    date: formatDateForAPI(selectedDate),
  });

  const [isModalOpen, setIsModalOpen] = useState<string | boolean>(false);
  const [reviewText, setReviewText] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [selectedJobForReview, setSelectedJobForReview] =
    useState<JobData | null>(null);

  // Review submission mutation
  const [submitReview, { isLoading: isSubmittingReview }] =
    useSubmitReviewMutation();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayShortNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const currentMonthYear = `${
    monthNames[currentDate.getMonth()]
  }, ${currentDate.getFullYear()}`;

  const generateWeekDates = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const dateObj = new Date(startOfWeek);
      dateObj.setDate(startOfWeek.getDate() + i);
      weekDates.push({
        name: dayShortNames[i],
        date: dateObj.getDate(),
        fullDate: dateObj,
        month: monthNames[dateObj.getMonth()],
      });
    }
    return weekDates;
  };

  const [weekDates, setWeekDates] = useState(generateWeekDates(currentDate));

  const handleUnfilledOrConfirmCompletion = async (
    id: string,
    status: string,
  ) => {
    try {
      const res = await completeApplication({
        id,
        data: { completionStatus: status },
      }).unwrap();

      if (res?.success) {
        toast.success(res?.message || "Request updated successfully!");
        refetch();
      } else {
        toast.error(res?.message || "Failed to update request");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "API call failed!");
    }
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === "prev" ? -7 : 7));
    setCurrentDate(newDate);
    setWeekDates(generateWeekDates(newDate));
  };

  const handleDateSelect = (dateObj: Date) => {
    setSelectedDate(dateObj);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const transformJobDataToProviders = (jobs: JobData[]): Provider[] => {
    return jobs.map((job) => {
      // Determine working status based on job applications
      let workingStatus = "pending";
      let status: "complete" | "pending completion" = "pending completion";

      if (job.JobApplication.length > 0) {
        const application = job.JobApplication[0];

        if (application.status === "APPROVED") {
          // Handle different statusAfterApproval values
          switch (application.statusAfterApproval) {
            case "INPROGRESS":
              workingStatus = "In Progress";
              // status = "pending completion";
              break;
            case "PENDING":
              workingStatus = "pending";
              // status = "pending completion";
              break;
            case "PAST":
              workingStatus = "confirm completion";
              break;
            case "COMPLETED":
              workingStatus = "review now";
              status = "complete";
              break;
            case "NO_SHOW":
              workingStatus = "no show";
              // status = "complete";
              break;
            case "REQUESTED":
              workingStatus = "requested";
              // status = "pending completion";
              break;
            case "CANCELLED":
              workingStatus = "cancelled";
              status = "complete";
              break;
            default:
              workingStatus = "pending";
            // status = "pending completion";
          }
        } else {
          workingStatus = "pending";
          // status = "pending completion";
        }
      }

      const providerName =
        job.JobApplication.length > 0 && job.JobApplication[0].user
          ? job.JobApplication[0].user.fullName
          : job.jobRole;

      // Get provider image
      const providerImage =
        job.JobApplication.length > 0 &&
        job.JobApplication[0].user &&
        job.JobApplication[0].user.profileImage
          ? getSafeImageUrl(job.JobApplication[0].user.profileImage)
          : "/default-avatar.png";

      return {
        id: job.id,
        name: providerName,
        specialty: job.qualification,
        location: job.about,
        rating: 4.5,
        image: providerImage,
        reviewCount: job.appliedCount,
        distance: "N/A",
        status: status,
        workingStatus: workingStatus,
        originalJob: job,
      };
    });
  };

  const renderActionButtons = (item: Provider) => {
    const { workingStatus, status, originalJob } = item;

    // For PAST status - show Unfilled and Confirm Completion buttons
    if (
      workingStatus === "confirm completion" &&
      status === "pending completion"
    ) {
      return (
        <div className="flex gap-2">
          <Button
            variant="outlined"
            onClick={() =>
              handleUnfilledOrConfirmCompletion(
                originalJob?.JobApplication[0]?.id || "",
                "unfilled",
              )
            }
          >
            Unfilled
          </Button>
          <Button
            onClick={() =>
              handleUnfilledOrConfirmCompletion(
                originalJob?.JobApplication[0]?.id || "",
                "approve",
              )
            }
            style={{ backgroundColor: "#007870", color: "white" }}
            loading={isCompletingApplication}
            disabled={isCompletingApplication}
          >
            Confirm Completion
          </Button>
        </div>
      );
    }

    // For COMPLETED status - show Review button
    if (workingStatus === "review now" && status === "complete") {
      return (
        <span
          onClick={() => handleReviewClick(item)}
          className="px-3 py-1 border border-green-500 bg-green-50 text-green-600 rounded cursor-pointer hover:bg-green-100"
        >
          Review
        </span>
      );
    }

    // For INPROGRESS status - show In Progress badge
    if (workingStatus === "In Progress") {
      return (
        <span className="px-3 py-1 border border-blue-500 bg-blue-50 text-blue-600 rounded-2xl">
          In Progress
        </span>
      );
    }

    // For other statuses - show status badge
    let statusClass = "px-3 py-1 border rounded-2xl";

    switch (workingStatus) {
      case "pending":
        statusClass += " border-yellow-500 bg-yellow-50 text-yellow-600";
        break;
      case "no show":
        statusClass += " border-red-500 bg-red-50 text-red-600";
        break;
      case "cancelled":
        statusClass += " border-gray-500 bg-gray-50 text-gray-600";
        break;
      case "requested":
        statusClass += " border-purple-500 bg-purple-50 text-purple-600";
        break;
      default:
        statusClass += " border-gray-500 bg-gray-50 text-gray-600";
    }

    return <span className={statusClass}>{workingStatus}</span>;
  };

  const handleReviewAdd = async () => {
    if (!selectedJobForReview || !rating || !reviewText.trim()) {
      message.error("Please provide both rating and review comment");
      return;
    }

    try {
      const jobApplication = selectedJobForReview.JobApplication[0];
      if (!jobApplication || !jobApplication.user) {
        message.error("No job application or user found");
        return;
      }

      const reviewPayload = {
        receiverId: jobApplication.user.id,
        jobPostId: selectedJobForReview.id,
        rating: rating,
        comment: reviewText,
      };

      console.log("Submitting review:", reviewPayload);

      // Submit the review
      const result = await submitReview(reviewPayload).unwrap();

      if (result?.success) {
        toast.success(result.message || "Review submitted successfully!");
      } else {
        toast.error(result.message || "Failed to submit review");
      }

      console.log("Review submitted successfully:", result);
      message.success("Review submitted successfully!");

      // Reset modal state
      setIsModalOpen(false);
      setRating(0);
      setReviewText("");
      setSelectedJobForReview(null);

      // Refetch data to update the UI
      refetch();
    } catch (error: any) {
      console.error("Error submitting review:", error);
      message.error(error?.data?.message || "Failed to submit review");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setRating(0);
    setReviewText("");
    setSelectedJobForReview(null);
  };

  const handleReviewClick = (provider: Provider) => {
    if (provider.workingStatus === "review now" && provider.originalJob) {
      setSelectedJobForReview(provider.originalJob);
      setIsModalOpen(provider.id);
    }
  };

  // Get providers data
  const providers = jobData?.result?.data
    ? transformJobDataToProviders(jobData.result.data)
    : [];

  console.log("Providers data:", providers);

  const totalItems = jobData?.result?.meta?.total || 0;
  const totalPages = jobData?.result?.meta?.totalPages || 1;

  return (
    <div className="m-5">
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

      {/* Calendar week view */}
      <div className="grid grid-cols-7 gap-1 mb-8 border border-gray-100 rounded-2xl bg-white p-2">
        {weekDates.map((day) => {
          const isCurrentMonth =
            day.month === monthNames[currentDate.getMonth()];
          const isSelected =
            selectedDate.toDateString() === day.fullDate.toDateString();
          const isToday =
            new Date().toDateString() === day.fullDate.toDateString();

          const dayClasses = `rounded w-[100px] flex flex-col items-center py-2 ${
            isSelected
              ? "bg-teal-500 text-white cursor-pointer"
              : isCurrentMonth
                ? `text-gray-900 hover:bg-gray-50 cursor-pointer ${
                    isToday ? "bg-blue-50 border border-blue-200" : ""
                  }`
                : "text-gray-900 bg-gray-100 cursor-not-allowed"
          }`;

          return (
            <div key={`${day.name}-${day.date}`}>
              <div
                onClick={() => {
                  if (isCurrentMonth) {
                    handleDateSelect(day.fullDate);
                  }
                }}
                className={dayClasses}
              >
                <h1>{day.name}</h1>
                <h1 className="mt-3">{day.date}</h1>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected date display */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Selected Date:{" "}
          <span className="font-semibold">
            {selectedDate.toLocaleDateString()}
          </span>
        </p>
      </div>

      <div className="flex items-center justify-between pb-5">
        <h1 className="text-xl font-semibold text-gray-800">
          Shift/Contract{" "}
          {isLoading && (
            <span className="text-sm text-gray-500">(Loading...)</span>
          )}
        </h1>
        {totalItems > 0 && (
          <div className="text-sm text-gray-600">Total: {totalItems} items</div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">Error loading data. Please try again.</p>
        </div>
      )}

      {!isLoading && providers.length === 0 && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-600">
            No jobs found for the selected date.
          </p>
        </div>
      )}

      <div className="space-y-5">
        {providers.map((item) => {
          return (
            <div
              key={item.id}
              className="flex justify-between items-center p-4 bg-white rounded border border-gray-100"
            >
              <div className="flex gap-4">
                <Image
                  width={1000}
                  height={1000}
                  src={getSafeImageUrl(item.image)}
                  alt={item.name || "Provider avatar"}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-gray-500">{item.specialty}</p>
                  <div className="flex items-center text-gray-500 text-sm gap-1 pt-1 pb-3">
                    <MapPin className="w-3 h-3" />
                    {item.location}
                  </div>
                </div>
              </div>

              {/* Status and Action buttons */}
              <div className="flex items-center gap-2">
                {/* Status badge */}
                {item.status === "complete" && (
                  <span className="px-3 py-1 border border-green-500 bg-green-50 text-green-600 rounded">
                    Complete
                  </span>
                )}
                {item.status === "pending completion" && (
                  <span className="px-3 py-1 border border-yellow-500 bg-yellow-50 text-yellow-600 rounded">
                    Pending Completion
                  </span>
                )}

                {/* Action buttons based on status */}
                {renderActionButtons(item)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="flex justify-center mt-8">
          <Pagination
            current={currentPage}
            total={totalItems}
            pageSize={pageSize}
            onChange={handlePageChange}
            showSizeChanger={false}
            showQuickJumper
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} of ${total} items`
            }
          />
        </div>
      )}

      {/* Review Modal */}
      <Modal
        open={!!isModalOpen}
        onCancel={handleModalClose}
        footer={null}
        centered
        closable={false}
        width={400}
      >
        <h1 className="text-center pb-5 text-xl text-gray-700">Review</h1>
        <div className="flex items-center flex-col space-y-5 pb-5">
          <h3 className="text-center text-xl text-gray-800">
            Rate Your Experience
          </h3>
          <Rate value={rating} onChange={setRating} style={{ fontSize: 24 }} />
        </div>

        <div className="pb-5">
          <TextArea
            rows={4}
            maxLength={200}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review here... (0/200)"
            showCount
          />
        </div>

        <div className="flex gap-3">
          <Button
            key="cancel"
            onClick={handleModalClose}
            className="flex-1"
            style={{
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              height: "40px",
            }}
          >
            Cancel
          </Button>
          <Button
            key="submit"
            type="primary"
            className="flex-1"
            loading={isSubmittingReview}
            disabled={!rating || !reviewText.trim()}
            style={{
              backgroundColor: "#14b8a6",
              borderColor: "#14b8a6",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              height: "40px",
            }}
            onClick={handleReviewAdd}
          >
            Submit Review
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default ScheduleFacilityComponent;
