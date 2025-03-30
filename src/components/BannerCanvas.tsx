"use client";

import { useDeviceSize } from '@/hooks/use-device-size';
import React, { useRef, useState, useEffect } from 'react';

interface BannerCanvasProps {
  template: Template;
}

interface TextPosition {
  x: number;
  y: number;
}

interface TextBounds {
  width: number;
  height: number;
}

// Define the Filters interface to match your template structure
interface Filters {
  brightness: number;
  contrast: number;
  saturation: number;
}

// Extend the Template interface if not already defined in '@/data/templates'
interface Template {
  name: string;
  width: number;
  height: number;
  imageUrl?: string;
  defaultText: string;
  defaultTextColor: string;
  defaultFont: string;
  defaultFontSize: number;
  textWidth?: number;
  textPosition: { x: number; y: number };
  filters: Filters;
  greetingDetails?: {
    text: string;
    color: string;
    font: string;
    fontSize: number;
    textWidth?: number;
    position: { x: number; y: number };
  };
}

const BannerCanvas: React.FC<BannerCanvasProps> = ({ template }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const mainTextRef = useRef<HTMLDivElement>(null);
  const detailsTextRef = useRef<HTMLDivElement>(null);
  
  const [mainTextPosition, setMainTextPosition] = useState<TextPosition>({ x: 0, y: 0 });
  const [detailsTextPosition, setDetailsTextPosition] = useState<TextPosition>({ x: 0, y: 0 });
  const [mainTextBounds, setMainTextBounds] = useState<TextBounds>({ width: 0, height: 0 });
  const [detailsTextBounds, setDetailsTextBounds] = useState<TextBounds>({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState<'main' | 'details' | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const { isSmall } = useDeviceSize(); 

  const [positionsCustomized, setPositionsCustomized] = useState({
    main: false,
    details: false,
  });




  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;

    if (!positionsCustomized.main) {
      setMainTextPosition({
        x: template.textPosition.x * canvasWidth,
        y: template.textPosition.y * canvasHeight,
      });
    }
    
    if (!positionsCustomized.details && template.greetingDetails) {
      setDetailsTextPosition({
        x: template.greetingDetails.position.x * canvasWidth,
        y: template.greetingDetails.position.y * canvasHeight,
      });
    }
  }, [template.name, canvasRef.current?.clientWidth, canvasRef.current?.clientHeight]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;

    if (mainTextRef.current) {
      const mainTemp = document.createElement('div');
      mainTemp.style.position = 'absolute';
      mainTemp.style.visibility = 'hidden';
      mainTemp.style.fontSize = `${template.defaultFontSize}px`;
      mainTemp.style.fontFamily = template.defaultFont;
      mainTemp.style.width = `${template.textWidth || 80}%`;
      mainTemp.style.maxWidth = `${canvasWidth * (template.textWidth || 80) / 100}px`;
      mainTemp.style.whiteSpace = 'pre-line';
      mainTemp.style.textAlign = 'center';
      mainTemp.innerHTML = template.defaultText;
      
      document.body.appendChild(mainTemp);
      const mainBounds = mainTemp.getBoundingClientRect();
      setMainTextBounds({ width: mainBounds.width, height: mainBounds.height });
      document.body.removeChild(mainTemp);
    }

    if (detailsTextRef.current && template.greetingDetails) {
      const detailsTemp = document.createElement('div');
      detailsTemp.style.position = 'absolute';
      detailsTemp.style.visibility = 'hidden';
      detailsTemp.style.fontSize = `${template.greetingDetails.fontSize}px`;
      detailsTemp.style.fontFamily = template.greetingDetails.font;
      detailsTemp.style.width = `${template.greetingDetails.textWidth || 80}%`;
      detailsTemp.style.maxWidth = `${canvasWidth * (template.greetingDetails.textWidth || 80) / 100}px`;
      detailsTemp.style.whiteSpace = 'pre-line';
      detailsTemp.style.textAlign = 'center';
      detailsTemp.innerHTML = template.greetingDetails.text;
      
      document.body.appendChild(detailsTemp);
      const detailsBounds = detailsTemp.getBoundingClientRect();
      setDetailsTextBounds({ width: detailsBounds.width, height: detailsBounds.height });
      document.body.removeChild(detailsTemp);
    }
  }, [
    template.defaultFontSize,
    template.defaultFont,
    template.defaultText,
    template.textWidth,
    template.greetingDetails?.fontSize,
    template.greetingDetails?.font,
    template.greetingDetails?.text,
    template.greetingDetails?.textWidth,
    canvasRef.current?.clientWidth,
  ]);

  useEffect(() => {
    setPositionsCustomized({
      main: false,
      details: false,
    });
  }, [template.name]);

  const getFilterStyle = () => {
    return {
      filter: `brightness(${template.filters.brightness}%) contrast(${template.filters.contrast}%) saturate(${template.filters.saturation}%)`,
      WebkitFilter: `brightness(${template.filters.brightness}%) contrast(${template.filters.contrast}%) saturate(${template.filters.saturation}%)`, // Add Webkit prefix for better compatibility
    };
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, type: 'main' | 'details') => {
    setIsDragging(type);

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const ref = type === 'main' ? mainTextRef : detailsTextRef;
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setDragOffset({
        x: clientX - rect.left,
        y: clientY - rect.top,
      });
    }

    e.preventDefault();
  };

  const handleDrag = (e: MouseEvent | TouchEvent) => {
    if (!isDragging || !canvasRef.current) return;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const containerRect = canvasRef.current.getBoundingClientRect();
    
    const newX = clientX - containerRect.left - dragOffset.x;
    const newY = clientY - containerRect.top - dragOffset.y;

    if (isDragging === 'main') {
      setMainTextPosition({ x: newX, y: newY });
      setPositionsCustomized(prev => ({ ...prev, main: true }));
    } else if (isDragging === 'details') {
      setDetailsTextPosition({ x: newX, y: newY });
      setPositionsCustomized(prev => ({ ...prev, details: true }));
    }
  };

  const handleDragEnd = () => {
    setIsDragging(null);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDrag);
      window.addEventListener("touchmove", handleDrag);
      window.addEventListener("mouseup", handleDragEnd);
      window.addEventListener("touchend", handleDragEnd);
    } else {
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("touchmove", handleDrag);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchend", handleDragEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("touchmove", handleDrag);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchend", handleDragEnd);
    };
  }, [isDragging]);

  return (
    <div className="relative w-full" style={{ aspectRatio: `${template.width}/${template.height}` }}>
      <div
        id="banner-canvas"
        ref={canvasRef}
        className="absolute inset-0 rounded-lg overflow-hidden"
        style={getFilterStyle()}
      >
        <div className="absolute z-50 top-3 left-3">
          <img className="h-14" src="https://i.postimg.cc/7ZYbRmWD/image.png" alt="ph-logo" />
        </div>
        <div className="absolute z-50 right-3 top-3">
          <img className="h-14 rounded-xl" src="https://i.postimg.cc/j5TyQr4s/image.png" />
        </div>
        <div className="absolute left-5 bottom-3 text-white text-xs z-50">
          <h3>https://ph-fest.vercel.app/</h3>
        </div>
        
        <img
          src={template.imageUrl || "/placeholder.svg"}
          alt={template.name}
          className="w-full h-full object-cover"
          style={{
            // Ensure the image inherits the parent's filter
            filter: 'inherit',
            WebkitFilter: 'inherit',
          }}
        />
        {/* Main Text */}
        <div
          ref={mainTextRef}
          className="text-center p-4 absolute cursor-move"
          style={{
            color: template.defaultTextColor,
            width: `${template.textWidth || 80}%`,
            userSelect: 'none',
            touchAction: 'none',
            left: `${mainTextPosition.x}px`,
            top: `${mainTextPosition.y}px`,
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            border: isDragging === 'main' ? '2px solid #3b82f6' : 'none',
          }}
          onMouseDown={(e) => handleDragStart(e, 'main')}
          onTouchStart={(e) => handleDragStart(e, 'main')}
        >
          <h2
            className="font-bold whitespace-pre-line"
            style={{
              fontFamily: `${template.defaultFont}, sans-serif`,
              fontSize: `${isSmall ? '32' : template.defaultFontSize}px`,
            }}
          >
            {template.defaultText}
          </h2>
        </div>
        {/* Greeting Details Text (if exists) */}
        {template.greetingDetails && (
          <div
            ref={detailsTextRef}
            className="text-center p-4 absolute cursor-move"
            style={{
              color: template.greetingDetails.color,
              width: `${template.greetingDetails.textWidth || 80}%`,
              userSelect: 'none',
              touchAction: 'none',
              left: `${detailsTextPosition.x}px`,
              top: `${detailsTextPosition.y}px`,
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              border: isDragging === 'details' ? '2px solid #3b82f6' : 'none',
            }}
            onMouseDown={(e) => handleDragStart(e, 'details')}
            onTouchStart={(e) => handleDragStart(e, 'details')}
          >
            <h3
              className="font-bold whitespace-pre-line"
              style={{
                fontFamily: `${template.greetingDetails.font}, sans-serif`,
                fontSize: `${isSmall ? '16' :template.greetingDetails.fontSize}px`,
              }}
            >
              {template.greetingDetails.text}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerCanvas;