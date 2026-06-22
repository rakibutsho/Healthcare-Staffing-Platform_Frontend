"use client";
import Spinner from "@/components/common/Spinner";
import {
  useDeletePostMutation,
  useGetUserPostsQuery,
  usePostCommentMutation,
  usePostLikeMutation,
  useUpdateMyPostMutation,
} from "@/redux/features/(Providers)/communityProvider/communityProviderApi";
import { getSafeImageUrl } from "@/utils/getSafeImageUrl";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Space, Upload } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { Edit, Heart, MessageCircle, Send, Trash, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const { TextArea } = Input;

interface Comment {
  id: string;
  author: string;
  avatar: string;
  time: string;
  content: string;
  replies?: Comment[];
}

interface Post {
  id: string;
  author: string;
  avatar: string;
  time: string;
  content: string;
  images?: string[];
  likes: number;
  comments: number;
  hasReply?: boolean;
  commentsList?: Comment[];
  showComments?: boolean;
  videoUrl?: string;
}

function MyPostComponent() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [replyInputs, setReplyInputs] = useState<{ [key: string]: string }>({});
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>(
    {},
  );

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [content, setContent] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Delete confirmation modal state
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    open: boolean;
    postId: string | null;
  }>({
    open: false,
    postId: null,
  });

  const { data, isLoading, isError, refetch } = useGetUserPostsQuery(undefined);
  const [comment, { isLoading: isCommenting }] = usePostCommentMutation();
  const [like, { isLoading: isLiking }] = usePostLikeMutation();
  const [updatePost, { isLoading: isUpdating }] = useUpdateMyPostMutation();
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();

  // Load API data into posts
  useEffect(() => {
    if (data?.result) {
      const formattedPosts: Post[] = data.result.map((p: any) => ({
        id: p.id,
        author: p.user?.fullName || "Anonymous",
        avatar: getSafeImageUrl(p.user?.profileImage),
        time: new Date(p.createdAt).toLocaleString(),
        content: p.content || "",
        images: p.imageUrl ? [p.imageUrl] : undefined,
        videoUrl: p.videoUrl || undefined,
        likes: p.likes?.length || 0,
        comments: p.comments?.length || 0,
        showComments: false,
        commentsList:
          p.comments?.map((c: any) => ({
            id: c.id,
            author: c.user?.fullName || "Anonymous",
            avatar: getSafeImageUrl(c.user?.profileImage),
            time: new Date(c.createdAt).toLocaleString(),
            content: c.content,
            replies:
              c.replies?.map((r: any) => ({
                id: r.id,
                author: r.user?.fullName || "Anonymous",
                avatar: getSafeImageUrl(r.user?.profileImage),
                time: new Date(r.createdAt).toLocaleString(),
                content: r.content,
              })) || [],
          })) || [],
      }));
      setPosts(formattedPosts);
    }
  }, [data]);

  // Spinner
  if (isLoading) {
    return (
      <div className="flex mx-auto items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Failed to load posts.</p>
      </div>
    );
  }

  // Toggle comments
  const toggleComments = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post?.id === postId
          ? { ...post, showComments: !post?.showComments }
          : post,
      ),
    );
  };

  // Add comment
  const handleAddComment = async (postId: string) => {
    const content = commentInputs[postId]?.trim();
    if (!content) return;

    try {
      await comment({ content, postId, parentCommentId: null }).unwrap();
      toast.success("Comment added!");
      setCommentInputs({ ...commentInputs, [postId]: "" });
      refetch();
    } catch (err) {
      console.error("Failed to add comment:", err);
      toast.error("Failed to add comment");
    }
  };

  // Add reply
  const handleAddReply = async (postId: string, commentId: string) => {
    const key = `${postId}-${commentId}`;
    const content = replyInputs[key]?.trim();
    if (!content) return;

    try {
      await comment({ content, postId, parentCommentId: commentId }).unwrap();
      toast.success("Reply added!");
      setReplyInputs({ ...replyInputs, [key]: "" });
      refetch();
    } catch (err) {
      console.error("Failed to add reply:", err);
      toast.error("Failed to add reply");
    }
  };

  // Like
  const handleLike = async (postId: string) => {
    if (isLiking) return;
    try {
      await like({ postId }).unwrap();
      toast.success("Post liked!");
      refetch();
    } catch (err) {
      console.error("Failed to like post:", err);
      toast.error("Failed to like post");
    }
  };

  // Open edit modal
  const openEditModal = (post: Post) => {
    setEditingPost(post);
    setContent(post.content);
    setFileList([]);
    setIsModalOpen(true);
  };

  // Save updated post
  const handleSave = async () => {
    if (!editingPost || isUpdating) return;

    const formData = new FormData();
    formData.append("bodyData", JSON.stringify({ content }));

    fileList.forEach((file) => {
      if (file.originFileObj) {
        if (file.type?.startsWith("image")) {
          formData.append("imageUrl", file.originFileObj);
        } else if (file.type?.startsWith("video")) {
          formData.append("videoUrl", file.originFileObj);
        }
      }
    });

    try {
      await updatePost({ postId: editingPost.id, formData }).unwrap();
      toast.success("Post updated successfully");
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update post");
    }
  };

  // Delete post with local modal
  const handleDelete = (postId: string) => {
    setDeleteConfirmModal({ open: true, postId });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmModal.postId) return;

    try {
      await deletePost(deleteConfirmModal.postId).unwrap();
      toast.success("Post deleted successfully");
      setDeleteConfirmModal({ open: false, postId: null });
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete post");
      setDeleteConfirmModal({ open: false, postId: null });
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmModal({ open: false, postId: null });
  };

  return (
    <main className="flex-1 p-4 py-4 sm:py-6 lg:ml-0 space-y-5">
      {posts.map((post) => (
        <div
          key={post?.id}
          className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Image
                width={40}
                height={40}
                src={post?.avatar}
                alt={`${post?.author} avatar`}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-3 object-cover"
              />
              <div>
                <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                  {post?.author}
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm">{post?.time}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Edit
                className="w-5 h-5 text-blue-500 cursor-pointer hover:text-blue-700 transition"
                onClick={() => openEditModal(post)}
              />
              <Trash
                className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700 transition"
                onClick={() => handleDelete(post?.id)}
              />
              {/* <MoreHorizontal className="w-5 h-5 text-gray-400" /> */}
            </div>
          </div>

          {/* Content */}
          {post.content && (
            <p className="text-gray-800 text-sm sm:text-base mb-4 whitespace-pre-wrap">
              {post.content}
            </p>
          )}

          {/* Images */}
          {post.images && (
            <div className="grid grid-cols-4 gap-1 mb-4">
              {post.images.map((img, idx) => (
                <div
                  key={idx}
                  className="aspect-[4/3] flex mx-auto rounded overflow-hidden"
                >
                  <Image
                    width={300}
                    height={225}
                    src={img}
                    alt={`img-${idx}`}
                    className="object-contain w-full rounded-lg max-h-[500px]"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Video */}
          {post.videoUrl && (
            <div className="mb-4 rounded-lg overflow-hidden">
              <video
                controls
                className="w-full max-h-96 bg-black"
                poster={post.images?.[0]}
              >
                <source src={post.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => handleLike(post.id)}
              disabled={isLiking}
              className="flex items-center gap-1 text-gray-500 hover:text-red-500 disabled:opacity-50"
            >
              <Heart className="w-4 h-4" /> <span>{post.likes}</span>
            </button>
            <button
              onClick={() => toggleComments(post.id)}
              className="flex items-center gap-1 text-gray-500 hover:text-blue-500"
            >
              <MessageCircle className="w-4 h-4" />{" "}
              <span>{post?.comments}</span>
            </button>
          </div>

          {/* Comments */}
          {post.showComments && (
            <div className="border-t border-gray-200 pt-4 space-y-4">
              {/* Add Comment */}
              <div className="flex items-center gap-3">
                <Image
                  width={40}
                  height={40}
                  src="/default-avatar.png"
                  alt="your avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <input
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-full outline-none focus:border-blue-500"
                  placeholder="Write a comment..."
                  value={commentInputs[post?.id] || ""}
                  onChange={(e) =>
                    setCommentInputs({
                      ...commentInputs,
                      [post?.id]: e.target.value,
                    })
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleAddComment(post?.id)
                  }
                  disabled={isCommenting}
                />
                <Send
                  className={`w-4 h-4 cursor-pointer ${
                    isCommenting
                      ? "text-gray-400"
                      : "text-blue-600 hover:text-blue-800"
                  }`}
                  onClick={() => !isCommenting && handleAddComment(post?.id)}
                />
              </div>

              {/* Comment List */}
              {post?.commentsList?.map((comment) => (
                <div key={comment?.id} className="space-y-2 ml-2">
                  <div className="flex gap-3">
                    <Image
                      width={40}
                      height={40}
                      src={comment?.avatar}
                      alt={comment?.author || "Comment author avatar"}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <div className="bg-gray-50 rounded-lg px-3 py-2">
                        <div className="flex gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {comment?.author}
                          </span>
                          <span className="text-xs text-gray-500">
                            {comment?.time}
                          </span>
                        </div>
                        <p className="text-sm">{comment?.content}</p>
                      </div>
                      <button
                        className="text-xs text-gray-500 hover:text-blue-600 ml-2 mt-1"
                        onClick={() => {
                          const key = `${post?.id}-${comment?.id}`;
                          setReplyInputs({
                            ...replyInputs,
                            [key]: replyInputs[key] ? "" : "Reply...",
                          });
                        }}
                      >
                        Reply
                      </button>
                    </div>
                  </div>

                  {/* Replies */}
                  {comment?.replies?.map((reply) => (
                    <div key={reply?.id} className="flex gap-3 ml-11 mt-2">
                      <Image
                        width={32}
                        height={32}
                        src={reply?.avatar}
                        alt={reply?.author || "Reply author avatar"}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <div className="bg-gray-50 rounded-lg px-3 py-2">
                        <div className="flex gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {reply?.author}
                          </span>
                          <span className="text-xs text-gray-500">
                            {reply?.time}
                          </span>
                        </div>
                        <p className="text-sm">{reply?.content}</p>
                      </div>
                    </div>
                  ))}

                  {/* Reply input */}
                  {replyInputs[`${post?.id}-${comment?.id}`] !== undefined && (
                    <div className="ml-11 flex items-center gap-2 mt-2">
                      <input
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-full outline-none focus:border-blue-500"
                        placeholder="Write a reply..."
                        value={replyInputs[`${post?.id}-${comment?.id}`] || ""}
                        onChange={(e) =>
                          setReplyInputs({
                            ...replyInputs,
                            [`${post.id}-${comment?.id}`]: e?.target?.value,
                          })
                        }
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          handleAddReply(post?.id, comment?.id)
                        }
                        disabled={isCommenting}
                      />
                      <Send
                        className={`w-4 h-4 cursor-pointer ${
                          isCommenting
                            ? "text-gray-400"
                            : "text-blue-600 hover:text-blue-800"
                        }`}
                        onClick={() =>
                          !isCommenting && handleAddReply(post?.id, comment?.id)
                        }
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Edit Modal */}
      <Modal
        title="Edit Your Post"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={
          <Space>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              onClick={handleSave}
              loading={isUpdating}
              disabled={isUpdating}
            >
              Save Changes
            </Button>
          </Space>
        }
        width={600}
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Post Content
          </label>
          <TextArea
            rows={4}
            value={content}
            onChange={(e) => setContent(e?.target?.value)}
            placeholder="What's on your mind?"
            maxLength={500}
            showCount
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload New Image or Video (optional)
          </label>
          <Upload
            beforeUpload={(file) => {
              setFileList((prev) => [
                ...prev,
                {
                  uid: file?.uid,
                  name: file?.name,
                  status: "done",
                  url: URL.createObjectURL(file),
                  type: file?.type,
                  originFileObj: file,
                },
              ]);
              return false;
            }}
            onRemove={(file) => {
              setFileList((prev) => prev.filter((f) => f?.uid !== file?.uid));
            }}
            fileList={fileList}
            accept="image/*,video/*"
            listType="picture"
          >
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </div>

        {/* Preview Section */}
        {fileList.length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded">
            <h4 className="text-sm font-medium mb-2">Preview:</h4>
            <div className="space-y-2">
              {fileList.map((file) => (
                <div key={file.uid} className="flex items-center gap-2">
                  {file.type?.startsWith("image") ? (
                    <Image
                      width={80}
                      height={60}
                      src={file?.url || ""}
                      alt="preview"
                      className="w-20 h-15 object-cover rounded"
                    />
                  ) : file?.type?.startsWith("video") ? (
                    <video
                      src={file?.url}
                      className="w-20 h-15 object-cover rounded bg-black"
                      controls={false}
                    />
                  ) : null}
                  <span className="text-xs">{file?.name}</span>
                  <Button
                    type="text"
                    size="small"
                    icon={<X className="w-4 h-4" />}
                    onClick={() =>
                      setFileList((prev) =>
                        prev.filter((f) => f?.uid !== file?.uid),
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Post"
        open={deleteConfirmModal.open}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
        okText="Yes, Delete"
        okType="danger"
        cancelText="Cancel"
        confirmLoading={isDeleting}
      >
        <p>
          Are you sure you want to delete this post? This action cannot be
          undone.
        </p>
      </Modal>
    </main>
  );
}

export default MyPostComponent;
