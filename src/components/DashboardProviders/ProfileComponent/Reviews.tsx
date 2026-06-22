"use client";

import Spinner from "@/components/common/Spinner";
import {
  useGetMyProfileQuery,
  useGetSingleFacilityReviewQuery,
} from "@/redux/features/(Facility)/profileFacility/jobManagementFacilityApi";
import { Pagination } from "antd";
import { Star } from "lucide-react";
import { useState } from "react";

export default function Reviews() {
  const { data: userData, isLoading: isUserLoading } = useGetMyProfileQuery("");
  const user = userData?.result;

  const [currentPage, setCurrentPage] = useState(1);

  const { data: reviewsData, isLoading: isReviewLoading } =
    useGetSingleFacilityReviewQuery(
      { id: user?.id, page: currentPage, limit: 5 },
      { skip: !user?.id }
    );

  const reviews = reviewsData?.result?.data || [];
  const meta = reviewsData?.result?.meta || {
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 0,
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
      <span className="text-sm text-gray-600 ml-1">{rating}</span>
    </div>
  );

  // Loading state
  if (isUserLoading || isReviewLoading) {
    return (
      <div className="flex mx-auto justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-white m-2 p-5 rounded">
      {/* Header */}
      <div className="mb-4">
        <p className="text-lg text-gray-700">
          {meta.total} review{meta.total !== 1 ? "s" : ""}
        </p>
      </div>

      {/* No reviews */}
      {reviews.length === 0 && (
        <div className="flex justify-center items-center py-12">
          <p className="text-gray-500 text-center text-base">
            No reviews found for this facility.
          </p>
        </div>
      )}

      {/* Review list */}
      <div className="space-y-3">
        {reviews.map((review: any) => {
          const facility = review.sender.facilityProfile;
          const initials = facility?.facilityName
            ? facility.facilityName
                .split(" ")
                .map((word: string) => word[0])
                .join("")
                .toUpperCase()
            : "NA";

          return (
            <div
              key={review.id}
              className="flex gap-4 p-4 border border-gray-50 bg-gray-50 rounded"
            >
              <div className="flex-shrink-0">
                {facility?.profileImage ? (
                  <img
                    src={facility.profileImage}
                    alt={facility.facilityName}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {initials}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h3 className="text-base font-medium text-gray-900">
                      {facility?.facilityName || "Unknown Facility"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {facility?.address?.fullAddress || "No address"}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="mb-2">{renderStars(review.rating)}</div>

                <p className="text-sm text-gray-600 leading-relaxed">
                  {review.comment}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            current={currentPage}
            total={meta.total}
            pageSize={meta.limit}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
}
