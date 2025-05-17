
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUpload } from "./FileUpload";
import { LinkedInParser } from "./LinkedInParser";
import { GuidedForm } from "./GuidedForm";

interface InputMethodProps {
  onComplete: (data: any) => void;
}

export function InputMethod({ onComplete }: InputMethodProps) {
  const [selectedMethod, setSelectedMethod] = useState<"resume" | "linkedin" | "guided">("resume");
  
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="resume">Upload Resume</TabsTrigger>
            <TabsTrigger value="linkedin">LinkedIn URL</TabsTrigger>
            <TabsTrigger value="guided">Guided Q&A</TabsTrigger>
          </TabsList>
          <TabsContent value="resume" className="py-4">
            <FileUpload onComplete={onComplete} />
          </TabsContent>
          <TabsContent value="linkedin" className="py-4">
            <LinkedInParser onComplete={onComplete} />
          </TabsContent>
          <TabsContent value="guided" className="py-4">
            <GuidedForm onComplete={onComplete} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
