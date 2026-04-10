import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BookOpen, Eye, Edit, Download, MoreVertical, User, ScrollText, Scale, Calendar, Plus, FileText, Users, Briefcase, Gift, UserPlus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Link, useLocation } from "wouter";
import logoImage from "@assets/iwg-logo_1766347750026.png";
import StepIndicator from "@/components/StepIndicator";
import BasicDetailsStep from "@/components/BasicDetailsStep";
import NewExecutorsStep from "@/components/NewExecutorsStep";
import NewGuardiansStep from "@/components/NewGuardiansStep";
import FuneralPreferencesStep from "@/components/FuneralPreferencesStep";
import WasiyyahStep from "@/components/WasiyyahStep";
import HeirsSnapshotStep from "@/components/HeirsSnapshotStep";
import OptionalAddOnsStep from "@/components/OptionalAddOnsStep";
import ReviewStep from "@/components/ReviewStep";
import { WillPreviewDialog } from "@/components/WillPreviewDialog";
import { WillFormData, Executor, Guardian, Child, Wasiyyah } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useAuth } from "@/hooks/use-auth";
import { useUserWills } from "@/hooks/use-wills";

const steps = [
  { id: 1, title: "Basic Details", description: "Identity" },
  { id: 2, title: "Executors", description: "Estate managers" },
  { id: 3, title: "Guardians", description: "For children" },
  { id: 4, title: "Funeral", description: "Preferences" },
  { id: 5, title: "Wasiyyah", description: "Charitable bequest" },
  { id: 6, title: "Heirs", description: "Family info" },
  { id: 7, title: "Add-Ons", description: "Optional" },
  { id: 8, title: "Review", description: "Confirm details" },
];

export default function Dashboard() {
  const [showWillEditor, setShowWillEditor] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const { data: willsData, isLoading: isLoadingWills } = useUserWills();
  const [, setLocation] = useLocation();

  const completedWill = willsData?.wills?.find((w) => w.status === "completed");
  const draftWill = willsData?.wills?.find((w) => w.status === "draft");

  const [formData, setFormData] = useState<WillFormData>(
    draftWill?.formData || {
      basicDetails: {
        fullName: user?.fullName || "",
        addressLine1: "",
        city: "",
        postcode: "",
        date: new Date().toISOString().split('T')[0],
        burialCountry: "United Kingdom",
      },
      executors: [],
      guardians: [],
      children: [],
      funeralPreferences: {
        restrictPostMortem: true,
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
        madhhab: "hanafi",
      },
      optionalAddOns: {
        letterOfWishesEnabled: false,
        letterOfWishes: undefined,
        guidanceForGuardiansEnabled: false,
        guidanceForGuardians: undefined,
        guidanceForExecutorsEnabled: false,
      },
    }
  );

  useEffect(() => {
    const willToLoad = completedWill || draftWill;
    if (willToLoad?.formData) {
      setFormData(willToLoad.formData as WillFormData);
    }
  }, [completedWill, draftWill]);

  const handlePreview = () => {
    if (completedWill || draftWill) {
      setShowPreviewDialog(true);
    } else {
      setLocation('/my-details');
    }
  };

  const handleEdit = () => {
    setCurrentStep(1);
    setShowWillEditor(true);
  };

  const handleDownload = () => {
    if (completedWill) {
      toast({
        title: "Downloading Will",
        description: "Your Islamic Will PDF is being prepared...",
      });
    } else {
      toast({
        title: "Will Not Complete",
        description: "Please complete your will before downloading.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadUpdated = () => {
    toast({
      title: "Download Updated Will",
      description: "Your updated will PDF is being prepared...",
    });
    setShowWillEditor(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer" data-testid="logo">
              <img 
                src={logoImage} 
                alt="Islamic Wills Logo" 
                className="h-14 w-auto"
              />
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground" data-testid="text-user-name">
              {user?.fullName}
            </span>
            <Link href="/account">
              <Button variant="ghost" size="icon" data-testid="button-account">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Button variant="ghost" onClick={logout} data-testid="button-logout">
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-3">
              Welcome, {user?.fullName?.split(' ')[0] || 'there'}
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage your Islamic Will and important documents.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Your Will Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-xl font-semibold">Your Will</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="border-muted-foreground/30" data-testid="button-will-menu">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handlePreview} data-testid="menu-preview">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleEdit} data-testid="menu-edit">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDownload} data-testid="menu-download">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="text-center py-8">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
                {isLoadingWills ? (
                  <p className="text-muted-foreground">Loading your will...</p>
                ) : completedWill ? (
                  <>
                    <h3 className="text-xl font-semibold mb-2">Your Islamic Will is ready.</h3>
                    <p className="text-muted-foreground mb-4">
                      You can preview, download, or update your Will at any time.
                    </p>
                    <div className="flex flex-col gap-3">
                      <Button 
                        className="w-full bg-accent text-accent-foreground hover:bg-accent/90 border-0" 
                        size="lg"
                        onClick={handlePreview}
                        data-testid="button-preview-will"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Click to Preview
                      </Button>
                      <Button 
                        variant="outline"
                        className="w-full" 
                        size="lg"
                        onClick={handleDownload}
                        data-testid="button-download-will"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </>
                ) : draftWill ? (
                  <>
                    <h3 className="text-xl font-semibold mb-2">You have a draft Will in progress.</h3>
                    <p className="text-muted-foreground mb-4">
                      Continue editing your Will to complete it.
                    </p>
                    <Button 
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90 border-0" 
                      size="lg"
                      onClick={handleEdit}
                      data-testid="button-continue-will"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Continue Editing
                    </Button>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold mb-2">No Will yet.</h3>
                    <p className="text-muted-foreground mb-4">
                      Start creating your Islamic Will today.
                    </p>
                    <Link href="/my-details">
                      <Button 
                        className="w-full bg-accent text-accent-foreground hover:bg-accent/90 border-0" 
                        size="lg"
                        data-testid="button-start-will"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Start My Will
                      </Button>
                    </Link>
                  </>
                )}
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t pt-4">
                {completedWill ? (
                  <>
                    <span className="text-sm text-muted-foreground">
                      Last updated {completedWill.updatedAt ? new Date(completedWill.updatedAt).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }) : 'recently'}
                    </span>
                    <Badge variant="default" className="bg-accent text-accent-foreground">COMPLETE</Badge>
                  </>
                ) : draftWill ? (
                  <>
                    <span className="text-sm text-muted-foreground">
                      Last updated {draftWill.updatedAt ? new Date(draftWill.updatedAt).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }) : 'recently'}
                    </span>
                    <Badge variant="secondary">DRAFT</Badge>
                  </>
                ) : (
                  <>
                    <span className="text-sm text-muted-foreground">Not started</span>
                    <Badge variant="outline">NEW</Badge>
                  </>
                )}</CardFooter>
            </Card>

            {/* Additional Documents Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-semibold">Additional Documents</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Download your supplementary documents</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Letter of Wishes */}
                {completedWill?.formData?.optionalAddOns?.letterOfWishesEnabled ? (
                  <Button 
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      toast({
                        title: "Downloading",
                        description: "Your Letter of Wishes is being prepared...",
                      });
                    }}
                    data-testid="button-download-letter-wishes"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Letter of Wishes
                    <Download className="h-4 w-4 ml-auto" />
                  </Button>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline"
                        className="w-full justify-start opacity-50 cursor-not-allowed"
                        disabled
                        data-testid="button-download-letter-wishes-disabled"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Letter of Wishes
                        <Download className="h-4 w-4 ml-auto" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>To download this, <Link href="/create-will" className="underline">update your details here</Link></p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {/* Guidance for Guardians */}
                {completedWill?.formData?.optionalAddOns?.guidanceForGuardiansEnabled ? (
                  <Button 
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      toast({
                        title: "Downloading",
                        description: "Your Guidance for Guardians is being prepared...",
                      });
                    }}
                    data-testid="button-download-guidance-guardians"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Guidance for Guardians
                    <Download className="h-4 w-4 ml-auto" />
                  </Button>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline"
                        className="w-full justify-start opacity-50 cursor-not-allowed"
                        disabled
                        data-testid="button-download-guidance-guardians-disabled"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Guidance for Guardians
                        <Download className="h-4 w-4 ml-auto" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>To download this, <Link href="/create-will" className="underline">update your details here</Link></p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {/* Executor Briefing */}
                {completedWill?.formData?.optionalAddOns?.guidanceForExecutorsEnabled ? (
                  <Button 
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      toast({
                        title: "Downloading",
                        description: "Your Executor Briefing is being prepared...",
                      });
                    }}
                    data-testid="button-download-executor-briefing"
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    Executor Briefing
                    <Download className="h-4 w-4 ml-auto" />
                  </Button>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline"
                        className="w-full justify-start opacity-50 cursor-not-allowed"
                        disabled
                        data-testid="button-download-executor-briefing-disabled"
                      >
                        <Briefcase className="h-4 w-4 mr-2" />
                        Executor Briefing
                        <Download className="h-4 w-4 ml-auto" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>To download this, <Link href="/create-will" className="underline">update your details here</Link></p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {/* Note about creating documents */}
                {!completedWill?.formData?.optionalAddOns?.letterOfWishesEnabled && 
                 !completedWill?.formData?.optionalAddOns?.guidanceForGuardiansEnabled && 
                 !completedWill?.formData?.optionalAddOns?.guidanceForExecutorsEnabled && (
                  <p className="text-sm text-muted-foreground pt-3 border-t mt-3">
                    These optional documents can be created when you complete or update your Will.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Book Consultation Card */}
            <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Scale className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-semibold">Legal Consultation</CardTitle>
                    <Badge variant="secondary" className="mt-1 bg-accent/20 text-accent-foreground border-accent/30">
                      Free
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Schedule a complimentary 30-minute consultation with our qualified Islamic estate planning lawyers 
                  to discuss your specific needs and questions.
                </p>
                <Button 
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 border-0" 
                  size="lg"
                  onClick={() => {
                    toast({
                      title: "Book Consultation",
                      description: "Redirecting to our booking calendar...",
                    });
                  }}
                  data-testid="button-book-consultation"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Free Consultation
                </Button>
              </CardContent>
            </Card>

            {/* Refer a Friend Card */}
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Gift className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-semibold">Refer a Friend</CardTitle>
                    <Badge variant="secondary" className="mt-1 bg-primary/20 text-primary border-primary/30">
                      20% Off
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Share the gift of peace of mind. When your family or friends create their Islamic Will, 
                  you both receive 20% off your next service.
                </p>
                <Button 
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 border-0" 
                  size="lg"
                  onClick={() => {
                    toast({
                      title: "Referral Program",
                      description: "Your unique referral link has been copied to clipboard!",
                    });
                  }}
                  data-testid="button-refer-friend"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Get Your Referral Link
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Will Editor Modal */}
      <Dialog open={showWillEditor} onOpenChange={setShowWillEditor}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto overflow-x-hidden p-0">
          <VisuallyHidden>
            <DialogTitle>Edit Your Islamic Will</DialogTitle>
            <DialogDescription>
              Update your Shariah-compliant Islamic will details
            </DialogDescription>
          </VisuallyHidden>
          
          <div className="sticky top-0 bg-background border-b z-10">
            <div className="px-4 sm:px-6 py-4">
              <div className="flex items-center gap-3 mb-4">
                <ScrollText className="h-6 w-6 text-primary flex-shrink-0" />
                <h1 className="text-lg sm:text-xl font-semibold text-foreground">Edit Your Will</h1>
              </div>
              <div className="overflow-x-hidden">
                <StepIndicator steps={steps} currentStep={currentStep} />
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 py-6 overflow-x-hidden">
            {currentStep === 1 && (
              <BasicDetailsStep
                defaultValues={formData.basicDetails}
                onNext={(data) => {
                  setFormData(prev => ({ ...prev, basicDetails: data }));
                  setCurrentStep(2);
                }}
                onSaveProgress={() => {}}
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
                onSaveProgress={() => {}}
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
                onSaveProgress={() => {}}
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
                onSaveProgress={() => {}}
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
                onSaveProgress={() => {}}
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
                onSaveProgress={() => {}}
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
                onSaveProgress={() => {}}
              />
            )}

            {currentStep === 8 && (
              <div className="space-y-6">
                <ReviewStep
                  formData={formData}
                  onNext={() => {}}
                  onBack={() => setCurrentStep(7)}
                  onEditStep={(step) => setCurrentStep(step)}
                />
                
                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentStep(7)}
                    data-testid="button-back-from-download"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handleDownloadUpdated}
                    className="flex-1"
                    size="lg"
                    data-testid="button-download-updated-will"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Updated Will
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Will Preview Dialog */}
      <WillPreviewDialog
        open={showPreviewDialog}
        onOpenChange={setShowPreviewDialog}
        formData={(completedWill?.formData || draftWill?.formData) as WillFormData | null}
        onEdit={() => {
          setShowPreviewDialog(false);
          handleEdit();
        }}
        onEditStep={(step: number) => {
          setShowPreviewDialog(false);
          setCurrentStep(step);
          setShowWillEditor(true);
        }}
        lastUpdated={completedWill?.updatedAt || draftWill?.updatedAt 
          ? new Date(completedWill?.updatedAt || draftWill?.updatedAt || '').toLocaleDateString('en-GB', { month: 'long', day: 'numeric', year: 'numeric' })
          : undefined
        }
      />
    </div>
  );
}
