import { cn } from "@/lib/utils";
import { Message } from "ai/react";
import { Loader2, AlertCircle } from "lucide-react";
import React from "react";

type Props = {
  isLoading: boolean;
  messages: Message[] | null;
  error?: string;
};

const MessageList = ({ messages, isLoading, error }: Props) => {
  // Show loading spinner if data is being fetched
  if (isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );
  }

  // Display error message if there is an error
  if (error) {
    return (
      <div className="flex items-center justify-center p-4 text-red-600 bg-red-100 border border-red-300 rounded-md">
        <AlertCircle className="w-5 h-5 mr-2" />
        <p>{error}</p>
      </div>
    );
  }

  // Handle case where messages are not available or empty
  if (!messages || messages.length === 0) {
    return (
      <div className="flex items-center justify-center text-gray-500">
        <p>No messages yet. Start the conversation!</p>
      </div>
    );
  }

  // Render the message list
  return (
    <div className="flex flex-col gap-4 px-6 py-4">
      {messages.map((message) => {
        if (!message.id) {
          // Log invalid messages for debugging
          console.error("Message ID is missing:", message);
          return null;
        }

        return (
          <div
            key={message.id}
            className={cn("flex", {
              "justify-end pl-12": message.role === "user",
              "justify-start pr-12": message.role === "assistant",
            })}
          >
            <div
              className={cn(
                "rounded-xl px-4 py-2 text-sm shadow-lg max-w-xs break-words",
                {
                  "bg-blue-500 text-white": message.role === "user",
                  "bg-gray-200 text-gray-900": message.role === "assistant",
                }
              )}
            >
              <p>{message.content}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
