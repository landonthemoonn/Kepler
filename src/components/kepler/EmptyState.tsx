import React from "react";
import { Plus } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="h-24 w-24 rounded-full bg-[#f4f2eb] flex items-center justify-center mb-6">
        <div className="h-16 w-16 rounded-full bg-[#e8e6df] animate-pulse" />
      </div>
      <h3 className="text-xl font-bold text-[#333333] mb-2">Good Morning!</h3>
      <p className="text-gray-500 max-w-xs mx-auto mb-8">
        No logs yet for today. Tap an activity above to start Kepler's daily journal.
      </p>
    </div>
  );
}
