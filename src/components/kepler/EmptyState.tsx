import React from "react";
import { Plus, Coffee, Sun } from "lucide-react";
import { Button } from "../ui/button";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="relative mb-6 group">
        <div className="absolute inset-0 bg-[#Fdfcf8] rounded-full blur-xl opacity-80" />
        <div className="h-28 w-28 rounded-full bg-gradient-to-br from-[#f4f2eb] to-[#e8e6df] flex items-center justify-center relative shadow-inner">
          <Sun className="h-12 w-12 text-[#8CA99B] opacity-50" />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md">
             <Coffee className="h-5 w-5 text-[#Dfb065]" />
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-[#333333] mb-2 tracking-tight">Good Morning!</h3>
      <p className="text-gray-500 max-w-xs mx-auto mb-8 text-base leading-relaxed">
        Ready to start the day with Kepler? <br/>
        Tap an activity above to log your first entry.
      </p>
    </div>
  );
}
