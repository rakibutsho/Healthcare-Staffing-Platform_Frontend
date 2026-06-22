"use client";
import { Badge } from "@/components/ui/buttons/badge";
import { useGetReviewsQuery } from "@/redux/features/home/homeApi";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Hospital, Star, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

// Default avatar fallback
const DEFAULT_AVATAR =
  "https://nyc3.digitaloceanspaces.com/smtech-space/uploads/1757314567961-z4rei45wnv.png";

export default function TestimonialCarousel() {
  const { data: testimonialsData, isLoading } = useGetReviewsQuery({});

  // Transform API data to match component structure
  const testimonials =
    testimonialsData?.result?.data?.map((review: any) => {
      const isProvider = !!review.sender.providerProfile;
      const isFacility = !!review.sender.facilityProfile;

      return {
        id: review.id,
        rating: review.rating,
        text: review.comment,
        name: review.sender.fullName,
        position: isFacility
          ? review.sender.facilityProfile?.facilityName || "Healthcare Facility"
          : review.jobPost?.jobRole || "Healthcare Provider",
        badge: isProvider ? "Provider" : "Facility",
        badgeColor: isProvider
          ? "bg-blue-100 text-blue-800"
          : "bg-green-100 text-green-800",
        avatar:
          review.sender.profileImage ||
          review.sender.providerProfile?.profileImage ||
          review.sender.facilityProfile?.profileImage ||
          DEFAULT_AVATAR,
      };
    }) || [];

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  if (isLoading) {
    return (
      <div className="w-full py-12">
        <div className="text-center">
          <p className="text-gray-600">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="w-full py-12">
        <div className="text-center">
          <p className="text-gray-600">No testimonials available yet.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full container mx-auto py-12 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Success Stories from Both Sides
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Helping healthcare professionals find the right jobs and facilities
            hire top talent.
          </p>
        </div>

        {/* Carousel */}
        <div>
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((item: any) => (
                <div
                  key={item.id}
                  className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] p-4"
                >
                  <div className="bg-white rounded-xl shadow p-6 space-y-4 h-full flex flex-col">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      <Badge
                        className={`${item.badgeColor} text-xs font-medium py-1 flex items-center gap-2`}
                      >
                        {item.badge === "Provider" ? (
                          <>
                            <Users size={20} />
                            {item.badge}
                          </>
                        ) : (
                          <>
                            <Hospital size={20} />
                            {item.badge}
                          </>
                        )}
                      </Badge>
                    </div>
                    <p className="text-gray-700 flex-1">{item.text}</p>
                    <div className="flex items-center space-x-4 mt-4">
                      <Image
                        src={item.avatar}
                        alt={item.name || "Testimonial author"}
                        width={56}
                        height={56}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-gray-500">{item.position}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-center mt-6 space-x-3">
            <button
              onClick={scrollPrev}
              disabled={!prevBtnEnabled}
              className={`rounded-full shadow p-2 border border-[#193e58] transition ${
                prevBtnEnabled
                  ? "bg-white hover:bg-[#193e58] hover:text-white active:scale-95"
                  : "bg-[#193e58] text-white cursor-not-allowed"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollNext}
              disabled={!nextBtnEnabled}
              className={`rounded-full shadow p-2 border border-[#193e58] transition ${
                nextBtnEnabled
                  ? "bg-white hover:bg-[#193e58] hover:text-white active:scale-95"
                  : "bg-[#193e58] text-white cursor-not-allowed"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <section className="py-20 bg-[#e2e8f0]">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-[2B3A55] leading-tight">
              The Smarter Way to Staff Anesthesia.
            </h2>
            <p className="text-xl text-black leading-relaxed max-w-2xl mx-auto">
              AnestheLink bridges hospitals and anesthesia providers directly —
              saving time, cutting costs, and building lasting partnerships.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-4 w-full sm:w-auto">
              <Link
                href="/auth/login"
                className="flex items-center gap-3 px-4 lg:px-6 py-3 lg:py-4 bg-[#4B9FA3] rounded-md text-white text-lg lg:text-[20px] font-medium w-full sm:w-auto justify-center sm:justify-start hover:bg-[#3a7a7d] transition-colors"
              >
                <Users />I am a Provider
              </Link>
              <Link
                href="/auth/login"
                className="flex items-center gap-3 px-4 lg:px-6 py-3 lg:py-4 bg-[rgba(125,198,200,0.15)] border border-[rgba(25,62,88,0.20)] rounded-md text-[#193E58] text-lg lg:text-[20px] font-normal w-full sm:w-auto justify-center sm:justify-start hover:bg-[rgba(125,198,200,0.25)] transition-colors"
              >
                <Hospital />I am a Facility
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
