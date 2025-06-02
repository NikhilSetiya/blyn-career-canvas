
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GuidedForm } from "./GuidedForm";

interface InputMethodProps {
  onComplete: (data: any) => void;
}

export function InputMethod({ onComplete }: InputMethodProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Tell us about yourself</CardTitle>
        <CardDescription>
          We'll help you create professional career materials based on your information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <GuidedForm onComplete={onComplete} />
      </CardContent>
    </Card>
  );
}
