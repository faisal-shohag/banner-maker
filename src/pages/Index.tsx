import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import BannerCanvas from '@/components/BannerCanvas';
import TemplateGallery from '@/components/TemplateGallery';
import TextEditor from '@/components/TextEditor';
import ColorPicker from '@/components/ColorPicker';
import FontSelector from '@/components/FontSelector';
import templates from '@/data/templates';
import { useToast } from "@/components/ui/use-toast";
import { Share2 } from 'lucide-react';
import ExportShareModal from '@/components/ExportButton';
import { BiSolidWidget } from "react-icons/bi";
import { MdOutlineTextFields } from "react-icons/md";
import { IoMdColorPalette } from "react-icons/io";
import { AiFillHeart } from "react-icons/ai";

const Index = () => {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State for main text
  const [mainText, setMainText] = useState(selectedTemplate.defaultText);
  const [mainTextColor, setMainTextColor] = useState(selectedTemplate.defaultTextColor);
  const [mainFont, setMainFont] = useState(selectedTemplate.defaultFont);
  const [mainFontSize, setMainFontSize] = useState(selectedTemplate.defaultFontSize);
  const [mainTextWidth, setMainTextWidth] = useState(selectedTemplate.textWidth || 80);
  
  // State for greeting details (optional)
  const [detailsText, setDetailsText] = useState(selectedTemplate.greetingDetails?.text || '');
  const [detailsTextColor, setDetailsTextColor] = useState(selectedTemplate.greetingDetails?.color || '#ffffff');
  const [detailsFont, setDetailsFont] = useState(selectedTemplate.greetingDetails?.font || selectedTemplate.defaultFont);
  const [detailsFontSize, setDetailsFontSize] = useState(selectedTemplate.greetingDetails?.fontSize || 24);
  const [detailsTextWidth, setDetailsTextWidth] = useState(selectedTemplate.greetingDetails?.textWidth || 80);
  
  const [filters, setFilters] = useState(selectedTemplate.filters);

  useEffect(() => {
    setMainText(selectedTemplate.defaultText);
    setMainTextColor(selectedTemplate.defaultTextColor);
    setMainFont(selectedTemplate.defaultFont);
    setMainFontSize(selectedTemplate.defaultFontSize);
    setMainTextWidth(selectedTemplate.textWidth || 80);
    setFilters(selectedTemplate.filters);
    
    if (selectedTemplate.greetingDetails) {
      setDetailsText(selectedTemplate.greetingDetails.text);
      setDetailsTextColor(selectedTemplate.greetingDetails.color);
      setDetailsFont(selectedTemplate.greetingDetails.font);
      setDetailsFontSize(selectedTemplate.greetingDetails.fontSize);
      setDetailsTextWidth(selectedTemplate.greetingDetails.textWidth || 80);
    } else {
      setDetailsText('');
      setDetailsTextColor('#ffffff');
      setDetailsFont(selectedTemplate.defaultFont);
      setDetailsFontSize(24);
      setDetailsTextWidth(80);
    }
  }, [selectedTemplate]);

  const modifiedTemplate = {
    ...selectedTemplate,
    defaultText: mainText,
    defaultTextColor: mainTextColor,
    defaultFont: mainFont,
    defaultFontSize: mainFontSize,
    textWidth: mainTextWidth,
    filters: filters,
    greetingDetails: selectedTemplate.greetingDetails ? {
      ...selectedTemplate.greetingDetails,
      text: detailsText,
      color: detailsTextColor,
      font: detailsFont,
      fontSize: detailsFontSize,
      textWidth: detailsTextWidth,
    } : undefined,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Editor Controls */}
          <div className="lg:col-span-5 xl:col-span-4 order-2 lg:order-1">
            <Card className="shadow-md">
              <CardContent className="p-4">
                <Tabs defaultValue="templates">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger className='gap-1' value="templates"><BiSolidWidget/> Templates</TabsTrigger>
                    <TabsTrigger className='gap-1' value="text"><MdOutlineTextFields/> Text</TabsTrigger>
                    <TabsTrigger className='gap-1' value="style"><IoMdColorPalette/> Style</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="templates" className="space-y-4">
                    <TemplateGallery
                      templates={templates}
                      selectedTemplate={selectedTemplate}
                      onSelectTemplate={setSelectedTemplate}
                    />
                  </TabsContent>
                  
                  <TabsContent value="text" className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Main Text</h3>
                      <TextEditor
                        text={mainText}
                        setText={setMainText}
                        fontSize={mainFontSize}
                        setFontSize={setMainFontSize}
                        textWidth={mainTextWidth}
                        setTextWidth={setMainTextWidth}
                      />
                      <Separator className="my-4" />
                      <FontSelector font={mainFont} setFont={setMainFont} />
                    </div>
                    
                    {selectedTemplate.greetingDetails && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Details Text</h3>
                        <TextEditor
                          text={detailsText}
                          setText={setDetailsText}
                          fontSize={detailsFontSize}
                          setFontSize={setDetailsFontSize}
                          textWidth={detailsTextWidth}
                          setTextWidth={setDetailsTextWidth}
                        />
                        <Separator className="my-4" />
                        <FontSelector font={detailsFont} setFont={setDetailsFont} />
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="style" className="space-y-4">
                    <ColorPicker
                      color={mainTextColor}
                      setColor={setMainTextColor}
                      label="Main Text Color"
                    />
                    {selectedTemplate.greetingDetails && (
                      <ColorPicker
                        color={detailsTextColor}
                        setColor={setDetailsTextColor}
                        label="Details Text Color"
                      />
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Banner Preview */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6 order-1 lg:order-2">
            <Card className="shadow-md animate-fade-in">
              <CardContent className="p-2 flex items-center justify-center">
                <BannerCanvas template={modifiedTemplate} />
              </CardContent>
            </Card>
            
            <div className="flex justify-between items-center">
              <div className='font-bold text-muted-foreground flex items-center gap-1 text-xs'>
                Created with <AiFillHeart className='text-red-500'/> by <a className='underline' target="_blank" href='https://github.com/faisal-shohag'>Abu Nayim Faisal</a>
              </div>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                    <Share2 className="mr-2 h-4 w-4" />
                    Export & Share
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Export & Share Your Banner</DialogTitle>
                  </DialogHeader>
                  <ExportShareModal 
                    filename={`eid-banner-${selectedTemplate.name.toLowerCase().replace(/\s+/g, '-')}`}
                    onClose={() => setIsModalOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;