"use client";
import { DrizzleChat } from "@/lib/db/schema";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { MessageCircle, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import SubscriptionButton from "./SubscriptionButton";

type Props = {
  chats: DrizzleChat[];
  chatId: number;
  isPro: boolean;
};

const ChatSideBar = ({ chats, chatId, isPro }: Props) => {
  return (
    <div className="w-full max-h-screen overflow-scroll soff p-4 text-gray-100 bg-green-900">
      {/* New Chat Button */}
      <Link href="/">
        <Button className="w-full border-dashed border-green-400 text-green-100 bg-green-800 hover:bg-green-700 hover:text-white">
          <PlusCircle className="mr-2 w-4 h-4" />
          New Chat
        </Button>
      </Link>

      {/* Chat List */}
      <div className="flex max-h-screen overflow-scroll pb-20 flex-col gap-2 mt-4">
        {chats.map((chat) => (
          <Link key={chat.id} href={`/chat/${chat.id}`}>
            <div
              className={cn(
                "rounded-lg p-3 flex items-center text-sm truncate whitespace-nowrap",
                {
                  "bg-green-600 text-white shadow-md": chat.id === chatId,
                  "bg-green-800 text-green-200 hover:bg-green-700 hover:text-white":
                    chat.id !== chatId,
                }
              )}
            >
              <MessageCircle className="mr-2 text-green-400" />
              <p className="overflow-hidden text-ellipsis">{chat.pdfName}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChatSideBar;
