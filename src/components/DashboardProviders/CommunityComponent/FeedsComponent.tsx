"use client";
import EmojiPicker from "emoji-picker-react";
import { Heart, MessageCircle, Send, Smile } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";

import Spinner from "@/components/common/Spinner";
import {
  useGetAllPostsQuery,
  usePostCommentMutation,
  usePostLikeMutation,
} from "@/redux/features/(Providers)/communityProvider/communityProviderApi";
import { getSafeImageUrl } from "@/utils/getSafeImageUrl";
import { toast } from "sonner";

function FeedsComponent({ searchTerm }: { searchTerm: string }) {
  const { data, isLoading, isError, refetch } = useGetAllPostsQuery(
    { search: searchTerm },
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: false,
      refetchOnReconnect: false,
    },
  );
  const [comment] = usePostCommentMutation();
  const [like] = usePostLikeMutation();

  const [replyInputs, setReplyInputs] = useState<{ [key: string]: string }>({});
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>(
    {},
  );
  const [openComments, setOpenComments] = useState<{ [key: string]: boolean }>(
    {},
  );

  // NEW: Emoji picker states
  const [emojiPickerForComment, setEmojiPickerForComment] = useState<{
    [key: string]: boolean;
  }>({});
  const [emojiPickerForReply, setEmojiPickerForReply] = useState<{
    [key: string]: boolean;
  }>({});

  const posts = data?.result || [];

  const toggleComments = (postId: string) => {
    setOpenComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleAddComment = useCallback(
    async (postId: string) => {
      const content = commentInputs[postId]?.trim();
      if (!content) return;

      try {
        await comment({ content, postId, parentCommentId: null }).unwrap();
        setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
        setEmojiPickerForComment((prev) => ({ ...prev, [postId]: false }));

        refetch();
      } catch (err) {
        console.error("Failed to add comment:", err);
        toast.error("Failed to add comment");
      }
    },
    [comment, commentInputs, refetch],
  );

  const handleAddReply = useCallback(
    async (postId: string, commentId: string) => {
      const key = `${postId}-${commentId}`;
      const content = replyInputs[key]?.trim();
      if (!content) return;

      try {
        await comment({
          content,
          postId,
          parentCommentId: commentId,
        }).unwrap();
        refetch();
        setReplyInputs((prev) => ({ ...prev, [key]: "" }));
        setEmojiPickerForReply((prev) => ({ ...prev, [key]: false }));
      } catch (err) {
        console.error("Failed to add reply:", err);
        toast.error("Failed to add reply");
      }
    },
    [comment, replyInputs, refetch],
  );

  const handleLike = useCallback(
    async (postId: string) => {
      try {
        await like({ postId }).unwrap();
        setTimeout(refetch, 10);
      } catch (err) {
        console.error("Failed to like post:", err);
      }
    },
    [like, refetch],
  );

  /** ----------------------------
   *   Render Replies (memoized)
   *  ---------------------------- */

  const renderReplies = useCallback(
    (replies: any[], postId: string, parentCommentId: string) => {
      if (!replies || replies.length === 0) return null;

      return (
        <div className="mt-2 ml-6 space-y-2">
          {replies.map((reply: any) => (
            <div key={reply?.id} className="flex gap-2">
              <Image
                width={24}
                height={24}
                src={getSafeImageUrl(reply?.user?.profileImage)}
                alt={reply?.user?.fullName || "User"}
                className="w-6 h-6 rounded-full"
              />
              <div className="bg-gray-50 rounded-lg px-3 py-1">
                <div className="flex gap-2 mb-1">
                  <span className="font-medium text-xs">
                    {reply?.user?.fullName || "Anonymous"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(reply?.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs">{reply?.content}</p>
              </div>
            </div>
          ))}
        </div>
      );
    },
    [],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center mx-auto min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return <p className="p-4 text-red-500">Failed to load posts.</p>;
  }

  return (
    <main className="flex-1 p-4 py-4 sm:py-6 space-y-5">
      {posts.map((post: any) => (
        <div key={post?.id} className="bg-white rounded-lg border p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Image
                width={40}
                height={40}
                src={getSafeImageUrl(post?.user?.profileImage)}
                alt="avatar"
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                  {post?.user?.fullName || "Anonymous"}
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm">
                  {new Date(post?.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          {post.content && <p className="mb-4">{post.content}</p>}

          {/* Image */}
          {post.imageUrl && (
            <div className="mb-4">
              <Image
                width={600}
                height={400}
                src={post.imageUrl}
                alt="post"
                className="w-full rounded-lg object-contain"
              />
            </div>
          )}

          {/* Video */}
          {post.videoUrl && (
            <div className="mb-4">
              <video controls className="w-full rounded-lg max-h-[500px]">
                <source src={post.videoUrl} type="video/mp4" />
              </video>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => handleLike(post?.id)}
              className="flex items-center gap-1 text-gray-500 hover:text-red-500 cursor-pointer"
            >
              <Heart className="w-4 h-4" />
              <span>{post?.likes?.length || 0}</span>
            </button>

            <button
              onClick={() => toggleComments(post?.id)}
              className="flex items-center gap-1 text-gray-500 hover:text-blue-500 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{post?.comments?.length || 0}</span>
            </button>
          </div>

          {/* Comments Section */}
          {openComments[post?.id] && (
            <div className="border-t pt-4 space-y-4">
              {/* Existing comments */}
              {post?.comments?.map((comment: any) => {
                const replyKey = `${post?.id}-${comment?.id}`;

                return (
                  <div key={comment?.id} className="ml-2 space-y-2">
                    <div className="flex gap-3">
                      <Image
                        width={32}
                        height={32}
                        src={getSafeImageUrl(comment?.user?.profileImage)}
                        alt="user"
                        className="w-8 h-8 rounded-full"
                      />

                      <div className="flex-1">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex gap-2 mb-1">
                            <span className="font-medium text-sm">
                              {comment?.user?.fullName || "Anonymous"}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(comment?.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm">{comment?.content}</p>
                        </div>

                        {/* Replies */}
                        {comment?.replies &&
                          renderReplies(
                            comment?.replies,
                            post?.id,
                            comment?.id,
                          )}

                        {/* Reply Input + Emoji */}
                        <div className="relative flex items-center gap-2 mt-2 ml-8">
                          <input
                            type="text"
                            placeholder="Write a reply..."
                            value={replyInputs[replyKey] || ""}
                            onChange={(e) =>
                              setReplyInputs({
                                ...replyInputs,
                                [replyKey]: e.target.value,
                              })
                            }
                            className="flex-1 border rounded-lg px-3 py-1 text-sm"
                          />

                          {/* Emoji button */}
                          <button
                            onClick={() =>
                              setEmojiPickerForReply((prev) => ({
                                ...prev,
                                [replyKey]: !prev[replyKey],
                              }))
                            }
                            className="text-gray-500 cursor-pointer"
                          >
                            <Smile className="w-5 h-5" />
                          </button>

                          {/* Emoji Picker */}
                          {emojiPickerForReply[replyKey] && (
                            <div className="absolute bottom-10 right-0 z-50">
                              <EmojiPicker
                                onEmojiClick={(emoji) =>
                                  setReplyInputs((prev) => ({
                                    ...prev,
                                    [replyKey]:
                                      (prev[replyKey] || "") + emoji.emoji,
                                  }))
                                }
                              />
                            </div>
                          )}

                          <button
                            onClick={() =>
                              handleAddReply(post?.id, comment?.id)
                            }
                            className="text-blue-500 cursor-pointer"
                          >
                            <Send className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Add New Comment + Emoji */}
              <div className="relative flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={commentInputs[post?.id] || ""}
                  onChange={(e) =>
                    setCommentInputs({
                      ...commentInputs,
                      [post?.id]: e.target.value,
                    })
                  }
                  className="flex-1 border rounded-lg px-3 py-2 text-sm"
                />

                {/* Emoji button */}
                <button
                  onClick={() =>
                    setEmojiPickerForComment((prev) => ({
                      ...prev,
                      [post?.id]: !prev[post?.id],
                    }))
                  }
                  className="text-gray-500 cursor-pointer"
                >
                  <Smile className="w-6 h-6" />
                </button>

                {/* Emoji Picker */}
                {emojiPickerForComment[post?.id] && (
                  <div className="absolute bottom-12 right-0 z-50">
                    <EmojiPicker
                      onEmojiClick={(emoji) =>
                        setCommentInputs((prev) => ({
                          ...prev,
                          [post?.id]: (prev[post?.id] || "") + emoji.emoji,
                        }))
                      }
                    />
                  </div>
                )}

                <button
                  onClick={() => handleAddComment(post?.id)}
                  className="text-blue-500 cursor-pointer"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </main>
  );
}

export default FeedsComponent;
