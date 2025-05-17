
import { useState } from "react";
import { AppLayout } from "@/components/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputMethod } from "@/components/onboarding/InputMethod";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { OutputOptions } from "@/components/output/OutputOptions";
import { FinalOutput } from "@/components/output/FinalOutput";

enum DashboardState {
  INPUT,
  PREVIEW,
  OPTIONS,
  OUTPUT
}

const Dashboard = () => {
  const [currentState, setCurrentState] = useState<DashboardState>(DashboardState.INPUT);
  const [userData, setUserData] = useState<any>(null);
  const [outputOptions, setOutputOptions] = useState<any>(null);

  const handleInputComplete = (data: any) => {
    setUserData(data);
    setCurrentState(DashboardState.PREVIEW);
  };

  const handlePreviewComplete = () => {
    setCurrentState(DashboardState.OPTIONS);
  };

  const handleOptionsComplete = (options: any) => {
    setOutputOptions(options);
    setCurrentState(DashboardState.OUTPUT);
  };

  const handleOutputComplete = () => {
    setCurrentState(DashboardState.INPUT);
  };

  const renderCurrentStep = () => {
    switch (currentState) {
      case DashboardState.INPUT:
        return <InputMethod onComplete={handleInputComplete} />;
      case DashboardState.PREVIEW:
        return (
          <ResumePreview 
            data={userData} 
            onUpdate={setUserData}
            onComplete={handlePreviewComplete}
          />
        );
      case DashboardState.OPTIONS:
        return (
          <OutputOptions 
            userData={userData} 
            onComplete={handleOptionsComplete}
          />
        );
      case DashboardState.OUTPUT:
        return (
          <FinalOutput 
            userData={userData}
            outputOptions={outputOptions}
            onComplete={handleOutputComplete}
          />
        );
      default:
        return <InputMethod onComplete={handleInputComplete} />;
    }
  };

  const getProgressStep = () => {
    switch (currentState) {
      case DashboardState.INPUT:
        return 1;
      case DashboardState.PREVIEW:
        return 2;
      case DashboardState.OPTIONS:
        return 3;
      case DashboardState.OUTPUT:
        return 4;
      default:
        return 1;
    }
  };

  return (
    <AppLayout>
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-2 mb-6">
            <h1 className="text-3xl font-bold">Create Your Career Materials</h1>
            <p className="text-muted-foreground">
              Transform your experience into professional career materials with AI assistance.
            </p>
          </div>
          
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((step) => (
                  <div 
                    key={step}
                    className={`h-2 w-16 rounded-full ${step <= getProgressStep() ? "bg-primary" : "bg-muted"}`}
                  ></div>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                Step {getProgressStep()} of 4
              </span>
            </div>
          </div>
          
          {renderCurrentStep()}
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
