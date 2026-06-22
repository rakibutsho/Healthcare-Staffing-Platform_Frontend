"use client";

import DetailsJobComponent from "@/components/DashboardProviders/Home/HomeComponent/DetailsJobComponent";
import React from "react";

export default function DetailsJobPage({
  params,
}: {
  params: Promise<{ details_job: string }>;
}) {
  const { details_job } = React.use(params); // unwrap with React.use()

  return <DetailsJobComponent job_id={details_job} />;
}
