
import React from 'react';
import { Template } from '@/data/templates';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TemplateGalleryProps {
  templates: Template[];
  selectedTemplate: Template;
  onSelectTemplate: (template: Template) => void;
}

const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  templates,
  selectedTemplate,
  onSelectTemplate,
}) => {
  const categories = [...new Set(templates.map(t => t.category))];

  return (
    <div className="space-y-4">
     
      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category} className="space-y-2">
            <h3 className="text-sm font-medium capitalize">{category.replace(/-/g, ' ')} ({(templates
              .filter(t => t.category === category)).length})</h3>
            <ScrollArea className="lg:h-[500px] w-full">
              <div className="flex flex-wrap gap-3 p-1">
                {templates
                  .filter(t => t.category === category)
                  .map((template) => (
                    <Card 
                      key={template.id}
                      className={`w-40 h-32 cursor-pointer overflow-hidden transition-all ${
                        selectedTemplate.id === template.id ? 'ring-2 ring-eid-green' : 'hover:ring-1 hover:ring-eid-gold'
                      }`}
                      onClick={() => onSelectTemplate(template)}
                    >
                      <CardContent className="p-0 h-full">
                        <div className="relative h-full">
                          <img
                            src={template.imageUrl}
                            alt={template.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-end justify-center">
                            <span className="text-white text-xs pb-2">{template.name}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </ScrollArea>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateGallery;
