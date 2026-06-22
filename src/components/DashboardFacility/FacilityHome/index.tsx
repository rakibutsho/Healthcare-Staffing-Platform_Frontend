"use client";
import {
  useGetAllJobPostQuery,
  useGetAllPendingJobRequestsQuery,
} from "@/redux/features/(Facility)/profileFacility/jobManagementFacilityApi";
import { Pagination } from "antd";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import JobPostRelevant from "./JobPostRelevant";
import JobPostResent from "./JobPostResent";

export interface FacilityItem {
  id: string;
  medical: string;
  title: string;
  status: string;
  location: string;
  company: string;
  price: string;
  time: string;
  duration: string;
  cert: string;
  totalMatch: number;
  totalClick: number;
  totalApplied: number;
}

function FacilityComponent() {
  const [activeTab, setActiveTab] = useState<string>("Job Post");
  const [relevantJobApply, setRelevantJobApply] = useState<string>("");

  // Pagination with limit
  const [jobPostPage, setJobPostPage] = useState<number>(1);
  const [pendingRequestPage, setPendingRequestPage] = useState<number>(1);
  const [relevantJobPage, setRelevantJobPage] = useState<number>(1);
  const pageSize = 10;

  const {
    data: pendingJobRequestData,
    isLoading: pendingJobRequestLoading,
    error: pendingJobRequestError,
  } = useGetAllPendingJobRequestsQuery({
    page: pendingRequestPage,
    limit: pageSize,
  });

  const {
    data: facilityData,
    isLoading: facilityDataLoading,
    error: facilityDataError,
  } = useGetAllJobPostQuery({
    page: jobPostPage,
    limit: pageSize,
  });

  // Extract data and meta information
  const pendingJobRequest = pendingJobRequestData?.result?.data || [];
  const pendingJobRequestMeta = pendingJobRequestData?.result?.meta || {};

  const facility = facilityData?.result?.data || [];
  const facilityMeta = facilityData?.result?.meta || {};

  const handleJobPostPaginationChange = (page: number) => {
    setJobPostPage(page);
  };

  const handlePendingRequestPaginationChange = (page: number) => {
    setPendingRequestPage(page);
  };

  const handleRelevantJobPaginationChange = (page: number) => {
    setRelevantJobPage(page);
  };

  const tabs: string[] = ["Job Post", "Pending Request"];

  // Get the appropriate data and meta based on current view
  const getCurrentData = () => {
    if (relevantJobApply) {
      return {
        data: facility,
        total: facilityMeta?.total || 0,
        currentPage: relevantJobPage,
        onPageChange: handleRelevantJobPaginationChange,
        isLoading: facilityDataLoading,
        error: facilityDataError,
      };
    }

    if (activeTab === "Job Post") {
      return {
        data: facility,
        total: facilityMeta?.total || 0,
        currentPage: jobPostPage,
        onPageChange: handleJobPostPaginationChange,
        isLoading: facilityDataLoading,
        error: facilityDataError,
      };
    } else {
      return {
        data: pendingJobRequest,
        total: pendingJobRequestMeta?.total || 0,
        currentPage: pendingRequestPage,
        onPageChange: handlePendingRequestPaginationChange,
        isLoading: pendingJobRequestLoading,
        error: pendingJobRequestError,
      };
    }
  };

  const currentViewData = getCurrentData();

  // Error component
  const ErrorMessage = ({ error }: { error: any }) => (
    <div className="flex justify-center items-center py-8">
      <div className="text-red-500 text-center">
        <p className="text-lg font-medium">Error loading data</p>
        <p className="text-sm mt-1">
          {error?.message || "Something went wrong. Please try again."}
        </p>
      </div>
    </div>
  );

  // Loading component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#193E58]"></div>
    </div>
  );

  // No data component
  const NoData = ({ message }: { message: string }) => (
    <div className="flex justify-center items-center py-8">
      <div className="text-gray-500 text-center">
        <p className="text-lg font-medium">{message}</p>
      </div>
    </div>
  );

  // Render data grid
  const renderDataGrid = () => {
    if (currentViewData.isLoading) {
      return <LoadingSpinner />;
    }

    if (currentViewData.error) {
      return <ErrorMessage error={currentViewData.error} />;
    }

    if (!currentViewData.data || currentViewData.data.length === 0) {
      const noDataMessage = relevantJobApply
        ? "No job requests found"
        : activeTab === "Job Post"
        ? "No job posts found"
        : "No pending requests found";
      return <NoData message={noDataMessage} />;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentViewData.data.map((item: any, idx: number) => {
          if (relevantJobApply || activeTab === "Pending Request") {
            return (
              <JobPostRelevant
                item={item}
                key={`${item.id}-${idx}`}
                link={
                  relevantJobApply
                    ? "facility/apply_job"
                    : "facility/a_provider_profile"
                }
              />
            );
          } else {
            return (
              <JobPostResent
                item={item}
                key={`${item.id}-${idx}`}
                setRelevantJobApply={setRelevantJobApply}
              />
            );
          }
        })}
      </div>
    );
  };

  const renderPagination = () => {
    if (
      currentViewData.isLoading ||
      currentViewData.error ||
      currentViewData.total === 0
    ) {
      return null;
    }

    return (
      <div className="p-4 w-full flex justify-center items-center mt-6">
        <Pagination
          current={currentViewData.currentPage}
          pageSize={pageSize}
          total={currentViewData.total}
          onChange={currentViewData.onPageChange}
          className="custom-pagination"
          showSizeChanger={false}
          showQuickJumper={currentViewData.total > 100}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} of ${total} items`
          }
        />
      </div>
    );
  };

  return (
    <div className="p-5 space-y-4">
      {!relevantJobApply && (
        <div className="p-2 bg-white rounded-4xl flex items-center flex-wrap gap-4">
          {tabs.map((item, index) => (
            <h1
              key={index}
              onClick={() => {
                setActiveTab(item);
                setRelevantJobApply("");
              }}
              className={`px-6 py-3 rounded-4xl cursor-pointer transition-colors ${
                activeTab === item
                  ? "bg-[#193E58] text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {item}
            </h1>
          ))}
        </div>
      )}

      {/* Content Section */}
      <div className="space-y-4">
        {relevantJobApply ? (
          <>
            {/* Relevant Job Apply View */}
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-medium">
                {relevantJobApply} - Job Requests
              </h1>
              <button
                onClick={() => setRelevantJobApply("Job Requests")}
                className="px-4 py-2 text-[#193E58] border border-[#193E58] rounded-lg hover:bg-[#193E58] hover:text-white transition-colors"
              >
                Back to Job Posts
              </button>
            </div>
            {renderDataGrid()}
            {renderPagination()}
          </>
        ) : (
          <>
            {activeTab === "Job Post" ? (
              <>
                {/* Job Post Tab */}
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-medium">Recent Job Posts</h1>
                  <Link href="/facility/new_job_post">
                    <button className="px-6 py-3 rounded-4xl cursor-pointer bg-[#193E58] text-white flex items-center gap-1 whitespace-nowrap hover:bg-[#2a4a5f] transition-colors">
                      <Plus size={20} /> Create Post
                    </button>
                  </Link>
                </div>
                {renderDataGrid()}
                {renderPagination()}
              </>
            ) : (
              <>
                {/* Pending Request Tab */}
                <h1 className="text-3xl font-medium">Pending Job Requests</h1>
                {renderDataGrid()}
                {renderPagination()}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default FacilityComponent;
