
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, User, MapPin, Mail, Phone, Trophy } from "lucide-react";

interface PortfolioPreviewProps {
  userData: any;
  template: string;
}

export function PortfolioPreview({ userData, template }: PortfolioPreviewProps) {
  const [activeSection, setActiveSection] = useState("hero");

  const getTemplateColors = (template: string) => {
    const colors = {
      developer: {
        primary: "bg-gradient-to-r from-blue-600 to-blue-800",
        accent: "text-blue-600",
        bg: "bg-blue-50"
      },
      designer: {
        primary: "bg-gradient-to-r from-pink-500 to-orange-500",
        accent: "text-pink-600",
        bg: "bg-pink-50"
      },
      product: {
        primary: "bg-gradient-to-r from-cyan-500 to-blue-500",
        accent: "text-cyan-600",
        bg: "bg-cyan-50"
      },
      business: {
        primary: "bg-gradient-to-r from-green-500 to-emerald-600",
        accent: "text-green-600",
        bg: "bg-green-50"
      },
      consultant: {
        primary: "bg-gradient-to-r from-indigo-500 to-blue-600",
        accent: "text-indigo-600",
        bg: "bg-indigo-50"
      },
      freelancer: {
        primary: "bg-gradient-to-r from-yellow-500 to-orange-500",
        accent: "text-yellow-600",
        bg: "bg-yellow-50"
      },
      startup: {
        primary: "bg-gradient-to-r from-red-500 to-pink-500",
        accent: "text-red-600",
        bg: "bg-red-50"
      },
      academic: {
        primary: "bg-gradient-to-r from-teal-500 to-green-500",
        accent: "text-teal-600",
        bg: "bg-teal-50"
      }
    };
    return colors[template as keyof typeof colors] || colors.developer;
  };

  const templateColors = getTemplateColors(template);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Portfolio Preview - {template.charAt(0).toUpperCase() + template.slice(1)} Template
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Navigation Tabs */}
          <div className="flex border-b bg-gray-50">
            {["hero", "about", "experience", "skills", "contact"].map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                  activeSection === section
                    ? "border-b-2 border-blue-500 text-blue-600 bg-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {section}
              </button>
            ))}
          </div>

          {/* Preview Content */}
          <div className="h-96 overflow-y-auto">
            {activeSection === "hero" && (
              <div className={`${templateColors.primary} text-white p-8 text-center min-h-full flex flex-col justify-center`}>
                <div className="space-y-4">
                  {userData.profilePhoto && (
                    <div className="w-24 h-24 rounded-full mx-auto overflow-hidden border-4 border-white/20">
                      <img 
                        src={userData.profilePhoto} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h1 className="text-4xl font-bold">{userData.name}</h1>
                  <p className="text-xl opacity-90">{userData.role}</p>
                  <p className="text-lg opacity-80 flex items-center justify-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {userData.location}
                  </p>
                  <div className="flex gap-4 justify-center pt-4">
                    <Button variant="secondary" size="sm">Get In Touch</Button>
                    <Button variant="outline" size="sm" className="bg-transparent border-white text-white hover:bg-white hover:text-gray-900">
                      View Work
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "about" && (
              <div className={`${templateColors.bg} p-8`}>
                <div className="max-w-2xl mx-auto text-center">
                  <h2 className="text-2xl font-bold mb-6">About Me</h2>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <p className="text-gray-600 leading-relaxed">
                      Passionate {userData.role?.toLowerCase()} with expertise in creating innovative solutions. 
                      Based in {userData.location}, I bring a unique blend of technical skills and creative thinking to every project.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "experience" && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-center mb-8">Experience</h2>
                <div className="max-w-3xl mx-auto space-y-6">
                  {userData.workExperience && userData.workExperience.map((exp: any, index: number) => (
                    <Card key={index} className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{exp.position}</h3>
                          <p className={`font-medium ${templateColors.accent}`}>{exp.company}</p>
                        </div>
                        <Badge variant="outline">
                          {exp.startDate} - {exp.endDate || "Present"}
                        </Badge>
                      </div>
                      <p className="text-gray-600">{exp.description}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "skills" && (
              <div className={`${templateColors.bg} p-8`}>
                <h2 className="text-2xl font-bold text-center mb-8">Skills</h2>
                <div className="max-w-4xl mx-auto">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array.isArray(userData.skills) && userData.skills.map((skill: string, index: number) => (
                      <div key={index} className="bg-white p-4 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
                        <span className="font-medium">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === "contact" && (
              <div className="bg-gray-900 text-white p-8 min-h-full">
                <h2 className="text-2xl font-bold text-center mb-8">Get In Touch</h2>
                <div className="max-w-2xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userData.email && (
                      <div className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg">
                        <Mail className="h-5 w-5 text-blue-400" />
                        <span>{userData.email}</span>
                      </div>
                    )}
                    {userData.phone && (
                      <div className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg">
                        <Phone className="h-5 w-5 text-green-400" />
                        <span>{userData.phone}</span>
                      </div>
                    )}
                    {userData.location && (
                      <div className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg">
                        <MapPin className="h-5 w-5 text-red-400" />
                        <span>{userData.location}</span>
                      </div>
                    )}
                  </div>
                  
                  {userData.achievements && userData.achievements.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-yellow-400" />
                        Key Achievements
                      </h3>
                      <div className="space-y-3">
                        {userData.achievements.map((achievement: string, index: number) => (
                          <div key={index} className="p-3 bg-gray-800 rounded-lg">
                            <p className="text-sm">{achievement}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
