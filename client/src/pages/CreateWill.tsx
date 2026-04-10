import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import StepIndicator from "@/components/StepIndicator";
import BasicDetailsStep from "@/components/BasicDetailsStep";
import NewExecutorsStep from "@/components/NewExecutorsStep";
import NewGuardiansStep from "@/components/NewGuardiansStep";
import FuneralPreferencesStep from "@/components/FuneralPreferencesStep";
import WasiyyahStep from "@/components/WasiyyahStep";
import HeirsSnapshotStep from "@/components/HeirsSnapshotStep";
import OptionalAddOnsStep from "@/components/OptionalAddOnsStep";
import ReviewStep from "@/components/ReviewStep";
import PaymentStep from "@/components/PaymentStep";
import SaveProgressDialog from "@/components/SaveProgressDialog";
import { WillFormData, Executor, Guardian, Child, Wasiyyah } from "@shared/schema";
import { FileText, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWillDraft } from "@/hooks/use-wills";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const steps = [
  { id: 1, title: "Basic Details", description: "Identity" },
  { id: 2, title: "Executors", description: "Estate managers" },
  { id: 3, title: "Guardians", description: "For children" },
  { id: 4, title: "Funeral", description: "Preferences" },
  { id: 5, title: "Wasiyyah", description: "Charitable bequest" },
  { id: 6, title: "Heirs", description: "Family info" },
  { id: 7, title: "Add-Ons", description: "Optional" },
  { id: 8, title: "Review", description: "Confirm details" },
  { id: 9, title: "Payment", description: "Complete" },
];

export default function CreateWill() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const { toast } = useToast();
  const { createWill, isCreating } = useWillDraft();
  const [, setLocation] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const [formData, setFormData] = useState<WillFormData>(() => {
    const savedName = sessionStorage.getItem('willFullName');
    return {
      basicDetails: {
        fullName: savedName || "",
        addressLine1: "",
        city: "",
        postcode: "",
        date: new Date().toISOString().split('T')[0],
        burialCountry: "",
      },
      executors: [],
      guardians: [],
      children: [],
      funeralPreferences: {
        restrictPostMortem: false,
        organDonation: false,
        imamOrMasjid: "",
        cemetery: "",
        charityAtFuneral: "",
      },
      wasiyyah: {
        enabled: false,
        beneficiaries: [],
      },
      heirsSnapshot: {
        hasSpouse: false,
        numberOfSons: 0,
        numberOfDaughters: 0,
        motherAlive: false,
        fatherAlive: false,
        otherHeirs: "",
        madhhab: undefined,
      },
      optionalAddOns: {
        letterOfWishesEnabled: false,
        letterOfWishes: undefined,
        guidanceForGuardiansEnabled: false,
        guidanceForGuardians: undefined,
        guidanceForExecutorsEnabled: false,
      },
    };
  });

  const handleSaveProgress = () => {
    setShowSaveDialog(true);
  };

  const handleCreateAccount = (email: string, password: string) => {
    console.log('Creating account:', email);
    setShowSaveDialog(false);
    toast({
      title: "Account Created",
      description: "Your progress has been saved. You can return anytime to complete your will.",
    });
  };

  const handleAuthSuccess = async () => {
    try {
      await createWill(formData);
      toast({
        title: "Will Saved",
        description: "Your will has been securely saved. Proceeding to payment...",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save will. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePayment = async (email: string) => {
    try {
      toast({
        title: "Redirecting to Payment",
        description: "You'll be redirected to Stripe to complete your purchase securely.",
      });

      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || "Failed to start payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer" data-testid="logo">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <FileText className="w-4 h-4 text-accent-foreground" />
              </div>
              <span className="font-bold text-lg text-foreground">Islamic Will Gen</span>
            </div>
          </Link>
          
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <StepIndicator steps={steps} currentStep={currentStep} />
        </div>

        <div className="bg-card rounded-lg border p-6 sm:p-8">
          {currentStep === 1 && (
            <BasicDetailsStep
              defaultValues={formData.basicDetails}
              onNext={(data) => {
                setFormData(prev => ({ ...prev, basicDetails: data }));
                setCurrentStep(2);
              }}
              onSaveProgress={handleSaveProgress}
            />
          )}

          {currentStep === 2 && (
            <NewExecutorsStep
              defaultExecutors={formData.executors}
              onNext={(executors: Executor[]) => {
                setFormData(prev => ({ ...prev, executors }));
                setCurrentStep(3);
              }}
              onBack={() => setCurrentStep(1)}
              onSaveProgress={handleSaveProgress}
            />
          )}

          {currentStep === 3 && (
            <NewGuardiansStep
              defaultGuardians={formData.guardians}
              defaultChildren={formData.children}
              onNext={(data: { guardians: Guardian[]; children: Child[] }) => {
                setFormData(prev => ({ 
                  ...prev, 
                  guardians: data.guardians,
                  children: data.children,
                }));
                setCurrentStep(4);
              }}
              onBack={() => setCurrentStep(2)}
              onSaveProgress={handleSaveProgress}
            />
          )}

          {currentStep === 4 && (
            <FuneralPreferencesStep
              defaultValues={formData.funeralPreferences}
              onNext={(data) => {
                setFormData(prev => ({ ...prev, funeralPreferences: data }));
                setCurrentStep(5);
              }}
              onBack={() => setCurrentStep(3)}
              onSaveProgress={handleSaveProgress}
            />
          )}

          {currentStep === 5 && (
            <WasiyyahStep
              defaultValues={formData.wasiyyah}
              onNext={(data: Wasiyyah) => {
                setFormData(prev => ({ ...prev, wasiyyah: data }));
                setCurrentStep(6);
              }}
              onBack={() => setCurrentStep(4)}
              onSaveProgress={handleSaveProgress}
            />
          )}

          {currentStep === 6 && (
            <HeirsSnapshotStep
              defaultValues={formData.heirsSnapshot}
              onNext={(data) => {
                setFormData(prev => ({ ...prev, heirsSnapshot: data }));
                setCurrentStep(7);
              }}
              onBack={() => setCurrentStep(5)}
              onSaveProgress={handleSaveProgress}
            />
          )}

          {currentStep === 7 && (
            <OptionalAddOnsStep
              defaultValues={formData.optionalAddOns}
              onNext={(data) => {
                setFormData(prev => ({ ...prev, optionalAddOns: data }));
                setCurrentStep(8);
              }}
              onBack={() => setCurrentStep(6)}
              onSaveProgress={handleSaveProgress}
            />
          )}

          {currentStep === 8 && (
            <ReviewStep
              formData={formData}
              onNext={() => setCurrentStep(9)}
              onBack={() => setCurrentStep(7)}
              onEditStep={(step) => setCurrentStep(step)}
            />
          )}

          {currentStep === 9 && (
            <PaymentStep
              onBack={() => setCurrentStep(8)}
              onAuthSuccess={handleAuthSuccess}
              onPayment={handlePayment}
            />
          )}
        </div>
      </main>

      <SaveProgressDialog
        open={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onSave={handleCreateAccount}
      />
    </div>
  );
}
