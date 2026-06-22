"use client";
import React, { useState, useEffect } from "react";
import { useGetAllAppliedJobsByProviderQuery } from "@/redux/features/(Providers)/profileProvider/providerJobApi";
import { Pagination, Empty, Alert } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import Spinner from "@/components/common/Spinner";
import AppliedJobCard from "./AppliedJobCard";
import { AppliedJob } from "@/types/AppliedJobs";

function AllAppliedJob() {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 12;

  const { data, isLoading, error, isError, refetch } =
    useGetAllAppliedJobsByProviderQuery({
      page: currentPage,
      limit,
    });

  // Derived states
  const jobsData: AppliedJob[] = data?.result?.data || [];
  const meta = data?.result?.meta || {};

  const { total = 0, totalPages = 0, page: serverPage = 1 } = meta;

  // Sync local state with server response
  useEffect(() => {
    if (serverPage !== currentPage && serverPage >= 1) {
      setCurrentPage(serverPage);
    }
  }, [serverPage, currentPage]);

  const handlePaginationChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle API errors
  if (isError) {
    const errorMessage = error
      ? (error as any)?.data?.message ||
        (error as any)?.message ||
        "Failed to load applied jobs"
      : "An error occurred";

    return (
      <div className="p-6">
        <Alert
          message="Error"
          description={errorMessage}
          type="error"
          showIcon
          icon={<ExclamationCircleOutlined />}
          className="mb-6"
        />
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex mx-auto justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  // Empty state - handle both no data and page out of bounds
  if (!isLoading && jobsData.length === 0) {
    // If we're not on page 1 and there's no data, go back to page 1
    if (currentPage > 1) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div className="flex flex-col items-center">
                <span className="text-xl font-semibold text-gray-700 mb-2">
                  No Jobs Found on Page {currentPage}
                </span>
                <span className="text-gray-500">
                  This page doesn&#39;t have any applied jobs
                </span>
              </div>
            }
          />
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setCurrentPage(1)}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Go to First Page
            </button>
            <button
              onClick={() => refetch()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Refresh
            </button>
          </div>
        </div>
      );
    }

    // If we're on page 1 and no data, show empty state
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div className="flex flex-col items-center">
              <span className="text-xl font-semibold text-gray-700 mb-2">
                No Applied Jobs Found
              </span>
              <span className="text-gray-500">
                Start applying to jobs to see them here
              </span>
            </div>
          }
        />
        <button
          onClick={() => (window.location.href = "/dashboard")}
          className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium cursor-pointer"
        >
          Browse Available Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header with stats */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          My Applied Jobs
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-gray-600">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
            {total} total applications
          </span>
          <span className="text-sm">
            Page {currentPage} of {totalPages || 1}
          </span>
          <span className="text-sm">
            Showing {(currentPage - 1) * limit + 1} -{" "}
            {Math.min(currentPage * limit, total)} of {total} jobs
          </span>
        </div>
      </div>

      {/* Job cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {jobsData.map((job) => (
          <AppliedJobCard key={job.id} job={job} />
        ))}
      </div>

      {/* Pagination - only show if needed */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 pt-6 border-t border-gray-200">
          <Pagination
            current={currentPage}
            total={total}
            pageSize={limit}
            onChange={handlePaginationChange}
            showSizeChanger={false}
            showQuickJumper={totalPages > 5}
            showTotal={(total, range) => (
              <span className="text-gray-600">
                Showing {range[0]}-{range[1]} of {total} applications
              </span>
            )}
            className="custom-pagination"
            disabled={isLoading}
          />
        </div>
      )}
    </div>
  );
}

export default AllAppliedJob;
