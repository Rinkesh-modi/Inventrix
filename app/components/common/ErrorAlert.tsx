// app/components/common/ErrorAlert.tsx
import { FaTimes } from "react-icons/fa";

interface ErrorAlertProps {
  error: string;
}

export default function ErrorAlert({ error }: ErrorAlertProps) {
  return (
    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex">
        <FaTimes className="h-5 w-5 text-red-400 mt-0.5" />
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <p className="text-sm text-red-700 mt-1">{error}</p>
        </div>
      </div>
    </div>
  );
}
