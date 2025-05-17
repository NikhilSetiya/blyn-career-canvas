
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onComplete: (data: any) => void;
}

export function FileUpload({ onComplete }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf" || 
          selectedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        setFile(selectedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or DOCX file.",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);

    try {
      // Simulate parsing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock parsed data
      const mockData = {
        name: "Alex Johnson",
        role: "Frontend Developer",
        location: "San Francisco, CA",
        workExperience: [
          {
            company: "Tech Innovators",
            position: "Junior Frontend Developer",
            startDate: "2020-06",
            endDate: "2022-12",
            description: "Developed responsive web applications using React and TypeScript. Collaborated with designers and backend engineers to implement UI/UX designs.",
          }
        ],
        skills: ["React", "TypeScript", "JavaScript", "HTML", "CSS", "Git"],
        education: [
          {
            institution: "University of California, Berkeley",
            degree: "B.S. Computer Science",
            graduationDate: "2020-05",
          }
        ],
        achievements: [
          "Reduced page load time by 40% through code optimization",
          "Led migration from legacy code to modern React components"
        ]
      };

      toast({
        title: "Resume uploaded successfully",
        description: "We've extracted your information. You can review and edit it now.",
      });

      onComplete(mockData);
    } catch (error) {
      toast({
        title: "Error parsing resume",
        description: "There was an issue processing your file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-dashed border-2 rounded-lg p-8 text-center bg-muted/30">
        <input
          type="file"
          id="resume-upload"
          className="hidden"
          accept=".pdf,.docx"
          onChange={handleFileChange}
        />
        <label 
          htmlFor="resume-upload"
          className="flex flex-col items-center justify-center cursor-pointer h-40"
        >
          <div className="flex flex-col items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-muted-foreground mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm font-medium text-muted-foreground">
              {file ? file.name : "Drag & drop your resume here or click to browse"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Supports PDF, DOCX (Max 5MB)
            </p>
          </div>
        </label>
      </div>

      <Button 
        onClick={handleUpload} 
        disabled={!file || isUploading} 
        className="w-full"
      >
        {isUploading ? "Processing..." : "Upload Resume"}
      </Button>
    </div>
  );
}
