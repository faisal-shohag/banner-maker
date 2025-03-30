"use client";

import { useDeviceSize } from '@/hooks/use-device-size';
import React, { useRef, useState, useEffect } from 'react';
import Moveable from "react-moveable";

interface BannerCanvasProps {
  template: Template;
  logos: Logo[];
}

interface Logo {
  id: string;
  url: string;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  visible: boolean;
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

const BannerCanvas: React.FC<BannerCanvasProps> = ({ template, logos = [] }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const mainTextRef = useRef<HTMLDivElement>(null);
  const detailsTextRef = useRef<HTMLDivElement>(null);
  
  const [mainTextPosition, setMainTextPosition] = useState<TextPosition>({ x: 0, y: 0 });
  const [detailsTextPosition, setDetailsTextPosition] = useState<TextPosition>({ x: 0, y: 0 });
  const [mainTextBounds, setMainTextBounds] = useState<TextBounds>({ width: 0, height: 0 });
  const [detailsTextBounds, setDetailsTextBounds] = useState<TextBounds>({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState<'main' | 'details' | string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [activeElement, setActiveElement] = useState<'main' | 'details' | string | null>(null);
  const { isSmall } = useDeviceSize(); 

  const [positionsCustomized, setPositionsCustomized] = useState({
    main: false,
    details: false,
  });

  // Logo states
  const [logoPositions, setLogoPositions] = useState<{ [key: string]: { x: number, y: number } }>({});
  const [logoSizes, setLogoSizes] = useState<{ [key: string]: { width: number, height: number } }>({});
  
  useEffect(() => {
    // Initialize logo positions if they don't exist
    logos.forEach(logo => {
      if (!logoPositions[logo.id] && logo.visible) {
        setLogoPositions(prev => ({
          ...prev,
          [logo.id]: logo.position || { x: 50, y: 50 }
        }));

        setLogoSizes(prev => ({
          ...prev,
          [logo.id]: logo.size || { width: 60, height: 60 }
        }));
      }
    });
  }, [logos]);

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

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, type: 'main' | 'details' | string) => {
    setIsDragging(type);
    setActiveElement(type);

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    let targetRef;
    if (type === 'main') {
      targetRef = mainTextRef;
    } else if (type === 'details') {
      targetRef = detailsTextRef;
    } else {
      // It's a logo
      const logoElement = document.getElementById(`logo-${type}`);
      if (logoElement) {
        const rect = logoElement.getBoundingClientRect();
        setDragOffset({
          x: clientX - rect.left,
          y: clientY - rect.top,
        });
      }
      e.preventDefault();
      return;
    }

    if (targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
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
    } else {
      // Handle logo dragging
      setLogoPositions(prev => ({
        ...prev,
        [isDragging]: { x: newX, y: newY }
      }));
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
        <div className="absolute z-50 left-5 bottom-3 text-white text-xs">
          <h3>https://ph-fest.vercel.app/</h3>
        </div>
        
        <img
          src={template.imageUrl || "/placeholder.svg"}
          alt={template.name}
          className="w-full h-full object-cover"
          style={{
            filter: 'inherit',
            WebkitFilter: 'inherit',
          }}
        />
        
        {/* Main Text with Moveable */}
        <div
          ref={mainTextRef}
          id="main-text"
          className="text-center p-4 absolute cursor-move"
          style={{
            color: template.defaultTextColor,
            width: `${template.textWidth || 80}%`,
            userSelect: 'none',
            touchAction: 'none',
            left: `${mainTextPosition.x}px`,
            top: `${mainTextPosition.y}px`,
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            border: activeElement === 'main' ? '0px solid none' : 'none',
          }}
          onClick={() => setActiveElement('main')}
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
            id="details-text"
            className="text-center p-4 absolute cursor-move"
            style={{
              color: template.greetingDetails.color,
              width: `${template.greetingDetails.textWidth || 80}%`,
              userSelect: 'none',
              touchAction: 'none',
              left: `${detailsTextPosition.x}px`,
              top: `${detailsTextPosition.y}px`,
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              border: activeElement === 'details' ? '0px solid #3b82f6' : 'none',
            }}
            onClick={() => setActiveElement('details')}
            onMouseDown={(e) => handleDragStart(e, 'details')}
            onTouchStart={(e) => handleDragStart(e, 'details')}
          >
            <h3
              className="font-bold whitespace-pre-line"
              style={{
                fontFamily: `${template.greetingDetails.font}, sans-serif`,
                fontSize: `${isSmall ? '16' : template.greetingDetails.fontSize}px`,
              }}
            >
              {template.greetingDetails.text}
            </h3>
          </div>
        )}

        {/* Logos */}
        {logos.filter(logo => logo.visible).map((logo) => (
          <div
            key={logo.id}
            id={`logo-${logo.id}`}
            className="absolute cursor-move flex items-center justify-center"
            style={{
              left: `${logoPositions[logo.id]?.x || 50}px`,
              top: `${logoPositions[logo.id]?.y || 50}px`,
              width: `${logoSizes[logo.id]?.width || 60}px`,
              height: `${logoSizes[logo.id]?.height || 60}px`,
              border: activeElement === logo.id ? 'none' : 'none',
              zIndex: 50,
            }}
            onClick={() => setActiveElement(logo.id)}
            onMouseDown={(e) => handleDragStart(e, logo.id)}
            onTouchStart={(e) => handleDragStart(e, logo.id)}
          >
            <img 
              src={logo.url} 
              alt={`Logo ${logo.id}`} 
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </div>

      {/* Moveable for main text */}
      {activeElement === 'main' && (
        <Moveable
          target={mainTextRef.current}
          container={canvasRef.current}
          draggable={true}
          resizable={true}
          scalable={false}
          rotatable={true}
          warpable={false}
          keepRatio={false}
          renderDirections={["n", "e", "s", "w", "ne", "nw", "se", "sw"]}
          edge={false}
          onDrag={({ target, translate }) => {
            target.style.transform = `translate(${translate[0]}px, ${translate[1]}px)`;
            setPositionsCustomized(prev => ({ ...prev, main: true }));
          }}
          onResize={({ target, width, height }) => {
            target.style.width = `${width}px`;
            target.style.height = `${height}px`;
          }}
          onRotate={({ target, rotate }) => {
            target.style.transform = `rotate(${rotate}deg)`;
          }}
        />
      )}

      {/* Moveable for details text */}
      {activeElement === 'details' && template.greetingDetails && (
        <Moveable
          target={detailsTextRef.current}
          container={canvasRef.current}
          draggable={true}
          resizable={true}
          scalable={false}
          rotatable={true}
          warpable={false}
          keepRatio={false}
          renderDirections={["n", "e", "s", "w", "ne", "nw", "se", "sw"]}
          edge={false}
          onDrag={({ target, translate }) => {
            target.style.transform = `translate(${translate[0]}px, ${translate[1]}px)`;
            setPositionsCustomized(prev => ({ ...prev, details: true }));
          }}
          onResize={({ target, width, height }) => {
            target.style.width = `${width}px`;
            target.style.height = `${height}px`;
          }}
          onRotate={({ target, rotate }) => {
            target.style.transform = `rotate(${rotate}deg)`;
          }}
        />
      )}

      {/* Moveable for logos */}
      {activeElement && !['main', 'details'].includes(activeElement) && (
        <Moveable
          target={document.getElementById(`logo-${activeElement}`)}
          container={canvasRef.current}
          draggable={true}
          resizable={true}
          scalable={true}
          rotatable={true}
          warpable={false}
          keepRatio={true}
          renderDirections={["n", "e", "s", "w", "ne", "nw", "se", "sw"]}
          edge={false}
          onDrag={({ target, translate }) => {
            target.style.transform = `translate(${translate[0]}px, ${translate[1]}px)`;
          }}
          onResize={({ target, width, height }) => {
            target.style.width = `${width}px`;
            target.style.height = `${height}px`;
            
            setLogoSizes(prev => ({
              ...prev,
              [activeElement]: { width, height }
            }));
          }}
          onRotate={({ target, rotate }) => {
            const currentTransform = target.style.transform || '';
            if (!currentTransform.includes('rotate')) {
              target.style.transform += ` rotate(${rotate}deg)`;
            } else {
              target.style.transform = currentTransform.replace(/rotate\([^)]+\)/, `rotate(${rotate}deg)`);
            }
          }}
        />
      )}
    </div>
  );
};

export default BannerCanvas;