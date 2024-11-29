"use client";
import { uploadToS3 } from "@/lib/s3";
import { useMutation } from "@tanstack/react-query";
import { Inbox, Loader2 } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

// https://github.com/aws/aws-sdk-js-v3/issues/4126

const FileUpload = () => {
  const router = useRouter();
  const [uploading, setUploading] = React.useState(false);

  const { mutate, isLoading } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      const response = await axios.post("/api/create-chat", {
        file_key,
        file_name,
      });
      return response.data;
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast.error("Failed to create chat. Please try again.");
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (!file) {
        toast.error("No file selected. Please try again.");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error(
          "The selected file exceeds the 10MB limit. Please choose a smaller file."
        );
        return;
      }

      try {
        setUploading(true);
        const data = await uploadToS3(file);

        if (!data?.file_key || !data.file_name) {
          toast.error(
            "An error occurred during upload. Invalid server response."
          );
          return;
        }

        mutate(data, {
          onSuccess: ({ chat_id }) => {
            toast.success("Your PDF has been uploaded and chat is ready!");
            router.push(`/chat/${chat_id}`);
          },
          onError: (err) => {
            console.error("Chat creation error:", err);
            toast.error(
              "Error creating chat. Please check your file and try again."
            );
          },
        });
      } catch (error: any) {
        console.error("Upload error:", error);
        if (error.response?.status === 403) {
          toast.error("Permission denied. Please check your credentials.");
        } else if (error.response?.status === 500) {
          toast.error("Server error. Please try again later.");
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      } finally {
        setUploading(false);
      }
    },
    onError: (err) => {
      console.error("Dropzone error:", err);
      toast.error("Error processing the file. Please try again.");
    },
  });

  return (
    <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl shadow-lg">
      <div
        {...getRootProps({
          className:
            "border-dashed border-4 border-green-400 rounded-2xl cursor-pointer bg-white py-10 flex justify-center items-center flex-col hover:bg-green-50 transition-all duration-200",
        })}
      >
        <input {...getInputProps()} />
        {uploading || isLoading ? (
          <>
            <Loader2 className="h-12 w-12 text-green-600 animate-spin" />
            <p className="mt-3 text-base text-gray-600 font-medium">
              Uploading your file, please wait...
            </p>
          </>
        ) : (
          <>
            <Inbox className="w-12 h-12 text-green-500" />
            <p className="mt-3 text-base text-gray-700 font-semibold">
              Drag and drop your PDF here, or click to select a file.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Files must be in PDF format and under 10MB.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
