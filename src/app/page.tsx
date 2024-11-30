import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight, LogIn } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function Home() {
  // Authentication and User related data
  const { userId } = await auth();
  const isAuth = !!userId;
  let firstChat;
  if (userId) {
    firstChat = await db.select().from(chats).where(eq(chats.userId, userId));
    if (firstChat) {
      firstChat = firstChat[0];
    }
  }
  return (
    <div className="w-screen min-h-screen bg-green-100 flex flex-col">
      <div className="flex-grow flex items-center justify-center">
        <div className="flex flex-col items-center text-center">
          {/* Page Title */}
          <h1 className="mr-3 text-5xl font-semibold text-teal-900">
            AI-Powered PDF Analyzer!
          </h1>
          {/* User Icon after they update */}
          <div className="flex mt-4">
            {isAuth && firstChat && (
              <>
                <Link href={`/chat/${firstChat.id}`}>
                  <Button className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 text-xl">
                    Go to Chats <ArrowRight className="ml-2" />
                  </Button>
                </Link>
              </>
            )}
          </div>

          <p className="max-w-xl mt-3 text-lg text-teal-800">
            Analyze and refine your PDFs effortlessly with our AI-powered tool
            for students and all!
          </p>

          {/* Log in Button */}
          <div className="w-full mt-6">
            {isAuth ? (
              <FileUpload />
            ) : (
              <Link href="/sign-in">
                <Button className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 text-xl">
                  Login to get Started!
                  <LogIn className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      {/* Footer Section */}
      <footer className="text-center py-4 mt-auto">
        <p className="text-sm">
          Made by Team 9 Software Engineers © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
