"use client";

import ProviderProfileComponent from "@/components/DashboardFacility/FacilityHome/ProviderProfileComponent";
import { useParams } from "next/navigation";

function ProviderProfilePage() {
  const id = useParams().id as string;

  return <ProviderProfileComponent id={id} />;
}

export default ProviderProfilePage;
