"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Template } from '@/data/templates';

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

const BannerCanvas: React.FC<BannerCanvasProps> = ({ template }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const mainTextRef = useRef<HTMLDivElement>(null);
  const detailsTextRef = useRef<HTMLDivElement>(null);
  
  // Positions in pixels, initialized from relative template positions
  const [mainTextPosition, setMainTextPosition] = useState<TextPosition>({ x: 0, y: 0 });
  const [detailsTextPosition, setDetailsTextPosition] = useState<TextPosition>({ x: 0, y: 0 });
  const [mainTextBounds, setMainTextBounds] = useState<TextBounds>({ width: 0, height: 0 });
  const [detailsTextBounds, setDetailsTextBounds] = useState<TextBounds>({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState<'main' | 'details' | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Track if positions have been customized via drag
  const [positionsCustomized, setPositionsCustomized] = useState({
    main: false,
    details: false
  });

  // Set initial positions only when the component first mounts or when template changes
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;

    // Only set initial positions if they haven't been customized
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

  // Update text bounds when text content or styling changes
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;

    // Main text bounds
    if (mainTextRef.current) {
      const mainTemp = document.createElement('div');
      mainTemp.style.position = 'absolute';
      mainTemp.style.visibility = 'hidden';
      mainTemp.style.fontSize = `${template.defaultFontSize}px`;
      mainTemp.style.fontFamily = template.defaultFont;
      mainTemp.style.width = '80%';
      mainTemp.style.maxWidth = `${canvasWidth * 0.8}px`;
      mainTemp.style.whiteSpace = 'pre-line';
      mainTemp.style.textAlign = 'center';
      mainTemp.innerHTML = template.defaultText;
      
      document.body.appendChild(mainTemp);
      const mainBounds = mainTemp.getBoundingClientRect();
      setMainTextBounds({ width: mainBounds.width, height: mainBounds.height });
      document.body.removeChild(mainTemp);
    }

    // Details text bounds (if exists)
    if (detailsTextRef.current && template.greetingDetails) {
      const detailsTemp = document.createElement('div');
      detailsTemp.style.position = 'absolute';
      detailsTemp.style.visibility = 'hidden';
      detailsTemp.style.fontSize = `${template.greetingDetails.fontSize}px`;
      detailsTemp.style.fontFamily = template.greetingDetails.font;
      detailsTemp.style.width = '80%';
      detailsTemp.style.maxWidth = `${canvasWidth * 0.8}px`;
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
    template.greetingDetails?.fontSize,
    template.greetingDetails?.font,
    template.greetingDetails?.text,
    canvasRef.current?.clientWidth
  ]);

  // Reset position customization when template changes
  useEffect(() => {
    setPositionsCustomized({
      main: false,
      details: false
    });
  }, [template.name]);

  const getFilterStyle = () => {
    return {
      filter: `brightness(${template.filters.brightness}%) contrast(${template.filters.contrast}%) saturate(${template.filters.saturation}%)`,
    };
  };

  // Handle drag start
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

  // Handle drag movement
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

  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(null);
  };

  // Add/remove event listeners
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
      <div id="banner-canvas" ref={canvasRef} className="absolute inset-0 rounded-lg overflow-hidden">
        <div className='absolute z-50 top-3 left-3'>
          <img className='h-14' src='https://i.postimg.cc/7ZYbRmWD/image.png' alt='ph-logo'/>
        </div>
        <div className='absolute z-50 right-3 top-3'>
          <img className='h-14 rounded-xl' src='https://play-lh.googleusercontent.com/sD1PjHX1s76Nw54bki3rIvqjLmKXrJNenU8YmrKTznL3r9c7a8wFzjb6_TUoyKAMa5w'/>
        </div>

        <div className='absolute left-5  bottom-3 text-white text-xs z-50'>
          <h3>Eid Mubarak from Abu Nayim Faisal</h3>
        </div>
        
        <img
          src={template.imageUrl || "/placeholder.svg"}
          alt={template.name}
          className="w-full h-full object-cover"
          style={getFilterStyle()}
        />
        {/* Main Text */}
        <div
          ref={mainTextRef}
          className="text-center p-4 absolute cursor-move"
          style={{
            color: template.defaultTextColor,
            width: '80%',
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
              fontSize: `${template.defaultFontSize}px`,
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
              width: '80%',
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
                fontSize: `${template.greetingDetails.fontSize}px`,
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