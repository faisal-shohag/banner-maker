import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import BannerCanvas from '@/components/BannerCanvas';
import TemplateGallery from '@/components/TemplateGallery';
import TextEditor from '@/components/TextEditor';
import ColorPicker from '@/components/ColorPicker';
import FilterControls from '@/components/FilterControls';
import FontSelector from '@/components/FontSelector';
import ExportButton from '@/components/ExportButton';
import templates from '@/data/templates';
import { useToast } from "@/components/ui/use-toast";
import { TiExport } from "react-icons/ti";
import { RiShareFill } from "react-icons/ri";

const Index = () => {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  
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
    // Update states when template changes
    setMainText(selectedTemplate.defaultText);
    setMainTextColor(selectedTemplate.defaultTextColor);
    setMainFont(selectedTemplate.defaultFont);
    setMainFontSize(selectedTemplate.defaultFontSize);
    setMainTextWidth(selectedTemplate.textWidth || 80);
    setFilters(selectedTemplate.filters);
    
    // Update greeting details if they exist
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

  const resetFilters = () => {
    setFilters(selectedTemplate.filters);
    toast({
      title: "Filters Reset",
      description: "Image filters have been reset to default values.",
    });
  };

  // Create a modified template object with updated values
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
        <header className="text-center">
          {/* Header content if any */}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Editor Controls */}
          
          <div className="lg:col-span-5 xl:col-span-4 order-2 lg:order-1">
            <Card className="shadow-md">
              <CardContent className="p-4">
                <Tabs defaultValue="templates">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="templates">Templates</TabsTrigger>
                    <TabsTrigger value="text">Text</TabsTrigger>
                    <TabsTrigger value="style">Style</TabsTrigger>
                    {/* <TabsTrigger value="filters">Filters</TabsTrigger> */}
                  </TabsList>
                  
                  <TabsContent value="templates" className="space-y-4">
                    <TemplateGallery
                      templates={templates}
                      selectedTemplate={selectedTemplate}
                      onSelectTemplate={setSelectedTemplate}
                    />
                  </TabsContent>
                  
                  <TabsContent value="text" className="space-y-4">
                    {/* Main Text Controls */}
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
                    
                    {/* Details Text Controls */}
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
                  
                  {/* <TabsContent value="filters" className="space-y-4">
                    <FilterControls
                      filters={filters}
                      setFilters={setFilters}
                      resetFilters={resetFilters}
                    />
                  </TabsContent> */}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Banner Preview */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6 order-1 lg:order-2">
            <Card className="shadow-md animate-fade-in relative">
              <div className='flex justify-end items-center pt-1 px-5 gap-2 absolute z-50 bg-white rounded-xl -top-5 shadow-2xl right-0'>
                <div><TiExport/></div>
                <div><RiShareFill/></div>
              </div>
              <CardContent className="p-2 flex items-center justify-center">
                <BannerCanvas template={modifiedTemplate} />
              </CardContent>
            </Card>
            
            <div className="flex justify-end">
              <ExportButton filename={`eid-banner-${selectedTemplate.name.toLowerCase().replace(/\s+/g, '-')}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;