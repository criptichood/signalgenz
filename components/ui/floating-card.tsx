import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Minus, Maximize2, X } from 'lucide-react';

interface FloatingCardProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  isMinimized: boolean;
  onToggleMinimize: () => void;
  position: { x: number; y: number };
  onPositionChange: (position: { x: number; y: number }) => void;
  className?: string;
  initialWidth?: number;
}

export const FloatingCard = ({
  title,
  children,
  isOpen,
  onClose,
  isMinimized,
  onToggleMinimize,
  position,
  onPositionChange,
  className = '',
  initialWidth = 320,
}: FloatingCardProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLElement>) => {
    // Prevent dragging when clicking on buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    e.preventDefault();
  }, [position.x, position.y]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      onPositionChange({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, onPositionChange]);


  if (!isOpen) {
    return null;
  }

  return (
    <Card
      ref={cardRef}
      className={`fixed bg-background/80 backdrop-blur-md border border-border shadow-2xl rounded-lg flex flex-col z-40 ${className}`}
      style={{
        width: `${initialWidth}px`,
        top: `${position.y}px`,
        left: `${position.x}px`,
        transform: `translate(0, 0)`, // Use top/left for positioning
      }}
    >
      <CardHeader
        onMouseDown={handleMouseDown}
        className="flex flex-row items-center justify-between p-3 border-b border-border cursor-move rounded-t-lg"
      >
        <h3 className="text-sm font-bold pl-1 select-none">{title}</h3>
        <div className="flex items-center gap-2">
          <Button
            onClick={onToggleMinimize}
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            aria-label={isMinimized ? 'Maximize' : 'Minimize'}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4"/> : <Minus className="h-4 w-4" />}
          </Button>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className={`overflow-hidden transition-all duration-300 ease-in-out p-0 ${isMinimized ? 'h-0' : 'h-[420px]'}`}>
        {children}
      </CardContent>
    </Card>
  );
};