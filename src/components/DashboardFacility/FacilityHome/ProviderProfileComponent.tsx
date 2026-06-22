"use client";

import {
  useGetProviderProfileByIdQuery,
  useGetSingleFacilityReviewQuery,
} from "@/redux/features/(Facility)/profileFacility/jobManagementFacilityApi";
import { getSafeImageUrl } from "@/utils/getSafeImageUrl";
import { Button, Pagination, Rate } from "antd";
import { FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ProviderProfileProps {
  id: string;
}

function ProviderProfileComponent({ id }: ProviderProfileProps) {
  const { data: providerData, isLoading } = useGetProviderProfileByIdQuery({
    id,
  });

  const [page, setPage] = useState<number>(1);
  const pageSize = 5;

  const { data: reviewData } = useGetSingleFacilityReviewQuery({
    id,
    page,
    limit: pageSize,
  });

  const provider = providerData?.result;
  const reviews = reviewData?.result;

  const [activeTab, setActiveTab] = useState<string>("About");
  const tabs: string[] = ["About", "Reviews"];

  if (isLoading) {
    return <p className="m-5 text-gray-500">Loading profile...</p>;
  }

  if (!provider) {
    return <p className="m-5 text-red-500">Provider not found</p>;
  }

  const providerProfile = provider.providerProfile;

  const renderDocuments = (title: string, docs?: any[]) => {
    if (!docs || docs.length === 0) return null;

    return (
      <div className="mt-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {docs.map((doc: any, index: number) => (
            <a
              key={index}
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition"
            >
              <FileText className="text-teal-600" />
              <span className="font-medium text-gray-700">
                {doc.fileName || "View Document"}
              </span>
            </a>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="m-5">
      {/* Title */}
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Provider Profile
      </h1>

      {/* Banner */}
      <div
        className="h-64 md:h-80 w-full bg-cover bg-center relative rounded-xl"
        style={{
          backgroundImage:
            "url('https://paintingdrive.com/blog/wp-content/uploads/2024/06/Home-interior-design-in-2022-2048x1366.jpg')",
        }}
      >
        <div className="absolute -bottom-16 left-6">
          <Image
            width={200}
            height={200}
            src={getSafeImageUrl(
              provider.profileImage || providerProfile?.profileImage,
            )}
            alt="Profile"
            className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white object-cover shadow-md"
          />
        </div>
      </div>

      {/* Name */}
      <h2 className="text-2xl font-bold text-gray-800 mt-20">
        {provider.fullName}
      </h2>

      <p className="text-lg font-semibold text-gray-600">{provider.role}</p>

      {/* Tabs */}
      <div className="p-2 bg-white rounded-full flex gap-4 mt-6 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full ${
              activeTab === tab ? "bg-[#193E58] text-white" : "bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ABOUT TAB */}
      {activeTab === "About" && (
        <div className="mt-8 space-y-8">
          {/* Provider Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Provider Information</h3>

            <div className="grid md:grid-cols-2 gap-4 text-gray-700">
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                {providerProfile?.phoneNumber || "N/A"}
              </p>

              <p>
                <span className="font-semibold">Experience:</span>{" "}
                {providerProfile?.experience || "N/A"}
              </p>

              <p>
                <span className="font-semibold">Address:</span>{" "}
                {providerProfile?.address?.fullAddress || "N/A"}
              </p>

              <p>
                <span className="font-semibold">NPI Number:</span>{" "}
                {providerProfile?.npiNumber || "N/A"}
              </p>

              <p>
                <span className="font-semibold">Licence Number:</span>{" "}
                {providerProfile?.licenceNumber || "N/A"}
              </p>
            </div>
          </div>

          {/* Provider Types */}
          {providerProfile?.provider?.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-3">Provider Type</h3>

              <div className="flex flex-wrap gap-2">
                {providerProfile.provider.map((item: string) => (
                  <span
                    key={item}
                    className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {providerProfile?.certification?.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-3">Certifications</h3>

              <div className="flex flex-wrap gap-2">
                {providerProfile.certification.map((cert: string) => (
                  <span
                    key={cert}
                    className="px-4 py-2 bg-teal-50 border border-teal-100 rounded-lg"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* State Licensed */}
          {providerProfile?.stateLicenced?.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-3">Licensed States</h3>

              <div className="flex flex-wrap gap-2">
                {providerProfile.stateLicenced.map((state: string) => (
                  <span
                    key={state}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {state}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* DOCUMENTS */}
          {renderDocuments("Resume", providerProfile?.document)}
          {renderDocuments("Licence Documents", providerProfile?.LICENCE)}
          {renderDocuments("Diploma Documents", providerProfile?.DIPLOMA)}
          {renderDocuments("BLS Certificates", providerProfile?.BLS)}
          {renderDocuments("ACLS Certificates", providerProfile?.ACLS)}
          {renderDocuments("PALS Certificates", providerProfile?.PALS)}
        </div>
      )}

      {/* REVIEWS TAB */}
      {activeTab === "Reviews" && (
        <div className="mt-8 space-y-6">
          <div>
            <h2 className="text-lg font-semibold">
              Reviews ({reviews?.meta?.total || 0})
            </h2>

            <div className="flex items-center gap-2">
              <Rate
                allowHalf
                disabled
                defaultValue={Number(provider.averageRating)}
              />
              <span>{provider.averageRating} / 5</span>
            </div>
          </div>

          {reviews?.data?.length ? (
            reviews.data.map((review: any) => (
              <div key={review.id} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex gap-3 items-center">
                  <Image
                    src={getSafeImageUrl(review.sender?.profileImage)}
                    alt="Reviewer"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />

                  <div>
                    <p className="font-semibold">{review.sender?.email}</p>

                    <Rate
                      allowHalf
                      disabled
                      defaultValue={review.rating}
                      style={{ fontSize: 14 }}
                    />
                  </div>
                </div>

                <p className="mt-2 text-gray-700">{review.comment}</p>

                <span className="text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))
          ) : (
            <p>No reviews yet</p>
          )}

          <Pagination
            current={page}
            pageSize={pageSize}
            total={reviews?.meta?.total || 0}
            onChange={(page) => setPage(page)}
          />
        </div>
      )}

      {/* Chat Button */}
      <div className="flex gap-3 my-8">
        <Link href={`/facility/messages?user=${provider?.id}`}>
          <Button size="large" type="primary">
            Request to Chat
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default ProviderProfileComponent;
