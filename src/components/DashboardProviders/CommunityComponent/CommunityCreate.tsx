"use client";
import { useState } from "react";
import { Button, Modal, Upload, Spin } from "antd";
import TextArea from "antd/es/input/TextArea";
import type { UploadFile, RcFile } from "antd/es/upload/interface";
import { Plus, Camera } from "lucide-react";
import Image from "next/image";
import { useGetProviderProfileQuery } from "@/redux/features/(Providers)/profileProvider/profileProviderApi";
import { useCreatePostMutation } from "@/redux/features/(Providers)/communityProvider/communityProviderApi";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

function CommunityCreate() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isLoading, setIsLoading] = useState(false); // ✅ Loader state

  const { data: userData } = useGetProviderProfileQuery({});
  const [createPost] = useCreatePostMutation();

  const { handleSubmit, control, reset, watch } = useForm<{ content: string }>({
    defaultValues: { content: "" },
  });

  const content = watch("content");

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setFileList([]);
    reset();
  };

  const handleModalPost = async (formData: { content: string }) => {
    if (!formData.content && fileList.length === 0) return;

    setIsLoading(true); // ✅ Start loader

    const formDataToSend = new FormData();
    formDataToSend.append(
      "bodyData",
      JSON.stringify({ content: formData.content })
    );

    fileList.forEach((file) => {
      const originFile = file.originFileObj as RcFile;
      if (!originFile) return;

      if (file.type?.startsWith("image"))
        formDataToSend.append("imageUrl", originFile);
      else if (file.type?.startsWith("video"))
        formDataToSend.append("videoUrl", originFile);
    });

    try {
      const response = await createPost(formDataToSend).unwrap();
      toast.success("Post created successfully");
      handleModalCancel();
    } catch (err) {
      console.error("Error creating post:", err);
      toast.error("Failed to create post");
    } finally {
      setIsLoading(false); // ✅ Stop loader
    }
  };

  const handleUploadChange = ({ fileList }: { fileList: UploadFile[] }) =>
    setFileList(fileList);

  const isPostEmpty = !content && fileList.length === 0;

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 whitespace-nowrap bg-white border border-gray-300 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <Plus className="w-4 h-4" />
        <span>Create post</span>
      </button>

      {/* Modal */}
      <Modal
        open={isModalOpen}
        onCancel={handleModalCancel}
        footer={null}
        width={600}
        centered
        className="create-post-modal"
      >
        <div className="space-y-4">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-6">
            <Image
              width={1000}
              height={1000}
              src={
                userData?.result?.providerProfile?.profileImage ||
                "/default-avatar.png"
              }
              alt="User avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-medium text-gray-900">
                {userData?.result?.fullName || "Anonymous"}
              </h3>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(handleModalPost)}>
            <div className="mb-5">
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    placeholder="What’s on your mind?"
                    rows={6}
                    className="resize-none focus:ring-0"
                    style={{
                      fontSize: "14px",
                      boxShadow: "none",
                      padding: "12px",
                      borderColor: "#d1d5db",
                      borderRadius: "6px",
                    }}
                  />
                )}
              />
            </div>

            {/* Upload Section */}
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              accept="image/*,video/*"
              beforeUpload={() => false}
              multiple
            >
              {fileList.length >= 5 ? null : (
                <div className="w-20 h-20 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-gray-100 rounded">
                  <Camera className="w-5 h-5 text-gray-500" />
                  <span className="text-xs text-gray-400">Add</span>
                </div>
              )}
            </Upload>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-5">
              <Button
                onClick={handleModalCancel}
                style={{ padding: "10px 20px" }}
                className="text-sm"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                disabled={isPostEmpty || isLoading} // ✅ disable when loading
                style={{
                  backgroundColor: "#14b8a6",
                  borderColor: "#14b8a6",
                  padding: "10px 24px",
                }}
                className="text-sm font-medium flex items-center justify-center gap-2"
              >
                {isLoading && <Spin size="small" />}
                Post
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}

export default CommunityCreate;
