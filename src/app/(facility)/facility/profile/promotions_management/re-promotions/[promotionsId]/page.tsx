/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import RePromotions from "@/components/DashboardFacility/FacilityProfile/RePromotions";
import { useParams } from "next/navigation";

const page = () => {
  const id = useParams().promotionsId as string;

  return <RePromotions id={id} />;
};

export default page;
