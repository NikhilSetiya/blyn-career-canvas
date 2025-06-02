
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { PortfolioPreview } from "@/components/portfolio/PortfolioPreview";
import { NetlifyDeployService } from "@/services/netlifyDeploy";
import { ExternalLink } from "lucide-react";

interface FinalOutputProps {
  userData: any;
  outputOptions: any;
  onComplete: () => void;
}

export function FinalOutput({ userData, outputOptions, onComplete }: FinalOutputProps) {
  const [activeTab, setActiveTab] = useState("resume");
  const [isExporting, setIsExporting] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [netlifyToken, setNetlifyToken] = useState("");
  const [deployedUrl, setDeployedUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Simulate export
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Export successful",
        description: `Your ${activeTab} has been exported.`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an issue exporting your file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeploy = async () => {
    if (!netlifyToken.trim()) {
      toast({
        title: "Netlify token required",
        description: "Please enter your Netlify API token to deploy.",
        variant: "destructive",
      });
      return;
    }

    setIsDeploying(true);
    
    try {
      const deployService = new NetlifyDeployService(netlifyToken);
      const url = await deployService.deploy(userData, outputOptions.portfolioTemplate);
      
      setDeployedUrl(url);
      toast({
        title: "Portfolio deployed successfully!",
        description: `Your portfolio is now live at ${url}`,
      });
    } catch (error) {
      console.error('Deployment error:', error);
      toast({
        title: "Deployment failed",
        description: "There was an issue deploying your portfolio. Please check your Netlify token and try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Your Generated Materials</CardTitle>
        <CardDescription>
          Review and export your professionally created career materials
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
            <div className="border rounded-md p-6 min-h-[400px]">
              <div className="space-y-4">
                <div className="text-center">
                  <h2 className="text-2xl font-bold">{userData.name}</h2>
                  <p className="text-muted-foreground">{userData.role} | {userData.location}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold border-b pb-1 mb-2">Experience</h3>
                  {userData.workExperience && userData.workExperience.map((exp: any, i: number) => (
                    <div key={i} className="mb-3">
                      <div className="flex justify-between">
                        <p className="font-medium">{exp.company}</p>
                        {exp.startDate && (
                          <p className="text-sm text-muted-foreground">
                            {exp.startDate} - {exp.endDate || "Present"}
                          </p>
                        )}
                      </div>
                      <p className="text-sm">{exp.position}</p>
                      <p className="text-sm mt-1">{exp.description}</p>
                    </div>
                  ))}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold border-b pb-1 mb-2">Education</h3>
                  {userData.education && userData.education.map((edu: any, i: number) => (
                    <div key={i} className="mb-2">
                      <div className="flex justify-between">
                        <p className="font-medium">{edu.institution}</p>
                        {edu.graduationDate && (
                          <p className="text-sm text-muted-foreground">{edu.graduationDate}</p>
                        )}
                      </div>
                      <p className="text-sm">{edu.degree}</p>
                    </div>
                  ))}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold border-b pb-1 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(userData.skills) && userData.skills.map((skill: string, i: number) => (
                      <span key={i} className="bg-muted px-2 py-1 rounded-md text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                {userData.achievements && userData.achievements.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold border-b pb-1 mb-2">Achievements</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {userData.achievements.map((achievement: string, i: number) => (
                        <li key={i} className="text-sm">{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="cover" className="space-y-4">
            <div className="border rounded-md p-6 min-h-[400px]">
              <div className="space-y-4">
                <div>
                  <p className="text-right">{userData.name}</p>
                  <p className="text-right text-sm text-muted-foreground">{userData.location}</p>
                  <p className="text-right text-sm text-muted-foreground">email@example.com</p>
                  <p className="text-right text-sm text-muted-foreground">+1 (555) 123-4567</p>
                </div>
                
                <div className="pt-6">
                  <p>Dear Hiring Manager,</p>
                  
                  <p className="mt-4">
                    I am writing to express my interest in the {userData.role} position at [Company Name].
                    With my background in {userData.skills && Array.isArray(userData.skills) ? userData.skills.slice(0, 3).join(", ") : "relevant skills"} 
                    and experience at {userData.workExperience && userData.workExperience[0]?.company}, 
                    I am confident in my ability to make significant contributions to your team.
                  </p>
                  
                  <p className="mt-4">
                    Throughout my career, I have {userData.achievements && userData.achievements[0]?.toLowerCase()}. 
                    I am particularly proud of my work at {userData.workExperience && userData.workExperience[0]?.company}, 
                    where I {userData.workExperience && userData.workExperience[0]?.description?.split('.')[0]?.toLowerCase()}.
                  </p>
                  
                  <p className="mt-4">
                    I am excited about the opportunity to bring my unique skills to your company and 
                    help drive your continued success. My approach to {userData.role.toLowerCase()} combines 
                    technical expertise with a deep commitment to quality and user experience.
                  </p>
                  
                  <p className="mt-4">
                    Thank you for considering my application. I look forward to the possibility of discussing 
                    how my background, skills, and achievements can benefit your team.
                  </p>
                  
                  <p className="mt-8">Sincerely,</p>
                  <p className="mt-2">{userData.name}</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="portfolio" className="space-y-4">
            <PortfolioPreview 
              userData={userData} 
              template={outputOptions.portfolioTemplate} 
            />
            
            <div className="border rounded-md p-4 space-y-4">
              <h3 className="font-medium">Deploy to Netlify</h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="netlify-token">Netlify API Token</Label>
                  <Input
                    id="netlify-token"
                    type="password"
                    placeholder="Enter your Netlify API token"
                    value={netlifyToken}
                    onChange={(e) => setNetlifyToken(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Get your token from{" "}
                    <a 
                      href="https://app.netlify.com/user/applications#personal-access-tokens" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Netlify Dashboard
                    </a>
                  </p>
                </div>
                
                {deployedUrl && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-800">Portfolio Deployed!</p>
                        <p className="text-sm text-green-600">{deployedUrl}</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open(deployedUrl, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Visit
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onComplete}>Back to Dashboard</Button>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleExport} disabled={isExporting}>
            {isExporting ? "Exporting..." : `Export ${activeTab === "portfolio" ? "HTML" : activeTab === "resume" ? "Resume" : "Cover Letter"}`}
          </Button>
          {activeTab === "portfolio" && (
            <Button onClick={handleDeploy} disabled={isDeploying || !netlifyToken.trim()}>
              {isDeploying ? "Deploying..." : "Deploy to Netlify"}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
