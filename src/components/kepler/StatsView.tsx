import React, { useMemo } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { format, subDays, isSameDay } from "date-fns";

interface StatsViewProps {
  logs: any[];
}

export function StatsView({ logs }: StatsViewProps) {
  // 1. Walks per day (Last 7 days)
  const walkStats = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = subDays(new Date(), 6 - i);
      return {
        date: d,
        label: format(d, "EEE"),
        count: 0,
        duration: 0
      };
    });

    logs.forEach(log => {
      if (log.type === 'walk') {
        const logDate = new Date(log.timestamp);
        const dayStat = last7Days.find(d => isSameDay(d.date, logDate));
        if (dayStat) {
          dayStat.count += 1;
        }
      }
    });

    return last7Days;
  }, [logs]);

  // 2. Poop Consistency Distribution
  const poopStats = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    logs.forEach(log => {
      if (log.type === 'poop' && log.consistency) {
        if (counts[log.consistency as keyof typeof counts] !== undefined) {
          counts[log.consistency as keyof typeof counts]++;
        }
      }
    });

    return [
      { name: "Watery", value: counts[1], color: "#Dfb065" },
      { name: "Soft", value: counts[2], color: "#eac995" },
      { name: "Normal", value: counts[3], color: "#8CA99B" },
      { name: "Firm", value: counts[4], color: "#8f6d32" },
      { name: "Hard", value: counts[5], color: "#5c4620" },
    ].filter(i => i.value > 0);
  }, [logs]);

  return (
    <div className="space-y-6 pb-20">
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[#333333]">Walks this Week</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={walkStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis 
                  dataKey="label" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#999', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#999', fontSize: 12 }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f4f4f5' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" fill="#8CA99B" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[#333333]">Consistency Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full flex items-center justify-center">
            {poopStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={poopStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {poopStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 text-sm">No data yet</p>
            )}
          </div>
          <div className="flex flex-wrap gap-3 justify-center mt-4">
            {poopStats.map((entry) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-xs text-gray-500">{entry.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
