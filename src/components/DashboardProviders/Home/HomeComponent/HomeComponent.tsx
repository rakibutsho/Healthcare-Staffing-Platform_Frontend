"use client";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import JobCard, { Job } from "./JobComponent";
import { Modal, Pagination } from "antd";
import { useGetSearchJobsQuery } from "@/redux/features/(Providers)/profileProvider/providerJobApi";
import Spinner from "@/components/common/Spinner";
// import SubscriptionPlan from "@/components/common/priceModa";
import { useGetProviderProfileQuery } from "@/redux/features/(Providers)/profileProvider/profileProviderApi";

function HomeComponent() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTime, setCurrentTime] = useState(new Date()); // ✅ local time state
  const limit = 12;

  // api calling
  const { data, isLoading, refetch } = useGetSearchJobsQuery({
    searchTerm: searchQuery,
    page: currentPage,
    limit,
  });

  // const [showPlanModal, setShowPlanModal] = useState(false);

  const { data: user } = useGetProviderProfileQuery("");
  const userData = user?.result?.isSubscription;

  // ✅ Auto-update local date/time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ✅ UPDATED: Wait for BOTH user AND job data to load before showing modal
  // useEffect(() => {
  //   if (!isLoading && user && data) {
  //     if (userData === false) {
  //       const timer = setTimeout(() => {
  //         setShowPlanModal(true);
  //       }, 500);
  //       return () => clearTimeout(timer);
  //     }
  //   }
  // }, [user, userData, data, isLoading]);

  const jobsData = data?.result?.data || [];
  const meta = data?.result?.meta;

  const handlePaginationChange = (current: number) => {
    setCurrentPage(current);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Search Bar */}
      <div className="flex flex-wrap sm:flex-wrap-reverse md:flex-nowrap justify-between items-center gap-4 mb-6">
        <div className="flex flex-wrap md:flex-nowrap items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Find Facility"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md 
        focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <button
            onClick={() => setCurrentPage(1)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md 
      flex items-center space-x-2 transition-colors w-full md:w-auto justify-center"
          >
            <Search size={16} />
            <span>Search</span>
          </button>
        </div>

        {/* ✅ Live Local Date & Time */}
        <div className="text-right bg-white px-5 py-3 rounded shadow">
          <div className="text-sm font-semibold text-gray-900">
            {currentTime.toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div className="text-xs text-gray-500">
            {currentTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Matching jobs for you
      </h1>

      {/* Job Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          <p>Loading jobs...</p>
        ) : (
          jobsData.map((job: Job) => (
            <JobCard key={job?.id} job={job} refetch={refetch} />
          ))
        )}
      </div>

      <div className="p-4 w-full flex justify-center items-center mt-6">
        <Pagination
          current={currentPage}
          pageSize={limit}
          total={data?.result?.meta?.total || 0}
          onChange={handlePaginationChange}
          className="custom-pagination"
        />
      </div>
    </div>
  );
}

export default HomeComponent;
