"use client";

import { useGetProvidersByFacilityQuery } from "@/redux/features/(Facility)/profileFacility/jobManagementFacilityApi";
import { getSafeImageUrl } from "@/utils/getSafeImageUrl";
import { Button, Modal, Rate, Spin } from "antd";
import { MapPin, Search, Settings2, Star, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface Provider {
  id: string;
  name: string;
  specialty: string;
  location: string;
  rating: number;
  image: string;
  reviewCount?: number;
  distance?: string;
  certifications?: string[];
  stateLicenses?: string[];
  experience?: string;
}

interface ApiProvider {
  id: string;
  fullName: string;
  email: string;
  averageRating: number;
  providerProfile: {
    id: string;
    provider: string[];
    npiNumber: string;
    licenceNumber: string;
    address: {
      long: string;
      lat: string;
      fullAddress: string;
    };
    profileImage: string;
    certification: string[];
    stateLicenced: string[];
    caseTypePreference: string[];
    callRequest: boolean;
    radius: number;
    experience?: string;
  };
}

interface FilterState {
  jobTypes: string[];
  credentials: string; // Changed from string[] to string
  states: string; // Changed from string[] to string
  minRating: number;
  experiences: string; // Changed from string[] to string
}

function ProvidersComponent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Filter states
  const [filters, setFilters] = useState<FilterState>({
    jobTypes: [],
    credentials: "",
    states: "",
    minRating: 0,
    experiences: "",
  });

  const [tempFilters, setTempFilters] = useState<FilterState>(filters);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const router = useRouter();

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Build query parameters for API
  const queryParams = useMemo(() => {
    const params: any = {
      page: currentPage,
      limit: currentLimit,
    };

    if (debouncedSearchTerm) {
      params.searchTerm = debouncedSearchTerm;
    }

    if (filters.jobTypes.length > 0) {
      params.jobRoles = filters.jobTypes.join(",");
    }

    if (filters.credentials) {
      // Changed from filters.credentials.length > 0
      params.certificates = filters.credentials; // Changed from join(",")
    }

    if (filters.states) {
      // Changed from filters.states.length > 0
      params.states = filters.states; // Changed from join(",")
    }

    if (filters.minRating > 0) {
      params.ratings = filters.minRating;
    }

    if (filters.experiences) {
      // Changed from filters.experiences.length > 0
      params.experience = filters.experiences; // Changed from join(",")
    }

    return params;
  }, [currentPage, currentLimit, debouncedSearchTerm, filters]);

  const {
    data: providersData,
    isLoading,
    error,
    refetch,
  } = useGetProvidersByFacilityQuery(queryParams);

  // Transform API data to match component interface
  const providers: Provider[] = useMemo(() => {
    return (
      providersData?.result?.data?.map((apiProvider: ApiProvider) => ({
        id: apiProvider.id,
        name: apiProvider.fullName,
        specialty:
          apiProvider.providerProfile?.provider?.join(", ") || "Not specified",
        location:
          apiProvider.providerProfile?.address?.fullAddress ||
          "Location not provided",
        rating: apiProvider.averageRating || 0,
        image: getSafeImageUrl(apiProvider.providerProfile?.profileImage),
        reviewCount: 0,
        distance: `${apiProvider.providerProfile?.radius || 0} miles`,
        certifications: apiProvider.providerProfile?.certification || [],
        stateLicenses: apiProvider.providerProfile?.stateLicenced || [],
        experience: apiProvider.providerProfile?.experience,
      })) || []
    );
  }, [providersData]);

  // Filter options
  const filterOptions = {
    jobTypes: [
      { label: "CRNA", value: "CRNA" },
      { label: "AA", value: "AA" },
      { label: "MD/DO", value: "MD_DO" },
    ],
    credentials: [
      { label: "BLS", value: "BLS" },
      { label: "ACLS", value: "ACLS" },
      { label: "PALS", value: "PALS" },
      { label: "Diploma", value: "DIPLOMA" },
      { label: "License", value: "LICENCE" },
    ],
    states: [
      { label: "California", value: "CALIFORNIA" },
      { label: "Texas", value: "TEXAS" },
      { label: "New York", value: "NEW_YORK" },
    ],
    ratings: [1, 2, 3, 4, 5],
    experiences: [
      { label: "1-2 years", value: "ONE_TO_TWO_YEARS" },
      { label: "2-3 years", value: "TWO_TO_THREE_YEARS" },
      { label: "3-4 years", value: "THREE_TO_FOUR_YEARS" },
      { label: "4-10 years", value: "FOUR_TO_TEN_YEARS" },
    ],
  };

  const handleProfileDetails = (id: string) => {
    router.push(`/facility/provider_profile/${id}`);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    refetch();
  };

  const handleFilterChange = (
    filterType: keyof FilterState,
    value: any,
    isChecked?: boolean,
  ) => {
    setTempFilters((prev) => {
      const newFilters = { ...prev };

      if (filterType === "minRating") {
        newFilters.minRating = value;
      } else if (
        filterType === "credentials" ||
        filterType === "states" ||
        filterType === "experiences"
      ) {
        // Single selection for these fields
        newFilters[filterType] = newFilters[filterType] === value ? "" : value;
      } else if (Array.isArray(newFilters[filterType])) {
        // Multi-selection for jobTypes
        const currentArray = newFilters[filterType] as string[];
        if (isChecked) {
          newFilters[filterType] = [...currentArray, value] as any;
        } else {
          newFilters[filterType] = currentArray.filter(
            (item) => item !== value,
          ) as any;
        }
      }

      return newFilters;
    });
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setCurrentPage(1);
    setOpenModal(false);
  };

  const resetFilters = () => {
    const emptyFilters: FilterState = {
      jobTypes: [],
      credentials: "",
      states: "",
      minRating: 0,
      experiences: "",
    };
    setTempFilters(emptyFilters);
    setFilters(emptyFilters);
    setSearchTerm("");
    setCurrentPage(1);
  };

  const removeFilter = (filterType: keyof FilterState, value: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev };

      if (filterType === "jobTypes") {
        newFilters.jobTypes = newFilters.jobTypes.filter(
          (item) => item !== value,
        );
      } else if (
        filterType === "credentials" ||
        filterType === "states" ||
        filterType === "experiences"
      ) {
        newFilters[filterType] = "";
      }

      return newFilters;
    });
  };

  const getActiveFiltersCount = () => {
    return (
      filters.jobTypes.length +
      (filters.credentials ? 1 : 0) +
      (filters.states ? 1 : 0) +
      (filters.experiences ? 1 : 0) +
      (filters.minRating > 0 ? 1 : 0)
    );
  };

  const getFilterDisplayValue = (
    filterType: keyof FilterState,
    value: string,
  ) => {
    const options = filterOptions[filterType as keyof typeof filterOptions];
    if (Array.isArray(options)) {
      const option = options.find((opt: any) => opt.value === value);
      return (option as { label: string; value: string })?.label || value;
    }
    return value;
  };

  if (isLoading && !providersData) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex justify-center items-center py-12">
          <Spin size="large" />
          <span className="ml-3 text-gray-600">Loading providers...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-500 text-center py-8">
          <p>Error loading providers. Please try again later.</p>
          <Button onClick={() => refetch()} className="mt-4" type="primary">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 mb-4 w-lg relative">
          <div className="absolute top-2 left-2">
            <Search className="text-gray-600" />
          </div>
          <input
            type="text"
            placeholder="Search providers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 rounded pl-10 pr-3 py-2 ring focus:ring-2 ring-teal-500 outline-none border border-gray-300"
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button
            type="primary"
            className="w-[100px]"
            style={{
              backgroundColor: "#14b8a6",
              borderColor: "#14b8a6",
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 500,
              height: "40px",
            }}
            icon={<Search />}
            onClick={handleSearch}
          >
            Search
          </Button>
        </div>
        <Button
          type="primary"
          className="w-[50px] relative"
          style={{
            backgroundColor: "#14b8a6",
            borderColor: "#14b8a6",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            height: "40px",
          }}
          onClick={() => {
            setTempFilters(filters);
            setOpenModal(true);
          }}
        >
          <Settings2 />
          {getActiveFiltersCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {getActiveFiltersCount()}
            </span>
          )}
        </Button>
      </div>

      {/* Active Filters Display */}
      {getActiveFiltersCount() > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-sm text-gray-600 mr-2">Active filters:</span>

          {filters.jobTypes.map((type) => (
            <span
              key={type}
              className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
            >
              {getFilterDisplayValue("jobTypes", type)}
              <X
                className="w-3 h-3 cursor-pointer hover:text-teal-900"
                onClick={() => removeFilter("jobTypes", type)}
              />
            </span>
          ))}

          {/* Single state filter */}
          {filters.states && (
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
              {getFilterDisplayValue("states", filters.states)}
              <X
                className="w-3 h-3 cursor-pointer hover:text-blue-900"
                onClick={() => removeFilter("states", filters.states)}
              />
            </span>
          )}

          {/* Single credential filter */}
          {filters.credentials && (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
              {getFilterDisplayValue("credentials", filters.credentials)}
              <X
                className="w-3 h-3 cursor-pointer hover:text-green-900"
                onClick={() => removeFilter("credentials", filters.credentials)}
              />
            </span>
          )}

          {filters.minRating > 0 && (
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
              {filters.minRating} + Stars
              <X
                className="w-3 h-3 cursor-pointer hover:text-yellow-900"
                onClick={() =>
                  setFilters((prev) => ({ ...prev, minRating: 0 }))
                }
              />
            </span>
          )}

          {/* Single experience filter */}
          {filters.experiences && (
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
              {getFilterDisplayValue("experiences", filters.experiences)}
              <X
                className="w-3 h-3 cursor-pointer hover:text-purple-900"
                onClick={() => removeFilter("experiences", filters.experiences)}
              />
            </span>
          )}

          <Button
            size="small"
            type="link"
            onClick={resetFilters}
            className="text-red-500 hover:text-red-700"
          >
            Clear all
          </Button>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Provider matches for you ({providersData?.result?.meta?.total || 0}{" "}
          found)
        </h2>
        {isLoading && <Spin size="small" />}
      </div>

      {providers.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-lg mb-2">No providers found</div>
          <p>Try adjusting your search criteria or filters</p>
        </div>
      ) : (
        providers.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex gap-4">
              <Image
                width={48}
                height={48}
                src={getSafeImageUrl(item.image)}
                alt={item.name || "Provider avatar"}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-500">{item.specialty}</p>
                <div className="flex items-center text-gray-500 text-sm gap-1 pt-1">
                  <MapPin className="w-3 h-3" />
                  {item.location}
                </div>

                {/* Show certifications if available */}
                {item.certifications && item.certifications.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.certifications.slice(0, 3).map((cert, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                      >
                        {cert}
                      </span>
                    ))}
                    {item.certifications.length > 3 && (
                      <span className="text-gray-400 text-xs">
                        +{item.certifications.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <Button
                  type="primary"
                  className="w-[150px] mt-3"
                  style={{
                    backgroundColor: "#14b8a6",
                    borderColor: "#14b8a6",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 500,
                    height: "40px",
                  }}
                  onClick={() => handleProfileDetails(item.id)}
                >
                  View Details
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Rate
                  allowHalf
                  disabled
                  value={item.rating}
                  style={{ color: "#facc15", fontSize: "16px" }}
                />
                <span className="text-gray-700 text-xs">
                  {item.rating > 0 ? item.rating.toFixed(1) : "No ratings"}
                </span>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Pagination */}
      {providersData?.result?.meta &&
        providersData.result.meta.totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <div className="flex gap-2 items-center">
              <Button
                disabled={currentPage === 1 || isLoading}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>

              {/* Page numbers */}
              <div className="flex gap-1">
                {Array.from(
                  { length: Math.min(5, providersData.result.meta.totalPages) },
                  (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        type={currentPage === pageNum ? "primary" : "default"}
                        onClick={() => setCurrentPage(pageNum)}
                        disabled={isLoading}
                      >
                        {pageNum}
                      </Button>
                    );
                  },
                )}
              </div>

              <Button
                disabled={
                  currentPage === providersData.result.meta.totalPages ||
                  isLoading
                }
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}

      {/* Filter Modal */}
      <Modal
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
        centered
        closable={true}
        width={450}
        title={
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-800 text-xl">
              Filter Providers
            </span>
            <button
              className="text-red-500 text-sm font-medium hover:text-red-700"
              onClick={resetFilters}
            >
              Reset All Filters
            </button>
          </div>
        }
      >
        <div className="space-y-6 max-h-96 overflow-y-auto">
          <div>
            <h4 className="font-medium text-gray-700 mb-3 text-lg">
              Job Title
            </h4>
            <div className="flex gap-2">
              {filterOptions.jobTypes.map((job) => (
                <button
                  key={job.value}
                  onClick={() =>
                    handleFilterChange(
                      "jobTypes",
                      job.value,
                      !tempFilters.jobTypes.includes(job.value),
                    )
                  }
                  className={`flex-1 py-2 h-10 rounded-2xl border text-sm font-medium transition-all ${
                    tempFilters.jobTypes.includes(job.value)
                      ? "bg-teal-500 text-white border-teal-500"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:border-teal-300"
                  }`}
                >
                  {job.label}
                </button>
              ))}
            </div>
          </div>

          {/* Credentials/License - Single Selection */}
          <div>
            <h4 className="font-medium text-gray-700 mb-3 text-lg">
              Credentials/License
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {filterOptions.credentials.map((cred) => (
                <button
                  key={cred.value}
                  onClick={() => handleFilterChange("credentials", cred.value)}
                  className={`flex items-center justify-center px-3 h-10 rounded-2xl border text-sm font-medium transition-all ${
                    tempFilters.credentials === cred.value
                      ? "bg-teal-500 text-white border-teal-500"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:border-teal-300"
                  }`}
                >
                  {cred.label}
                </button>
              ))}
            </div>
          </div>

          {/* States - Single Selection */}
          <div>
            <h4 className="font-medium text-gray-700 mb-3 text-lg">State</h4>
            <div className="flex flex-wrap gap-2">
              {filterOptions.states.map((state) => (
                <button
                  key={state.value}
                  onClick={() => handleFilterChange("states", state.value)}
                  className={`px-4 h-10 rounded-2xl border text-sm font-medium transition-all ${
                    tempFilters.states === state.value
                      ? "bg-teal-500 text-white border-teal-500"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:border-teal-300"
                  }`}
                >
                  {state.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ratings */}
          <div>
            <h4 className="font-medium text-gray-700 mb-3 text-lg">
              Minimum Rating
            </h4>
            <div className="flex gap-2">
              {filterOptions.ratings.map((rate) => (
                <button
                  key={rate}
                  onClick={() => handleFilterChange("minRating", rate)}
                  className={`flex items-center justify-center gap-1 w-16 h-10 rounded-2xl border text-sm font-medium transition-all ${
                    tempFilters.minRating === rate
                      ? "bg-teal-500 text-white border-teal-500"
                      : "border-gray-200 hover:border-teal-300"
                  }`}
                >
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  {rate}
                </button>
              ))}
            </div>
          </div>

          {/* Experience - Single Selection */}
          <div>
            <h4 className="font-medium text-gray-700 mb-3 text-lg">
              Experience
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {filterOptions.experiences.map((exp) => (
                <button
                  key={exp.value}
                  onClick={() => handleFilterChange("experiences", exp.value)}
                  className={`flex items-center justify-center px-3 h-10 rounded-2xl border text-sm font-medium transition-all ${
                    tempFilters.experiences === exp.value
                      ? "bg-teal-500 text-white border-teal-500"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:border-teal-300"
                  }`}
                >
                  {exp.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex gap-3 mt-6 pt-4 border-t">
          <Button
            size="large"
            className="flex-1"
            onClick={() => setOpenModal(false)}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            className="flex-1"
            style={{
              backgroundColor: "#14b8a6",
              borderColor: "#14b8a6",
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 500,
              height: "40px",
            }}
            onClick={applyFilters}
          >
            Apply Filters ({getActiveFiltersCount()})
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default ProvidersComponent;
