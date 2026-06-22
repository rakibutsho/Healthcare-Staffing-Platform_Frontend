"use client";

import { getSafeImageUrl } from "@/utils/getSafeImageUrl";
import { Button, Card } from "antd";
import { Briefcase, Clock, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface JobCardProps {
  item: {
    appliedAt: any;
    user: any;
    providerProfile: any;
    id: string;
    providerUserId: string;
    status: string;
    title: string;
    location: string;
    date: string;
    remainingDays: number;
    time?: string;
    experience?: string;
    fullName?: string;
    profileImage?: string;
  };
  loading?: boolean;
  link: string;
}

function JobCard({ item, loading, link }: JobCardProps) {
  const router = useRouter();

  const handleDetailsPage = (id: string, userID: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("userID", userID);
    }

    // router.push(`/${link}/${id}`);
    router.push(`/${link}/${id}?userId=${userID}`);
  };

  const handleRequestToChat = (id: string) => {
    console.log("Request to chat:", id);
    // API request logic here
  };

  return (
    <Card>
      <div className=" p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Image
            src={getSafeImageUrl(item?.user?.providerProfile?.profileImage)}
            alt={item.fullName || "Profile"}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="text-gray-700 font-medium">{item?.user?.fullName}</p>
            <p className="text-gray-500 text-sm">{item.title}</p>
          </div>
        </div>

        {/* Location & Date */}
        <div className="text-sm text-gray-600 space-y-2">
          <p className="flex items-center gap-2">
            <MapPin size={16} />{" "}
            {item?.user?.providerProfile?.address?.fullAddress}
          </p>
          <p className="flex items-center gap-2">
            <Star size={16} /> {item?.user?.averageRating}{" "}
          </p>
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap gap-2 text-xs text-gray-600">
          {item.time && (
            <span className="bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
              <Clock size={14} /> {item.time}
            </span>
          )}
          {item.experience && (
            <span className="bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
              <Briefcase size={14} /> {item.experience}
            </span>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex gap-3 pt-2">
          <Button
            block
            size="large"
            className="h-10"
            onClick={() => handleDetailsPage(item.providerUserId, item.id)}
            loading={loading}
            disabled={loading}
          >
            View Details
          </Button>
          <Link href={`/facility/messages?user=${item?.user?.id}`}>
            <Button
              type="primary"
              block
              size="large"
              style={{ backgroundColor: "#007870", borderColor: "#007870" }}
              onClick={() => handleRequestToChat(item.id)}
              loading={loading}
              disabled={loading}
            >
              Request to Chat
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

export default JobCard;
