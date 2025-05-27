
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  preview_image: string;
  template_data: any;
}

interface PortfolioTemplatesProps {
  onSelect: (template: Template) => void;
}

export function PortfolioTemplates({ onSelect }: PortfolioTemplatesProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // For now, use hardcoded templates until the database table is available
    const hardcodedTemplates: Template[] = [
      {
        id: '1',
        name: 'Modern Developer',
        category: 'developer',
        description: 'A clean, modern template for software developers',
        preview_image: 'modern_dev.jpg',
        template_data: {
          layout: 'sidebar',
          color_scheme: 'blue',
          sections: ['intro', 'skills', 'projects', 'experience', 'education', 'contact']
        }
      },
      {
        id: '2',
        name: 'Creative Designer',
        category: 'designer',
        description: 'Showcase your design portfolio with this visual template',
        preview_image: 'creative_design.jpg',
        template_data: {
          layout: 'grid',
          color_scheme: 'purple',
          sections: ['intro', 'showcase', 'skills', 'experience', 'testimonials', 'contact']
        }
      },
      {
        id: '3',
        name: 'Product Manager',
        category: 'business',
        description: 'Highlight your product management experience and skills',
        preview_image: 'product_mgr.jpg',
        template_data: {
          layout: 'full',
          color_scheme: 'green',
          sections: ['intro', 'approach', 'case_studies', 'skills', 'experience', 'education']
        }
      },
      {
        id: '4',
        name: 'Startup Founder',
        category: 'founder',
        description: 'Perfect for entrepreneurs and founders',
        preview_image: 'founder.jpg',
        template_data: {
          layout: 'cards',
          color_scheme: 'orange',
          sections: ['intro', 'ventures', 'achievements', 'skills', 'philosophy', 'contact']
        }
      }
    ];

    setTemplates(hardcodedTemplates);
    setLoading(false);
  }, []);

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template.id);
    onSelect(template);
    toast({
      title: "Template selected",
      description: `You've selected the ${template.name} template.`,
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading templates...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const categories = [...new Set(templates.map(t => t.category))];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Choose Your Portfolio Template</h2>
        <p className="text-muted-foreground">
          Select a template that best represents your professional style
        </p>
      </div>

      {categories.map((category) => (
        <div key={category} className="space-y-4">
          <h3 className="text-xl font-semibold capitalize">{category} Templates</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates
              .filter((template) => template.category === category)
              .map((template) => (
                <Card 
                  key={template.id} 
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleSelectTemplate(template)}
                >
                  <CardHeader>
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-md mb-2 flex items-center justify-center">
                      <span className="text-2xl font-bold text-muted-foreground">
                        {template.name.charAt(0)}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="capitalize">
                        {template.category}
                      </Badge>
                      <Button 
                        size="sm" 
                        variant={selectedTemplate === template.id ? "default" : "outline"}
                      >
                        {selectedTemplate === template.id ? "Selected" : "Select"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
