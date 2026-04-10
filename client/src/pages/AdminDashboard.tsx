import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Link } from "wouter";
import { 
  Mail, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Users, 
  Send,
  RefreshCw,
  AlertCircle
} from "lucide-react";

interface OnboardingStats {
  totalUsersOnboarded: number;
  welcomeEmailsSent: number;
  welcomeEmailsFailed: number;
  followUpEmailsPending: number;
  followUpEmailsSent: number;
  followUpEmailsFailed: number;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [testEmail, setTestEmail] = useState("");
  const [testFullName, setTestFullName] = useState("");

  const { data: stats, isLoading, error, refetch } = useQuery<OnboardingStats>({
    queryKey: ["/api/admin/onboarding-stats"],
    retry: false,
  });

  const testOnboardingMutation = useMutation({
    mutationFn: async (data: { email: string; fullName: string }) => {
      const response = await apiRequest("POST", "/api/admin/test-onboarding", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Test Email Sent",
        description: "Welcome email sent successfully!",
      });
      setTestEmail("");
      setTestFullName("");
      refetch();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send test email",
        variant: "destructive",
      });
    },
  });

  const handleTestOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    testOnboardingMutation.mutate({
      email: testEmail,
      fullName: testFullName,
    });
  };

  // Show access denied message if not admin
  if (error || (!isLoading && !stats)) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-2xl mx-auto mt-20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-destructive" />
              <CardTitle>Access Denied</CardTitle>
            </div>
            <CardDescription>
              You do not have permission to access the admin dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Admin privileges are required to view onboarding statistics and send test emails.
              Please contact your system administrator if you believe you should have access.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Onboarding Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor user onboarding, email automation, and engagement metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/admin/broadcast">
            <Button 
              variant="default" 
              size="sm"
              data-testid="button-broadcast-email"
            >
              <Send className="h-4 w-4 mr-2" />
              Broadcast Email
            </Button>
          </Link>
          <Button 
            onClick={() => refetch()} 
            variant="outline" 
            size="sm"
            data-testid="button-refresh-stats"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users Onboarded</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-total-users">
              {stats?.totalUsersOnboarded || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Users who started onboarding
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Welcome Emails Sent</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary" data-testid="stat-welcome-sent">
              {stats?.welcomeEmailsSent || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Successfully delivered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Welcome Emails Failed</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive" data-testid="stat-welcome-failed">
              {stats?.welcomeEmailsFailed || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Failed deliveries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Follow-Up Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-followup-pending">
              {stats?.followUpEmailsPending || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Scheduled for 3 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Follow-Up Sent</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary" data-testid="stat-followup-sent">
              {stats?.followUpEmailsSent || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Successfully delivered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Follow-Up Failed</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive" data-testid="stat-followup-failed">
              {stats?.followUpEmailsFailed || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Failed deliveries
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Onboarding Email</CardTitle>
          <CardDescription>
            Manually send a welcome email to test the onboarding flow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTestOnboarding} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="test-email">Email Address</Label>
                <Input
                  id="test-email"
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="test@example.com"
                  required
                  data-testid="input-test-email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="test-fullname">Full Name</Label>
                <Input
                  id="test-fullname"
                  type="text"
                  value={testFullName}
                  onChange={(e) => setTestFullName(e.target.value)}
                  placeholder="John Doe"
                  required
                  data-testid="input-test-fullname"
                />
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={testOnboardingMutation.isPending}
              data-testid="button-send-test-email"
            >
              {testOnboardingMutation.isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Test Email
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Onboarding Flow Status</CardTitle>
          <CardDescription>
            Real-time monitoring of the automated onboarding process
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Welcome Email Automation</p>
                <p className="text-xs text-muted-foreground">Triggered on user registration</p>
              </div>
            </div>
            <span className="text-xs font-medium text-primary">Active</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Follow-Up Email Scheduler</p>
                <p className="text-xs text-muted-foreground">3-day engagement check-in</p>
              </div>
            </div>
            <span className="text-xs font-medium text-primary">Active</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">User Metadata Tracking</p>
                <p className="text-xs text-muted-foreground">Signup source and onboarding status</p>
              </div>
            </div>
            <span className="text-xs font-medium text-primary">Active</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Error Recovery & Retry</p>
                <p className="text-xs text-muted-foreground">Automatic retry with exponential backoff</p>
              </div>
            </div>
            <span className="text-xs font-medium text-primary">Active</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
