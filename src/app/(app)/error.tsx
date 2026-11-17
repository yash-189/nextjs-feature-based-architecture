"use client";

import { ErrorState } from "@/ui/components/feedback/ErrorState";

export default function AppError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <ErrorState
      title="Something went wrong"
      description={
        error.digest
          ? `Please try again. Reference: ${error.digest}`
          : "Please try again."
      }
      onRetry={retry}
    />
  );
}
