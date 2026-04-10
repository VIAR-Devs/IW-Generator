import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, 
  Send,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Loader2
} from "lucide-react";
import { Link } from "wouter";

interface BroadcastResult {
  success: boolean;
  totalSent: number;
  totalFailed: number;
  errors: string[];
}

interface OnboardingStats {
  totalUsersOnboarded: number;
  welcomeEmailsSent: number;
  welcomeEmailsFailed: number;
  followUpEmailsPending: number;
  followUpEmailsSent: number;
  followUpEmailsFailed: number;
}

export default function AdminBroadcast() {
  const { toast } = useToast();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [userFilter, setUserFilter] = useState<'all' | 'last_7_days' | 'last_30_days'>('all');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState<BroadcastResult | null>(null);

  // Get user count for preview
  const { data: stats } = useQuery<OnboardingStats>({
    queryKey: ["/api/admin/onboarding-stats"],
  });

  const broadcastMutation = useMutation<BroadcastResult>({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/admin/broadcast-email", {
        subject,
        message,
        userFilter,
      });
      return response.json() as Promise<BroadcastResult>;
    },
    onSuccess: (data) => {
      setBroadcastResult(data);
      setShowConfirmDialog(false);
      
      if (data.totalFailed === 0) {
        toast({
          title: "Broadcast Sent Successfully",
          description: `Email sent to ${data.totalSent} users`,
        });
      } else {
        toast({
          title: "Broadcast Completed with Errors",
          description: `Sent to ${data.totalSent} users, ${data.totalFailed} failed`,
          variant: "destructive",
        });
      }
      
      // Reset form
      setSubject("");
      setMessage("");
    },
    onError: (error: any) => {
      setShowConfirmDialog(false);
      toast({
        title: "Broadcast Failed",
        description: error.message || "Failed to send broadcast email",
        variant: "destructive",
      });
    },
  });

  const handleSendClick = () => {
    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide both subject and message",
        variant: "destructive",
      });
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleConfirmSend = () => {
    broadcastMutation.mutate();
  };

  const getRecipientCount = () => {
    if (!stats) return 0;
    // For now, return total users as approximation
    // In production, you'd want a separate endpoint to get exact count
    return stats.totalUsersOnboarded;
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Link href="/dashboard/admin">
          <Button variant="ghost" size="sm" data-testid="button-back-admin">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin Dashboard
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Broadcast Email</h1>
          <p className="text-muted-foreground mt-2">
            Send announcements or updates to your users
          </p>
        </div>

        {/* Broadcast Result */}
        {broadcastResult && (
          <Card className="border-primary">
            <CardHeader>
              <div className="flex items-center gap-3">
                {broadcastResult.totalFailed === 0 ? (
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                )}
                <CardTitle>Broadcast Results</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Successfully Sent</p>
                    <p className="text-2xl font-bold" data-testid="text-sent-count">
                      {broadcastResult.totalSent}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Failed</p>
                    <p className="text-2xl font-bold" data-testid="text-failed-count">
                      {broadcastResult.totalFailed}
                    </p>
                  </div>
                </div>
              </div>

              {broadcastResult.errors.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-destructive mb-2">Errors:</p>
                  <div className="bg-destructive/10 p-3 rounded-md max-h-40 overflow-y-auto">
                    {broadcastResult.errors.map((error, idx) => (
                      <p key={idx} className="text-xs text-destructive mb-1">
                        {error}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Email Composer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Compose Broadcast Message
            </CardTitle>
            <CardDescription>
              Write your message below. It will be sent to users based on your selected filter.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* User Filter */}
            <div className="space-y-2">
              <Label htmlFor="user-filter">Recipients</Label>
              <Select
                value={userFilter}
                onValueChange={(value) => setUserFilter(value as any)}
              >
                <SelectTrigger id="user-filter" data-testid="select-user-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="last_7_days">Registered in Last 7 Days</SelectItem>
                  <SelectItem value="last_30_days">Registered in Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Estimated recipients: {getRecipientCount()} users
              </p>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">Subject Line</Label>
              <Input
                id="subject"
                placeholder="e.g., Important Update: New Features Available"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                data-testid="input-subject"
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Enter your message here. Keep it clear and concise.&#10;&#10;Example:&#10;We're excited to announce new features that will help you create your Islamic will more easily..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={10}
                data-testid="textarea-message"
              />
              <p className="text-xs text-muted-foreground">
                {message.length} characters
              </p>
            </div>

            {/* Preview */}
            {subject && message && (
              <div className="border rounded-md p-4 bg-muted/30">
                <p className="text-xs font-medium text-muted-foreground mb-2">Preview:</p>
                <div className="space-y-2">
                  <p className="font-semibold">{subject}</p>
                  <div className="text-sm whitespace-pre-wrap">{message}</div>
                </div>
              </div>
            )}

            {/* Send Button */}
            <div className="flex justify-end pt-4">
              <Button
                onClick={handleSendClick}
                disabled={!subject.trim() || !message.trim() || broadcastMutation.isPending}
                size="lg"
                data-testid="button-send-broadcast"
              >
                {broadcastMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Broadcast
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Broadcast Email</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                You are about to send this email to approximately <strong>{getRecipientCount()} users</strong>.
              </p>
              <p className="text-sm">
                <strong>Subject:</strong> {subject}
              </p>
              <p className="text-sm">
                <strong>Filter:</strong> {userFilter.replace('_', ' ')}
              </p>
              <p className="mt-4 text-destructive font-medium">
                This action cannot be undone. Are you sure you want to proceed?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-broadcast">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmSend}
              className="bg-primary"
              data-testid="button-confirm-broadcast"
            >
              Yes, Send Email
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
