"use client";

import FacilityLandingPage from "@/components/DashboardProviders/Home/FacilityLandingPage"; // Replace with your actual FACILITY component
import HomeComponent from "@/components/pages/home/HomeComponent";
// import HomeComponent from "@/components/pages/home/HomeComponent";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";

const HomePage = () => {
  const role = useAppSelector(selectCurrentUser)?.role;

  if (role === "PROVIDER") {
    return <FacilityLandingPage />;
  } else if (role === "FACILITY") {
    return <FacilityLandingPage />; // FACILITY specific component
  } else {
    return <HomeComponent />;
  }
};

export default HomePage;
