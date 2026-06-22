
import { Container } from "@/components/ui-library/container";
import FacilityHome from "./FacilityHome";
import ProviderFacility from "./ProviderFacility";
import FacilityFaqSolution from "./FacilityFaqSolution";

function FacilityLandingPage() {
  return (
    <div>
      <div className="bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 bg-cover bg-center lg:pb-0 pb-10 pt-[100px]">
        <Container>
          <FacilityHome />
        </Container>
      </div>
      <ProviderFacility/>
      <FacilityFaqSolution/>
    </div>
  );
}

export default FacilityLandingPage;
