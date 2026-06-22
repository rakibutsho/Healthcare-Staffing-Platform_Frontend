/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import StopPromotions from "@/components/DashboardFacility/FacilityProfile/StopPromotions";
import { useParams } from "next/navigation";

const page = () => {
  const id = useParams().stopId as string;

  return <StopPromotions id={id} />;
};

export default page;
