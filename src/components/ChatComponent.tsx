"use client";
import React from "react";
import { Input } from "./ui/input";
import { useChat } from "ai/react";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import MessageList from "./MessageList";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Message } from "ai";
import { toast } from "react-hot-toast";

type Props = { chatId: number };

const ChatComponent = ({ chatId }: Props) => {
  const [error, setError] = React.useState<string | null>(null);

  // Fetch initial messagess
  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      try {
        const response = await axios.post<Message[]>("/api/get-messages", {
          chatId,
        });
        return response.data;
      } catch (err) {
        console.error("Error fetching messages:", err);
        throw new Error("Failed to load messages. Please try again later.");
      }
    },
    onError: (err) => {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    },
  });

  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: "/api/chat",
    body: {
      chatId,
    },
    initialMessages: data || [],
    onError: (err) => {
      console.error("Error sending message:", err);
      toast.error("Failed to send message. Please try again.");
    },
  });

  React.useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div
      className="relative max-h-screen overflow-scroll"
      id="message-container"
    >
      {/* header */}
      <div className="sticky top-0 inset-x-0 p-2 bg-gradient-to-r from-green-500 to-green-600 text-white h-fit">
        <h3 className="text-xl font-bold">Chat</h3>
      </div>

      {/* error messages */}
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded-md mx-2 mt-2">
          {error}
        </div>
      )}
      {isError && (
        <div className="bg-red-100 text-red-700 p-2 rounded-md mx-2 mt-2">
          {queryError instanceof Error
            ? queryError.message
            : "Failed to load messages. Please refresh the page."}
        </div>
      )}

      {/* message list */}
      {!isError && <MessageList messages={messages} isLoading={isLoading} />}

      <form
        onSubmit={(e) => {
          try {
            if (!input.trim()) {
              toast.error("Message cannot be empty.");
              return;
            }
            handleSubmit(e);
          } catch (err) {
            console.error("Error handling submit:", err);
            toast.error("An unexpected error occurred. Please try again.");
          }
        }}
        className="sticky bottom-0 inset-x-0 px-2 py-4 bg-green-50 border-t-2 border-green-400"
      >
        <div className="flex">
          <Input
            value={input}
            onChange={(e) => {
              try {
                handleInputChange(e);
              } catch (err) {
                console.error("Error handling input:", err);
                toast.error("Error updating input. Please refresh.");
              }
            }}
            placeholder="Ask any question..."
            className="w-full bg-green-100 border-green-300 focus:border-green-500 focus:ring-green-500"
          />
          <Button
            className="bg-green-600 text-white ml-2 hover:bg-green-700"
            type="submit"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
