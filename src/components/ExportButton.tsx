import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { exportToPng } from '@/utils/exportUtils'; // Updated function
import { Download, Share2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  EmailIcon,
} from 'react-share';

const ExportShareModal = ({ filename, onClose }) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const url = await exportToPng('banner-canvas', filename); // Now returns dataUrl
      setImageUrl(url); // Set the data URL for sharing
      toast({
        title: 'Export Successful',
        description: 'Banner has been exported as PNG!',
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        variant: 'destructive',
        title: 'Export Failed',
        description: 'Failed to export banner. Please try again.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const shareTitle = 'Check out my custom Eid banner!';
  const shareUrl = imageUrl || window.location.href; // Use image URL if available

  return (
    <div className="space-y-6 p-4">
      <div className="space-y-4">
      <div className="flex items-center gap-2">
          <Download className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Export</h3>
        </div>
        <Button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
        >
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? 'Exporting...' : 'Export as PNG'}
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Share2 className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Share<span className='text-xs'> (Exprimental)</span></h3>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <FacebookShareButton url={shareUrl} title={shareTitle}>
            <div className="flex items-center justify-center p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <FacebookIcon size={32} round />
            </div>
          </FacebookShareButton>

          <TwitterShareButton url={shareUrl} title={shareTitle}>
            <div className="flex items-center justify-center p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <TwitterIcon size={32} round />
            </div>
          </TwitterShareButton>

          <WhatsappShareButton url={shareUrl} title={shareTitle}>
            <div className="flex items-center justify-center p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <WhatsappIcon size={32} round />
            </div>
          </WhatsappShareButton>

          <EmailShareButton url={shareUrl} subject={shareTitle}>
            <div className="flex items-center justify-center p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <EmailIcon size={32} round />
            </div>
          </EmailShareButton>
        </div>
        {imageUrl && (
          <p className="text-sm text-gray-600">Sharing the exported image URL</p>
        )}
      </div>
    </div>
  );
};

export default ExportShareModal;