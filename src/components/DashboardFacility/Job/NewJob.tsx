"use client";

import { useCreateNewJobPostMutation } from "@/redux/features/(Facility)/profileFacility/jobManagementFacilityApi";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  DatePicker,
  Input,
  InputNumber,
  Select,
  Space,
  TimePicker,
  Typography,
  message,
} from "antd";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const jobPostSchema = z.object({
  jobRole: z.enum(["CRNA", "AA", "MD_DO"], {
    errorMap: () => ({ message: "Please select a valid job role" }),
  }),
  about: z
    .string()
    .min(10, "Please provide at least 10 characters about the role"),
  qualification: z
    .string()
    .min(10, "Please provide at least 10 characters for qualifications"),
  experience: z.string().min(1, "Experience requirement is required"),
  date: z.date({ required_error: "Date is required" }),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  totalCandidate: z.number().min(1, "Total candidates must be at least 1"),
  duration: z.enum(["DAILY", "MONTHLY"], {
    errorMap: () => ({ message: "Please select a valid duration" }),
  }),
  minPriceRange: z.number().min(0, "Minimum price must be 0 or greater"),
  maxPriceRange: z.number().min(0, "Maximum price must be 0 or greater"),
});

type JobPostForm = z.infer<typeof jobPostSchema>;

export default function CreateJobPost() {
  const [createNewJobPost, { isLoading }] = useCreateNewJobPostMutation();

  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JobPostForm>({
    resolver: zodResolver(jobPostSchema),
    defaultValues: {
      jobRole: "CRNA",
      about: "",
      qualification: "",
      experience: "",
      date: undefined,
      startTime: "",
      endTime: "",
      totalCandidate: 1,
      duration: "DAILY",
      minPriceRange: 0,
      maxPriceRange: 0,
    },
  });

  const convertToUTC = (timeString: string): string => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    const utcHours = date.getUTCHours();
    const utcMinutes = date.getUTCMinutes();

    return `${utcHours.toString().padStart(2, "0")}:${utcMinutes
      .toString()
      .padStart(2, "0")}`;
  };

  const formatDateToISO = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}T00:00:00.000Z`;
  };

  const onSubmit = async (data: JobPostForm) => {
    const formattedData = {
      ...data,
      date: [formatDateToISO(data.date)],
      startTime: convertToUTC(data.startTime),
      endTime: convertToUTC(data.endTime),
    };

    console.log("Formatted Data:", formattedData);
    try {
      const res = await createNewJobPost(formattedData).unwrap();

      console.log("Create job post response:", res);
      if (res.success) {
        reset();
        router.push("/facility");
        toast.success(res.message || "Job post created successfully!");
      } else {
        toast.error(res.message || "Failed to create job post");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }

    console.log("Job post data:", formattedData);
  };

  const handleCancel = () => {
    reset();
    router.push("/facility");
    message.info("Form cleared");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "24px",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <Card>
          <Title level={2} style={{ marginBottom: "24px" }}>
            Create Job Post
          </Title>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                  }}
                >
                  Job Role
                </label>
                <Controller
                  name="jobRole"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Select job role"
                      style={{ width: "100%" }}
                      status={errors.jobRole ? "error" : ""}
                    >
                      <Option value="CRNA">CRNA</Option>
                      <Option value="AA">AA</Option>
                      <Option value="MD_DO">MD/DO</Option>
                    </Select>
                  )}
                />
                {errors.jobRole && (
                  <div
                    style={{
                      color: "#ff4d4f",
                      fontSize: "14px",
                      marginTop: "4px",
                    }}
                  >
                    {errors.jobRole.message}
                  </div>
                )}
              </div>

              {/* About */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                  }}
                >
                  About this role
                </label>
                <Controller
                  name="about"
                  control={control}
                  render={({ field }) => (
                    <TextArea
                      {...field}
                      placeholder="Enter About this role"
                      rows={4}
                      status={errors.about ? "error" : ""}
                    />
                  )}
                />
                {errors.about && (
                  <div style={{ color: "#ff4d4f" }}>{errors.about.message}</div>
                )}
              </div>

              {/* Qualifications */}
              <div>
                <label style={{ display: "block", marginBottom: "8px" }}>
                  Qualifications
                </label>
                <Controller
                  name="qualification"
                  control={control}
                  render={({ field }) => (
                    <TextArea
                      {...field}
                      placeholder="Qualifications"
                      rows={4}
                      status={errors.qualification ? "error" : ""}
                    />
                  )}
                />
                {errors.qualification && (
                  <div style={{ color: "#ff4d4f" }}>
                    {errors.qualification.message}
                  </div>
                )}
              </div>

              {/* Experience + Date */}
              <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
                {/* Experience */}
                <div>
                  <label style={{ display: "block", marginBottom: "8px" }}>
                    Require Experience
                  </label>
                  <Controller
                    name="experience"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        placeholder="Select experience requirement"
                        style={{ width: "100%" }}
                        status={errors.experience ? "error" : ""}
                      >
                        <Option value="ONE_TO_TWO_YEARS">1-2 Years</Option>
                        <Option value="TWO_TO_THREE_YEARS">2-3 Years</Option>
                        <Option value="THREE_TO_FOUR_YEARS">3-4 Years</Option>
                        <Option value="FOUR_TO_TEN_YEARS">4-10 Years</Option>
                      </Select>
                    )}
                  />
                  {errors.experience && (
                    <div style={{ color: "#ff4d4f" }}>
                      {errors.experience.message}
                    </div>
                  )}
                </div>

                {/* Date */}
                <div>
                  <label style={{ display: "block", marginBottom: "8px" }}>
                    Job Date
                  </label>
                  <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        style={{ width: "100%" }}
                        placeholder="Select job date"
                        onChange={(date) => {
                          field.onChange(date ? date.toDate() : undefined);
                        }}
                        status={errors.date ? "error" : ""}
                      />
                    )}
                  />
                  {errors.date && (
                    <div style={{ color: "#ff4d4f" }}>
                      {errors.date.message}
                    </div>
                  )}
                </div>
              </div>

              {/* Start/End Time */}
              <div style={{ display: "flex", gap: "16px" }}>
                <div style={{ flex: 1 }}>
                  <label>Start Time</label>
                  <Controller
                    name="startTime"
                    control={control}
                    render={({ field }) => (
                      <TimePicker
                        use12Hours
                        format="h:mm A"
                        placeholder="Select start time"
                        style={{ width: "100%" }}
                        onChange={(time) => {
                          // store as 24h string for backend logic
                          field.onChange(time ? time.format("HH:mm") : "");
                        }}
                        status={errors.startTime ? "error" : ""}
                      />
                    )}
                  />
                  {errors.startTime && (
                    <div style={{ color: "#ff4d4f" }}>
                      {errors.startTime.message}
                    </div>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <label>End Time</label>
                  <Controller
                    name="endTime"
                    control={control}
                    render={({ field }) => (
                      <TimePicker
                        use12Hours
                        format="h:mm A"
                        placeholder="Select end time"
                        style={{ width: "100%" }}
                        onChange={(time) => {
                          field.onChange(time ? time.format("HH:mm") : "");
                        }}
                        status={errors.endTime ? "error" : ""}
                      />
                    )}
                  />
                  {errors.endTime && (
                    <div style={{ color: "#ff4d4f" }}>
                      {errors.endTime.message}
                    </div>
                  )}
                </div>
              </div>

              {/* Total Candidates */}
              <div>
                <label>Total Candidates</label>
                <Controller
                  name="totalCandidate"
                  control={control}
                  render={({ field }) => (
                    <InputNumber
                      {...field}
                      min={1}
                      placeholder="Enter total candidates needed"
                      style={{ width: "100%" }}
                      status={errors.totalCandidate ? "error" : ""}
                    />
                  )}
                />
                {errors.totalCandidate && (
                  <div style={{ color: "#ff4d4f" }}>
                    {errors.totalCandidate.message}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "16px" }}>
                <div style={{ flex: 1 }}>
                  <label>Duration</label>
                  <Controller
                    name="duration"
                    control={control}
                    render={({ field }) => (
                      <Select
                        placeholder="Duration"
                        {...field}
                        style={{ width: "100%" }}
                        status={errors.duration ? "error" : ""}
                      >
                        <Option value="DAILY">Per-Hour</Option>
                        <Option value="MONTHLY">Monthly</Option>
                      </Select>
                    )}
                  />
                  {errors.duration && (
                    <div style={{ color: "#ff4d4f" }}>
                      {errors.duration.message}
                    </div>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <label>Min Price Range</label>
                  <Controller
                    name="minPriceRange"
                    control={control}
                    render={({ field }) => (
                      <InputNumber
                        {...field}
                        min={0}
                        placeholder="Min Price Range"
                        style={{ width: "100%" }}
                        formatter={(value) =>
                          `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) =>
                          value!.replace(/\$\s?|(,*)/g, "") as any
                        }
                        status={errors.minPriceRange ? "error" : ""}
                      />
                    )}
                  />
                  {errors.minPriceRange && (
                    <div style={{ color: "#ff4d4f" }}>
                      {errors.minPriceRange.message}
                    </div>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <label>Max Price Range</label>
                  <Controller
                    name="maxPriceRange"
                    control={control}
                    render={({ field }) => (
                      <InputNumber
                        {...field}
                        min={0}
                        placeholder="Enter Price Range"
                        style={{ width: "100%" }}
                        formatter={(value) =>
                          `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) =>
                          value!.replace(/\$\s?|(,*)/g, "") as any
                        }
                        status={errors.maxPriceRange ? "error" : ""}
                      />
                    )}
                  />
                  {errors.maxPriceRange && (
                    <div style={{ color: "#ff4d4f" }}>
                      {errors.maxPriceRange.message}
                    </div>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                  paddingTop: "16px",
                }}
              >
                <Button onClick={handleCancel}>Cancel</Button>
                <Button loading={isLoading} type="primary" htmlType="submit">
                  Create Post
                </Button>
              </div>
            </Space>
          </form>
        </Card>
      </div>
    </div>
  );
}
