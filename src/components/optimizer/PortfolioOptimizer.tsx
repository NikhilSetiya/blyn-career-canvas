
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, TrendingUp, Target, Lightbulb } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface OptimizationResult {
  overallScore: number;
  sectionScores: {
    summary: number;
    projects: number;
    skills: number;
    experience: number;
  };
  missingKeywords: string[];
  suggestions: string[];
  optimizedContent: string;
}

export function PortfolioOptimizer() {
  const [jobDescription, setJobDescription] = useState("");
  const [portfolioContent, setPortfolioContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [showOptimized, setShowOptimized] = useState(false);
  const { toast } = useToast();

  const analyzePortfolio = async () => {
    if (!jobDescription.trim() || !portfolioContent.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both job description and portfolio content.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('optimize-portfolio', {
        body: {
          jobDescription,
          portfolioContent,
        },
      });

      if (error) {
        throw new Error(error.message || "Failed to analyze portfolio");
      }

      setResult(data);
      
      toast({
        title: "Analysis Complete",
        description: "Your portfolio has been analyzed successfully.",
      });
    } catch (error) {
      console.error("Error analyzing portfolio:", error);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your portfolio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Section */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
            <CardDescription>Paste the job description you want to optimize for</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[200px]"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Portfolio Content</CardTitle>
            <CardDescription>Paste your current portfolio content or project descriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste your portfolio content here..."
              value={portfolioContent}
              onChange={(e) => setPortfolioContent(e.target.value)}
              className="min-h-[300px]"
            />
          </CardContent>
        </Card>

        <Button 
          onClick={analyzePortfolio} 
          disabled={isAnalyzing}
          className="w-full"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Target className="mr-2 h-4 w-4" />
              Analyze & Optimize
            </>
          )}
        </Button>
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        {result && (
          <>
            {/* Overall Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Overall Portfolio Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      <span className={getScoreColor(result.overallScore)}>
                        {result.overallScore}%
                      </span>
                    </span>
                    <Badge variant={result.overallScore >= 80 ? "default" : result.overallScore >= 60 ? "secondary" : "destructive"}>
                      {result.overallScore >= 80 ? "Excellent" : result.overallScore >= 60 ? "Good" : "Needs Improvement"}
                    </Badge>
                  </div>
                  <Progress 
                    value={result.overallScore} 
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Section Scores */}
            <Card>
              <CardHeader>
                <CardTitle>Section Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(result.sectionScores).map(([section, score]) => (
                    <div key={section} className="flex items-center justify-between">
                      <span className="capitalize font-medium">{section}</span>
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${getScoreColor(score)}`}>
                          {score}%
                        </span>
                        <div className="w-20">
                          <Progress value={score} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Missing Keywords */}
            <Card>
              <CardHeader>
                <CardTitle>Missing Keywords</CardTitle>
                <CardDescription>Important keywords from the job description not found in your portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords.map((keyword, index) => (
                    <Badge key={index} variant="outline" className="text-red-600 border-red-200">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  AI Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Optimized Content */}
            <Card>
              <CardHeader>
                <CardTitle>Optimized Content</CardTitle>
                <CardDescription>AI-generated optimized version of your portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      variant={!showOptimized ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowOptimized(false)}
                    >
                      Original
                    </Button>
                    <Button
                      variant={showOptimized ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowOptimized(true)}
                    >
                      Optimized
                    </Button>
                  </div>
                  <Textarea
                    value={showOptimized ? result.optimizedContent : portfolioContent}
                    readOnly
                    className="min-h-[300px] font-mono text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
