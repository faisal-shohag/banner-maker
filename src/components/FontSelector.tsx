import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface FontSelectorProps {
  font: string;
  setFont: (font: string) => void;
}

const FontSelector: React.FC<FontSelectorProps> = ({
  font,
  setFont,
}) => {
  // Define available fonts with their actual font family names (not CSS classes)
  const fonts = [
    { name: 'Montserrat', value: 'Montserrat' },
    { name: 'Raleway', value: 'Raleway' },
    { name: 'Amiri', value: 'Amiri' },
    { name: 'Lateef', value: 'Lateef' },
    { name: 'Noto Nastaliq Urdu', value: 'Noto Nastaliq Urdu' },
    { name: 'Scheherazade New', value: 'Scheherazade New' },
    { name: 'Berkshire Swash', value: 'Berkshire Swash' },
    { name: 'শ্রেয়াম', value: 'Li Sweet Shreyam Unicode' },
    { name: 'কালপুরুষ', value: 'Kalpurush' },
    { name: 'হিন্দ শিলিগুড়ি', value: 'Hind Siliguri' },
  ];

  return (
    <div className="space-y-2">
      <Label htmlFor="font-selector">Font</Label>
      <Select value={font} onValueChange={setFont}>
        <SelectTrigger id="font-selector" className="w-full">
          <SelectValue placeholder="Select font" />
        </SelectTrigger>
        <SelectContent>
          {fonts.map((fontOption) => (
            <SelectItem 
              key={fontOption.value} 
              value={fontOption.value}
              style={{ fontFamily: fontOption.value }}
            >
              {fontOption.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FontSelector;