import { useState, useEffect } from "react";
import { CheckCircle, ArrowRight, Shield, Scale, Clock, FileCheck, Star, Users, Award, Sparkles, FileText, Heart, Globe, Droplets, GraduationCap, Home as HomeIcon } from "lucide-react";
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

import person1 from "@assets/stock_images/diverse_muslim_profe_44eb85f2.jpg";
import person2 from "@assets/stock_images/diverse_muslim_profe_656d3096.jpg";
import person3 from "@assets/stock_images/diverse_muslim_profe_65de6527.jpg";
import person4 from "@assets/stock_images/diverse_muslim_profe_3d12ebda.jpg";
import person5 from "@assets/stock_images/diverse_muslim_profe_2819c36a.jpg";
import person6 from "@assets/stock_images/diverse_muslim_profe_76dac33f.jpg";
import oneNationLogo from "@assets/o-n-logo_1766184971803.png";
import logoImage from "@assets/iwg-logo_1766347750026.png";

export default function OneNationLandingPage() {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [fullName, setFullName] = useState("");
  const [showStickyBar, setShowStickyBar] = useState(false);
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
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
    // Store that this came from One Nation partnership
    sessionStorage.setItem('willPartner', 'one-nation');
    setLocation('/my-details');
  };

  const trustedPeople = [
    { src: person1, alt: "Community member" },
    { src: person2, alt: "Community member" },
    { src: person3, alt: "Community member" },
    { src: person4, alt: "Community member" },
    { src: person5, alt: "Community member" },
    { src: person6, alt: "Community member" },
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Create Your Islamic Will",
      description: "Complete your Will using our simple, Shariah-aware online generator.",
    },
    {
      step: "2",
      title: "Support One Nation",
      description: "25% of your Will fee is donated to One Nation's where needed most fund.",
    },
    {
      step: "3",
      title: "Leave a Legacy",
      description: "You can choose to include One Nation as a beneficiary in your Will, creating long-term impact beyond your lifetime.",
    },
    {
      step: "4",
      title: "Increase the Reward",
      description: "Opt in to Gift Aid and optionally add a one-off donation during the process.",
    },
  ];

  const oneNationWork = [
    { icon: Heart, title: "Emergency Aid", description: "Food and medical relief in crisis zones" },
    { icon: Droplets, title: "Clean Water", description: "Water projects for communities in need" },
    { icon: GraduationCap, title: "Education", description: "Skills development and schooling" },
    { icon: HomeIcon, title: "Shelter", description: "Sustainable community support" },
  ];

  const whyNow = [
    "Simple, guided process",
    "Shariah-informed structure",
    "Secure and easy to complete",
    "Designed specifically for Ramadan",
    "Supports a charity making real impact",
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
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-home">Home</Link>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-how-it-works">How It Works</a>
            <a href="#about-one-nation" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-about">About One Nation</a>
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

      {/* Sticky Start Bar */}
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

      {/* Partnership Badge */}
      <section className="py-4 bg-accent/10 border-b">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm font-medium text-accent-foreground">
            Ramadan Legacy Fund – In Partnership with One Nation
          </p>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-10 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="mb-8">
            <img 
              src={oneNationLogo} 
              alt="One Nation" 
              className="h-24 sm:h-32 mx-auto object-contain"
              data-testid="img-one-nation-logo"
            />
          </div>
          
          <Badge variant="secondary" className="mb-6 px-4 py-1.5" data-testid="badge-partnership">
            <Heart className="w-3.5 h-3.5 mr-1.5" />
            25% donated to One Nation
          </Badge>
          
          <Squiggle />
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
            Create Your <Highlight>Islamic Will</Highlight>{" "}
            & Support <CircleHighlight>One Nation</CircleHighlight> this Ramadan
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            25% of every Will fee will be donated to One Nation to support their most needed projects this Ramadan.
          </p>

          {/* Immediate Action Card */}
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
                  25% to charity
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Sadaqah Jariyah
                </span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Why This Matters Section */}
      <section className="py-16 sm:py-20 bg-muted/30 border-y">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Squiggle />
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Why This <Highlight>Matters</Highlight>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-6">
            An Islamic Will is more than a legal document — it is part of preparing for your Akhirah.
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            This Ramadan, creating your Islamic Will also becomes an act of ongoing charity (sadaqah jariyah), 
            supporting vulnerable communities through One Nation's humanitarian and development work worldwide.
          </p>
          <Badge variant="secondary" className="px-4 py-2 text-base">
            <Sparkles className="w-4 h-4 mr-2" />
            One action. Lasting impact.
          </Badge>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 bg-background">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="flex -space-x-3">
              {trustedPeople.map((person, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-background overflow-hidden"
                  data-testid={`avatar-trusted-${i}`}
                >
                  <img
                    src={person.src}
                    alt={person.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="text-center sm:text-left">
              <p className="font-semibold text-foreground">Trusted by Muslims across the UK</p>
              <div className="flex items-center justify-center sm:justify-start gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
                <span className="text-sm text-muted-foreground ml-2">4.9/5 from 500+ reviews</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-accent/10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-accent text-accent-foreground px-4 py-1">How It Works</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Four <Highlight>Simple Steps</Highlight>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, i) => (
              <div key={i} className="text-center" data-testid={`step-${i}`}>
                <div className="w-16 h-16 rounded-full bg-accent text-accent-foreground font-bold text-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-accent/30">
                  {item.step}
                </div>
                <h3 className="font-semibold text-foreground mb-2 text-lg">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About One Nation Section */}
      <section id="about-one-nation" className="py-16 sm:py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <Squiggle />
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              About <Highlight>One Nation</Highlight>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              One Nation is a UK-based humanitarian charity delivering emergency relief and long-term 
              development projects across 30+ countries.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {oneNationWork.map((item, i) => (
              <Card key={i} className="p-6 text-center" data-testid={`one-nation-work-${i}`}>
                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </Card>
            ))}
          </div>

          <p className="text-center text-muted-foreground max-w-2xl mx-auto">
            One Nation operates with a strong commitment to transparency and impact, ensuring donations 
            are used where they are most urgently needed.
          </p>
        </div>
      </section>

      {/* Your Will Their Future Section */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Squiggle />
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-8">
            Your Will. <Highlight>Their Future.</Highlight>
          </h2>
          
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-left mb-8">
            {[
              "Fulfilling an important Islamic responsibility",
              "Turning a necessary decision into ongoing reward",
              "Supporting those in need through trusted humanitarian work",
              "Leaving behind a meaningful and lasting legacy",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3" data-testid={`benefit-${i}`}>
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Create Your Will Now Section */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Why Create Your Will <Highlight>Now</Highlight>
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {whyNow.map((item, i) => (
              <Badge key={i} variant="secondary" className="px-4 py-2 text-sm" data-testid={`why-now-${i}`}>
                <CheckCircle className="w-4 h-4 mr-2" />
                {item}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6" data-testid="trust-badge-0">
              <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Shariah Compliant</h3>
              <p className="text-sm text-muted-foreground">Follows authentic Islamic inheritance law with guidance from qualified scholars.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6" data-testid="trust-badge-1">
              <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center mb-4">
                <Scale className="w-7 h-7 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">UK Legally Valid</h3>
              <p className="text-sm text-muted-foreground">Fully enforceable under English and Welsh law when properly witnessed.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6" data-testid="trust-badge-2">
              <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center mb-4">
                <Globe className="w-7 h-7 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Global Impact</h3>
              <p className="text-sm text-muted-foreground">Supporting One Nation's humanitarian work in 30+ countries worldwide.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-foreground text-background">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Create Your Islamic Will Today
          </h2>
          <p className="text-lg opacity-80 mb-8 max-w-2xl mx-auto">
            Turn your Will into ongoing charity this Ramadan.
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
            Only £50 - 25% donated to One Nation
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
              <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                In partnership with One Nation - A UK-based humanitarian charity.
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This tool provides guidance for creating a Shariah-compliant will but does not constitute legal advice.
              </p>
            </div>
            
            {/* Links */}
            <nav className="flex items-center gap-6">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-home-footer">
                Home
              </Link>
              <a href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-privacy">
                Privacy
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
