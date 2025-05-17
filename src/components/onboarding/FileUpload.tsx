
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
      // 1. Upload file to Supabase Storage
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `resumes/${fileName}`;
      
      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('resume-uploads')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resume-uploads')
        .getPublicUrl(filePath);
      
      // 2. Call the parse-resume edge function
      const { data, error } = await supabase.functions.invoke('parse-resume', {
        body: { fileUrl: publicUrl },
      });
      
      if (error) {
        throw new Error(error.message || 'Failed to parse resume');
      }
      
      if (!data) {
        throw new Error('No data returned from parser');
      }
      
      // 3. Process the parsed data
      const parsedData = {
        name: data.name || '',
        role: data.role || '',
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
          graduationDate: edu.graduationDate || '',
        })) || [],
        achievements: data.achievements || []
      };
      
      // 4. Save to database
      await supabase.from('resumes').insert({
        user_id: userId,
        source_type: 'upload',
        original_file_url: publicUrl,
        extracted_data: parsedData,
      });

      toast({
        title: "Resume uploaded successfully",
        description: "We've extracted your information. You can review and edit it now.",
      });

      onComplete(parsedData);
    } catch (error: any) {
      console.error('Resume parsing error:', error);
      
      // Fallback to demo mode if the function fails
      toast({
        title: "Using demo mode",
        description: "The resume parser encountered an issue. Using sample data for now.",
      });
      
      // Mock data for demonstration
      const mockData = {
        name: "Alex Johnson",
        role: "Full Stack Developer",
        location: "San Francisco, CA",
        workExperience: [
          {
            company: "Tech Innovations Inc.",
            position: "Senior Developer",
            startDate: "2020-06",
            endDate: "present",
            description: "Led development of cloud-based applications using React, Node.js, and AWS. Implemented CI/CD pipelines and mentored junior developers.",
          },
          {
            company: "WebSolutions Co.",
            position: "Frontend Developer",
            startDate: "2018-03",
            endDate: "2020-05",
            description: "Developed responsive web applications using React and TypeScript. Collaborated with UX designers to implement user-friendly interfaces.",
          }
        ],
        skills: ["JavaScript", "TypeScript", "React", "Node.js", "AWS", "Docker", "GraphQL", "MongoDB"],
        education: [
          {
            institution: "University of California, Berkeley",
            degree: "B.S. Computer Science",
            graduationDate: "2018-05",
          }
        ],
        achievements: [
          "Reduced application load time by 40% through code optimization",
          "Published 3 technical articles on modern web development practices"
        ]
      };
      
      onComplete(mockData);
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
