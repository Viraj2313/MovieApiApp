import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_URL } from "../config";
import { triggerNotification } from "../utils/NotificationUtil";

const Friends = ({ user, userId }) => {
  const [friends, setFriends] = useState([]);
  const [friendId, setFriendId] = useState("");
  const [friend, setFriend] = useState({});
  const [friendFound, setFriendFound] = useState(false);
  const [searching, setSearching] = useState(false);
  user = 1;
  const getFriendsList = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/friends/get_friends`, {
        params: { userId },
      });
      if (response.status === 200) {
        console.log(response.data);
        setFriends(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getFriendsList();
  }, []);

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
        triggerNotification("Friend found", "success");
        setFriendFound(true);
        setFriend(response.data);
      }
    } catch (error) {
      triggerNotification(`${error}`, "error");
    }
  };
  const handleAddFriend = async () => {
    try {
      const payload = {
        userId: userId,
        friendId: friend.id,
        friendname: friend.name,
      };
      const response = await axios.post(
        `${API_URL}/api/friends/add_friend`,
        payload
      );
      if (response.status === 200) {
        triggerNotification("Friend added successfully!", "success");

        setFriends((prevFriends) => [...prevFriends, friend]);
        console.log(friends);

        setFriendFound(false);
        setFriend({});
      } else {
        triggerNotification("Failed to add friend", "error");
      }
    } catch (error) {
      triggerNotification("Friend request not sent", "error");
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
                <li key={friend.friendId}>
                  <div className="p-2 bg-gray-100 rounded shadow-md">
                    {friend.friendName}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-px bg-gray-700 mx-6"></div>
          <div className="flex-3">
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
                <div className="flex flex-col text-xl bg-white border border-gray-300 rounded-md shadow-lg p-4 w-96">
                  <div className="mb-4">
                    <p className="font-semibold">Name: {friend.name}</p>
                    <p className="text-gray-500">ID: {friend.id}</p>
                  </div>
                  <button
                    onClick={handleAddFriend}
                    className=" !bg-green-500 !text-white px-4 py-2 !rounded hover:!bg-green-600 !transition-all !self-start"
                  >
                    Add Friend
                  </button>
                </div>
              ) : (
                <p className="text-gray-500">
                  Type your friend's ID to add them as your friend.
                </p>
              )}
            </div>
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
