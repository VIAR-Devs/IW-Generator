import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, CheckCircle2 } from "lucide-react";

interface NeedHelpDialogProps {
  open: boolean;
  onClose: () => void;
  currentStep: number;
  userEmail?: string;
  userName?: string;
}

export default function NeedHelpDialog({ open, onClose, currentStep, userEmail, userName }: NeedHelpDialogProps) {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState(userName || "");
  const [email, setEmail] = useState(userEmail || "");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch('/api/assistance-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          message,
          currentStep,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit request');
      }

      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please try again, or call us on 0203 355 8552.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setError("");
    setPhone("");
    setMessage("");
    onClose();
  };

  if (submitted) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent>
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <DialogTitle className="text-xl">We'll be in touch</DialogTitle>
            <DialogDescription className="text-base">
              Our team will contact you within 24 hours to help you complete your Islamic Will.
              We'll pick up exactly where you left off.
            </DialogDescription>
            <Button onClick={handleClose} className="mt-4">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            Get Personal Guidance
          </DialogTitle>
          <DialogDescription>
            Prefer to speak to someone? Our team will pick up where you left off and guide you through the rest personally.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="help-name">Your Name</Label>
            <Input
              id="help-name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="help-email">Email Address</Label>
            <Input
              id="help-email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="help-phone">Phone Number</Label>
            <Input
              id="help-phone"
              type="tel"
              placeholder="07xxx xxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="help-message">How can we help? (optional)</Label>
            <Textarea
              id="help-message"
              placeholder="Let us know what you need help with..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Request Guidance"}
            </Button>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          <p className="text-xs text-muted-foreground text-center">
            No extra charge. We'll call you within 24 hours.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
