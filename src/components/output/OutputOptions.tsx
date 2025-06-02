
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

const resumeTemplates = [
  { id: "modern", name: "Modern Clean", description: "Clean, minimal design with clear sections", preview: "bg-gradient-to-br from-blue-50 to-white" },
  { id: "professional", name: "Professional", description: "Traditional format with classic styling", preview: "bg-gradient-to-br from-gray-50 to-white" },
  { id: "creative", name: "Creative", description: "Bold design with color accents", preview: "bg-gradient-to-br from-purple-50 to-pink-50" },
  { id: "minimalist", name: "Minimalist", description: "Ultra-clean with focus on content", preview: "bg-gradient-to-br from-slate-50 to-white" },
  { id: "executive", name: "Executive", description: "Sophisticated layout for senior roles", preview: "bg-gradient-to-br from-emerald-50 to-white" },
  { id: "tech", name: "Tech Focus", description: "Modern design for IT professionals", preview: "bg-gradient-to-br from-cyan-50 to-blue-50" },
];

const coverLetterTemplates = [
  { id: "professional", name: "Professional", description: "Formal and structured approach", preview: "bg-gradient-to-br from-blue-50 to-white" },
  { id: "conversational", name: "Conversational", description: "Friendly and personal tone", preview: "bg-gradient-to-br from-green-50 to-white" },
  { id: "confident", name: "Confident", description: "Bold and assertive style", preview: "bg-gradient-to-br from-orange-50 to-white" },
  { id: "storytelling", name: "Storytelling", description: "Narrative-driven approach", preview: "bg-gradient-to-br from-purple-50 to-white" },
  { id: "technical", name: "Technical", description: "Focus on technical achievements", preview: "bg-gradient-to-br from-gray-50 to-white" },
  { id: "startup", name: "Startup", description: "Dynamic and innovative tone", preview: "bg-gradient-to-br from-red-50 to-white" },
];

const portfolioTemplates = [
  { id: "developer", name: "Developer Portfolio", description: "Code projects & technical skills", preview: "bg-gradient-to-br from-slate-100 to-gray-100" },
  { id: "designer", name: "Creative Designer", description: "Visual portfolio with project showcases", preview: "bg-gradient-to-br from-pink-100 to-purple-100" },
  { id: "product", name: "Product Manager", description: "Case studies and product strategy", preview: "bg-gradient-to-br from-blue-100 to-cyan-100" },
  { id: "business", name: "Business Professional", description: "Achievements and business results", preview: "bg-gradient-to-br from-green-100 to-emerald-100" },
  { id: "consultant", name: "Consultant", description: "Problem-solving and client work", preview: "bg-gradient-to-br from-indigo-100 to-blue-100" },
  { id: "freelancer", name: "Freelancer", description: "Diverse skills and client testimonials", preview: "bg-gradient-to-br from-yellow-100 to-orange-100" },
  { id: "startup", name: "Startup Founder", description: "Ventures and entrepreneurial journey", preview: "bg-gradient-to-br from-red-100 to-pink-100" },
  { id: "academic", name: "Academic", description: "Research and publications focus", preview: "bg-gradient-to-br from-teal-100 to-green-100" },
];

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
      await new Promise(resolve => setTimeout(resolve, 2500));

      const outputs = {
        resumeStyle,
        coverLetterStyle,
        portfolioTemplate,
        purpose,
        coverLetterTone,
        jobDescription,
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
          Choose from our professionally designed templates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="resume" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="resume">Resume Templates</TabsTrigger>
            <TabsTrigger value="cover">Cover Letter</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          </TabsList>
          
          <TabsContent value="resume" className="space-y-4">
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Choose Resume Template</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resumeTemplates.map((template) => (
                  <div key={template.id}>
                    <RadioGroup value={resumeStyle} onValueChange={setResumeStyle}>
                      <div>
                        <RadioGroupItem 
                          value={template.id} 
                          id={template.id} 
                          className="peer sr-only" 
                        />
                        <Label
                          htmlFor={template.id}
                          className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                        >
                          <div className={`h-20 w-full rounded-md ${template.preview} mb-3 flex items-center justify-center`}>
                            <div className="w-3/4 h-3/4 bg-white/80 rounded-sm shadow-sm"></div>
                          </div>
                          <span className="font-semibold text-center">{template.name}</span>
                          <span className="text-xs text-muted-foreground text-center mt-1">{template.description}</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                ))}
              </div>
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
                  <SelectItem value="career-change">Career Change</SelectItem>
                  <SelectItem value="promotion">Internal Promotion</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          <TabsContent value="cover" className="space-y-4">
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Choose Cover Letter Style</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {coverLetterTemplates.map((template) => (
                  <div key={template.id}>
                    <RadioGroup value={coverLetterStyle} onValueChange={setCoverLetterStyle}>
                      <div>
                        <RadioGroupItem 
                          value={template.id} 
                          id={`cover-${template.id}`} 
                          className="peer sr-only" 
                        />
                        <Label
                          htmlFor={`cover-${template.id}`}
                          className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                        >
                          <div className={`h-20 w-full rounded-md ${template.preview} mb-3 flex items-center justify-center`}>
                            <div className="w-3/4 h-3/4 bg-white/80 rounded-sm shadow-sm p-2">
                              <div className="h-1 bg-gray-300 rounded mb-1"></div>
                              <div className="h-1 bg-gray-300 rounded mb-1"></div>
                              <div className="h-1 bg-gray-300 rounded w-3/4"></div>
                            </div>
                          </div>
                          <span className="font-semibold text-center">{template.name}</span>
                          <span className="text-xs text-muted-foreground text-center mt-1">{template.description}</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                ))}
              </div>
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
                  <SelectItem value="analytical">Analytical</SelectItem>
                  <SelectItem value="collaborative">Collaborative</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          <TabsContent value="portfolio" className="space-y-4">
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Choose Portfolio Template</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {portfolioTemplates.map((template) => (
                  <div key={template.id}>
                    <RadioGroup value={portfolioTemplate} onValueChange={setPortfolioTemplate}>
                      <div>
                        <RadioGroupItem 
                          value={template.id} 
                          id={`portfolio-${template.id}`} 
                          className="peer sr-only" 
                        />
                        <Label
                          htmlFor={`portfolio-${template.id}`}
                          className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                        >
                          <div className={`h-16 w-full rounded-md ${template.preview} mb-2 flex items-center justify-center`}>
                            <div className="w-full h-full bg-white/80 rounded-sm shadow-sm p-1">
                              <div className="h-1/3 bg-gray-300 rounded-sm mb-1"></div>
                              <div className="grid grid-cols-2 gap-1 h-2/3">
                                <div className="bg-gray-300 rounded-sm"></div>
                                <div className="bg-gray-300 rounded-sm"></div>
                              </div>
                            </div>
                          </div>
                          <span className="font-medium text-center text-sm">{template.name}</span>
                          <span className="text-xs text-muted-foreground text-center">{template.description}</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                ))}
              </div>
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
          {isProcessing ? "Generating..." : "Generate All Materials"}
        </Button>
      </CardFooter>
    </Card>
  );
}
