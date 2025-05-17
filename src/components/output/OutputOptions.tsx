
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface OutputOptionsProps {
  userData: any;
  onComplete: (outputs: any) => void;
}

export function OutputOptions({ userData, onComplete }: OutputOptionsProps) {
  const [activeTab, setActiveTab] = useState("resume");
  const [resumeStyle, setResumeStyle] = useState("modern");
  const [coverLetterStyle, setCoverLetterStyle] = useState("professional");
  const [portfolioTemplate, setPortfolioTemplate] = useState("developer");
  const [purpose, setPurpose] = useState("job");
  const [coverLetterTone, setCoverLetterTone] = useState("professional");
  const [jobDescription, setJobDescription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsProcessing(true);

    try {
      // Simulate generation process
      await new Promise(resolve => setTimeout(resolve, 2500));

      const outputs = {
        resumeStyle,
        coverLetterStyle,
        portfolioTemplate,
        purpose,
        coverLetterTone,
        jobDescription,
        // Simulated generated content
        resumeContent: "Generated resume content would appear here in a production app",
        coverLetterContent: "Generated cover letter content would appear here in a production app",
        portfolioUrl: "https://yourname.vercel.app"
      };

      toast({
        title: "Output generated successfully",
        description: "Your resume, cover letter, and portfolio have been generated.",
      });

      onComplete(outputs);
    } catch (error) {
      toast({
        title: "Error generating output",
        description: "There was an issue generating your output. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Create Your Career Materials</CardTitle>
        <CardDescription>
          Customize your resume, cover letter, and portfolio options
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="resume" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="resume">Resume</TabsTrigger>
            <TabsTrigger value="cover">Cover Letter</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          </TabsList>
          
          <TabsContent value="resume" className="space-y-4">
            <div className="space-y-2">
              <Label>Resume Style</Label>
              <RadioGroup 
                value={resumeStyle}
                onValueChange={setResumeStyle}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem 
                    value="modern" 
                    id="modern" 
                    className="peer sr-only" 
                  />
                  <Label
                    htmlFor="modern"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="h-12 w-12 rounded-full bg-muted/50 mb-2"></div>
                    <span className="font-semibold">Modern</span>
                    <span className="text-xs text-muted-foreground">Clean, minimal design with clear sections</span>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem 
                    value="traditional" 
                    id="traditional" 
                    className="peer sr-only" 
                  />
                  <Label
                    htmlFor="traditional"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="h-12 w-12 rounded-full bg-muted/50 mb-2"></div>
                    <span className="font-semibold">Traditional</span>
                    <span className="text-xs text-muted-foreground">Classic format with traditional styling</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label>Purpose</Label>
              <Select value={purpose} onValueChange={setPurpose}>
                <SelectTrigger>
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="job">Job Application</SelectItem>
                  <SelectItem value="freelance">Freelancing</SelectItem>
                  <SelectItem value="branding">Personal Branding</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          <TabsContent value="cover" className="space-y-4">
            <div className="space-y-2">
              <Label>Cover Letter Style</Label>
              <RadioGroup 
                value={coverLetterStyle}
                onValueChange={setCoverLetterStyle}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem 
                    value="professional" 
                    id="professional" 
                    className="peer sr-only" 
                  />
                  <Label
                    htmlFor="professional"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="h-12 w-12 rounded-full bg-muted/50 mb-2"></div>
                    <span className="font-semibold">Professional</span>
                    <span className="text-xs text-muted-foreground">Formal and structured</span>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem 
                    value="conversational" 
                    id="conversational" 
                    className="peer sr-only" 
                  />
                  <Label
                    htmlFor="conversational"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="h-12 w-12 rounded-full bg-muted/50 mb-2"></div>
                    <span className="font-semibold">Conversational</span>
                    <span className="text-xs text-muted-foreground">Friendly and personal</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={coverLetterTone} onValueChange={setCoverLetterTone}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                  <SelectItem value="confident">Confident</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          <TabsContent value="portfolio" className="space-y-4">
            <div className="space-y-2">
              <Label>Portfolio Template</Label>
              <RadioGroup 
                value={portfolioTemplate}
                onValueChange={setPortfolioTemplate}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem 
                    value="developer" 
                    id="developer" 
                    className="peer sr-only" 
                  />
                  <Label
                    htmlFor="developer"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="h-12 w-12 rounded-full bg-muted/50 mb-2"></div>
                    <span className="font-semibold">Developer</span>
                    <span className="text-xs text-muted-foreground">Focused on code projects & technical skills</span>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem 
                    value="designer" 
                    id="designer" 
                    className="peer sr-only" 
                  />
                  <Label
                    htmlFor="designer"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="h-12 w-12 rounded-full bg-muted/50 mb-2"></div>
                    <span className="font-semibold">Designer</span>
                    <span className="text-xs text-muted-foreground">Visual portfolio with project showcases</span>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem 
                    value="product" 
                    id="product" 
                    className="peer sr-only" 
                  />
                  <Label
                    htmlFor="product"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="h-12 w-12 rounded-full bg-muted/50 mb-2"></div>
                    <span className="font-semibold">Product Manager</span>
                    <span className="text-xs text-muted-foreground">Highlights product strategy & results</span>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem 
                    value="business" 
                    id="business" 
                    className="peer sr-only" 
                  />
                  <Label
                    htmlFor="business"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="h-12 w-12 rounded-full bg-muted/50 mb-2"></div>
                    <span className="font-semibold">Business</span>
                    <span className="text-xs text-muted-foreground">Professional with focus on achievements</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </TabsContent>
        </Tabs>

        <div className="border-t pt-4">
          <div className="space-y-2">
            <Label htmlFor="job-description">Job Description (Optional)</Label>
            <Textarea 
              id="job-description"
              placeholder="Paste a job description to optimize your resume and cover letter for specific keywords"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[120px]"
            />
            <p className="text-xs text-muted-foreground">
              This will help tailor your materials to include relevant keywords and match the job requirements.
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button onClick={handleGenerate} disabled={isProcessing}>
          {isProcessing ? "Generating..." : "Generate"}
        </Button>
      </CardFooter>
    </Card>
  );
}
