import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Lock, Mail, CheckCircle2 } from "lucide-react";
import IslamicInfoCard from "./IslamicInfoCard";
import { AuthDialog } from "@/components/AuthDialog";
import { useAuth } from "@/hooks/use-auth";

interface PaymentStepProps {
  onBack: () => void;
  onAuthSuccess: () => void;
  onPayment: (email: string) => void;
}

export default function PaymentStep({ onBack, onAuthSuccess, onPayment }: PaymentStepProps) {
  const { user } = useAuth();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [deliveryEmail, setDeliveryEmail] = useState("");
  const isAuthenticated = !!user;

  const handleCreateAccountClick = () => {
    setAuthMode("register");
    setAuthDialogOpen(true);
  };

  const handleSignInClick = () => {
    setAuthMode("login");
    setAuthDialogOpen(true);
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      handleCreateAccountClick();
      return;
    }
    onPayment(deliveryEmail || user?.email || "");
  };

  return (
    <div className="space-y-6">
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} mode={authMode} onSuccess={onAuthSuccess} />

      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Complete Your Will</h2>
        <p className="text-muted-foreground">
          {!isAuthenticated 
            ? "Create an account or sign in to save your will and proceed to payment."
            : "Complete payment to receive your will document."
          }
        </p>
      </div>

      <IslamicInfoCard
        title="Secure Document Delivery"
        content="Your Shariah-compliant will will be professionally formatted and delivered to your email. The document meets all UK legal requirements and includes signing instructions."
      />

      {!isAuthenticated ? (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Account Required</h3>
            </div>

            <p className="text-muted-foreground">
              To save your will and proceed to payment, please create an account or sign in.
            </p>

            <div className="space-y-3">
              <Button 
                onClick={handleCreateAccountClick} 
                className="w-full"
                data-testid="button-create-account-payment"
              >
                Create Account
              </Button>
              
              <Button 
                onClick={handleSignInClick} 
                variant="outline"
                className="w-full"
                data-testid="button-sign-in-payment"
              >
                Sign In
              </Button>
            </div>

            <Separator />

            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground text-center">
                Your will data is securely stored in your browser. Creating an account will save it permanently and allow you to edit it later.
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Payment Details</h3>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground">Islamic Will Document</span>
                <span className="text-2xl font-bold text-foreground">£49.99</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 mt-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  Shariah-compliant will with Faraid calculations
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  UK legally valid format
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  Professional PDF with signing instructions
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  Delivered instantly to your email
                </li>
              </ul>
            </div>

            <form onSubmit={handlePayment} className="space-y-4">
              <div className="space-y-2">
                <Label>Delivery Email</Label>
                <Input
                  type="email"
                  value={deliveryEmail || user?.email || ""}
                  onChange={(e) => setDeliveryEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  data-testid="input-final-email"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  Secure payment powered by Stripe. Your payment information is encrypted and secure.
                </p>
              </div>

              <Button type="submit" size="lg" className="w-full" data-testid="button-proceed-to-payment">
                <CreditCard className="h-4 w-4 mr-2" />
                Proceed to Secure Payment
              </Button>
            </form>
          </div>
        </Card>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} data-testid="button-back">
          Back
        </Button>
      </div>
    </div>
  );
}
