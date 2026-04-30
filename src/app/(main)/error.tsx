"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Something went wrong!</h2>
        <p className="text-gray-500">We encountered an unexpected error. Please try again.</p>
      </div>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
