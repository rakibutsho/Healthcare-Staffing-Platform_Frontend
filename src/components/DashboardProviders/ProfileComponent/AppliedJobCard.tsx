"use client";
import React, { useState } from "react";
import {
  Bookmark,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Modal, Tag } from "antd";
import { AppliedJob } from "@/types/AppliedJobs";
import { useCancelJobRequestFromProviderMutation } from "@/redux/features/(Providers)/profileProvider/providerJobApi";
import { toast } from "sonner";

interface JobCardProps {
  job: AppliedJob;
}

const AppliedJobCard: React.FC<JobCardProps> = ({ job }) => {
  const salary = `$${job.jobPost.minPriceRange}-${job.jobPost.maxPriceRange}`;
  const company =
    job.jobPost.user?.facilityProfile?.facilityName || "Unknown Facility";
  const posted = job.appliedAt ? new Date(job.appliedAt).toDateString() : "N/A";

  const schedule = job.jobPost.schedule?.[0];
  const shift =
    schedule?.startTime && schedule?.endTime
      ? `${new Date(schedule.startTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })} - ${new Date(schedule.endTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`
      : "N/A";

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelJob, { isLoading }] = useCancelJobRequestFromProviderMutation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "processing";
      case "COMPLETED":
        return "success";
      case "CANCELLED":
        return "error";
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "error";
      default:
        return "default";
    }
  };

  const handleConfirmCancel = async () => {
    try {
      const res = await cancelJob({
        jobPostId: job.jobPost.id,
        cancellationReason: "reject",
      }).unwrap();
      toast.success(res.message || "Job application cancelled successfully");
      setIsCancelModalOpen(false);
    } catch (error: any) {
      toast.error(
        error.data?.message ||
          error.message ||
          "Failed to cancel job application."
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Status */}
      <div className="flex justify-between items-start mb-4">
        <Tag
          color={getStatusColor(job.statusAfterApproval)}
          className="text-xs"
        >
          {job.statusAfterApproval}
        </Tag>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-col gap-4">
        {/* Facility + Job Title */}
        <div className="space-y-1">
          <p className="text-gray-600 text-sm truncate" title={company}>
            {company}
          </p>
          <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-2">
            {job.jobPost.jobRole}
          </h3>
        </div>

        {/* Location + Salary */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={14} className="text-gray-400" />
            <span
              className="truncate"
              title={job.jobPost.user?.facilityProfile?.address?.fullAddress}
            >
              {job.jobPost.user?.facilityProfile?.address?.fullAddress ?? "N/A"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSign size={14} className="text-gray-400" />
            <span className="font-medium">{salary}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={14} className="text-gray-400" />
            <span>Applied: {posted}</span>
          </div>
        </div>

        {/* Small Tags Row */}
        <div className="flex flex-wrap gap-3 text-xs pt-2">
          <div className="flex items-center bg-gray-100 px-3 py-1.5 rounded max-w-full">
            <div className="w-2.5 h-2.5 bg-gray-400 rounded-full mr-2"></div>
            <span className="truncate">
              {job.jobPost.qualification || "N/A"}
            </span>
          </div>

          <div className="flex items-center bg-gray-100 px-3 py-1.5 rounded whitespace-nowrap">
            <Clock size={12} className="mr-1 text-gray-400" />
            {shift}
          </div>

          <div className="flex items-center bg-gray-100 px-3 py-1.5 rounded whitespace-nowrap">
            <Users size={12} className="mr-1 text-gray-400" />
            {job.jobPost.jobRole}
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 pt-3">
          <Link
            href={`/dashboard/${job.jobPost.id}`}
            className="flex-1 text-center border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-md text-sm font-medium transition-colors"
          >
            View Details
          </Link>

          {job.statusAfterApproval === "PENDING" && (
            <button
              onClick={() => setIsCancelModalOpen(true)}
              disabled={isLoading}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-md text-sm font-medium disabled:opacity-50"
            >
              {isLoading ? "Cancelling..." : "Cancel"}
            </button>
          )}
        </div>
      </div>

      {/* CANCEL MODAL */}
      <Modal
        title="Cancel Job Application"
        open={isCancelModalOpen}
        onOk={handleConfirmCancel}
        onCancel={() => setIsCancelModalOpen(false)}
        okText={isLoading ? "Cancelling..." : "Yes, Cancel"}
        cancelText="No"
        okButtonProps={{
          className: "bg-red-500 hover:bg-red-600",
          disabled: isLoading,
        }}
        cancelButtonProps={{ disabled: isLoading }}
        confirmLoading={isLoading}
        closable={!isLoading}
      >
        <div className="space-y-3">
          <p className="text-gray-700">
            Are you sure you want to cancel this job application?
          </p>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
            <p className="text-sm text-yellow-700">
              <strong>Note:</strong> This action cannot be undone.
            </p>
          </div>

          <div className="text-sm text-gray-600 mt-3">
            <p>
              <strong>Job:</strong> {job.jobPost.jobRole}
            </p>
            <p>
              <strong>Facility:</strong> {company}
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AppliedJobCard;
