
import { AppLayout } from "@/components/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Templates = () => {
  const { toast } = useToast();
  
  const handleTemplateSelect = () => {
    toast({
      title: "Template selected",
      description: "This template has been added to your account.",
    });
  };

  return (
    <AppLayout>
      <div className="container py-8">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-2 mb-6">
            <h1 className="text-3xl font-bold">Templates Gallery</h1>
            <p className="text-muted-foreground">
              Browse our collection of resume, cover letter, and portfolio templates
            </p>
          </div>
          
          <Tabs defaultValue="resume" className="mb-8">
            <TabsList className="grid grid-cols-3 w-[400px]">
              <TabsTrigger value="resume">Resume</TabsTrigger>
              <TabsTrigger value="cover">Cover Letter</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            </TabsList>
            
            <TabsContent value="resume" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: "Modern Clean", category: "General" },
                  { name: "Traditional", category: "General" },
                  { name: "Tech Focused", category: "IT" },
                  { name: "Creative", category: "Design" },
                  { name: "Academic", category: "Research" },
                  { name: "Executive", category: "Business" },
                ].map((template, i) => (
                  <Card key={i} className="overflow-hidden hover-scale">
                    <div className="aspect-[4/5] bg-muted flex items-center justify-center">
                      <div className="w-3/4 h-4/5 bg-background border rounded-sm p-3">
                        <div className="w-full h-6 mb-3 bg-muted rounded-sm"></div>
                        <div className="space-y-2">
                          <div className="w-full h-3 bg-muted rounded-sm"></div>
                          <div className="w-full h-3 bg-muted rounded-sm"></div>
                          <div className="w-3/4 h-3 bg-muted rounded-sm"></div>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">{template.category}</p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button variant="outline" size="sm" onClick={handleTemplateSelect} className="w-full">
                        Use Template
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="cover" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: "Professional", category: "General" },
                  { name: "Conversational", category: "General" },
                  { name: "Technical", category: "IT" },
                  { name: "Creative", category: "Design" },
                  { name: "Academic", category: "Research" },
                ].map((template, i) => (
                  <Card key={i} className="overflow-hidden hover-scale">
                    <div className="aspect-[4/5] bg-muted flex items-center justify-center">
                      <div className="w-3/4 h-4/5 bg-background border rounded-sm p-3">
                        <div className="w-1/2 h-3 mb-6 bg-muted rounded-sm self-end ml-auto"></div>
                        <div className="space-y-2">
                          <div className="w-full h-3 bg-muted rounded-sm"></div>
                          <div className="w-full h-3 bg-muted rounded-sm"></div>
                          <div className="w-full h-3 bg-muted rounded-sm"></div>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">{template.category}</p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button variant="outline" size="sm" onClick={handleTemplateSelect} className="w-full">
                        Use Template
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="portfolio" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: "Developer Portfolio", category: "IT" },
                  { name: "Designer Showcase", category: "Creative" },
                  { name: "Product Manager", category: "Business" },
                  { name: "Founder", category: "Startup" },
                  { name: "Marketer", category: "Marketing" },
                  { name: "Researcher", category: "Academic" },
                ].map((template, i) => (
                  <Card key={i} className="overflow-hidden hover-scale">
                    <div className="aspect-[4/5] bg-muted flex items-center justify-center">
                      <div className="w-3/4 h-4/5 bg-background border rounded-sm p-1">
                        <div className="h-1/4 bg-muted rounded-sm mb-1"></div>
                        <div className="grid grid-cols-2 gap-1 h-3/4">
                          <div className="bg-muted rounded-sm"></div>
                          <div className="bg-muted rounded-sm"></div>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">{template.category}</p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button variant="outline" size="sm" onClick={handleTemplateSelect} className="w-full">
                        Use Template
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
};

export default Templates;
