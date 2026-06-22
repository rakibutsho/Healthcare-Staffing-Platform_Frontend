/* eslint-disable react-hooks/rules-of-hooks */

"use client";

import GetSinglePromotion from "@/components/DashboardFacility/FacilityProfile/GetSinglePromotion";
import { useParams } from "next/navigation";

const page = () => {
  const id = useParams().id as string;

  return (
    <div>
      <GetSinglePromotion id={id} />
    </div>
  );
};

export default page;
