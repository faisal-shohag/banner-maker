
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { exportToPng } from '@/utils/exportUtils';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

interface ExportButtonProps {
  filename?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  filename = 'eid-banner',
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportToPng('banner-canvas', filename);
      toast.success('Banner exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export banner. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button 
      onClick={handleExport} 
      className={`w-full bg-eid-green hover:bg-eid-green/90 ${isExporting ? 'animate-save-pulse' : ''}`}
      disabled={isExporting}
    >
      <Download className="mr-2 h-4 w-4" />
      {isExporting ? 'Exporting...' : 'Export as PNG'}
    </Button>
  );
};

export default ExportButton;
