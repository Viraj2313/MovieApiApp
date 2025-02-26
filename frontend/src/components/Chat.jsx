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
        console.log("✅ Connected to SignalR hub");
        setConnection(newConnection);

        newConnection.on("ReceiveMessage", (user, message) => {
          setMessages((prev) => [...prev, { user, message }]);
        });

        newConnection.on("ReceiveChatHistory", (history) => {
          console.log("📜 Chat history received:", history);
          setMessages((prev) => [
            ...history.map((msg) => ({
              user: msg.senderId,
              message: msg.messageText,
            })),
            ...prev, // Keep existing messages
          ]);
        });

        console.log("📡 Fetching chat history for:", senderId, receiverId);

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
      console.error("❌ Error sending message:", error);
    }
  };

  return (
    <div>
      <h2>Chat with User {receiverId}</h2>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>
              {msg.user == senderId ? "You" : `User ${msg.user}`}:
            </strong>{" "}
            {msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage} disabled={!connection}>
        Send
      </button>
    </div>
  );
};

export default Chat;
