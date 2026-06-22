/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import JobDetailsComponent from "@/components/DashboardFacility/FacilityHome/JobDetailsComponent";
import { useParams } from "next/navigation";

const page = () => {
  const id = useParams().id as string;

  return (
    <div>
      <JobDetailsComponent id={id} />
    </div>
  );
};

export default page;
