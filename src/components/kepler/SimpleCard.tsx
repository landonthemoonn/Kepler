import React, { useState, useEffect } from "react";
import { Utensils, ShowerHead, StickyNote, Clock } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Textarea } from "../ui/textarea";

interface SimpleCardProps {
  type: "feed" | "bath" | "note";
  note?: string;
  onUpdate?: (data: { note: string }) => void;
  onDelete?: () => void;
}

export function SimpleCard({ type, note: initialNote = "", onUpdate, onDelete }: SimpleCardProps) {
  const [note, setNote] = useState(initialNote);

  const onUpdateRef = React.useRef(onUpdate);

  React.useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    if (onUpdateRef.current) {
      onUpdateRef.current({ note });
    }
  }, [note]);

  const config = {
    feed: {
      icon: Utensils,
      color: "bg-[#8B9BB4] text-white",
      bg: "bg-[#EEF1F6]",
      iconColor: "text-[#8B9BB4]",
      title: "Feeding",
      placeholder: "What did Kepler eat?",
      ring: "focus-visible:ring-[#8B9BB4]/50"
    },
    bath: {
      icon: ShowerHead,
      color: "bg-[#A8A29E] text-white",
      bg: "bg-[#F5F5F4]",
      iconColor: "text-[#A8A29E]",
      title: "Bath & Grooming",
      placeholder: "Shampoo used, mood, etc.",
      ring: "focus-visible:ring-[#A8A29E]/50"
    },
    note: {
      icon: StickyNote,
      color: "bg-[#333333] text-white",
      bg: "bg-[#F3F4F6]",
      iconColor: "text-[#333333]",
      title: "Daily Note",
      placeholder: "How is Kepler feeling today?",
      ring: "focus-visible:ring-gray-300"
    }
  }[type];

  const Icon = config.icon;

  return (
    <Card className="overflow-hidden border-0 shadow-[0_4px_16px_rgba(0,0,0,0.04)] bg-white rounded-2xl mb-4 transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
      <div className="p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-full ${config.bg} flex items-center justify-center ${config.iconColor}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#333333]">{config.title}</h3>
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

        <div className="space-y-2">
           <Textarea 
             placeholder={config.placeholder}
             className={`bg-gray-50/50 border-0 resize-none focus-visible:ring-1 ${config.ring} min-h-[80px] rounded-xl`}
             rows={3}
             value={note}
             onChange={(e) => setNote(e.target.value)}
           />
        </div>
      </div>
    </Card>
  );
}
