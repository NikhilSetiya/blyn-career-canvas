
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

interface GuidedFormProps {
  onComplete: (data: any) => void;
}

export function GuidedForm({ onComplete }: GuidedFormProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    location: "",
    email: "",
    phone: "",
    skills: "",
    education: "",
    workExperience: "",
    achievements: "",
  });

  const updateForm = (key: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        setProfilePhoto(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setPhotoPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file.",
          variant: "destructive",
        });
      }
    }
  };

  const nextStep = () => {
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const processedData = {
        name: formData.name,
        role: formData.role,
        location: formData.location,
        email: formData.email,
        phone: formData.phone,
        profilePhoto: photoPreview,
        skills: formData.skills.split(",").map(skill => skill.trim()),
        education: [
          {
            institution: formData.education.split(",")[0]?.trim() || "",
            degree: formData.education.split(",")[1]?.trim() || "",
            graduationDate: formData.education.split(",")[2]?.trim() || "",
          }
        ],
        workExperience: [
          {
            company: formData.workExperience.split("\n")[0]?.trim() || "",
            position: formData.workExperience.split("\n")[1]?.trim() || "",
            description: formData.workExperience.split("\n").slice(2).join("\n").trim(),
          }
        ],
        achievements: formData.achievements.split("\n").filter(a => a.trim()),
      };

      toast({
        title: "Information saved",
        description: "Your profile information has been saved successfully.",
      });

      onComplete(processedData);
    } catch (error) {
      toast({
        title: "Error saving information",
        description: "There was an issue saving your information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {step === 1 && (
        <div className="space-y-4 animate-fade-in">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateForm("name", e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Current or Desired Role</Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e) => updateForm("role", e.target.value)}
              placeholder="Frontend Developer"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => updateForm("location", e.target.value)}
              placeholder="San Francisco, CA"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateForm("email", e.target.value)}
              placeholder="john@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => updateForm("phone", e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="photo">Profile Photo (Optional)</Label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                id="photo"
                className="hidden"
                accept="image/*"
                onChange={handlePhotoChange}
              />
              <label 
                htmlFor="photo"
                className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-muted"
              >
                <Upload className="h-4 w-4" />
                Choose Photo
              </label>
              {photoPreview && (
                <div className="w-16 h-16 rounded-full overflow-hidden border">
                  <img 
                    src={photoPreview} 
                    alt="Profile preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
          <Button onClick={nextStep} className="w-full">Next: Skills & Education</Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 animate-fade-in">
          <div className="space-y-2">
            <Label htmlFor="skills">Skills (comma-separated)</Label>
            <Input
              id="skills"
              value={formData.skills}
              onChange={(e) => updateForm("skills", e.target.value)}
              placeholder="React, JavaScript, UI Design"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="education">Education (Institution, Degree, Year)</Label>
            <Input
              id="education"
              value={formData.education}
              onChange={(e) => updateForm("education", e.target.value)}
              placeholder="University of California, BS Computer Science, 2022"
              required
            />
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={prevStep}>Back</Button>
            <Button onClick={nextStep}>Next: Experience & Achievements</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4 animate-fade-in">
          <div className="space-y-2">
            <Label htmlFor="workExperience">Work Experience</Label>
            <Textarea
              id="workExperience"
              value={formData.workExperience}
              onChange={(e) => updateForm("workExperience", e.target.value)}
              placeholder="Company Name
Position
Description of your responsibilities and achievements"
              className="min-h-[150px]"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="achievements">Key Achievements (one per line)</Label>
            <Textarea
              id="achievements"
              value={formData.achievements}
              onChange={(e) => updateForm("achievements", e.target.value)}
              placeholder="Led a team of 5 developers
Increased conversion rate by 20%
Implemented CI/CD pipeline"
              className="min-h-[100px]"
              required
            />
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={prevStep}>Back</Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Information"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
