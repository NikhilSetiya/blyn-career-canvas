
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AuthForm } from "@/components/auth/AuthForm";

const Index = () => {
  const navigate = useNavigate();
  
  const handleAuthSuccess = () => {
    navigate("/dashboard");
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="w-full max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-8">
                <div>
                  <h1 className="text-5xl font-bold tracking-tighter">
                    Build Your <span className="gradient-text">Career</span> with AI
                  </h1>
                  <p className="text-xl mt-4 text-muted-foreground">
                    Blyn transforms your resume into a stunning portfolio, ATS-ready resume, and tailored cover letters — all powered by AI.
                  </p>
                </div>
                <div className="flex flex-col space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/10 p-2 rounded-full mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Upload once, create everywhere</h3>
                      <p className="text-muted-foreground">Upload your resume or LinkedIn profile and we'll do the rest.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/10 p-2 rounded-full mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">ATS-optimized resume templates</h3>
                      <p className="text-muted-foreground">Ensure your resume passes through applicant tracking systems.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/10 p-2 rounded-full mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Professionally hosted portfolio</h3>
                      <p className="text-muted-foreground">Get a free hosted portfolio site to showcase your skills.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Card className="backdrop-blur-sm bg-white/60">
                <CardContent className="p-6">
                  <AuthForm onSuccess={handleAuthSuccess} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
