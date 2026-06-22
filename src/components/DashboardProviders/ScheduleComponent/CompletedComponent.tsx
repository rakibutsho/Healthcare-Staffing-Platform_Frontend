import Spinner from "@/components/common/Spinner";
import { useSubmitReviewMutation } from "@/redux/features/(Facility)/profileFacility/jobManagementFacilityApi";
import { useGetCompletedJobsByProviderQuery } from "@/redux/features/(Providers)/scheduleProvider/scheduleProviderApi";
import { Button, Empty, Form, Input, Modal, Rate } from "antd";
import { useState } from "react";
import { toast } from "sonner";
import ScheduleCardItem from "./ScheduleCardItem";

export default function CompletedComponent() {
  const [reviewModal, setReviewModal] = useState<string | boolean | null>(
    false,
  );
  const [rating, setRating] = useState<number>(5);
  const [form] = Form.useForm();

  const {
    data: completeJobData,
    isLoading,
    isError,
    refetch,
  } = useGetCompletedJobsByProviderQuery({
    page: 1,
    limit: 10,
  });

  const [createReview, { isLoading: reviewLoading }] =
    useSubmitReviewMutation();

  const handleFinish = async (values: any) => {
    if (!reviewModal) return;

    try {
      const job = completeJobData?.result?.data.find(
        (j: any) => j?.jobPost?.id === reviewModal,
      );

      if (!job) {
        toast.error("Job not found for review.");
        return;
      }

      const body = {
        receiverId: job?.jobPost?.user?.id,
        jobPostId: job?.jobPost?.id,
        rating: rating,
        comment: values?.review,
      };

      await createReview(body).unwrap();

      toast.success("Review submitted successfully!");
      setReviewModal(null);
      form.resetFields();
      setRating(5);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to submit review.");
    }
  };

  return (
    <div className="space-y-6 pt-3">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        <span>📅</span> Completed Jobs
      </h2>

      {isLoading ? (
        <div className="flex mx-auto justify-center items-center">
          <Spinner />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center">
          <p className="text-red-500 mb-2">Failed to load completed jobs.</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.isArray(completeJobData?.result?.data) &&
          completeJobData!.result!.data.length > 0 ? (
            completeJobData!.result!.data.map((item: any) => {
              const jobPost = item?.jobPost;
              if (!jobPost) return null;

              const schedule = Array.isArray(jobPost.schedule)
                ? jobPost.schedule[0]
                : undefined;

              return (
                <ScheduleCardItem
                  key={jobPost.id}
                  item={{
                    id: jobPost.id,
                    date: schedule
                      ? new Date(schedule.date).toDateString()
                      : "N/A",
                    title: jobPost.qualification || "",
                    status: "Completed",
                    company: jobPost.user?.facilityProfile?.facilityName || "",
                    location:
                      jobPost.user?.facilityProfile?.address?.fullAddress || "",
                    price: `${jobPost.minPriceRange || ""} - ${jobPost.maxPriceRange || ""}`,
                    time: schedule
                      ? `${new Date(schedule.startTime).toLocaleTimeString()} - ${new Date(schedule.endTime).toLocaleTimeString()}`
                      : "",
                    duration: "N/A",
                    cert: jobPost.jobRole,
                  }}
                  statue="Completed"
                  openModal={() => {
                    setReviewModal(jobPost.id);
                    setRating(5);
                    form.setFieldsValue({ rating: 5, review: "" });
                  }}
                />
              );
            })
          ) : (
            <div className="col-span-full">
              <Empty description="No completed jobs found." />
            </div>
          )}
        </div>
      )}

      {/* Review Modal */}
      <Modal
        title="Submit Your Review"
        open={!!reviewModal}
        onCancel={() => {
          setReviewModal(null);
          form.resetFields();
          setRating(0);
        }}
        footer={null}
        centered
        width={500}
      >
        <div className="pt-5">
          <Form form={form} layout="vertical" onFinish={handleFinish}>
            <Form.Item
              name="rating"
              label="Rating"
              rules={[{ required: true, message: "Please select a rating!" }]}
            >
              <Rate
                value={rating}
                onChange={(value) => setRating(value)}
                allowClear
                count={5}
              />
            </Form.Item>

            <Form.Item
              name="review"
              label="Your Review"
              rules={[
                { required: true, message: "Please write your review!" },
                { max: 200, message: "Review cannot exceed 200 characters" },
              ]}
            >
              <Input.TextArea rows={4} placeholder="Write something..." />
            </Form.Item>

            <div className="flex justify-end gap-2">
              <Button
                onClick={() => {
                  setReviewModal(null);
                  form.resetFields();
                  setRating(0);
                }}
                className="h-12"
                size="large"
                danger
              >
                Cancel
              </Button>

              <Button
                type="primary"
                htmlType="submit"
                className="h-12"
                size="large"
                color="cyan"
                variant="solid"
                loading={reviewLoading}
                disabled={reviewLoading}
              >
                Review Now
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
}
