
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUpload } from "./FileUpload";
import { GuidedForm } from "./GuidedForm";

interface InputMethodProps {
  onComplete: (data: any) => void;
}

export function InputMethod({ onComplete }: InputMethodProps) {
  const [selectedMethod, setSelectedMethod] = useState<"resume" | "guided">("resume");
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">How would you like to get started?</CardTitle>
        <CardDescription>
          Choose how you'd like to input your information. You can always edit it later.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="resume" onValueChange={(value) => setSelectedMethod(value as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="resume">Upload Resume</TabsTrigger>
            <TabsTrigger value="guided">Guided Q&A</TabsTrigger>
          </TabsList>
          <TabsContent value="resume" className="py-4">
            <FileUpload onComplete={onComplete} />
          </TabsContent>
          <TabsContent value="guided" className="py-4">
            <GuidedForm onComplete={onComplete} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
