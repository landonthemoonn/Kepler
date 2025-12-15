import React from "react";
import { Dog, Footprints, Utensils, ShowerHead, StickyNote } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../ui/utils";

export type ActionType = "walk" | "poop" | "feed" | "bath" | "note";

interface QuickActionsProps {
  onAction: (action: ActionType) => void;
}

export function QuickActions({ onAction }: QuickActionsProps) {
  const actions = [
    {
      id: "walk",
      label: "Walk",
      icon: Footprints,
      color: "bg-[#8CA99B] hover:bg-[#7a9488] text-white",
    },
    {
      id: "poop",
      label: "Poop",
      icon: Dog, // Using Dog as a placeholder for poop if no better icon, or maybe combine icons
      color: "bg-[#Dfb065] hover:bg-[#cda25e] text-white",
    },
    {
      id: "feed",
      label: "Feed",
      icon: Utensils,
      color: "bg-[#8B9BB4] hover:bg-[#7a8ba4] text-white",
    },
    {
      id: "bath",
      label: "Bath",
      icon: ShowerHead,
      color: "bg-[#A8A29E] hover:bg-[#96908c] text-white",
    },
    {
      id: "note",
      label: "Note",
      icon: StickyNote,
      color: "bg-[#e5e5e5] hover:bg-[#d4d4d4] text-[#333333]",
    },
  ];

  return (
    <div className="w-full py-4 overflow-x-auto no-scrollbar">
      <div className="flex gap-3 md:gap-4 min-w-max px-1">
        {actions.map((action) => (
          <Button
            key={action.id}
            onClick={() => onAction(action.id as ActionType)}
            className={cn(
              "h-14 md:h-16 px-6 md:px-8 rounded-full shadow-sm border-0 transition-all active:scale-95 flex items-center gap-3",
              action.color
            )}
          >
            <action.icon className="h-5 w-5 md:h-6 md:w-6" />
            <span className="text-base md:text-lg font-medium">{action.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
