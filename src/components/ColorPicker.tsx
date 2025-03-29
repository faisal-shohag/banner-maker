
import React from 'react';
import { Label } from '@/components/ui/label';

interface ColorPickerProps {
  color: string;
  setColor: (color: string) => void;
  label?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  setColor,
  label = "Text Color",
}) => {
  const predefinedColors = [
    "#FFFFFF", "#000000", "#E9B44C", "#0A866A", "#7E69AB", "#39A9AB", 
    "#9A348E", "#FDF6E3", "#D62828", "#F77F00"
  ];

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-8 h-8 rounded overflow-hidden cursor-pointer"
        />
        <input
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="flex-1 px-2 py-1 text-sm border rounded-md"
        />
      </div>
      
      <div className="flex flex-wrap gap-2 mt-2">
        {predefinedColors.map((presetColor) => (
          <button
            key={presetColor}
            className={`w-6 h-6 rounded-full cursor-pointer transition-all ${
              color === presetColor ? "ring-2 ring-offset-2 ring-black" : ""
            }`}
            style={{ backgroundColor: presetColor }}
            onClick={() => setColor(presetColor)}
            aria-label={`Select ${presetColor} color`}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
