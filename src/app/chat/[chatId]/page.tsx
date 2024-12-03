import ChatComponent from "@/components/ChatComponent";
import ChatSideBar from "@/components/ChatSideBar";
import PDFViewer from "@/components/PDFViewer";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    chatId: string;
  };
};

const ChatPage = async ({ params: { chatId } }: Props) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }
  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
  if (!_chats) {
    return redirect("/");
  }
  if (!_chats.find((chat) => chat.id === parseInt(chatId))) {
    return redirect("/");
  }

  const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));
  // Log currentChat for debugging
  console.log("Current Chat:", currentChat);

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex w-full h-full overflow-hidden">
        {/* Chat Sidebar */}
        <div className="flex-[1.5] max-w-xs h-screen overflow-auto scrollbar-hide">
          <ChatSideBar chats={_chats} chatId={parseInt(chatId)} />
        </div>
        {/* Main Content Area */}
        <div className="flex-[4] flex flex-col p-4 h-full bg-gradient-to-br from-green-100 to-green-50">
          <div className="flex items-center justify-between p-4 bg-white shadow rounded-md mb-4">
            <h1 className="text-lg font-semibold text-gray-800">
              PDF Viewer: {currentChat?.pdfName || "Untitled"}
            </h1>
          </div>
          <div className="flex-1 bg-white shadow rounded-md overflow-hidden">
            <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
          </div>
        </div>
        {/* Chat Component */}
        <div className="flex-[2.5] border-l-4 border-l-slate-200 h-screen overflow-auto">
          <ChatComponent chatId={parseInt(chatId)} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
