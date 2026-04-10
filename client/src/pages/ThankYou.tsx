import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CheckCircle2, Download, Home, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const passwordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ThankYou() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleCreateAccount = async (data: PasswordFormData) => {
    setIsCreatingAccount(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAccountCreated(true);
      toast({
        title: "Account created!",
        description: "You can now log in to access your will anytime.",
      });
    } catch {
      toast({
        title: "Error creating account",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingAccount(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-thank-you-title">
            Thank You for Your Purchase!
          </h1>
          <p className="text-muted-foreground" data-testid="text-thank-you-message">
            Your Islamic will has been successfully generated.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              Download Your Will
            </CardTitle>
            <CardDescription>
              Your will document is ready. Download it and keep it in a safe place.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" data-testid="button-download-will">
              <Download className="h-4 w-4 mr-2" />
              Download Will (PDF)
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              We recommend printing your will and storing it with your important documents.
              Let your executor know where to find it.
            </p>
          </CardContent>
        </Card>

        {!accountCreated && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Create Your Account
              </CardTitle>
              <CardDescription>
                Create a password to access your will anytime and make future updates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleCreateAccount)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Create a password (min 8 characters)"
                            {...field}
                            data-testid="input-password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirm your password"
                            {...field}
                            data-testid="input-confirm-password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit"
                    className="w-full"
                    disabled={isCreatingAccount}
                    data-testid="button-create-account"
                  >
                    {isCreatingAccount ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {accountCreated && (
          <Card className="mb-6 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium" data-testid="text-account-success">Account Created Successfully!</p>
                  <p className="text-sm text-muted-foreground">
                    You can now log in to your dashboard to access your will.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Need help? Contact us at support@islamicwill.co.uk
          </p>
          <Button 
            variant="outline" 
            onClick={() => setLocation("/")}
            data-testid="button-go-home"
          >
            <Home className="h-4 w-4 mr-2" />
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
