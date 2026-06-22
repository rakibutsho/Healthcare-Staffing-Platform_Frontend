"use client";

import AProviderProfileComponent from "@/components/DashboardFacility/FacilityHome/AProviderProfileComponent";
import { useParams, useSearchParams } from "next/navigation";

function ProviderProfilePage() {
  const id = useParams().id as string;

  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") as string;
  console.log("userId", userId);

  return <AProviderProfileComponent id={id} userId={userId} />;
}

export default ProviderProfilePage;
