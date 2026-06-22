"use client";

import Spinner from "@/components/common/Spinner";
import AddressAutocomplete from "@/components/shared/AddressAutocomplete";
import {
  useGetProviderProfileQuery,
  useUpdateProviderProfileMutation,
} from "@/redux/features/(Providers)/profileProvider/profileProviderApi";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row, Select, Upload } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ProfileFormValues {
  fullName: string;
  email: string;
  phoneNumber: string;
  license: string;
  credentials: string[];
  stateLicenced: string[]; // FIXED
  NPI_Number: string;
  experience: ExperienceType;
  fullAddress: string;
  provider: string[];
}

type ExperienceType =
  | "ONE_TO_TWO_YEARS"
  | "TWO_TO_THREE_YEARS"
  | "THREE_TO_FOUR_YEARS"
  | "FOUR_TO_TEN_YEARS";

function PersonalDetails() {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [initialData, setInitialData] = useState<any>(null);
  const [addressLat, setAddressLat] = useState<string | null>(null);
  const [addressLong, setAddressLong] = useState<string | null>(null);

  const {
    data,
    isLoading: isGetProfile,
    refetch,
  } = useGetProviderProfileQuery("");
  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateProviderProfileMutation();

  const userData = data?.result;

  const oldImageUrl =
    "https://www.ers.ga.gov/sites/main/files/main-images/camera_lense_0.jpeg";

  // Provider types
  const providerOptions = [
    { label: "CRNA", value: "CRNA" },
    { label: "AA", value: "AA" },
    { label: "MD/DO", value: "MD_DO" },
  ];

  // Credentials
  const credentialOptions = ["BLS", "ACLS", "PALS", "DIPLOMA", "LICENCE"];

  // State enum (must match backend)
  const stateOptions = [
    "ALABAMA",
    "ALASKA",
    "ARIZONA",
    "ARKANSAS",
    "CALIFORNIA",
    "COLORADO",
    "CONNECTICUT",
    "DELAWARE",
    "FLORIDA",
    "GEORGIA",
    "HAWAII",
    "IDAHO",
    "ILLINOIS",
    "INDIANA",
    "IOWA",
    "KANSAS",
    "KENTUCKY",
    "LOUISIANA",
    "MAINE",
    "MARYLAND",
    "MASSACHUSETTS",
    "MICHIGAN",
    "MINNESOTA",
    "MISSISSIPPI",
    "MISSOURI",
    "MONTANA",
    "NEBRASKA",
    "NEVADA",
    "NEW_HAMPSHIRE",
    "NEW_JERSEY",
    "NEW_MEXICO",
    "NEW_YORK",
    "NORTH_CAROLINA",
    "NORTH_DAKOTA",
    "OHIO",
    "OKLAHOMA",
    "OREGON",
    "PENNSYLVANIA",
    "RHODE_ISLAND",
    "SOUTH_CAROLINA",
    "SOUTH_DAKOTA",
    "TENNESSEE",
    "TEXAS",
    "UTAH",
    "VERMONT",
    "VIRGINIA",
    "WASHINGTON",
    "WEST_VIRGINIA",
    "WISCONSIN",
    "WYOMING",
  ];

  // Experience enum
  const experienceOptions = [
    { label: "1-2 Years", value: "ONE_TO_TWO_YEARS" },
    { label: "2-3 Years", value: "TWO_TO_THREE_YEARS" },
    { label: "3-4 Years", value: "THREE_TO_FOUR_YEARS" },
    { label: "4-10 Years", value: "FOUR_TO_TEN_YEARS" },
  ];

  // Load user data
  useEffect(() => {
    if (userData) {
      form.setFieldsValue({
        fullName: userData.fullName || "",
        email: userData.email || "",
        phoneNumber: userData.providerProfile?.phoneNumber || "",
        license: userData.providerProfile?.licenceNumber || "",
        credentials: userData.providerProfile?.certification || [],
        stateLicenced: userData.providerProfile?.stateLicenced || [], // FIXED
        NPI_Number: userData.providerProfile?.npiNumber || "",
        experience: userData.providerProfile?.experience || "ONE_TO_TWO_YEARS",
        fullAddress: userData.providerProfile?.address?.fullAddress || "",
        provider: userData.providerProfile?.provider || [],
      });

      setAddressLat(userData.providerProfile?.address?.lat ?? null);
      setAddressLong(userData.providerProfile?.address?.long ?? null);

      setInitialData(userData);

      setFileList([
        {
          uid: "-1",
          name: "profile.jpg",
          status: "done",
          url: userData.providerProfile?.profileImage || oldImageUrl,
        },
      ]);
    }
  }, [userData, form]);

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

    const loc = data.results[0].geometry.location as {
      lat: number;
      lng: number;
    };

    // backend wants { lat, long }
    return { lat: String(loc.lat), long: String(loc.lng) };
  }

  // Final submit handler
  const handleUpdatedProfile = async (values: ProfileFormValues) => {
    try {
      const fullAddress = values.fullAddress?.trim() || "";
      if (!fullAddress) {
        toast.error("Full address is required");
        return;
      }
      // Prefer lat/long obtained from the autocomplete selection (when editing),
      // otherwise fall back to previously saved values and finally geocode.
      let lat = addressLat ?? initialData?.providerProfile?.address?.lat ?? "0";
      let long =
        addressLong ?? initialData?.providerProfile?.address?.long ?? "0";

      if ((lat === "0" || long === "0") && fullAddress) {
        try {
          const geo = await geocodeAddress(fullAddress);
          lat = geo.lat;
          long = geo.long;
        } catch (e: any) {
          toast.error(e?.message || "Failed to geocode address");
        }
      }

      const bodyData = {
        fullName: values.fullName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        provider: values.provider,
        licenceNumber: values.license,
        npiNumber: values.NPI_Number,
        certification: values.credentials,
        stateLicenced: values.stateLicenced, // FIXED field mapping
        experience: values.experience,
        address: {
          fullAddress,
          lat,
          long,
        },
        document: initialData?.providerProfile?.document || [],
        caseTypePreference:
          initialData?.providerProfile?.caseTypePreference || [],
        callRequest: initialData?.providerProfile?.callRequest ?? true,
        radius: initialData?.providerProfile?.radius ?? 50,
        providerAvailability:
          initialData?.providerProfile?.providerAvailability || [],
      };

      const profileImage = fileList[0]?.originFileObj
        ? (fileList[0].originFileObj as File)
        : undefined;

      const res = await updateProfile({ bodyData, profileImage }).unwrap();

      toast.success(res?.message || "Profile updated successfully");
      refetch();
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update profile");
      console.error(err);
    }
  };

  const handleUploadChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList.slice(-1));
  };

  const beforeUpload = () => false;

  const handleCancel = () => {
    form.resetFields();
    setIsEditing(false);
  };

  if (isGetProfile) {
    return (
      <div className="flex mx-auto justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="absolute top-4 right-4 flex gap-2 items-center">
        <Button
          type="primary"
          size="large"
          icon={!isEditing ? <Edit /> : undefined}
          loading={isUpdating}
          onClick={() => (!isEditing ? setIsEditing(true) : form.submit())}
          style={{
            backgroundColor: "#14b8a6",
            borderColor: "#14b8a6",
            borderRadius: 8,
          }}
        >
          {isEditing ? "Save Change" : "Edit"}
        </Button>

        {isEditing && (
          <div className="flex gap-4 justify-end">
            <Button className="h-12" size="large" onClick={handleCancel}>
              Cancel
            </Button>

            {/* <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={isUpdating}
              className="h-12"
              style={{
                backgroundColor: "#14b8a6",
                borderColor: "#14b8a6",
                borderRadius: 8,
              }}
            >
              Submit
            </Button> */}
          </div>
        )}
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleUpdatedProfile}
        className="space-y-6"
      >
        <Form.Item label="Profile Image">
          <Upload
            listType="picture-card"
            fileList={fileList}
            beforeUpload={beforeUpload}
            onChange={handleUploadChange}
            showUploadList={{ showRemoveIcon: isEditing }}
            disabled={!isEditing}
          >
            {!isEditing || fileList.length >= 1 ? null : (
              <div>
                <UploadOutlined />
                <div className="mt-8">Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Row gutter={[16, 0]}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Full Name"
              name="fullName"
              rules={[{ required: true }]}
            >
              <Input disabled={!isEditing} className="h-12" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Email" name="email">
              <Input disabled className="h-12" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Phone Number"
              name="phoneNumber"
              rules={[{ required: true }]}
            >
              <Input disabled={!isEditing} className="h-12" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Provider Type"
              name="provider"
              rules={[{ required: true }]}
            >
              <Select mode="multiple" disabled={!isEditing}>
                {providerOptions.map((p) => (
                  <Select.Option key={p.value} value={p.value}>
                    {p.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="License Number"
              name="license"
              rules={[{ required: true }]}
            >
              <Input disabled={!isEditing} className="h-12" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Experience"
              name="experience"
              rules={[{ required: true }]}
            >
              <Select disabled={!isEditing}>
                {experienceOptions.map((e) => (
                  <Select.Option key={e.value} value={e.value}>
                    {e.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Credentials"
              name="credentials"
              rules={[{ required: true }]}
            >
              <Select mode="multiple" disabled={!isEditing}>
                {credentialOptions.map((c) => (
                  <Select.Option key={c} value={c}>
                    {c}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="States Licensed"
              name="stateLicenced"
              rules={[{ required: true }]}
            >
              <Select mode="multiple" disabled={!isEditing}>
                {stateOptions.map((s) => (
                  <Select.Option key={s} value={s}>
                    {s}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="NPI Number"
              name="NPI_Number"
              rules={[{ required: true }]}
            >
              <Input disabled={!isEditing} className="h-12" />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Full Address"
              name="fullAddress"
              rules={[{ required: true }]}
            >
              {isEditing ? (
                <AddressAutocomplete
                  placeholder="Enter full address"
                  value={form.getFieldValue("fullAddress")}
                  onChange={(v: string) =>
                    form.setFieldsValue({ fullAddress: v })
                  }
                  onSelect={(address: string, latLng) => {
                    form.setFieldsValue({ fullAddress: address });
                    if (latLng) {
                      setAddressLat(String(latLng.lat));
                      setAddressLong(String(latLng.lng));
                    }
                  }}
                />
              ) : (
                <Input disabled className="h-12" />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default PersonalDetails;
