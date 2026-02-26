'use client';

import { useEffect, useState } from "react";

const MyMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [userId, setUserId] = useState(null);

  /* =============================
     Get Token + Decode User
  ============================= */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setUserId(decoded.id);
    } catch (err) {
      console.error("Invalid token");
      localStorage.removeItem("token");
      setLoading(false);
    }
  }, []);

  /* =============================
     Fetch Conversations
  ============================= */
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/messages/conversations`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch conversations");
        }

        const data = await res.json();
        setConversations(data || []);
      } catch (err) {
        console.error(err);
        setError("Could not load conversations.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchConversations();
    }
  }, [userId]);

  /* =============================
     Fetch Messages
  ============================= */
  const fetchMessages = async (conversationId) => {
    try {
      const token = localStorage.getItem("token");

      setSelectedConversation(conversationId);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/messages/${conversationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await res.json();
      setMessages(data || []);
    } catch (err) {
      console.error(err);
      setError("Could not load messages.");
    }
  };

  /* =============================
     UI States
  ============================= */
  if (loading) {
    return (
      <div className="p-6">
        <p className="text-slate-500">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 space-y-6 p-6">
      <h2 className="text-2xl font-bold text-slate-900">Messages</h2>

      {error && (
        <p className="text-red-500">{error}</p>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden min-h-[500px]">
        <div className="grid md:grid-cols-3 h-full">

          {/* =============================
              Conversation List
          ============================= */}
          <div className="border-r border-slate-200">
            {conversations.length === 0 ? (
              <div className="p-6 text-slate-500 text-sm">
                No conversations yet.
              </div>
            ) : (
              conversations.map((c) => {
                const otherUser = c.participants.find(
                  (p) => p._id !== userId
                );

                return (
                  <button
                    key={c._id}
                    onClick={() => fetchMessages(c._id)}
                    className={`w-full p-4 border-b text-left hover:bg-slate-50 transition ${
                      selectedConversation === c._id
                        ? "bg-teal-50"
                        : ""
                    }`}
                  >
                    <p className="font-medium text-slate-900">
                      {otherUser?.name || "Unknown"}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {c.lastMessage?.text || "No messages yet"}
                    </p>
                  </button>
                );
              })
            )}
          </div>

          {/* =============================
              Chat Area
          ============================= */}
          <div className="md:col-span-2 p-6">
            {selectedConversation ? (
              messages.length === 0 ? (
                <div className="text-slate-500">
                  No messages in this conversation.
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((m) => (
                    <div
                      key={m._id}
                      className={`p-3 rounded-lg text-sm max-w-xs ${
                        m.sender._id === userId
                          ? "bg-teal-500 text-white ml-auto"
                          : "bg-slate-100 text-slate-900"
                      }`}
                    >
                      <p className="font-medium text-xs mb-1">
                        {m.sender.name}
                      </p>
                      <p>{m.text}</p>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">
                Select a conversation
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default MyMessages;