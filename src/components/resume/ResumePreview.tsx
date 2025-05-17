
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ResumePreviewProps {
  data: any;
  onUpdate: (data: any) => void;
  onComplete: () => void;
}

export function ResumePreview({ data, onUpdate, onComplete }: ResumePreviewProps) {
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(data);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    onUpdate(editData);
    setEditMode(false);
  };

  const updateField = (field: string, value: any) => {
    setEditData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Review Your Information</CardTitle>
        <div className="flex justify-end">
          {editMode ? (
            <Button onClick={handleSave} variant="outline">Save Changes</Button>
          ) : (
            <Button onClick={handleEdit} variant="outline">Edit Information</Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Personal Information</h3>
          {editMode ? (
            <div className="space-y-2">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name"
                  value={editData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Input 
                  id="role"
                  value={editData.role}
                  onChange={(e) => updateField("role", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location"
                  value={editData.location}
                  onChange={(e) => updateField("location", e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="bg-muted p-4 rounded-md">
              <p className="text-xl font-medium">{data.name}</p>
              <p className="text-muted-foreground">{data.role}</p>
              <p className="text-muted-foreground">{data.location}</p>
            </div>
          )}
        </div>

        {/* Skills */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Skills</h3>
          {editMode ? (
            <div>
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Input 
                id="skills"
                value={Array.isArray(editData.skills) ? editData.skills.join(", ") : editData.skills}
                onChange={(e) => updateField("skills", e.target.value.split(", "))}
              />
            </div>
          ) : (
            <div className="bg-muted p-4 rounded-md flex flex-wrap gap-2">
              {Array.isArray(data.skills) && data.skills.map((skill: string, index: number) => (
                <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Work Experience */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Work Experience</h3>
          {editMode ? (
            <div className="space-y-4">
              {data.workExperience && data.workExperience.map((exp: any, i: number) => (
                <div key={i} className="space-y-2 border p-3 rounded-md">
                  <div>
                    <Label>Company</Label>
                    <Input 
                      value={editData.workExperience[i]?.company || ""}
                      onChange={(e) => {
                        const updatedExp = [...editData.workExperience];
                        updatedExp[i] = { ...updatedExp[i], company: e.target.value };
                        updateField("workExperience", updatedExp);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Position</Label>
                    <Input 
                      value={editData.workExperience[i]?.position || ""}
                      onChange={(e) => {
                        const updatedExp = [...editData.workExperience];
                        updatedExp[i] = { ...updatedExp[i], position: e.target.value };
                        updateField("workExperience", updatedExp);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea 
                      value={editData.workExperience[i]?.description || ""}
                      onChange={(e) => {
                        const updatedExp = [...editData.workExperience];
                        updatedExp[i] = { ...updatedExp[i], description: e.target.value };
                        updateField("workExperience", updatedExp);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {data.workExperience && data.workExperience.map((exp: any, i: number) => (
                <div key={i} className="bg-muted p-4 rounded-md">
                  <p className="font-medium">{exp.company}</p>
                  <p className="text-sm text-muted-foreground">{exp.position}</p>
                  {(exp.startDate || exp.endDate) && (
                    <p className="text-sm text-muted-foreground">
                      {exp.startDate} - {exp.endDate || "Present"}
                    </p>
                  )}
                  <p className="mt-2 text-sm">{exp.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Education */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Education</h3>
          {editMode ? (
            <div className="space-y-4">
              {data.education && data.education.map((edu: any, i: number) => (
                <div key={i} className="space-y-2 border p-3 rounded-md">
                  <div>
                    <Label>Institution</Label>
                    <Input 
                      value={editData.education[i]?.institution || ""}
                      onChange={(e) => {
                        const updatedEdu = [...editData.education];
                        updatedEdu[i] = { ...updatedEdu[i], institution: e.target.value };
                        updateField("education", updatedEdu);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Degree</Label>
                    <Input 
                      value={editData.education[i]?.degree || ""}
                      onChange={(e) => {
                        const updatedEdu = [...editData.education];
                        updatedEdu[i] = { ...updatedEdu[i], degree: e.target.value };
                        updateField("education", updatedEdu);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {data.education && data.education.map((edu: any, i: number) => (
                <div key={i} className="bg-muted p-4 rounded-md">
                  <p className="font-medium">{edu.institution}</p>
                  <p className="text-sm">{edu.degree}</p>
                  {edu.graduationDate && (
                    <p className="text-sm text-muted-foreground">
                      Graduated: {edu.graduationDate}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Achievements */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Achievements</h3>
          {editMode ? (
            <div>
              <Label>Achievements (one per line)</Label>
              <Textarea 
                value={Array.isArray(editData.achievements) ? editData.achievements.join("\n") : editData.achievements}
                onChange={(e) => updateField("achievements", e.target.value.split("\n").filter((a: string) => a.trim()))}
                className="min-h-[100px]"
              />
            </div>
          ) : (
            <div className="bg-muted p-4 rounded-md">
              <ul className="list-disc pl-5 space-y-1">
                {Array.isArray(data.achievements) && data.achievements.map((achievement: string, i: number) => (
                  <li key={i}>{achievement}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button onClick={onComplete}>Continue to Output Options</Button>
      </CardFooter>
    </Card>
  );
}
