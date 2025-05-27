
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      // Create file path with user ID folder
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      
      // Upload to the resumes storage bucket
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName);
      
      // Call the parse-resume edge function
      const { data, error } = await supabase.functions.invoke('parse-resume', {
        body: { fileUrl: publicUrl },
      });
      
      if (error) {
        throw new Error(error.message || 'Failed to parse resume');
      }
      
      if (!data) {
        throw new Error('No data returned from parser');
      }
      
      // Process the parsed data into the expected format
      const parsedData = {
        name: data.name || '',
        role: data.role || '',
        location: data.location || '',
        email: data.email || '',
        phone: data.phone || '',
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
      
      // Save to database
      await supabase.from('parsed_data').insert({
        user_id: userId,
        source_type: 'resume',
        raw_data: data,
        processed_data: parsedData,
      });

      toast({
        title: "Resume uploaded successfully",
        description: "Your resume has been parsed. Review the extracted information.",
      });

      onComplete(parsedData);
    } catch (error: any) {
      console.error('Resume parsing error:', error);
      
      toast({
        title: "Upload failed",
        description: error.message || "Failed to parse resume. Please try again.",
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
