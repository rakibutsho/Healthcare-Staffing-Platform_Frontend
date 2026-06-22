"use client";

import AddressAutocomplete from "@/components/shared/AddressAutocomplete";
import { useCreateFacilityProfileMutation } from "@/redux/features/auth/authApi";
import { Button, Checkbox, Form, Input, Modal, Progress, Select } from "antd";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { toast } from "sonner";
import congratulations from "../../../assets/images/congratulations.png";

interface FacilityInfo {
  facilityName: string;
  address: string;
  facilityType: string;
  caseType: string[];
  website?: string;
  orLoad: string;
}

interface CredentialInfo {
  crnaCredentials: string[];
  mdDoCredentials: string[];
}

interface HRInfo {
  hr_name: string;
  email: string;
  phone: string;
  role: string;
}

function FacilityProfileSetupComponent() {
  const [createFacilityProfile, { isLoading }] =
    useCreateFacilityProfileMutation();

  const [form] = Form.useForm();
  const [credential, setCredential] = useState<string>("Facility Info");
  const [progressValue, setProgressValue] = useState<number>(1);
  const [phone, setPhone] = useState<string | undefined>("");
  const [facilityInfo, setFacilityInfo] = useState<FacilityInfo | null>(null);
  const [credentialInfo, setCredentialInfo] = useState<CredentialInfo | null>(
    null,
  );
  const [agreeToTamsPolice, setAgreeToTamsPolice] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<boolean>(false);

  const router = useRouter();

  const CASE_TYPE_OPTIONS = [
    { label: "General Surgery", value: "GENERAL" },
    { label: "Orthopedic", value: "ORTHOPEDIC" },
    { label: "ENT", value: "ENT" },
    { label: "GI / Endoscopy", value: "GI_OR_ENDOSCOPY" },
    { label: "OB / GYN", value: "OB_OR_GYN" },
    { label: "Urology", value: "UROLOGY" },
    { label: "Cardiac", value: "CARDIAC" },
    { label: "Neurosurgery", value: "NEUROSURGERY" },
    { label: "Pediatrics", value: "PEDIATRICS" },
    { label: "Trauma", value: "TRAUMA" },
    { label: "Pain Management", value: "PAIN_MANAGEMENT" },
    { label: "Ophthalmology", value: "OPHTHALMOLOGY" },
    { label: "Dental / Oral Surgery", value: "DENTAL_OR_ORAL_SURGERY" },
  ];

  async function geocodeAddress(fullAddress: string) {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!key) throw new Error("Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY");

    const url =
      "https://maps.googleapis.com/maps/api/geocode/json" +
      `?address=${encodeURIComponent(fullAddress)}` +
      `&key=${key}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== "OK" || !data.results?.length) {
      throw new Error(data.error_message || "Unable to geocode this address");
    }

    const location = data.results[0].geometry.location; // { lat, lng }
    return { lat: location.lat, lng: location.lng };
  }

  const handleProfileSetUpStepOne = async (values: FacilityInfo) => {
    console.log("Facility Info:", values);
    setFacilityInfo(values);
    setCredential("Credential Requirements");
    setProgressValue(2);
    form.resetFields(); // Reset form for next step
  };

  const handleProfileSetUpStepTwo = async (values: CredentialInfo) => {
    console.log("Credential Info:", values);
    setCredentialInfo(values);
    setCredential("Staffing Contact Info");
    setProgressValue(3);
    form.resetFields(); // Reset form for next step
  };

  const handleProfileSubmit = async (values: HRInfo) => {
    if (!facilityInfo || !credentialInfo) {
      console.error("Missing facility or credential information");
      return;
    }

    const { lat, lng } = await geocodeAddress(facilityInfo.address);

    // Transform data to match API structure
    const payload = {
      facilityName: facilityInfo.facilityName,
      address: {
        long: String(lng),
        lat: String(lat),
        fullAddress: facilityInfo.address,
      },
      facilityType: facilityInfo.facilityType,
      caseType: facilityInfo.caseType,
      ...(facilityInfo.website && {
        website: facilityInfo.website,
      }),
      orLoad: facilityInfo.orLoad,
      certification: credentialInfo.crnaCredentials || [],
      md_do: credentialInfo.mdDoCredentials || [],
      HrDetails: {
        email: values.email,
        name: values.hr_name,
        phoneNumber: values.phone,
        role: values.role.toUpperCase(),
      },
    };

    try {
      console.log("Submitting payload:", payload);
      const res = await createFacilityProfile(payload).unwrap();
      console.log("Profile created successfully:", res);
      setSubmitMessage(true);
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
      console.error("Failed to create facility profile:", error);
      // You might want to show an error message to the user
    }
  };

  const handleHomePage = () => {
    router.push("/");
  };

  return (
    <div className="flex w-full h-screen items-center justify-center px-4 mx-auto">
      <div className="max-w-md w-full text-center space-y-5">
        <div className="space-y-5">
          <h1 className="text-4xl font-semibold text-gray-700 text-left">
            {credential}
          </h1>

          <div>
            <h1 className="text-gray-600 text-left">
              Step {progressValue} of 3
            </h1>
            <Progress percent={(progressValue / 3) * 100} showInfo={false} />
          </div>
        </div>

        {credential === "Facility Info" ? (
          <>
            <h1 className="text-xl text-left font-medium text-gray-700">
              Facility Details
            </h1>
            <Form
              form={form}
              onFinish={handleProfileSetUpStepOne}
              layout="vertical"
              className="w-full text-left"
            >
              <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  label="Facility Name"
                  name="facilityName"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your facility name!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter facility name"
                    size="large"
                    className="h-12"
                  />
                </Form.Item>

                <Form.Item
                  label="Facility Type"
                  name="facilityType"
                  rules={[
                    {
                      required: true,
                      message: "Please select your facility type!",
                    },
                  ]}
                >
                  <Select
                    placeholder="Select facility type"
                    options={[
                      {
                        label: "Surgical Center/Hospital",
                        value: "SURGICAL_CENTER",
                      },
                      // { label: "Hospital", value: "HOSPITAL" },
                      // { label: "Clinic", value: "CLINIC" },
                      // { label: "Nursing Home", value: "NURSING_HOME" },
                    ]}
                    style={{ height: "48px" }}
                  />
                </Form.Item>
              </div>

              <Form.Item
                label="Address"
                name="address"
                rules={[
                  { required: true, message: "Please enter your address!" },
                ]}
              >
                {/* Address autocomplete uses Google Places API. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in env. */}
                <AddressAutocomplete
                  placeholder="Enter facility address"
                  onChange={(v) => form.setFieldsValue({ address: v })}
                  onSelect={(address) => form.setFieldsValue({ address })}
                />
              </Form.Item>

              <Form.Item
                label="Case Types"
                name="caseType"
                rules={[
                  { required: true, message: "Please select case types!" },
                ]}
              >
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="Select case types"
                  options={CASE_TYPE_OPTIONS}
                  style={{ height: "48px" }}
                />
              </Form.Item>

              {/* <Form.Item
                label="Company Size"
                name="companySize"
                rules={[
                  { required: true, message: "Please select company size!" },
                ]}
              >
                <Select
                  placeholder="Select company size"
                  options={[
                    { label: "1 - 50", value: "1 - 50" },
                    { label: "51 - 100", value: "51 - 100" },
                    { label: "101 - 500", value: "101 - 500" },
                    { label: "500 - 1000", value: "500 - 1000" },
                    { label: "1000+", value: "1000+" },
                  ]}
                  style={{ height: "48px" }}
                />
              </Form.Item> */}

              <Form.Item
                label="Website"
                name="website"
                rules={[
                  {
                    validator: (_, value) => {
                      if (!value || value.trim() === "") {
                        return Promise.resolve(); // ✅ optional
                      }

                      try {
                        new URL(value);
                        return Promise.resolve();
                      } catch (error) {
                        return Promise.reject(
                          new Error("Please enter a valid website URL!"),
                        );
                      }
                    },
                  },
                ]}
              >
                <Input
                  placeholder="Enter website URL (optional)"
                  size="large"
                  className="h-12"
                />
              </Form.Item>

              <Form.Item
                label="OR Load"
                name="orLoad"
                rules={[{ required: true, message: "Please enter OR load!" }]}
              >
                <Input
                  placeholder="Enter OR load (e.g., High, Medium, Low)"
                  size="large"
                  className="h-12"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  style={{
                    backgroundColor: "#14b8a6",
                    borderColor: "#14b8a6",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  Next <ArrowRight />
                </Button>
              </Form.Item>
            </Form>
          </>
        ) : credential === "Credential Requirements" ? (
          <>
            <h1 className="text-xl text-left font-medium text-gray-700">
              Credential Details
            </h1>
            <Form
              form={form}
              onFinish={handleProfileSetUpStepTwo}
              layout="vertical"
              className="w-full text-left"
            >
              <div className="mb-4">
                <h1 className="font-medium mb-2">CRNA Credentials</h1>
                <Form.Item name="crnaCredentials">
                  <Checkbox.Group className="flex flex-col gap-2">
                    <Checkbox value="LICENCE">LICENSE</Checkbox>
                    <Checkbox value="DIPLOMA">DIPLOMA</Checkbox>
                    <Checkbox value="PALS">PALS</Checkbox>
                    <Checkbox value="ACLS">ACLS</Checkbox>
                    <Checkbox value="BLS">BLS</Checkbox>
                  </Checkbox.Group>
                </Form.Item>
              </div>
              <div className="mb-4">
                <h1 className="font-medium mb-2">MD/DO Credentials</h1>
                <Form.Item name="mdDoCredentials">
                  <Checkbox.Group className="flex flex-col gap-2">
                    <Checkbox value="STATE_LICENSE">State License</Checkbox>
                    <Checkbox value="BOARD_CERT">Board Certification</Checkbox>
                  </Checkbox.Group>
                </Form.Item>
              </div>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  style={{
                    backgroundColor: "#14b8a6",
                    borderColor: "#14b8a6",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  Next <ArrowRight />
                </Button>
              </Form.Item>
            </Form>
          </>
        ) : (
          <>
            <h1 className="text-xl text-left font-medium text-gray-700">
              HR Personnel Info
            </h1>
            <Form
              form={form}
              onFinish={handleProfileSubmit}
              layout="vertical"
              className="w-full text-left"
            >
              <Form.Item
                label="Name"
                name="hr_name"
                rules={[
                  {
                    required: true,
                    message: "Please enter HR personnel name!",
                  },
                ]}
              >
                <Input
                  placeholder="Enter HR personnel name"
                  size="large"
                  className="h-12"
                />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <Input
                  placeholder="Enter email address"
                  size="large"
                  className="h-12"
                />
              </Form.Item>

              <Form.Item
                label="Phone Number"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Please enter phone number!",
                  },
                  {
                    validator: (_, value) =>
                      value && isValidPhoneNumber(value)
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error("Please enter a valid phone number!"),
                          ),
                  },
                ]}
              >
                <PhoneInput
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(value) => {
                    setPhone(value);
                    form.setFieldValue("phone", value);
                  }}
                  defaultCountry="US"
                  className="w-full! h-12 rounded-lg border border-gray-300 px-3"
                />
              </Form.Item>

              <Form.Item
                label="Role"
                name="role"
                rules={[
                  {
                    required: true,
                    message: "Please select role!",
                  },
                ]}
              >
                <Select
                  placeholder="Select role"
                  options={[{ label: "HR Manager", value: "HR_MANAGER" }]}
                  style={{ height: "48px" }}
                />
              </Form.Item>

              <div className="pb-5">
                <Checkbox
                  checked={agreeToTamsPolice}
                  onChange={(e) => setAgreeToTamsPolice(e.target.checked)}
                >
                  I agree to the{" "}
                  <Link href="#" className="text-teal-600">
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-teal-600">
                    Privacy Policy
                  </Link>
                </Checkbox>
              </div>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={isLoading}
                  disabled={!agreeToTamsPolice}
                  style={{
                    backgroundColor: "#14b8a6",
                    borderColor: "#14b8a6",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
      </div>

      <Modal
        open={submitMessage}
        onCancel={() => setSubmitMessage(false)}
        footer={null}
        centered
        width={500}
        closable={false}
        style={{
          borderRadius: "12px",
          textAlign: "center",
          padding: "30px 20px",
        }}
      >
        <div className="flex items-center justify-center flex-col">
          <Image
            width={1000}
            height={1000}
            src={congratulations}
            alt="congratulations"
            className="w-50 rounded-full object-fill"
          />
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "600",
              marginBottom: "8px",
              color: "#333",
            }}
          >
            Congratulations
          </h2>
          <p
            style={{
              fontSize: "16px",
              color: "#666",
              marginBottom: "24px",
            }}
          >
            Your facility profile has been created successfully.
          </p>
        </div>

        <Button
          type="primary"
          block
          size="large"
          onClick={handleHomePage}
          style={{
            height: "48px",
            fontSize: "16px",
            fontWeight: "500",
            borderRadius: "8px",
            backgroundColor: "#14b8a6",
            borderColor: "#14b8a6",
          }}
        >
          Go To Home
        </Button>
      </Modal>
    </div>
  );
}

export default FacilityProfileSetupComponent;
