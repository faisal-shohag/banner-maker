import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import BannerCanvas from "@/components/BannerCanvas";
import TemplateGallery from "@/components/TemplateGallery";
import TextEditor from "@/components/TextEditor";
import ColorPicker from "@/components/ColorPicker";
import FontSelector from "@/components/FontSelector";
import LogoTab from "@/components/LogoTab"; // New import for the Logo tab
import templates from "@/data/templates";
import { useToast } from "@/components/ui/use-toast";
import { Share2 } from "lucide-react";
import ExportShareModal from "@/components/ExportButton";
import { BiSolidWidget } from "react-icons/bi";
import { MdOutlineTextFields } from "react-icons/md";
import { IoIosLeaf, IoMdColorPalette, IoMdImage } from "react-icons/io";

import { AiFillHeart } from "react-icons/ai";
import { FaRegImages } from "react-icons/fa"; // Import for logo tab icon
import FeedbackSection from "@/components/Feedback";
import { useDeviceSize } from "@/hooks/use-device-size";

// Interface for Logo
interface Logo {
  id: string;
  url: string;
  visible: boolean;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
}

const Index = () => {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [customImageUrl, setCustomImageUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isLarge } = useDeviceSize();

  // Logos state
  const [logos, setLogos] = useState<Logo[]>([
    { id: "logo2", url: "https://i.postimg.cc/7ZYbRmWD/image.png", visible: false },
    { id: "logo3", url: "https://i.postimg.cc/VNxv3W3N/image.png", visible: false },
    { id: "logo1", url: "https://i.postimg.cc/tT9Jq440/image.png", visible: false },
    
  ]);

  // State for main text
  const [mainText, setMainText] = useState(selectedTemplate.defaultText);
  const [mainTextColor, setMainTextColor] = useState(selectedTemplate.defaultTextColor);
  const [mainFont, setMainFont] = useState(selectedTemplate.defaultFont);
  const [mainFontSize, setMainFontSize] = useState(selectedTemplate.defaultFontSize);
  const [mainTextWidth, setMainTextWidth] = useState(selectedTemplate.textWidth || 80);

  // State for greeting details (optional)
  const [detailsText, setDetailsText] = useState(selectedTemplate.greetingDetails?.text || "");
  const [detailsTextColor, setDetailsTextColor] = useState(selectedTemplate.greetingDetails?.color || "#ffffff");
  const [detailsFont, setDetailsFont] = useState(selectedTemplate.greetingDetails?.font || selectedTemplate.defaultFont);
  const [detailsFontSize, setDetailsFontSize] = useState(selectedTemplate.greetingDetails?.fontSize || 24);
  const [detailsTextWidth, setDetailsTextWidth] = useState(selectedTemplate.greetingDetails?.textWidth || 80);

  const [filters, setFilters] = useState(selectedTemplate.filters);

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCustomImageUrl(imageUrl);
      toast({
        title: "Image Uploaded",
        description: "Your custom image has been successfully uploaded.",
      });
    }
  };

  // Handle logo toggling
  const handleToggleLogo = (logoId: string) => {
    setLogos(prevLogos => 
      prevLogos.map(logo => 
        logo.id === logoId 
          ? { ...logo, visible: !logo.visible } 
          : logo
      )
    );
    
    const logo = logos.find(l => l.id === logoId);
    if (logo && !logo.visible) {
      toast({
        title: "Logo Added",
        description: `Logo has been added to your banner. You can drag and resize it.`,
      });
    }
  };

  // Handle logo removal
  const handleRemoveLogo = (logoId: string) => {
    setLogos(prevLogos => 
      prevLogos.map(logo => 
        logo.id === logoId 
          ? { ...logo, visible: false } 
          : logo
      )
    );
    
    toast({
      title: "Logo Removed",
      description: "Logo has been removed from your banner.",
    });
  };

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
      setDetailsText("");
      setDetailsTextColor("#ffffff");
      setDetailsFont(selectedTemplate.defaultFont);
      setDetailsFontSize(24);
      setDetailsTextWidth(80);
    }
    // Reset custom image when changing templates
    setCustomImageUrl(null);
  }, [selectedTemplate]);

  const modifiedTemplate = {
    ...selectedTemplate,
    imageUrl: customImageUrl || selectedTemplate.imageUrl,
    defaultText: mainText,
    defaultTextColor: mainTextColor,
    defaultFont: mainFont,
    defaultFontSize: mainFontSize,
    textWidth: mainTextWidth,
    filters: filters,
    greetingDetails: selectedTemplate.greetingDetails
      ? {
          ...selectedTemplate.greetingDetails,
          text: detailsText,
          color: detailsTextColor,
          font: detailsFont,
          fontSize: detailsFontSize,
          textWidth: detailsTextWidth,
        }
      : undefined,
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
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger className="gap-1" value="templates">
                      <BiSolidWidget /> Templates
                    </TabsTrigger>
                    <TabsTrigger className="gap-1" value="text">
                      <MdOutlineTextFields /> Text
                    </TabsTrigger>
                    <TabsTrigger className="gap-1" value="style">
                      <IoMdColorPalette /> Style
                    </TabsTrigger>

                    <TabsTrigger className="gap-1" value="logos">
                      <IoIosLeaf /> Logos
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="templates" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold">Select Template</h2>
                      <label className="cursor-pointer flex border border-dashed px-3 py-1 rounded-xl items-center">
                      
                        <IoMdImage className="text-2xl text-blue-700 hover:text-blue-900" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <span className="text-xs">Choose</span>
                      </label>
                    </div>
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

                  <LogoTab logos={logos} onRemoveLogo={handleRemoveLogo} onToggleLogo={handleToggleLogo}/>
                </Tabs>
              </CardContent>
            </Card>

            {!isLarge && (
              <div className="mt-5">
                <FeedbackSection />
              </div>
            )}
          </div>

          {/* Right Panel - Banner Preview */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6 order-1 lg:order-2">
            <Card className="shadow-md animate-fade-in">
              <CardContent className="p-2 flex items-center justify-center">
                <BannerCanvas logos={logos} template={modifiedTemplate} />
              </CardContent>
            </Card>

            {/* SETTINGS */}
            <div className="flex justify-between items-center order-1">
              <div className="font-bold text-muted-foreground flex items-center gap-1 text-xs">
                Created with <AiFillHeart className="text-red-500" /> by{" "}
                <a
                  className="underline"
                  target="_blank"
                  href="https://github.com/faisal-shohag"
                >
                  Abu Nayim Faisal
                </a>
              </div>
              <Dialog  open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                    <Share2 className="mr-2 h-4 w-4" />
                    Export & Share
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md z-[999999]">
                  <DialogHeader>
                    <DialogTitle>Export & Share Your Banner</DialogTitle>
                  </DialogHeader>
                  <ExportShareModal
                    filename={`eid-banner-${selectedTemplate.name
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                    onClose={() => setIsModalOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
            {isLarge && (
              <div>
                <FeedbackSection />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;