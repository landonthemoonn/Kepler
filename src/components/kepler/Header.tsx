import React from "react";
import { format, isSameDay } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { cn } from "../ui/utils";

interface HeaderProps {
  date: Date;
  setDate: (date: Date) => void;
  dogName?: string;
  dogImage?: string;
}

export function Header({ 
  date, 
  setDate, 
  dogName = "Kepler",
  dogImage 
}: HeaderProps) {
  const isToday = isSameDay(date, new Date());

  return (
    <header className="flex items-center justify-between py-6 px-1">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-[#333333] tracking-tight flex items-center gap-2">
          {dogName}
          <span className="text-base font-medium text-gray-400 font-normal">Daily Care Log</span>
        </h1>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-fit justify-start text-left font-medium text-lg hover:bg-transparent p-0 h-auto gap-2 transition-colors",
                isToday ? "text-[#8CA99B] hover:text-[#7a9488]" : "text-[#Dfb065] hover:text-[#cda25e]"
              )}
            >
              <CalendarIcon className="h-5 w-5" />
              {isToday ? "Today, " : ""}{format(date, "MMMM do")}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => d && setDate(d)}
              initialFocus
              className="p-3 border-none shadow-xl rounded-xl"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-[#333333] transition-colors">
           <Bell className="h-6 w-6" />
        </Button>
        <Avatar className="h-14 w-14 border-2 border-white shadow-sm ring-1 ring-gray-100">
          <AvatarImage src={dogImage} alt={dogName} className="object-cover" />
          <AvatarFallback>KP</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
