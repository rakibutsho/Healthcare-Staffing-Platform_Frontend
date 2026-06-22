"use client";
import { Container } from "@/components/ui-library/container";
import CompleteHealthcare from "./CompleteHealthcare";
import HealthcareHero from "./HealthcareHero";
import HowToWork from "./HowToWork";
import TestimonialCarousel from "./TestimonialCarousel";

const HomeComponent = () => {
  return (
    <div>
      <div className="bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 bg-cover bg-center lg:pb-0 pb-10 pt-[100px]">
        <Container>
          <HealthcareHero />
        </Container>
      </div>
      <HowToWork />
      <CompleteHealthcare />
      <TestimonialCarousel />
    </div>
  );
};

export default HomeComponent;
