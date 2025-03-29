
import React from 'react';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface TextEditorProps {
  text: string;
  setText: (text: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({
  text,
  setText,
  fontSize,
  setFontSize,
}) => {
  const handleFontSizeChange = (value: number[]) => {
    setFontSize(value[0]);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Edit Text</h2>
      
      <div className="space-y-2">
        <Label htmlFor="banner-text">Greeting Text</Label>
        <Input
          id="banner-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your greeting text"
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="font-size">Font Size</Label>
          <span className="text-sm text-muted-foreground">{fontSize}px</span>
        </div>
        <Slider
          id="font-size"
          min={16}
          max={120}
          step={1}
          value={[fontSize]}
          onValueChange={handleFontSizeChange}
        />
      </div>
    </div>
  );
};

export default TextEditor;
