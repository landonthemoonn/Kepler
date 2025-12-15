import React, { useState } from "react";
import { Header } from "./components/kepler/Header";
import { QuickActions, ActionType } from "./components/kepler/QuickActions";
import { WalkCard } from "./components/kepler/WalkCard";
import { PoopCard } from "./components/kepler/PoopCard";
import { SimpleCard } from "./components/kepler/SimpleCard";
import { EmptyState } from "./components/kepler/EmptyState";
import { StatsView } from "./components/kepler/StatsView";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, BarChart2 } from "lucide-react";

// Types for our log entries
interface LogEntry {
  id: string;
  type: ActionType;
  timestamp: Date;
  // Optional data fields
  paths?: {x: number, y: number}[][];
  consistency?: number;
  note?: string;
}

export default function App() {
  const [date, setDate] = useState<Date>(new Date());
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [view, setView] = useState<"log" | "stats">("log");

  const handleAddLog = (type: ActionType) => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      timestamp: new Date(),
    };
    // Add to top of list
    setLogs((prev) => [newLog, ...prev]);
  };

  const handleUpdateLog = (id: string, data: Partial<LogEntry>) => {
    setLogs((prev) => 
      prev.map((log) => (log.id === id ? { ...log, ...data } : log))
    );
  };

  const handleDeleteLog = (id: string) => {
    setLogs((prev) => prev.filter((log) => log.id !== id));
  };

  // Dog Avatar
  const DOG_IMAGE = "https://images.unsplash.com/photo-1764163224360-7ba64e31f5b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjByZXRyaWV2ZXIlMjBkb2clMjBwb3J0cmFpdCUyMHdhcm0lMjBsaWdodHxlbnwxfHx8fDE3NjU4MTQzOTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

  return (
    <div className="min-h-screen bg-[#FDFCF8] font-sans text-[#333333] selection:bg-[#8CA99B]/20">
      <div className="max-w-xl mx-auto min-h-screen flex flex-col shadow-2xl shadow-[#000000]/5 bg-[#FDFCF8]">
        
        {/* Sticky Header area */}
        <div className="sticky top-0 z-10 bg-[#FDFCF8]/90 backdrop-blur-md border-b border-gray-100/50">
          <Header 
            date={date} 
            setDate={setDate} 
            dogImage={DOG_IMAGE}
          />
          {view === "log" && <QuickActions onAction={handleAddLog} />}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-4 md:p-6 space-y-2 relative">
          
          {view === "log" ? (
            <AnimatePresence initial={false} mode="popLayout">
              {logs.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <EmptyState />
                </motion.div>
              ) : (
                logs.map((log) => (
                  <motion.div
                    key={log.id}
                    layout
                    initial={{ opacity: 0, height: 0, y: -20 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
                  >
                    {log.type === "walk" && (
                      <WalkCard 
                        paths={log.paths}
                        onUpdate={(data) => handleUpdateLog(log.id, data)}
                        onDelete={() => handleDeleteLog(log.id)} 
                      />
                    )}
                    {log.type === "poop" && (
                      <PoopCard 
                        consistency={log.consistency}
                        note={log.note}
                        onUpdate={(data) => handleUpdateLog(log.id, data)}
                        onDelete={() => handleDeleteLog(log.id)} 
                      />
                    )}
                    {(log.type === "feed" || log.type === "bath" || log.type === "note") && (
                      <SimpleCard 
                        type={log.type} 
                        note={log.note}
                        onUpdate={(data) => handleUpdateLog(log.id, data)}
                        onDelete={() => handleDeleteLog(log.id)} 
                      />
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          ) : (
             <StatsView logs={logs} />
          )}
          
          {/* Bottom padding for scrolling */}
          <div className="h-24" />
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 max-w-xl mx-auto bg-white border-t border-gray-100 flex items-center justify-around py-4 z-40 pb-6 md:pb-4">
          <button
            onClick={() => setView("log")}
            className={`flex flex-col items-center gap-1 ${view === "log" ? "text-[#8CA99B]" : "text-gray-400"}`}
          >
            <Calendar className="w-6 h-6" />
            <span className="text-xs font-medium">Daily Log</span>
          </button>
          
          <button
            onClick={() => setView("stats")}
            className={`flex flex-col items-center gap-1 ${view === "stats" ? "text-[#8CA99B]" : "text-gray-400"}`}
          >
            <BarChart2 className="w-6 h-6" />
            <span className="text-xs font-medium">Trends</span>
          </button>
        </div>
      </div>
    </div>
  );
}
