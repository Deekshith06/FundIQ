"use client";

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div>
        </div>
      </div>
      {message && (
        <p className="mt-4 text-gray-600 font-medium animate-pulse-slow">
          {message}
        </p>
      )}
      <div className="mt-4 text-sm text-gray-500">
        AI agents are working...
      </div>
    </div>
  );
}