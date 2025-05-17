
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LinkedInParserProps {
  onComplete: (data: any) => void;
}

export function LinkedInParser({ onComplete }: LinkedInParserProps) {
  const [url, setUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.includes("linkedin.com")) {
      toast({
        title: "Invalid LinkedIn URL",
        description: "Please enter a valid LinkedIn profile URL.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Call the specific LinkedIn parser function
      const { data, error } = await supabase.functions.invoke('parse-linkedin', {
        body: { url },
      });

      if (error) {
        throw new Error(error.message || 'Failed to parse LinkedIn profile');
      }

      if (!data) {
        throw new Error('No data returned from parser');
      }

      // Process the parsed data
      const parsedData = {
        name: data.name || '',
        role: data.headline || data.role || '',
        location: data.location || '',
        workExperience: data.experience?.map((exp: any) => ({
          company: exp.company,
          position: exp.title,
          startDate: exp.startDate,
          endDate: exp.endDate || 'present',
          description: exp.description || '',
        })) || [],
        skills: data.skills || [],
        education: data.education?.map((edu: any) => ({
          institution: edu.school,
          degree: edu.degree,
          graduationDate: edu.endDate || edu.graduationDate || '',
        })) || [],
        achievements: data.achievements || []
      };

      // Save the parsed data to the resumes table
      const user = await supabase.auth.getUser();
      if (user.data.user?.id) {
        await supabase.from('resumes').insert({
          user_id: user.data.user.id,
          source_type: 'linkedin',
          extracted_data: parsedData,
        });
      }

      toast({
        title: "LinkedIn profile parsed successfully",
        description: "We've extracted your information. You can review and edit it now.",
      });

      onComplete(parsedData);
    } catch (error: any) {
      console.error('LinkedIn parsing error:', error);
      
      // Fallback to demo mode if the function fails
      toast({
        title: "Using demo mode",
        description: "The LinkedIn parser encountered an issue. Using sample data for now.",
      });
      
      // Mock data for demonstration
      const mockData = {
        name: "Jamie Smith",
        role: "UX Designer",
        location: "Portland, OR",
        workExperience: [
          {
            company: "Design Solutions Inc.",
            position: "Junior UX Designer",
            startDate: "2021-03",
            endDate: "present",
            description: "Creating user-centered designs by understanding business requirements and user feedback. Creating user flows, wireframes, and prototypes for new features.",
          }
        ],
        skills: ["Figma", "Sketch", "User Research", "Prototyping", "Information Architecture", "UI Design"],
        education: [
          {
            institution: "Rhode Island School of Design",
            degree: "B.F.A. Graphic Design",
            graduationDate: "2020-05",
          }
        ],
        achievements: [
          "Redesigned main product interface resulting in 25% increase in user engagement",
          "Led user research efforts for mobile app launch"
        ]
      };
      
      onComplete(mockData);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="linkedin-url">LinkedIn Profile URL</Label>
        <Input
          id="linkedin-url"
          placeholder="https://www.linkedin.com/in/yourprofile"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <p className="text-xs text-muted-foreground">
          Enter the full URL to your LinkedIn profile to extract your professional information.
        </p>
      </div>

      <Button type="submit" disabled={!url || isProcessing} className="w-full">
        {isProcessing ? "Processing..." : "Parse LinkedIn Profile"}
      </Button>
    </form>
  );
}
