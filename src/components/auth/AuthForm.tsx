
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";

interface AuthFormProps {
  onSuccess: () => void;
}

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const magicLinkSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isMagicLink, setIsMagicLink] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const getSchema = () => {
    if (isMagicLink) return magicLinkSchema;
    return isLogin ? loginSchema : signupSchema;
  };

  const form = useForm<z.infer<typeof loginSchema> | z.infer<typeof signupSchema> | z.infer<typeof magicLinkSchema>>({
    resolver: zodResolver(getSchema()),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: any) => {
    setIsLoading(true);
    
    try {
      if (isMagicLink) {
        // Magic link authentication
        const { error } = await supabase.auth.signInWithOtp({
          email: values.email,
          options: {
            emailRedirectTo: window.location.origin + '/dashboard'
          }
        });
        
        if (error) {
          throw error;
        }
        
        toast({
          title: "Magic link sent!",
          description: "Check your email for a sign-in link.",
        });
        
      } else if (isLogin) {
        // Sign in
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
        
        if (error) {
          throw error;
        }
        
        toast({
          title: "Welcome back!",
          description: "You've been successfully logged in.",
        });
        
        onSuccess();
        
      } else {
        // Sign up
        const { error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: {
              full_name: values.name,
            },
            emailRedirectTo: window.location.origin + '/dashboard'
          }
        });
        
        if (error) {
          throw error;
        }
        
        toast({
          title: "Account created!",
          description: "Check your email to confirm your account.",
        });
      }
      
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.message || "An error occurred during authentication.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setIsMagicLink(false);
    form.reset({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const toggleMagicLink = () => {
    setIsMagicLink(!isMagicLink);
    setIsLogin(true);
    form.reset({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const getTitle = () => {
    if (isMagicLink) return "Sign in with Magic Link";
    return isLogin ? "Login" : "Create Account";
  };

  const getButtonText = () => {
    if (isLoading) return "Processing...";
    if (isMagicLink) return "Send Magic Link";
    return isLogin ? "Login" : "Create Account";
  };

  return (
    <div className="grid gap-6">
      <CardTitle className="text-2xl font-bold text-center">
        {getTitle()}
      </CardTitle>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {!isLogin && !isMagicLink && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="mail@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!isMagicLink && (
            <>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!isLogin && (
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {getButtonText()}
          </Button>
        </form>
      </Form>
      
      <div className="flex flex-col items-center justify-center gap-2">
        {!isMagicLink && (
          <Button variant="link" onClick={toggleMode}>
            {isLogin ? "Create an account" : "Already have an account?"}
          </Button>
        )}
        
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        
        <Button variant="outline" className="w-full" onClick={toggleMagicLink}>
          {isMagicLink ? "Use Password Instead" : "Magic Link"}
        </Button>
      </div>
    </div>
  );
}
