
import { useState } from "react";
import { AppLayout } from "@/components/layouts/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResumeOptimizer } from "@/components/optimizer/ResumeOptimizer";
import { PortfolioOptimizer } from "@/components/optimizer/PortfolioOptimizer";

const Optimizer = () => {
  return (
    <AppLayout>
      <div className="container py-8">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-2 mb-6">
            <h1 className="text-3xl font-bold">Resume/Portfolio Optimizer</h1>
            <p className="text-muted-foreground">
              Optimize your resume or portfolio against job descriptions with real-time scoring and AI-powered suggestions.
            </p>
          </div>
          
          <Tabs defaultValue="resume" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="resume">Resume Optimizer</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio Optimizer</TabsTrigger>
            </TabsList>
            
            <TabsContent value="resume">
              <ResumeOptimizer />
            </TabsContent>
            
            <TabsContent value="portfolio">
              <PortfolioOptimizer />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
};

export default Optimizer;
