import { useState, useEffect } from "react";
import { CheckCircle, ArrowRight, Shield, Scale, Clock, FileCheck, Users, Award, FileText, HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import { AuthDialog } from "@/components/AuthDialog";
import { useAuth } from "@/hooks/use-auth";

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block">
      <span className="absolute inset-0 bg-accent -skew-x-2 transform -rotate-1 rounded-sm" style={{ top: '40%', height: '50%' }} />
      <span className="relative">{children}</span>
    </span>
  );
}

function Squiggle() {
  return (
    <svg viewBox="0 0 100 30" className="w-16 h-6 mx-auto mb-2" fill="none" stroke="hsl(var(--accent))" strokeWidth="3" strokeLinecap="round">
      <path d="M 10 20 Q 25 5 40 15 T 70 12 T 90 18" />
    </svg>
  );
}

function CircleHighlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block">
      <svg className="absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)]" viewBox="0 0 100 50" fill="none" preserveAspectRatio="none">
        <ellipse cx="50" cy="25" rx="48" ry="22" stroke="hsl(var(--accent))" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span className="relative">{children}</span>
    </span>
  );
}
import logoImage from "@assets/iwg-logo_1766347750026.png";

export default function LandingPage() {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [fullName, setFullName] = useState("");
  const [showStickyBar, setShowStickyBar] = useState(false);
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar after scrolling past 400px (approximately past the hero form)
      setShowStickyBar(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignInClick = () => {
    setAuthMode("login");
    setAuthDialogOpen(true);
  };

  const handleGetStartedClick = () => {
    if (fullName.trim()) {
      sessionStorage.setItem('willFullName', fullName.trim());
    }
    setLocation('/my-details');
  };

  const features = [
    {
      icon: Shield,
      title: "Shariah Compliant",
      description: "Follows authentic Islamic inheritance law (Faraid) with guidance from qualified scholars.",
    },
    {
      icon: Scale,
      title: "UK Legally Valid",
      description: "Your will is fully enforceable under English and Welsh law when properly witnessed.",
    },
    {
      icon: Clock,
      title: "Ready in 10 Minutes",
      description: "Our guided process makes creating your will quick and straightforward.",
    },
    {
      icon: FileCheck,
      title: "Professional Document",
      description: "Receive a professionally formatted, print-ready will document.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link href="/" data-testid="logo">
            <img 
              src={logoImage}
              alt="Islamic Will Generator" 
              className="h-14 cursor-pointer"
            />
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-features">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-how-it-works">How It Works</a>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 border-0" data-testid="button-dashboard">
                    My Will
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={logout} data-testid="button-sign-out">
                  Sign Out
                </Button>
              </>
            ) : (
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 border-0" onClick={handleSignInClick} data-testid="button-sign-in">
                My Will
              </Button>
            )}
          </div>
        </div>
      </header>

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} mode={authMode} />

      {/* Sticky Start Bar - appears when scrolling */}
      <div 
        className={`fixed top-16 left-0 right-0 z-40 bg-card border-b transition-all duration-300 ${
          showStickyBar ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row gap-2 items-center">
            <Input
              type="text"
              placeholder="Your full legal name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-10 text-sm flex-1"
              data-testid="input-sticky-name"
            />
            <Button 
              size="default" 
              onClick={handleGetStartedClick}
              className="h-10 px-5 whitespace-nowrap bg-accent text-accent-foreground hover:bg-accent/90 border-0 w-full sm:w-auto"
              data-testid="button-sticky-start"
            >
              Start My Will
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section with Inline Generator */}
      <section className="py-16 sm:py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Squiggle />
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
            Create Your <Highlight>Islamic Will</Highlight>{" "}
            in <CircleHighlight>10 Minutes</CircleHighlight>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            A simple, guided process to create a Shariah-compliant will that's legally valid in the UK. Start now and protect your family's future.
          </p>

          {/* Immediate Action Card - "We Buy Any Car" Style */}
          <Card className="p-6 sm:p-8 max-w-xl mx-auto border">
            <div className="space-y-4">
              <p className="text-sm font-medium text-muted-foreground">Enter your name to begin</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="text"
                  placeholder="Your full legal name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-12 text-base"
                  data-testid="input-full-name"
                />
                <Button 
                  size="lg" 
                  onClick={handleGetStartedClick}
                  className="h-12 px-6 whitespace-nowrap bg-accent text-accent-foreground hover:bg-accent/90 border-0"
                  data-testid="button-start-will"
                >
                  Start My Will
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground pt-2">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Only £50
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  10 minutes
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Secure
                </span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything you need in <Highlight>one place</Highlight>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform combines Islamic scholarship with UK legal requirements to give you a complete solution.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <Card key={i} className="p-6" data-testid={`feature-card-${i}`}>
                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-accent/10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-accent text-accent-foreground px-4 py-1">How It Works</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Three <Highlight>Simple Steps</Highlight>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Creating your Islamic will has never been easier.
            </p>
          </div>

          <div className="relative">
            <div className="grid md:grid-cols-3 gap-8 md:gap-16">
              {[
                {
                  step: "1",
                  title: "Answer Questions",
                  description: "Our guided form asks you simple questions about your family, assets, and wishes.",
                },
                {
                  step: "2",
                  title: "Review Your Will",
                  description: "We generate your will instantly. Review everything before finalising.",
                },
                {
                  step: "3",
                  title: "Print & Sign",
                  description: "Download your professionally formatted will, print it, and sign with two witnesses.",
                },
              ].map((item, i) => (
                <div key={i} className="text-center relative" data-testid={`step-${i}`}>
                  <div className="w-16 h-16 rounded-full bg-accent text-accent-foreground font-bold text-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-accent/30">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 text-lg">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                  
                  {/* Curvy Arrow - only show between steps on desktop */}
                  {i < 2 && (
                    <div className="hidden md:block absolute top-8 -right-8 w-16">
                      <svg viewBox="0 0 100 40" className="w-full text-accent" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M 0 20 Q 50 0 100 20" strokeLinecap="round" />
                        <path d="M 85 12 L 100 20 L 85 28" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6" data-testid="trust-badge-0">
              <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Bank-Level Security</h3>
              <p className="text-sm text-muted-foreground">Your data is encrypted and protected with the highest security standards.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6" data-testid="trust-badge-1">
              <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Scholar Reviewed</h3>
              <p className="text-sm text-muted-foreground">Our process has been reviewed by qualified Islamic scholars for Shariah compliance.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6" data-testid="trust-badge-2">
              <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center mb-4">
                <Award className="w-7 h-7 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Legally Valid</h3>
              <p className="text-sm text-muted-foreground">Created to meet all legal requirements for wills in England and Wales.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <Squiggle />
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Frequently Asked <Highlight>Questions</Highlight>
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about creating your Islamic will.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-3">
            <AccordionItem value="item-1" className="border rounded-lg px-4" data-testid="faq-item-1">
              <AccordionTrigger className="text-left hover:no-underline" iconClassName="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground">
                What makes a will "Islamic" or Shariah-compliant?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                An Islamic will follows the principles of Faraid (Islamic inheritance law) as outlined in the Quran and Sunnah. 
                It ensures that your estate is distributed according to the fixed shares prescribed for different family members, 
                while also allowing you to allocate up to one-third of your estate to charity (Wasiyyah) or non-heirs.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border rounded-lg px-4" data-testid="faq-item-2">
              <AccordionTrigger className="text-left hover:no-underline" iconClassName="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground">
                Is this will legally valid in the UK?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes. Our wills are designed to meet all the legal requirements for a valid will in England and Wales. 
                You'll need to sign it in the presence of two witnesses (who are not beneficiaries) for it to be legally binding. 
                The will combines UK legal validity with Islamic inheritance principles.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border rounded-lg px-4" data-testid="faq-item-3">
              <AccordionTrigger className="text-left hover:no-underline" iconClassName="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground">
                How long does it take to complete?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Most people complete their will in about 10 minutes. Our step-by-step process guides you through 
                each section clearly, and you can save your progress at any time to continue later.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border rounded-lg px-4" data-testid="faq-item-4">
              <AccordionTrigger className="text-left hover:no-underline" iconClassName="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground">
                What is Wasiyyah and how does it work?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Wasiyyah is an optional bequest of up to one-third of your estate that you can leave to charity, 
                non-Muslim relatives, or anyone who is not already an heir under Islamic law. The remaining two-thirds 
                must be distributed according to the fixed shares of Faraid.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border rounded-lg px-4" data-testid="faq-item-5">
              <AccordionTrigger className="text-left hover:no-underline" iconClassName="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground">
                Do I need to consult a solicitor?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                For most straightforward estates, our will generator provides everything you need. However, if you have 
                complex assets (like businesses or properties in multiple countries), significant debts, or complicated 
                family situations, we recommend consulting with a solicitor who understands both UK law and Islamic inheritance.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border rounded-lg px-4" data-testid="faq-item-6">
              <AccordionTrigger className="text-left hover:no-underline" iconClassName="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground">
                Can I update my will later?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes, you can create a new will at any time. Life changes like marriage, divorce, birth of children, 
                or significant changes to your assets should prompt a review of your will. Your most recent valid will 
                always supersedes any previous versions.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="border rounded-lg px-4" data-testid="faq-item-7">
              <AccordionTrigger className="text-left hover:no-underline" iconClassName="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground">
                Which madhab (school of thought) do you follow?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Our will generator allows you to select your preferred madhab (Hanafi, Shafi'i, Maliki, or Hanbali) 
                during the process. The inheritance calculations will then follow the specific rulings of your chosen 
                school of thought. If you're unsure, you can also choose a general approach.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-foreground text-background">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to create your Islamic will?
          </h2>
          <p className="text-lg opacity-80 mb-8 max-w-2xl mx-auto">
            Join thousands of Muslims who have already secured their family's future with a Shariah-compliant will.
          </p>
          <Button 
            size="lg"
            variant="secondary"
            onClick={handleGetStartedClick}
            className="h-12 px-8"
            data-testid="button-cta-final"
          >
            Start Creating My Will
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <p className="text-sm opacity-60 mt-4">
            Only £50 - Save progress & Update anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
            {/* Brand */}
            <div className="max-w-md">
              <Link href="/" className="block mb-3">
                <img 
                  src={logoImage}
                  alt="Islamic Will Generator" 
                  className="h-12"
                />
              </Link>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This tool provides guidance for creating a Shariah-compliant will but does not constitute legal advice. Consider consulting with a qualified solicitor or Islamic scholar for complex estates.
              </p>
            </div>
            
            {/* Links */}
            <nav className="flex items-center gap-6">
              <a href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-privacy">
                Privacy
              </a>
              <a href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-terms">
                Terms
              </a>
              <a href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-contact">
                Contact
              </a>
            </nav>
          </div>
          
          {/* Bottom bar */}
          <div className="border-t pt-6">
            <p className="text-center text-sm text-muted-foreground">
              © Islamic Will Generator a trading name of The Garden Network Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
