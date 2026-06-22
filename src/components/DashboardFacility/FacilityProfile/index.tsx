"use client";
import AddressAutocomplete from "@/components/shared/AddressAutocomplete";
import {
  useGetFacilityProfileQuery,
  useUpdateFacilityProfileMutation,
} from "@/redux/features/(Facility)/profileFacility/hrDetailsFacilityApi";
import {
  Button,
  Form,
  Input,
  message,
  Select,
  Spin,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { Edit, Upload as UploadIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const facilityTypeOptions = [
  { value: "SURGICAL_CENTER", label: "Surgical Center/Hospital" },
];

const ehrSystemOptions = [{ value: "EPIC", label: "Epic" }];

const caseTypeOptions = [
  { value: "GENERAL", label: "General" },
  // { value: "SPECIALIZED", label: "Specialized" },
  // { value: "EMERGENCY", label: "Emergency" },
];

const companySizeOptions = [
  { label: "1 - 50", value: "1 - 50" },
  { label: "51 - 100", value: "51 - 100" },
  { label: "101 - 500", value: "101 - 500" },
  { label: "500 - 1000", value: "500 - 1000" },
  { label: "1000+", value: "1000+" },
];

const mdDoOptions = [
  { value: "STATE_LICENSE", label: "State License" },
  { value: "BOARD_CERT", label: "Board Certification" },
];

// const certificationOptions = [
//   { value: "BLS", label: "BLS" },
//   { value: "ACLS", label: "ACLS" },
//   { value: "PALS", label: "PALS" },
//   { value: "DIPLOMA", label: "DIPLOMA" },
//   { value: "LICENCE", label: "LICENCE" },
// ];

interface FacilityProfileData {
  facilityName: string;
  email: string;
  phone: string;
  address: {
    fullAddress: string;
    lat: string;
    long: string;
  };
  facilityType: string;
  caseType: string[];
  website: string;
  orLoad: string;
  profileImage?: string;
}

function normalizeMdDoCredentials(value: unknown) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    return [value];
  }

  return [];
}

function FacilityProfileComponent() {
  const {
    data: profileData,
    isLoading: isProfileLoading,
    error,
    refetch,
  } = useGetFacilityProfileQuery({});
  const [updateFacilityProfile, { isLoading: isUpdating }] =
    useUpdateFacilityProfileMutation();

  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [addressLat, setAddressLat] = useState<string | null>(null);
  const [addressLong, setAddressLong] = useState<string | null>(null);

  const caseTypeOptions = [
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

  // Load profile data into form when data is fetched
  useEffect(() => {
    if (profileData?.result) {
      const { facilityProfile } = profileData.result;

      // Set form values
      form.setFieldsValue({
        facilityName: facilityProfile?.facilityName || "",
        email: profileData.result.email || "",
        phone: facilityProfile?.HrDetails?.[0]?.phoneNumber || "",
        location: facilityProfile?.address?.fullAddress || "",
        facilityType: facilityProfile?.facilityType || "",
        caseType: facilityProfile?.caseType || "",
        website: facilityProfile?.website || "",
        orLoad: facilityProfile?.orLoad || "",

        // certification: facilityProfile?.certification || "",
        md_do: normalizeMdDoCredentials(facilityProfile?.md_do),
      });

      setAddressLat(facilityProfile?.address?.lat ?? null);
      setAddressLong(facilityProfile?.address?.long ?? null);

      // Set profile image if exists
      if (facilityProfile?.profileImage) {
        setFileList([
          {
            uid: "-1",
            name: "profile-image",
            status: "done",
            url: facilityProfile.profileImage,
          },
        ]);
      }
    }
  }, [profileData, form]);

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

    // backend expects "long" (not "lng")
    return { lat: String(loc.lat), long: String(loc.lng) };
  }

  const handleUpdateProfile = async (values: any) => {
    try {
      // Check if profile image exists (either existing or newly uploaded)
      const hasExistingProfileImage =
        profileData?.result?.facilityProfile?.profileImage;
      const hasNewProfileImage =
        fileList.length > 0 &&
        fileList[0].originFileObj &&
        fileList[0].originFileObj instanceof File;

      if (!hasExistingProfileImage && !hasNewProfileImage) {
        message.error("Please upload a profile photo before saving");
        return;
      }

      const fullAddress = (values.location || "").trim();
      if (!fullAddress) {
        message.error("Please enter your location");
        return;
      }

      // fallback to existing stored lat/long if geocode fails
      let lat =
        addressLat ??
        profileData?.result?.facilityProfile?.address?.lat ??
        "00.00";
      let long =
        addressLong ??
        profileData?.result?.facilityProfile?.address?.long ??
        "00.00";

      if ((lat === "00.00" || long === "00.00") && fullAddress) {
        try {
          const geo = await geocodeAddress(fullAddress);
          lat = geo.lat;
          long = geo.long;
        } catch (e: any) {
          // If you want to BLOCK save when geocode fails, uncomment return:
          message.error(
            e?.message || "Failed to get latitude/longitude from address",
          );
          // return;
        }
      }

      const updateData = {
        facilityName: values.facilityName || "",
        address: {
          fullAddress,
          lat,
          long,
        },
        facilityType: values.facilityType,
        caseType: values.caseType,
        website: values.website || "",
        orLoad: values.orLoad,
        // certification: values.certification || [],
        md_do: values.md_do || [],
      };

      console.log("Update data before sending:", updateData);

      // If there's a profile image file to upload
      if (
        fileList.length > 0 &&
        fileList[0].originFileObj &&
        fileList[0].originFileObj instanceof File
      ) {
        const formData = new FormData();

        try {
          // Create a clean JSON string
          const jsonString = JSON.stringify(updateData, null, 0);
          console.log("JSON string being sent:", jsonString);

          // Append the profile data as JSON string
          formData.append("bodyData", jsonString);

          // Append the profile image
          formData.append("profileImage", fileList[0].originFileObj);

          // Log FormData contents for debugging
          console.log("FormData entries:");
          for (const [key, value] of formData.entries()) {
            console.log(key, value);
          }

          await updateFacilityProfile(formData).unwrap();
          toast.success("Facility profile updated successfully!");
        } catch (jsonError) {
          console.error("Error creating JSON:", jsonError);
          throw new Error("Failed to create valid JSON data");
        }
      } else {
        // Update without image - send as regular object
        console.log("Sending data without image:", updateData);
        await updateFacilityProfile(updateData).unwrap();
      }

      message.success("Profile updated successfully!");
      setIsEditing(false);
      refetch(); // Refresh the profile data
    } catch (error: any) {
      console.error("Error updating profile:", error);
      message.error(error?.data?.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    if (profileData?.result) {
      const { facilityProfile } = profileData.result;
      form.setFieldsValue({
        facilityName: facilityProfile?.facilityName || "",
        email: profileData.result.email || "",
        phone: facilityProfile?.HrDetails?.[0]?.phoneNumber || "",
        location: facilityProfile?.address?.fullAddress || "",
        facilityType: facilityProfile?.facilityType || "",
        caseType: Array.isArray(facilityProfile?.caseType)
          ? facilityProfile.caseType
          : [],
        website: facilityProfile?.website || "",
        orLoad: facilityProfile?.orLoad || "",
        md_do: normalizeMdDoCredentials(facilityProfile?.md_do),
      });

      setAddressLat(facilityProfile?.address?.lat ?? null);
      setAddressLong(facilityProfile?.address?.long ?? null);

      // Reset file list
      if (facilityProfile?.profileImage) {
        setFileList([
          {
            uid: "-1",
            name: "profile-image",
            status: "done",
            url: facilityProfile.profileImage,
          },
        ]);
      } else {
        setFileList([]);
      }
    }
    setIsEditing(false);
  };

  const handleUploadChange: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    setFileList(newFileList);
  };

  const beforeUpload: UploadProps["beforeUpload"] = (file) => {
    const isImage = file.type.startsWith("image/");
    const isLt5M = file.size / 1024 / 1024 < 5;

    if (!isImage) {
      message.error("You can only upload image files!");
      return false;
    }

    if (!isLt5M) {
      message.error("Image must be smaller than 5MB!");
      return false;
    }

    return false; // Prevent auto upload
  };

  if (isProfileLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500 mb-4">Error loading profile data</p>
        <Button onClick={() => refetch()} type="primary">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 relative">
      <div className="absolute top-4 right-4 z-50 flex gap-2 items-center">
        <Button
          type="primary"
          size="large"
          icon={!isEditing ? <Edit /> : undefined}
          onClick={() => (!isEditing ? setIsEditing(true) : form.submit())}
          loading={isUpdating}
          style={{
            backgroundColor: "#14b8a6",
            borderColor: "#14b8a6",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          {isEditing ? "Save Change" : "Edit"}
        </Button>

        {isEditing && (
          <div className="flex gap-4 justify-end">
            <Button className="h-12" size="large" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        )}
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleUpdateProfile}
        className="space-y-4"
        disabled={isUpdating}
      >
        {/* Company Logo Upload */}
        <Form.Item label="Company Logo">
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={handleUploadChange}
            beforeUpload={beforeUpload}
            onRemove={() => setFileList([])}
            showUploadList={{
              showRemoveIcon: isEditing,
              showPreviewIcon: true,
            }}
            disabled={!isEditing}
            maxCount={1}
          >
            {fileList.length >= 1 || !isEditing ? null : (
              <div>
                <UploadIcon />
                <div style={{ marginTop: 8 }}>Upload Logo</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item
          label="Facility Name"
          name="facilityName"
          rules={[
            { required: true, message: "Please enter your facility name" },
          ]}
        >
          <Input
            placeholder="Enter your facility name"
            className="h-12"
            disabled={!isEditing}
          />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input
            placeholder="Enter your email"
            className="h-12"
            disabled={true} // Email usually shouldn't be editable in profile
          />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phone"
          rules={[
            { required: true, message: "Please enter your phone number" },
          ]}
        >
          <Input
            placeholder="Enter your phone number"
            className="h-12"
            disabled={!isEditing}
          />
        </Form.Item>

        <Form.Item
          label="Location"
          name="location"
          rules={[{ required: true, message: "Please enter your location" }]}
        >
          {isEditing ? (
            <AddressAutocomplete
              value={form.getFieldValue("location")}
              placeholder="Enter your full address"
              onChange={(value) => form.setFieldsValue({ location: value })}
              onSelect={(address, latLng) => {
                form.setFieldsValue({ location: address });
                if (latLng) {
                  setAddressLat(String(latLng.lat));
                  setAddressLong(String(latLng.lng));
                }
              }}
            />
          ) : (
            <Input.TextArea
              placeholder="Enter your full address"
              rows={3}
              disabled
            />
          )}
        </Form.Item>

        <Form.Item
          label="Website"
          name="website"
          rules={[{ type: "url", message: "Please enter a valid URL" }]}
        >
          <Input
            placeholder="Enter your website URL"
            className="h-12"
            disabled={!isEditing}
          />
        </Form.Item>

        <Form.Item
          label="Facility Type"
          name="facilityType"
          rules={[
            { required: true, message: "Please select your facility type" },
          ]}
        >
          <Select
            placeholder="Select your facility type"
            disabled={!isEditing}
            style={{ height: 48 }}
          >
            {facilityTypeOptions.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Case Type"
          name="caseType"
          rules={[{ required: true, message: "Please select your case type" }]}
        >
          <Select
            mode="multiple"
            placeholder="Select your case type"
            disabled={!isEditing}
            style={{ height: 48 }}
          >
            {caseTypeOptions.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="OR Load"
          name="orLoad"
          rules={[{ required: true, message: "Please select your OR load" }]}
        >
          <Input
            placeholder="Enter your OR load"
            className="h-12"
            disabled={!isEditing}
          />
        </Form.Item>

        {/* <Form.Item
          label="Certification"
          name="certification"
          rules={[
            {
              required: true,
              message: "Please select at least one certification",
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select your certifications"
            disabled={!isEditing}
            style={{ minHeight: 48 }}
            allowClear
          >
            {certificationOptions.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item> */}

        <Form.Item
          label="MD/DO Certification"
          name="md_do"
          rules={[
            {
              required: true,
              message: "Please select at least one credential",
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select your MD/DO certification"
            disabled={!isEditing}
            allowClear
            style={{ minHeight: 48 }}
          >
            {mdDoOptions.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </div>
  );
}

export default FacilityProfileComponent;
