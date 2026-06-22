// "use client";
// import React, { useState } from "react";
// import JobCard, { Job } from "../Home/HomeComponent/JobComponent";
// import { useGetSearchJobsQuery } from "@/redux/features/(Providers)/profileProvider/providerJobApi";
// import { Pagination } from "antd";
// import Spinner from "@/components/common/Spinner";

// function Bookmarks() {
//   const [currentPage, setCurrentPage] = useState(1);
//   const limit = 12;

//   const { data, isLoading } = useGetSearchJobsQuery({
//     page: currentPage,
//     limit,
//   });

//   const jobsData = data?.result?.data || [];
//   const meta = data?.result?.meta;

//   const handlePaginationChange = (current: number) => {
//     setCurrentPage(current);
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <Spinner />
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 m-4">
//         {jobsData?.map((job: Job) => (
//           <JobCard key={job.id} job={job} />
//         ))}
//       </div>
//       <div className="p-4 w-full flex justify-center items-center mt-6">
//         <Pagination
//           current={currentPage}
//           pageSize={limit}
//           total={data?.result?.meta?.total || 0}
//           onChange={handlePaginationChange}
//           className="custom-pagination"
//         />
//       </div>
//     </div>
//   );
// }

// export default Bookmarks;
