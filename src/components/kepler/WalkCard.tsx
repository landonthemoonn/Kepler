import React, { useRef, useState, useEffect } from "react";
import { Map, Undo2, Eraser, Clock, User, Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import { cn } from "../ui/utils";

// Visual-only WalkCard - No Leaflet dependencies
interface Point {
  x: number;
  y: number;
}

interface WalkCardProps {
  paths?: Point[][];
  onUpdate?: (data: { paths: Point[][] }) => void;
  onDelete?: () => void;
}

export function WalkCard({ paths: initialPaths = [], onUpdate, onDelete }: WalkCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingEnabled, setDrawingEnabled] = useState(false);
  const [paths, setPaths] = useState<Point[][]>(initialPaths);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);

  // Placeholder map image
  const MAP_IMAGE = "https://images.unsplash.com/photo-1730317195705-8a265a59ed1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWdodCUyMGNvbG9yZWQlMjBjaXR5JTIwcGFyayUyMG1hcCUyMGlsbHVzdHJhdGlvbiUyMG5ldXRyYWx8ZW58MXx8fHwxNzY1ODE0NDAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

  useEffect(() => {
    if (onUpdate) {
      onUpdate({ paths });
    }
  }, [paths, onUpdate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      redraw();
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  useEffect(() => {
    redraw();
  }, [paths, currentPath]);

  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#8B9BB4"; 

    const drawPath = (path: Point[]) => {
      if (path.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
      }
      ctx.stroke();
    };

    paths.forEach(drawPath);
    if (currentPath.length > 0) drawPath(currentPath);
  };

  const startDrawing = (e: React.PointerEvent) => {
    if (!drawingEnabled) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    setCurrentPath([{x, y}]);
  };

  const draw = (e: React.PointerEvent) => {
    if (!isDrawing || !drawingEnabled) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCurrentPath(prev => [...prev, {x, y}]);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentPath.length > 1) {
      setPaths(prev => [...prev, currentPath]);
    }
    setCurrentPath([]);
  };

  const handleUndo = () => {
    setPaths(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPaths([]);
    setCurrentPath([]);
  };

  return (
    <Card className="overflow-hidden border-0 shadow-[0_2px_8px_rgba(0,0,0,0.04)] bg-white rounded-2xl mb-4">
      <div className="p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#E8EDEA] flex items-center justify-center text-[#8CA99B]">
              <Map className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#333333]">Walk</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-3 w-3" />
                <span>Now</span>
                <span>•</span>
                <User className="h-3 w-3" />
                <span>You</span>
              </div>
            </div>
          </div>
          {onDelete && (
            <Button variant="ghost" size="sm" onClick={onDelete} className="text-gray-400 hover:text-red-400">
              Delete
            </Button>
          )}
        </div>

        {/* Visual Map Placeholder */}
        <div 
          ref={containerRef}
          className="relative h-48 md:h-64 rounded-xl overflow-hidden bg-gray-100 touch-none"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-70 grayscale-[20%]"
            style={{ backgroundImage: `url(${MAP_IMAGE})` }}
          />
          
          {/* Overlay Text */}
          {paths.length === 0 && !drawingEnabled && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-600 shadow-sm animate-pulse">
                Draw route with your finger
              </p>
            </div>
          )}

          {/* Drawing Canvas */}
          <canvas
            ref={canvasRef}
            className={cn(
              "absolute inset-0 z-10",
              drawingEnabled ? "cursor-crosshair" : "pointer-events-none"
            )}
            onPointerDown={startDrawing}
            onPointerMove={draw}
            onPointerUp={stopDrawing}
            onPointerLeave={stopDrawing}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
             <div className="flex items-center space-x-2">
              <Switch 
                id="draw-mode" 
                checked={drawingEnabled}
                onCheckedChange={setDrawingEnabled}
                className="data-[state=checked]:bg-[#8B9BB4]"
              />
              <Label htmlFor="draw-mode" className="text-sm font-medium text-gray-600 flex items-center gap-1.5 cursor-pointer">
                <Pencil className="h-3.5 w-3.5" />
                Draw Route
              </Label>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleUndo}
              disabled={paths.length === 0}
              className="h-8 text-xs font-medium text-gray-600"
            >
              <Undo2 className="h-3.5 w-3.5 mr-1" />
              Undo
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClear}
              disabled={paths.length === 0}
              className="h-8 text-xs font-medium text-gray-600"
            >
              <Eraser className="h-3.5 w-3.5 mr-1" />
              Clear
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
