import { CircleDollarSign, Hospital, MapPin } from "lucide-react";
import React from "react";
import { ScheduleItem } from "./RequestComponent";
import { Button } from "antd";

interface Props {
  item: ScheduleItem;
  statue?: string;
   
  openModal?: (id: any) => void;
  loading?: boolean;
}

function ScheduleCardItem({ item, statue, openModal, loading }: Props) {
  const statusColors: Record<ScheduleItem["status"], string> = {
    Pending: "text-yellow-500 bg-yellow-50 border-yellow-500",
    Reject: "text-red-500 bg-red-50 border-red-500",
    Accept: "text-green-500 bg-green-50 border-green-500",
    Working: "text-blue-500 bg-blue-50 border-blue-500",
    Unfilled: "text-gray-500 bg-gray-50 border-gray-500",
    Completed: "text-green-500 bg-green-50 border-green-500",
  };

  return (
    <div className="bg-white rounded-xl shadow border border-white p-4 space-y-3">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-lg">Apply Date: {item.date}</span>
        <span
          className={`text-xs px-3 py-1 border rounded-full ${
            statusColors[item.status]
          }`}
        >
          {item.status}
        </span>
      </div>

      <h3 className="text-teal-600 font-semibold text-lg hover:underline cursor-pointer">
        {item.title}
      </h3>

      <div className="flex items-center justify-between gap-2">
        <p className="text-gray-600 flex items-center gap-1">
          <Hospital size={18} />
          {item.company}
        </p>
        <p className="text-gray-600 flex items-center gap-1">
          <CircleDollarSign size={18} /> {item.price}
        </p>
      </div>

      <div className="flex items-center justify-between gap-2">
        <p className="text-gray-600 flex items-center gap-1">
          <MapPin size={18} />
          {item.location}
        </p>
        <p className="text-gray-600 text-sm">per shift</p>
      </div>

      <div className="flex flex-wrap gap-2 text-sm text-gray-600 pt-2">
        <span className="bg-gray-100 px-2 py-1 rounded">{item.time}</span>
        <span className="bg-gray-100 px-2 py-1 rounded">
          Duration: {item.duration}
        </span>
        <span className="bg-gray-100 px-2 py-1 rounded">Cert: {item.cert}</span>
      </div>
      {statue === "Completed" && (
        <div className="pt-2">
          <Button
            type="primary"
            block
            color="cyan"
            variant="outlined"
            className="h-12"
            size="large"
            onClick={() => openModal?.(item?.id)}
            loading={loading}
            disabled={loading}
          >
            Review Now
          </Button>
        </div>
      )}
    </div>
  );
}

export default ScheduleCardItem;