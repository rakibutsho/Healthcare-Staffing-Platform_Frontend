"use client";

import { useGetSinglePromotionsQuery } from "@/redux/features/(Facility)/profileFacility/promotionsManagementFacilityApi";

type Promotion = {
  id: string;
  caption: string;
  startTime: string;
  endTime: string;
  value: number;
  promotionType: string;
  promotionImage: string;
  createdAt: string;
  facility: {
    facilityName: string;
    user: {
      email: string;
    };
  };
};

const GetSinglePromotion = ({ id }: { id: string }) => {
  const {
    data: promotionData,
    isLoading,
    isError,
  } = useGetSinglePromotionsQuery(id);

  if (isLoading) {
    return <div className="text-center p-4">Loading promotion...</div>;
  }

  if (isError || !promotionData?.result) {
    return (
      <div className="text-center p-4 text-red-500">Promotion not found</div>
    );
  }

  const promotion: Promotion = promotionData.result;

  return (
    <div className="max-w-[50%] mx-auto  mt-12  bg-white shadow-lg rounded-lg overflow-hidden">
      <img
        src={promotion.promotionImage}
        alt={promotion.caption}
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">{promotion.caption}</h2>
        <p className="text-gray-600 mb-1">
          <span className="font-semibold">Type:</span> {promotion.promotionType}
        </p>
        <p className="text-gray-600 mb-1">
          <span className="font-semibold">Discount:</span> {promotion.value}%
        </p>
        <p className="text-gray-600 mb-1">
          <span className="font-semibold">Start:</span>{" "}
          {new Date(promotion.startTime).toLocaleString()}
        </p>
        <p className="text-gray-600 mb-1">
          <span className="font-semibold">End:</span>{" "}
          {new Date(promotion.endTime).toLocaleString()}
        </p>
        <div className="mt-3 border-t pt-2">
          <p className="text-gray-700">
            <span className="font-semibold">Facility:</span>{" "}
            {promotion.facility.facilityName}
          </p>
          <p className="text-gray-500 text-sm">
            <span className="font-semibold">Email:</span>{" "}
            {promotion.facility.user.email}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GetSinglePromotion;
