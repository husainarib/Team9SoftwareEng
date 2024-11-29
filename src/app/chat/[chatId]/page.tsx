import ChatComponent from "@/components/ChatComponent";
import ChatSideBar from "@/components/ChatSideBar";
import PDFViewer from "@/components/PDFViewer";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { checkSubscription } from "@/lib/subscription";
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
  const isPro = await checkSubscription();

  return (
    // <div className="flex max-h-full overflow-hidden">
    //   <div className="flex w-full max-h-screen overflow-scroll">
    //     {/* chat sidebar */}
    //     <div className="flex-[1] max-w-xs">
    //       <ChatSideBar chats={_chats} chatId={parseInt(chatId)} isPro={isPro} />
    //     </div>
    //     {/* pdf viewer */}
    //     <div className="max-h-screen p-4 oveflow-scroll flex-[5]">
    //       <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
    //     </div>
    //     {/* chat component */}
    //     <div className="flex-[3] border-l-4 border-l-slate-200">
    //       <ChatComponent chatId={parseInt(chatId)} />
    //     </div>
    //   </div>
    // </div>
<div className="flex h-screen overflow-hidden">
  <div className="flex w-full h-full overflow-hidden">
    {/* Chat Sidebar */}
    <div className="flex-[1.5] max-w-xs h-screen overflow-auto">
      <ChatSideBar chats={_chats} chatId={parseInt(chatId)} isPro={isPro} />
    </div>
    {/* PDF Viewer */}
    <div className="flex-[4] p-4 h-screen overflow-auto">
      <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
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
