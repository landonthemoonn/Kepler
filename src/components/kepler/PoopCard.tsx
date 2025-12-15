import React, { useState, useEffect } from "react";
import { Clock, Dog } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Textarea } from "../ui/textarea";
import { cn } from "../ui/utils";

interface PoopCardProps {
  consistency?: number;
  note?: string;
  onUpdate?: (data: { consistency?: number; note?: string }) => void;
  onDelete?: () => void;
}

export function PoopCard({ consistency: initialConsistency = 3, note: initialNote = "", onUpdate, onDelete }: PoopCardProps) {
  const [consistency, setConsistency] = useState<number>(initialConsistency);
  const [note, setNote] = useState<string>(initialNote);
  
  // Sync with parent
  useEffect(() => {
    if (onUpdate) {
      onUpdate({ consistency, note });
    }
  }, [consistency, note, onUpdate]);

  const levels = [
    { val: 1, label: "Watery", color: "bg-[#Dfb065] opacity-40", size: "w-6 h-6" },
    { val: 2, label: "Soft", color: "bg-[#Dfb065] opacity-60", size: "w-7 h-7" },
    { val: 3, label: "Normal", color: "bg-[#Dfb065]", size: "w-8 h-8" },
    { val: 4, label: "Firm", color: "bg-[#8f6d32]", size: "w-7 h-7" },
    { val: 5, label: "Hard", color: "bg-[#5c4620]", size: "w-6 h-6" },
  ];

  return (
    <Card className="overflow-hidden border-0 shadow-[0_2px_8px_rgba(0,0,0,0.04)] bg-white rounded-2xl mb-4">
      <div className="p-4 md:p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#FFF4E0] flex items-center justify-center text-[#Dfb065]">
              <Dog className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#333333]">Bathroom</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-3 w-3" />
                <span>Now</span>
              </div>
            </div>
          </div>
          {onDelete && (
            <Button variant="ghost" size="sm" onClick={onDelete} className="text-gray-400 hover:text-red-400">
              Delete
            </Button>
          )}
        </div>

        {/* Consistency Selector */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Consistency</label>
          <div className="flex items-end justify-between px-2 py-4 bg-gray-50 rounded-xl">
            {levels.map((level) => (
              <div key={level.val} className="flex flex-col items-center gap-2">
                <button
                  onClick={() => setConsistency(level.val)}
                  className={cn(
                    "rounded-full transition-all duration-300 relative",
                    level.size,
                    level.color,
                    consistency === level.val 
                      ? "ring-4 ring-[#Dfb065]/20 scale-110" 
                      : "hover:scale-105"
                  )}
                  aria-label={level.label}
                />
                <span className={cn(
                  "text-xs transition-colors",
                  consistency === level.val ? "font-bold text-[#Dfb065]" : "text-gray-400"
                )}>
                  {level.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
           <Textarea 
             placeholder="Add notes..." 
             className="bg-gray-50 border-0 resize-none focus-visible:ring-1 focus-visible:ring-[#Dfb065]/50" 
             rows={2}
             value={note}
             onChange={(e) => setNote(e.target.value)}
           />
        </div>
      </div>
    </Card>
  );
}
