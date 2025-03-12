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
  const handleAddComment = async () => {
    try {
      if (!userId) {
        toast.error("You need to login first");
        return;
      }
      if (commentInput === "") {
        toast.info("Comment cannot be empty");
        return;
      }
      const response = await axios.post(
        `/api/movies/${userId}/${movieId}/${commentInput}`
      );
      if (response.status === 200) {
        setCommentInput("");
        toast.success("Comment added successfully");
        setRefresh(!refresh);
      }
    } catch (error) {
      console.log(error);
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
  return (
    <div className="w-full mx-auto bg-white shadow-lg rounded-lg p-6">
      {/* Comment Input Box */}
      <div className="flex items-center gap-1 p-3 rounded-lg shadow-sm">
        <input
          type="text"
          placeholder="Write a comment..."
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          className="flex-1 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 rounded-lg py-2 px-2 text-lg outline-none transition-all duration-200"
        />
        <button
          onClick={handleAddComment}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition-all duration-200 hover:cursor-pointer"
        >
          Add
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <LoadingPage />
        </div>
      ) : (
        <div className="mt-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Comments</h2>

          <div className="space-y-2">
            {comments.length > 0 ? (
              <ul className="divide-y divide-gray-300">
                {comments.map((comment) => (
                  <li
                    key={comment.id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200 transition-all duration-200 hover:bg-gray-100 shadow-sm flex justify-between items-start mt-2"
                  >
                    <div>
                      <p className="text-2xl font-semibold text-blue-600">
                        {comment.commentorName}
                      </p>
                      <p className="text-xl text-gray-700">
                        {comment.commentText}
                      </p>
                    </div>

                    {/* Show delete button only for the user's own comments */}
                    {comment.commentorId === parseInt(userId) && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-lg shadow transition-all duration-200 hover:cursor-pointer"
                      >
                        Delete
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center italic">
                No comments yet
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default Comments;
