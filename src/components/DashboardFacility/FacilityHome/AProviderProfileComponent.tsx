"use client";

import {
  useGetProviderProfileByIdQuery,
  useGetSingleFacilityReviewQuery,
  useJobAcceptOrDeclineApplicationMutation,
} from "@/redux/features/(Facility)/profileFacility/jobManagementFacilityApi";

import { getSafeImageUrl } from "@/utils/getSafeImageUrl";
import { Alert, Button, Pagination, Rate, Spin } from "antd";
import { ExternalLink, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface ProviderProfileProps {
  id: string;
  userId: string;
}

type ApplicationStatus = "APPROVED" | "REJECTED";

function AProviderProfileComponent({ id, userId }: ProviderProfileProps) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("About");
  const [page, setPage] = useState(1);
  const [actionLoading, setActionLoading] = useState({
    accept: false,
    decline: false,
  });

  const pageSize = 5;
  const tabs = ["About", "Reviews"];

  const defaultBannerImage =
    "https://paintingdrive.com/blog/wp-content/uploads/2024/06/Home-interior-design-in-2022-2048x1366.jpg";

  const [declineOrAccept] = useJobAcceptOrDeclineApplicationMutation();

  const {
    data: providerData,
    isLoading,
    error,
  } = useGetProviderProfileByIdQuery({ id });

  const { data: reviewData, isLoading: reviewLoading } =
    useGetSingleFacilityReviewQuery({
      id,
      page,
      limit: pageSize,
    });

  const provider = providerData?.result;
  const providerProfile = provider?.providerProfile;
  const facility = provider?.facilityProfile;
  const reviews = reviewData?.result;

  const handlePaginationChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleApplicationAction = async (
    status: ApplicationStatus,
    type: "accept" | "decline",
  ) => {
    setActionLoading((prev) => ({ ...prev, [type]: true }));

    try {
      const res = await declineOrAccept({
        id: userId,
        data: { action: status },
      }).unwrap();

      toast.success(res?.message || "Success");
      router.push("/facility");
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    } finally {
      setActionLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const renderProviderDetails = () => {
    if (!providerProfile) return null;

    const fields = [
      { label: "Phone Number", value: providerProfile.phoneNumber },
      { label: "Experience", value: providerProfile.experience },
      { label: "Licence Number", value: providerProfile.licenceNumber },
      { label: "Address", value: providerProfile?.address?.fullAddress },
    ];

    return (
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Provider Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(
            (item, idx) =>
              item.value && (
                <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                  <span className="font-semibold">{item.label}: </span>
                  {item.value}
                </div>
              ),
          )}
        </div>
      </div>
    );
  };

  const renderCredentialFiles = () => {
    const types = ["BLS", "ACLS", "PALS", "DIPLOMA", "LICENCE"];

    return (
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Credential Documents</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {types.map((type) => {
            const docs = providerProfile?.[type];

            if (!docs || !docs.length) return null;

            return docs.map((doc: any, idx: number) => (
              <a
                key={`${type}-${idx}`}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 border rounded-lg flex items-center gap-3 hover:bg-gray-50"
              >
                <FileText className="h-5 w-5 text-teal-600" />
                <span className="flex-1 truncate">
                  {type} - {doc.fileName}
                </span>
                <ExternalLink className="h-4 w-4" />
              </a>
            ));
          })}
        </div>
      </div>
    );
  };

  const renderDocuments = (documents: any[]) => {
    if (!documents?.length) return null;

    return (
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Documents</h3>

        <div className="grid md:grid-cols-2 gap-4">
          {documents.map((doc, idx) => (
            <a
              key={idx}
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 border rounded-lg flex items-center gap-3 hover:bg-gray-50"
            >
              <FileText className="h-5 w-5 text-teal-600" />
              <span className="flex-1 truncate">{doc.fileName}</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading)
    return (
      <div className="flex justify-center p-10">
        {" "}
        <Spin size="large" />{" "}
      </div>
    );

  if (error)
    return (
      <Alert type="error" message="Error loading provider profile" showIcon />
    );

  return (
    <div className="container mx-auto p-6">
      {/* Banner */}
      <div
        className="h-64 bg-cover bg-center rounded-xl"
        style={{ backgroundImage: `url(${defaultBannerImage})` }}
      />

      {/* Profile */}
      <div className="flex items-center gap-6 mt-6">
        <Image
          src={getSafeImageUrl(
            provider?.profileImage || providerProfile?.profileImage,
          )}
          alt="profile"
          width={120}
          height={120}
          className="rounded-full border"
        />

        <div>
          <h2 className="text-3xl font-bold">{provider?.fullName}</h2>
          <p className="text-gray-500">{provider?.role}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mt-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-lg ${
              activeTab === tab ? "bg-[#193E58] text-white" : "bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-8">
        {activeTab === "About" ? (
          <>
            {renderProviderDetails()}

            {providerProfile?.certification && (
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">
                  Provider Certifications
                </h3>
                <div className="flex flex-wrap gap-3">
                  {providerProfile.certification.map((c: string) => (
                    <span
                      key={c}
                      className="px-4 py-2 bg-teal-50 text-teal-700 rounded-lg border"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {renderCredentialFiles()}

            {renderDocuments(providerProfile?.document)}
          </>
        ) : (
          <>
            {reviewLoading ? (
              <Spin />
            ) : (
              <>
                <Rate disabled value={provider?.averageRating || 0} />

                {reviews?.data?.map((r: any) => (
                  <div key={r.id} className="border p-4 rounded mt-4">
                    <Rate disabled value={r.rating} />
                    <p>{r.comment}</p>
                  </div>
                ))}

                <Pagination
                  current={page}
                  pageSize={pageSize}
                  total={reviews?.meta?.total}
                  onChange={handlePaginationChange}
                />
              </>
            )}
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-10">
        <Button
          danger
          loading={actionLoading.decline}
          onClick={() => handleApplicationAction("REJECTED", "decline")}
        >
          Decline
        </Button>

        <Button
          type="primary"
          loading={actionLoading.accept}
          onClick={() => handleApplicationAction("APPROVED", "accept")}
        >
          Accept
        </Button>

        <Link href="/facility/messages">
          <Button type="primary" ghost>
            Request to Chat
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default AProviderProfileComponent;
