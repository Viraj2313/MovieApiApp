import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_URL } from "../config";
import { triggerNotification } from "../utils/NotificationUtil";
import { Link } from "react-router-dom";

const Friends = ({ user, userId, setUserId }) => {
  const [friends, setFriends] = useState([]);
  const [friendId, setFriendId] = useState("");
  const [friend, setFriend] = useState({});
  const [friendFound, setFriendFound] = useState(false);
  const [searching, setSearching] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);

  const getUserIdFromToken = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/get-user-id`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        console.log(response.data.userId);
        setUserId(response.data.userId);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getFriendsList();
    getFriendRequests();
    getUserIdFromToken();
  }, []);
  console.log(userId);
  const getFriendRequests = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/friends/get-friend-requests`,
        {
          params: {
            userId,
          },
        }
      );
      if (response.status === 200) {
        console.log(response.data);
        setFriendRequests(response.data);
      }
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const getFriendsList = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/friends/get-friends-list`,
        {
          params: { userId },
        }
      );
      if (response.status === 200) {
        console.log(response.data);
        setFriends(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAcceptReq = async (senderId) => {
    try {
      console.log(senderId);
      const response = await axios.post(
        `${API_URL}/api/friends/accept-request`,
        null,
        {
          params: {
            userId: userId,
            senderId: senderId,
          },
        }
      );
      setFriendFound(false);
      setFriendRequests([]);
      setFriend({});
      getFriendRequests();
      getFriendsList();
    } catch (error) {
      console.log(error.response.data);
      triggerNotification("Counldn't accept friend request");
    }
  };
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      if (!friendId) {
        triggerNotification("First enter student id", "error");
        return;
      }
      const response = await axios.get(`${API_URL}/api/friends/search`, {
        params: { friendId },
      });
      if (response.status === 200) {
        console.log(friend.id);
        triggerNotification("Friend found", "success");
        setFriendFound(true);
        setFriend(response.data);
      }
    } catch (error) {
      triggerNotification(`${error}`, "error");
    }
  };
  const handleSendFriendReq = async () => {
    try {
      console.log(userId, friend.id);
      const response = await axios.post(
        `${API_URL}/api/friends/send-request`,
        null,
        {
          params: {
            senderId: userId,
            receiverId: friend.id,
          },
        }
      );
      if (response.status === 200) {
        triggerNotification("Friend request Sent!", "success");
        setFriendFound(false);
        setFriend({});
      } else {
        triggerNotification("Failed to send friend request", "error");
      }
    } catch (error) {
      triggerNotification("Friend request not sent", "error");
      console.log(error.response.data);
    }
  };
  return (
    <>
      <div className="text-2xl font-bold mb-4">Your friends</div>
      {user ? (
        <div className="flex h-screen">
          <div className="flex-1 overflow-y-auto">
            <ul className="space-y-2">
              {friends.map((friend) => (
                <Link
                  to={`/chatHub?senderId=${userId}&receiverId=${friend.friendId}`}
                  key={friend.friendId}
                >
                  <li>
                    <div className="p-2 bg-gray-100 rounded shadow-md">
                      {friend.friendName}
                    </div>
                  </li>
                </Link>
              ))}
            </ul>
          </div>
          <div className="w-px bg-gray-700 mx-6"></div>
          <div className="flex-2">
            <div className="text-4xl font-bold mb-4">
              Search friend through their ID:
            </div>
            <form onSubmit={handleSearch} className="flex gap-4 mb-4">
              <input
                onChange={(e) => setFriendId(e.target.value)}
                type="text"
                value={friendId}
                placeholder="Enter your friend's ID"
                className="border-b h-10 focus:outline-none focus:border-blue-500 px-2 w-90%"
              />
              <button
                type="submit"
                className="!bg-blue-500 !text-white px-4 py-2 rounded hover:!bg-blue-600 !transition-all"
              >
                Search
              </button>
            </form>
            <div>
              {friendFound ? (
                <div className="flex flex-col text-xl bg-white border border-gray-300 rounded-md shadow-lg p-4 w-75">
                  <div className="mb-4">
                    <p className="font-semibold">Name: {friend.name}</p>
                    <p className="text-gray-500">ID: {friend.id}</p>
                  </div>
                  <button
                    onClick={handleSendFriendReq}
                    className=" !bg-green-500 !text-white px-4 py-2 !rounded hover:!bg-green-600 !transition-all !self-start"
                  >
                    Send Request
                  </button>
                </div>
              ) : (
                <p className="text-gray-500">
                  Type your friend's ID to add them as your friend.
                </p>
              )}
            </div>
          </div>
          <div className="w-px bg-gray-700 mx-6"></div>
          <div className="flex-1 text-3xl font-bold">
            Friend Requests
            <ul className="mt-4 space-y-2">
              {friendRequests.length > 0 ? (
                friendRequests.map((request) => (
                  <li
                    key={request.senderId}
                    className="p-2 bg-gray-100 rounded shadow-md"
                  >
                    <div className="flex justify-between items-center">
                      <span>{request.senderName}</span>
                      <span>{request.senderId}</span>{" "}
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-all"
                        onClick={() => handleAcceptReq(request.senderId)}
                      >
                        Accept
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No friend requests found</p>
              )}
            </ul>
          </div>
        </div>
      ) : (
        <div className="text-center text-xl text-red-500">
          Please login first
        </div>
      )}
    </>
  );
};

export default Friends;
