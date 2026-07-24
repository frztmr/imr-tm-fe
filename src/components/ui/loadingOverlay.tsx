import { Loader2 } from "lucide-react";

export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white rounded-lg p-4 shadow-md flex items-center gap-2">
        <Loader2 className="animate-spin w-5 h-5" />
        <span>Loading...</span>
      </div>
    </div>
  );
}