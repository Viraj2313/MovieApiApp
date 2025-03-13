import React, { useEffect, useState } from "react";
import LoadingPage from "./LoadingPage";
import { useUser } from "@/context/UserContext";
import axios from "axios";
import { toast } from "react-toastify";

const Comments = ({ movieId }) => {
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const { userId, setUserId } = useUser();
  const [commentInput, setCommentInput] = useState("");
  const [replyInputs, setReplyInputs] = useState({});
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/api/movies/${movieId}/get-comments`);
        if (response.status === 200) {
          setComments(response.data);
          setLoading(false);
          console.log(response.data);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchComments();
  }, [movieId, refresh]);

  const handleAddComment = async (parentCommentId = null) => {
    try {
      if (!userId) {
        toast.error("You need to login first");
        return;
      }

      const text = parentCommentId
        ? replyInputs[parentCommentId]
        : commentInput;

      // Check if the appropriate text field is empty
      if (!text || text.trim() === "") {
        toast.info("Comment cannot be empty");
        return;
      }

      const response = await axios.post(
        `/api/movies/${userId}/${movieId}/${text}/${parentCommentId || ""}`
      );
      if (response.status === 200) {
        setCommentInput("");

        // If this is a reply, completely remove the input field by removing that key from replyInputs
        // This will hide the input field but keep the Reply button visible
        if (parentCommentId) {
          const newReplyInputs = { ...replyInputs };
          delete newReplyInputs[parentCommentId]; // Remove the key entirely
          setReplyInputs(newReplyInputs);
        }

        toast.success("Comment added successfully");
        setRefresh(!refresh);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.delete(
        `/api/movies/${userId}/${movieId}/${commentId}`
      );
      if (response.status === 200) {
        toast.success("Comment deleted successfully");
        setRefresh(!refresh);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete comment");
    }
  };

  // Toggle reply input visibility
  const toggleReplyInput = (commentId) => {
    setReplyInputs((prev) => {
      const newReplyInputs = { ...prev };

      // If the reply input is already showing for this comment, hide it
      if (commentId in newReplyInputs) {
        delete newReplyInputs[commentId];
      } else {
        // Otherwise, show it and initialize with empty string
        newReplyInputs[commentId] = "";
      }

      return newReplyInputs;
    });
  };

  return (
    <div className="w-full mx-auto bg-white shadow-lg rounded-lg p-6">
      {/* Comment Input Box */}
      <div className="flex items-center gap-1 p-3 rounded-lg shadow-sm">
        <input
          type="text"
          placeholder="Write a comment..."
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg py-2 px-2"
        />
        <button
          onClick={() => handleAddComment()}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Add
        </button>
      </div>

      {/* Comments List */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Comments</h2>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <LoadingPage />
          </div>
        ) : comments.length === 0 ? (
          <p>No comments yet</p>
        ) : (
          <ul>
            {comments.map((comment) => (
              <li
                key={comment.id}
                className="p-4 border rounded-lg mt-2 flex justify-between items-start"
              >
                <div>
                  <p className="font-semibold">{comment.commentorName}</p>
                  <p>{comment.commentText}</p>
                  <button
                    onClick={() => toggleReplyInput(comment.id)}
                    className="text-blue-500 underline mt-2 hover:cursor-pointer"
                  >
                    {comment.id in replyInputs ? "Cancel" : "Reply"}
                  </button>

                  {/* Reply Input */}
                  {comment.id in replyInputs && (
                    <div className="ml-6 mt-2">
                      <input
                        type="text"
                        placeholder="Write a reply..."
                        value={replyInputs[comment.id]}
                        onChange={(e) =>
                          setReplyInputs({
                            ...replyInputs,
                            [comment.id]: e.target.value,
                          })
                        }
                        className="border border-gray-300 rounded-lg py-2 px-2 w-full"
                      />
                      <button
                        onClick={() => handleAddComment(comment.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded-lg mt-2 hover:cursor-pointer"
                      >
                        Reply
                      </button>
                    </div>
                  )}

                  {/* Render Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <ul className="ml-6 mt-3 border-l pl-3">
                      {comment.replies.map((reply) => (
                        <li key={reply.id} className="p-2">
                          <p className="font-semibold">{reply.commentorName}</p>
                          <p>{reply.commentText}</p>
                          {/* delete button */}
                          {reply.commentorId === parseInt(userId) && (
                            <button
                              onClick={() => handleDeleteComment(reply.id)}
                              className="text-red-500 text-sm mt-1"
                            >
                              Delete
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Show delete button only for the user's own comments */}
                {comment.commentorId === parseInt(userId) && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-lg"
                  >
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Comments;
