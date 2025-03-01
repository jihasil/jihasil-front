"use client";

import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { fetchR } from "@/app/(front)/shared/lib/request";

export interface UploadedFile<T = unknown> extends ClientUploadedFileData<T> {}

interface UseUploadFileProps
  extends Pick<
    UploadFilesOptions<OurFileRouter, keyof OurFileRouter>,
    "headers" | "onUploadBegin" | "onUploadProgress" | "skipPolling"
  > {
  onUploadComplete?: (file: UploadedFile) => void;
  onUploadError?: (error: unknown) => void;
}

export function useUploadFile({
  onUploadComplete,
  onUploadError,
  onUploadProgress,
}: UseUploadFileProps = {}) {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile>();
  const [uploadingFile, setUploadingFile] = useState<File>();
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  async function uploadFile(file: File) {
    setIsUploading(true);
    setUploadingFile(file);

    try {
      // Get presigned URL and final URL from your backend
      const { presignedUrl, fileUrl, fileKey } = await fetchR("/api/upload", {
        method: "POST",
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      }).then((r) => r.json());

      await axios.put(presignedUrl, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (progressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          setProgress(progress);
          onUploadProgress?.({ progress });
        },
      });

      const uploadedFile = {
        key: fileKey,
        url: fileUrl,
        name: file.name,
        size: file.size,
        type: file.type,
      };

      setUploadedFile(uploadedFile);
      onUploadComplete?.(uploadedFile);

      return uploadedFile;
    } catch (error) {
      onUploadError?.(error);
      showErrorToast(error);
      throw error;
    } finally {
      setProgress(0);
      setIsUploading(false);
      setUploadingFile(undefined);
    }
  }

  return {
    isUploading,
    progress,
    uploadFile,
    uploadedFile,
    uploadingFile,
  };
}

export function getErrorMessage(err: unknown) {
  const unknownError = "Something went wrong, please try again later.";

  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => {
      return issue.message;
    });

    return errors.join("\n");
  } else if (err instanceof Error) {
    return err.message;
  } else {
    return unknownError;
  }
}

export function showErrorToast(err: unknown) {
  const errorMessage = getErrorMessage(err);

  return toast.error(errorMessage);
}
