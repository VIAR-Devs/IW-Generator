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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Mail,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  Send,
  RefreshCw,
  AlertCircle,
  Phone,
  MessageSquare
} from "lucide-react";

interface OnboardingStats {
  totalUsersOnboarded: number;
  welcomeEmailsSent: number;
  welcomeEmailsFailed: number;
  followUpEmailsPending: number;
  followUpEmailsSent: number;
  followUpEmailsFailed: number;
}

interface AssistanceRequest {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  currentStep: number;
  status: string;
  createdAt: string;
}

const stepNames = [
  '', 'Basic Details', 'Executors', 'Guardians', 'Funeral',
  'Wasiyyah', 'Heirs', 'Add-Ons', 'Review', 'Payment'
];

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

  const { data: assistanceData, refetch: refetchAssistance } = useQuery<{ requests: AssistanceRequest[] }>({
    queryKey: ["/api/admin/assistance-requests"],
    retry: false,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await apiRequest("PATCH", `/api/admin/assistance-requests/${id}`, { status });
      return response.json();
    },
    onSuccess: () => {
      refetchAssistance();
      toast({ title: "Status updated" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    },
  });

  const pendingRequests = assistanceData?.requests?.filter(r => r.status === "pending") || [];

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
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage assistance requests, onboarding, and email automation
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
            onClick={() => { refetch(); refetchAssistance(); }}
            variant="outline"
            size="sm"
            data-testid="button-refresh-stats"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="assistance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="assistance" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Assistance Requests
            {pendingRequests.length > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {pendingRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="onboarding">
            <Mail className="h-4 w-4 mr-2" />
            Onboarding
          </TabsTrigger>
          <TabsTrigger value="engagement">
            <Mail className="h-4 w-4 mr-2" />
            Engagement
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assistance" className="space-y-4">
          {(!assistanceData?.requests || assistanceData.requests.length === 0) ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">No assistance requests yet</p>
                <p className="text-xs text-muted-foreground mt-1">When users click "Need Help?" during will creation, their requests will appear here.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {assistanceData.requests.map((request) => (
                <Card key={request.id} className={request.status === "pending" ? "border-primary/30" : ""}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{request.name}</h3>
                          <Badge variant={
                            request.status === "pending" ? "destructive" :
                            request.status === "contacted" ? "default" : "secondary"
                          }>
                            {request.status}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <a href={`mailto:${request.email}`} className="hover:text-foreground">{request.email}</a>
                          <a href={`tel:${request.phone}`} className="hover:text-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {request.phone}
                          </a>
                          <span>Stopped at: {stepNames[request.currentStep] || `Step ${request.currentStep}`}</span>
                          <span>{new Date(request.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        {request.message && (
                          <p className="text-sm mt-2 bg-muted/50 p-2 rounded">{request.message}</p>
                        )}
                      </div>
                      <Select
                        value={request.status}
                        onValueChange={(value) => updateStatusMutation.mutate({ id: request.id, status: value })}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="onboarding" className="space-y-6">

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

        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <EngagementPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─── Engagement Panel (Phase 1 iw-025) ────────────────────────────────────

interface EngagementStats {
  allTime: Record<string, number>;
  last30Days: Record<string, number>;
  perTemplate: Record<string, Record<string, number>>;
  userEngagement: {
    totalUsers: number;
    totalOpens: number;
    totalClicks: number;
    bounced: number;
    unsubscribed: number;
  };
}

function EngagementPanel() {
  const { data, isLoading, error } = useQuery<EngagementStats>({
    queryKey: ["/api/admin/engagement-stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/engagement-stats", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load engagement stats");
      return res.json();
    },
  });

  if (isLoading) return <Card><CardContent className="p-6">Loading engagement data...</CardContent></Card>;
  if (error) return <Card><CardContent className="p-6 text-destructive">Error: {(error as Error).message}</CardContent></Card>;
  if (!data) return null;

  const sent30 = data.last30Days.sent || 0;
  const openRate30 = sent30 ? ((data.last30Days.opened || 0) / sent30) * 100 : 0;
  const clickRate30 = sent30 ? ((data.last30Days.clicked || 0) / sent30) * 100 : 0;
  const bounceRate30 = sent30 ? ((data.last30Days.bounced || 0) / sent30) * 100 : 0;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Last 30 days — email funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {["sent", "delivered", "opened", "clicked", "bounced", "unsubscribed"].map((k) => (
              <div key={k} className="rounded-md border p-3">
                <div className="text-xs uppercase text-muted-foreground">{k}</div>
                <div className="text-xl font-semibold">{data.last30Days[k] ?? 0}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div><span className="text-muted-foreground">Open rate: </span><strong>{openRate30.toFixed(1)}%</strong></div>
            <div><span className="text-muted-foreground">Click rate: </span><strong>{clickRate30.toFixed(1)}%</strong></div>
            <div><span className="text-muted-foreground">Bounce rate: </span><strong>{bounceRate30.toFixed(1)}%</strong></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Per template — last 30 days</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(data.perTemplate).length === 0 ? (
            <p className="text-sm text-muted-foreground">No template-tagged sends in window yet.</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(data.perTemplate).map(([tk, counts]) => (
                <div key={tk} className="flex items-center gap-4 text-sm">
                  <div className="w-24 font-medium">{tk}</div>
                  {["sent", "delivered", "opened", "clicked", "bounced"].map((k) => (
                    <div key={k} className="text-muted-foreground">
                      {k}: <strong className="text-foreground">{counts[k] ?? 0}</strong>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User-side engagement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div><div className="text-xs uppercase text-muted-foreground">Users</div><div className="text-xl font-semibold">{data.userEngagement.totalUsers}</div></div>
            <div><div className="text-xs uppercase text-muted-foreground">Total opens</div><div className="text-xl font-semibold">{data.userEngagement.totalOpens}</div></div>
            <div><div className="text-xs uppercase text-muted-foreground">Total clicks</div><div className="text-xl font-semibold">{data.userEngagement.totalClicks}</div></div>
            <div><div className="text-xs uppercase text-muted-foreground">Bounced</div><div className="text-xl font-semibold">{data.userEngagement.bounced}</div></div>
            <div><div className="text-xs uppercase text-muted-foreground">Unsubscribed</div><div className="text-xl font-semibold">{data.userEngagement.unsubscribed}</div></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
