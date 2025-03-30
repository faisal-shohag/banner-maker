import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface TextEditorProps {
  text: string;
  setText: (text: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  textWidth?: number;
  setTextWidth?: (width: number) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({
  text,
  setText,
  fontSize,
  setFontSize,
  textWidth = 80,
  setTextWidth
}) => {
  return (
    <div className="space-y-4">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text here"
        className="min-h-32 text-lg font-kalpurush"
      />
      
      <div className="space-y-2 hidden">
        <Label>Font Size: {fontSize}px</Label>
        <Slider
          value={[fontSize]}
          min={12}
          max={120}
          step={1}
          onValueChange={(values) => setFontSize(values[0])}
        />
      </div>
      
      {setTextWidth && (
        <div className="space-y-2 hidden">
          <Label>Text Width: {textWidth}%</Label>
          <Slider
            value={[textWidth]}
            min={20}
            max={100}
            step={5}
            onValueChange={(values) => setTextWidth(values[0])}
          />
        </div>
      )}
    </div>
  );
};

export default TextEditor;