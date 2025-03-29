
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface Filters {
  brightness: number;
  contrast: number;
  saturation: number;
}

interface FilterControlsProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  resetFilters: () => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  setFilters,
  resetFilters,
}) => {
  const handleFilterChange = (type: keyof Filters, value: number[]) => {
    setFilters({ ...filters, [type]: value[0] });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Image Filters</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={resetFilters}
          className="text-xs"
        >
          Reset
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="brightness">Brightness</Label>
            <span className="text-sm text-muted-foreground">{filters.brightness}%</span>
          </div>
          <Slider
            id="brightness"
            min={50}
            max={150}
            step={1}
            value={[filters.brightness]}
            onValueChange={(value) => handleFilterChange('brightness', value)}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="contrast">Contrast</Label>
            <span className="text-sm text-muted-foreground">{filters.contrast}%</span>
          </div>
          <Slider
            id="contrast"
            min={50}
            max={150}
            step={1}
            value={[filters.contrast]}
            onValueChange={(value) => handleFilterChange('contrast', value)}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="saturation">Saturation</Label>
            <span className="text-sm text-muted-foreground">{filters.saturation}%</span>
          </div>
          <Slider
            id="saturation"
            min={0}
            max={200}
            step={1}
            value={[filters.saturation]}
            onValueChange={(value) => handleFilterChange('saturation', value)}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterControls;
