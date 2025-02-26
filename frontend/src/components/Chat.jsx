import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import * as signalR from "@microsoft/signalr";
import { API_URL } from "../config";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [connection, setConnection] = useState(null);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const senderId = params.get("senderId");
  const receiverId = params.get("receiverId");

  useEffect(() => {
    if (!senderId || !receiverId) return;

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_URL}/chathub?userId=${senderId}`)
      .configureLogging(signalR.LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    newConnection
      .start()
      .then(() => {
        console.log("Connected to SignalR hub");
        setConnection(newConnection);

        // Receive chat history and merge messages
        newConnection.on("ReceiveChatHistory", (history) => {
          setMessages((prev) => {
            const existingMessages = new Set(
              prev.map((m) => `${m.user}:${m.message}`)
            );

            const newMessages = history
              .map((msg) => ({
                user: msg.senderId,
                message: msg.messageText,
                timestamp: new Date(msg.timestamp), // Convert to Date object
              }))
              .filter(
                (msg) => !existingMessages.has(`${msg.user}:${msg.message}`)
              );

            // Merge old and new messages, then sort by timestamp
            return [...prev, ...newMessages].sort(
              (a, b) => a.timestamp - b.timestamp
            );
          });
        });

        // Fetch the chat history
        return newConnection
          .invoke("GetChatHistory", parseInt(senderId), parseInt(receiverId))
          .catch((err) => console.error("Error fetching chat history:", err));
      })
      .catch((err) => console.error("Error connecting to SignalR:", err));

    return () => {
      if (newConnection) {
        newConnection
          .stop()
          .catch((err) => console.error("Error disconnecting:", err));
      }
    };
  }, [senderId, receiverId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !senderId || !receiverId || !connection) return;

    try {
      await connection.invoke(
        "SendMessage",
        parseInt(senderId),
        parseInt(receiverId),
        newMessage
      );

      setMessages((prev) => [
        ...prev,
        { user: parseInt(senderId), message: newMessage },
      ]);

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      {" "}
      {/* Adjust height based on navbar */}
      <div className="bg-blue-600 text-white text-center p-4 font-bold text-lg">
        Chat with User {receiverId}
      </div>
      {/* Chat messages container with proper scrolling */}
      <div className="flex-1 overflow-auto p-4 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-xs p-3 rounded-lg text-white shadow-md ${
              msg.user == senderId
                ? "bg-blue-500 ml-auto"
                : "bg-gray-700 mr-auto"
            }`}
          >
            <strong>
              {msg.user == senderId ? "You" : `User ${msg.user}`}:
            </strong>
            <p>{msg.message}</p>
          </div>
        ))}
      </div>
      {/* Input box always visible at the bottom */}
      <div className="p-4 bg-white flex items-center border-t sticky bottom-0">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          disabled={!connection}
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
