"use client";

import {
  useGetSinglePromotionsQuery,
  useRePromitionMutation,
} from "@/redux/features/(Facility)/profileFacility/promotionsManagementFacilityApi";
import { toast } from "sonner";

interface StopPromotionsProps {
  id: string;
}

const StopPromotions = ({ id }: StopPromotionsProps) => {
  const {
    data: singlePromotionResponse,
    isLoading,
    isFetching,
    isError,
  } = useGetSinglePromotionsQuery(id);

  const [stopPromition, { isLoading: stopPromoting }] =
    useRePromitionMutation();

  const promotion = singlePromotionResponse?.result || null;

  const calculateDuration = (start?: string, end?: string) => {
    if (!start || !end) return 0;
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const handleSubmit = async () => {
    try {
      const nonSensitiveData = {
        promotionId: promotion?.id ?? id,
        status: "REJECTED",
      };
    } catch (err) {
      toast.error("Please fill in required fields");
    }
  };

  if (isLoading || isFetching) return <p>Loading promotion details...</p>;
  if (isError) return <p>Failed to load promotion.</p>;
  if (!promotion) return <p>No promotion found.</p>;

  const caption = promotion.caption || "-";
  const promotionType = promotion.promotionType || "-";
  const value = promotion.value || 0;
  const promotionImage = promotion.promotionImage || null;
  const startTime = promotion.startTime || null;
  const endTime = promotion.endTime || null;

  return (
    <div className="max-w-[50%] mx-auto p-6 space-y-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-gray-800">Stop Promotion</h1>

      <div className="items-center space-y-3">
        <p>
          <strong>Caption:</strong> {caption}
        </p>
        <p>
          <strong>Type:</strong> {promotionType}
        </p>
        <p>
          <strong>Value:</strong> ${value}
        </p>
        <p>
          <strong>Current Duration:</strong>{" "}
          {startTime && endTime
            ? `${calculateDuration(startTime, endTime)} days`
            : "N/A"}
        </p>

        {promotionImage && (
          <img
            src={promotionImage}
            alt="Promotion"
            className="w-full max-w-md mx-auto my-4 rounded-lg shadow"
          />
        )}
      </div>

      <div>
        <button
          className="bg-red-500 hover:bg-red-600 cursor-pointer text-white font-bold py-2 px-4 rounded"
          onClick={handleSubmit}
          disabled={stopPromoting}
        >
          {stopPromoting ? "Stopping..." : "Stop Promotion"}
        </button>
      </div>
    </div>
  );
};

export default StopPromotions;
