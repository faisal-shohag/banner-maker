import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";

interface Logo {
  id: string;
  url: string;
  visible: boolean;
}

interface LogoTabProps {
  logos: Logo[];
  onToggleLogo: (id: string) => void;
  onRemoveLogo: (id: string) => void;
}

const LogoTab: React.FC<LogoTabProps> = ({ 
  logos, 
  onToggleLogo,
  onRemoveLogo
}) => {
  const availableLogos = [
    { id: "logo2", url: "https://i.postimg.cc/7ZYbRmWD/image.png" },
    { id: "logo3", url: "https://i.postimg.cc/VNxv3W3N/image.png" },
    { id: "logo1", url: "https://i.postimg.cc/tT9Jq440/image.png" },
    
  ];

  return (
    <TabsContent value="logos" className="space-y-4">
      <h3 className="text-lg font-semibold">Add Logos</h3>
      <p className="text-sm text-muted-foreground">Click on a logo to add it to your banner. You can drag, resize, and rotate logos on the canvas.</p>
      
      <div className="grid grid-cols-3 gap-3 mt-4">
        {availableLogos.map((logo) => {
          const isActive = logos.some(l => l.id === logo.id && l.visible);
          
          return (
            <Card 
              key={logo.id} 
              className={`p-2 cursor-pointer transition-all hover:shadow-md ${isActive ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
              onClick={() => onToggleLogo(logo.id)}
            >
              <div className="relative h-16 flex items-center justify-center">
                <img 
                  src={logo.url} 
                  alt={`Logo ${logo.id}`} 
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </Card>
          );
        })}
      </div>

      {logos.filter(logo => logo.visible).length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-2">Active Logos</h4>
          <div className="space-y-2 border rounded-md p-2">
            {logos.filter(logo => logo.visible).map((logo) => (
              <div key={logo.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center">
                  <img src={logo.url} alt={`Logo ${logo.id}`} className="h-8 w-8 object-contain mr-2" />
                  <span className="text-sm">Logo {logo.id.replace('logo', '')}</span>
                </div>
                <button 
                  onClick={() => onRemoveLogo(logo.id)} 
                  className="p-1 hover:bg-gray-200 rounded-full"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </TabsContent>
  );
};

export default LogoTab;