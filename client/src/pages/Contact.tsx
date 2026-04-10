import { useState } from "react";
import { ArrowRight, FileText, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { AuthDialog } from "@/components/AuthDialog";
import { useAuth } from "@/hooks/use-auth";

export default function Contact() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message sent",
      description: "Thank you for your message. We'll get back to you soon.",
    });
    
    setFormData({ name: "", email: "", message: "" });
    setIsSubmitting(false);
  };

  const handleGetStartedClick = () => {
    setLocation('/my-details');
  };

  const handleSignInClick = () => {
    setAuthMode("login");
    setAuthDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer" data-testid="logo">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <FileText className="w-4 h-4 text-accent-foreground" />
              </div>
              <div className="flex flex-col" style={{ lineHeight: '0.9' }}>
                <span className="font-bold text-lg text-foreground tracking-tight">Islamic Will</span>
                <span className="font-normal text-sm text-foreground tracking-[0.25em]">Generator</span>
              </div>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-features">Features</Link>
            <Link href="/#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-how-it-works">How It Works</Link>
            <Link href="/#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-testimonials">Testimonials</Link>
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

      {/* Main Content */}
      <section className="py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Get in Touch
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions about creating your Islamic will? We're here to help.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-foreground mb-6">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    data-testid="input-contact-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    data-testid="input-contact-email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                    data-testid="input-contact-message"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 border-0"
                  disabled={isSubmitting}
                  data-testid="button-contact-submit"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Card>

            {/* Contact Details */}
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-6">Contact Details</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Email</p>
                      <a 
                        href="mailto:support@islamicwillgenerator.co.uk" 
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        data-testid="link-email"
                      >
                        support@islamicwillgenerator.co.uk
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Address</p>
                      <p className="text-muted-foreground">
                        The Garden Network Ltd<br />
                        United Kingdom
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-8">
                <h3 className="font-semibold text-foreground mb-3">Response Time</h3>
                <p className="text-muted-foreground">
                  We aim to respond to all enquiries within 24-48 hours during business days.
                </p>
              </div>

              <div className="border-t pt-8">
                <h3 className="font-semibold text-foreground mb-3">FAQs</h3>
                <p className="text-muted-foreground mb-3">
                  Many common questions are answered on our homepage.
                </p>
                <Link href="/#faq">
                  <Button variant="outline" data-testid="button-view-faqs">
                    View FAQs
                  </Button>
                </Link>
              </div>
            </div>
          </div>
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
            data-testid="button-cta-contact"
          >
            Start Creating My Will
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <p className="text-sm opacity-60 mt-4">
            Only £49 - Save progress & Update anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
            {/* Brand */}
            <div className="max-w-md">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
                  <FileText className="w-3.5 h-3.5 text-accent-foreground" />
                </div>
                <div className="flex flex-col" style={{ lineHeight: '1' }}>
                  <span className="font-bold text-foreground tracking-tight">Islamic Will</span>
                  <span className="font-normal text-xs text-foreground tracking-[0.32em]">Generator</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This tool provides guidance for creating a Shariah-compliant will but does not constitute legal advice. Consider consulting with a qualified solicitor or Islamic scholar for complex estates.
              </p>
            </div>
            
            {/* Links */}
            <nav className="flex items-center gap-6">
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
