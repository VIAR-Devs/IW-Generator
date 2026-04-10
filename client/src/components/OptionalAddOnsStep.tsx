import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { FileText, Heart, BookOpen, CheckCircle2 } from "lucide-react";
import IslamicInfoCard from "./IslamicInfoCard";
import type { OptionalAddOns, LetterOfWishes, GuidanceForGuardians } from "@shared/schema";

interface OptionalAddOnsStepProps {
  defaultValues?: OptionalAddOns;
  onNext: (data: OptionalAddOns) => void;
  onBack: () => void;
  onSaveProgress: () => void;
}

export default function OptionalAddOnsStep({ defaultValues, onNext, onBack, onSaveProgress }: OptionalAddOnsStepProps) {
  const [letterOfWishesEnabled, setLetterOfWishesEnabled] = useState(defaultValues?.letterOfWishesEnabled || false);
  const [guidanceForGuardiansEnabled, setGuidanceForGuardiansEnabled] = useState(defaultValues?.guidanceForGuardiansEnabled || false);
  const [guidanceForExecutorsEnabled, setGuidanceForExecutorsEnabled] = useState(defaultValues?.guidanceForExecutorsEnabled || false);

  const [letterOfWishes, setLetterOfWishes] = useState<LetterOfWishes>(defaultValues?.letterOfWishes || {
    funeralTone: "",
    debtsZakatNotes: "",
    guardianSchoolingHopes: "",
    charitableIntentions: "",
    mementos: "",
    businessDigitalAccess: "",
    additionalWishes: "",
  });

  const [guidanceForGuardians, setGuidanceForGuardians] = useState<GuidanceForGuardians>(
    defaultValues?.guidanceForGuardians || {
      personalMessage: "",
    }
  );

  const handleNext = () => {
    onNext({
      letterOfWishesEnabled,
      letterOfWishes: letterOfWishesEnabled ? letterOfWishes : undefined,
      guidanceForGuardiansEnabled,
      guidanceForGuardians: guidanceForGuardiansEnabled ? guidanceForGuardians : undefined,
      guidanceForExecutorsEnabled,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Optional Add-Ons</h2>
        <p className="text-muted-foreground">
          Enhance your will with additional guidance and wishes for your loved ones.
        </p>
      </div>

      <IslamicInfoCard
        title="Additional Guidance Documents"
        content="These optional documents provide additional guidance to your executors and guardians, helping them understand your wishes and values beyond the legal requirements of the will."
      />

      {/* Letter of Wishes */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Letter of Wishes</h3>
          </div>
          <Switch
            checked={letterOfWishesEnabled}
            onCheckedChange={setLetterOfWishesEnabled}
            data-testid="switch-letter-of-wishes"
          />
        </div>

        {letterOfWishesEnabled && (
          <div className="space-y-4 pt-4">
            <p className="text-sm text-muted-foreground mb-4">
              Express your personal wishes and guidance for your loved ones:
            </p>

            <ul className="text-sm text-muted-foreground space-y-2 mb-4">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                Funeral tone (modest, dignified, no extravagance) — prefilled
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                Space for debts/zakat notes
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                Guardian and schooling hopes
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                Charitable intentions
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                Non-binding mementos
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                Business & digital access info
              </li>
            </ul>

            <Separator />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="debts-zakat">Debts & Zakat Notes</Label>
                <Textarea
                  id="debts-zakat"
                  placeholder="Any outstanding debts or zakat obligations you'd like to mention..."
                  value={letterOfWishes.debtsZakatNotes}
                  onChange={(e) => setLetterOfWishes({ ...letterOfWishes, debtsZakatNotes: e.target.value })}
                  data-testid="textarea-debts-zakat"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guardian-schooling">Guardian & Schooling Hopes</Label>
                <Textarea
                  id="guardian-schooling"
                  placeholder="Your hopes for your children's upbringing and education..."
                  value={letterOfWishes.guardianSchoolingHopes}
                  onChange={(e) => setLetterOfWishes({ ...letterOfWishes, guardianSchoolingHopes: e.target.value })}
                  data-testid="textarea-guardian-schooling"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="charitable">Charitable Intentions</Label>
                <Textarea
                  id="charitable"
                  placeholder="Any charitable causes or organizations you'd like to support..."
                  value={letterOfWishes.charitableIntentions}
                  onChange={(e) => setLetterOfWishes({ ...letterOfWishes, charitableIntentions: e.target.value })}
                  data-testid="textarea-charitable"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mementos">Non-Binding Mementos</Label>
                <Textarea
                  id="mementos"
                  placeholder="Personal items you'd like to suggest for specific people..."
                  value={letterOfWishes.mementos}
                  onChange={(e) => setLetterOfWishes({ ...letterOfWishes, mementos: e.target.value })}
                  data-testid="textarea-mementos"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="business-digital">Business & Digital Access</Label>
                <Textarea
                  id="business-digital"
                  placeholder="Information about business interests and digital accounts..."
                  value={letterOfWishes.businessDigitalAccess}
                  onChange={(e) => setLetterOfWishes({ ...letterOfWishes, businessDigitalAccess: e.target.value })}
                  data-testid="textarea-business-digital"
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="additional-wishes">Additional Wishes & Personal Messages</Label>
                <Textarea
                  id="additional-wishes"
                  placeholder="Any other wishes, messages, or guidance you'd like to share with your loved ones..."
                  value={letterOfWishes.additionalWishes}
                  onChange={(e) => setLetterOfWishes({ ...letterOfWishes, additionalWishes: e.target.value })}
                  rows={8}
                  className="min-h-[200px]"
                  data-testid="textarea-additional-wishes"
                />
                <p className="text-xs text-muted-foreground">
                  Note: Basic notes you write here will be professionally formatted in the final document to ensure legal clarity and appropriate tone.
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Guidance for Guardians */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Guidance for Guardians</h3>
          </div>
          <Switch
            checked={guidanceForGuardiansEnabled}
            onCheckedChange={setGuidanceForGuardiansEnabled}
            data-testid="switch-guidance-guardians"
          />
        </div>

        {guidanceForGuardiansEnabled && (
          <div className="space-y-4 pt-4">
            <ul className="text-sm text-muted-foreground space-y-2 mb-4">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                Auto-fill from guardians + children info
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                Allow one free-text "personal message" field
              </li>
            </ul>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="guardian-message">Personal Message to Guardians</Label>
              <Textarea
                id="guardian-message"
                placeholder="Your personal message to the guardians of your children..."
                value={guidanceForGuardians.personalMessage}
                onChange={(e) => setGuidanceForGuardians({ personalMessage: e.target.value })}
                rows={6}
                data-testid="textarea-guardian-message"
              />
              <p className="text-xs text-muted-foreground">
                Note: Your basic notes will be professionally formatted and enhanced to ensure clarity and appropriate legal language in the final document.
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Guidance for Executors */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Guidance for Executors</h3>
          </div>
          <Switch
            checked={guidanceForExecutorsEnabled}
            onCheckedChange={setGuidanceForExecutorsEnabled}
            data-testid="switch-guidance-executors"
          />
        </div>

        {guidanceForExecutorsEnabled && (
          <div className="pt-4">
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                Auto-populate from Will (executors, scholar, masjid, contact info)
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                Static content (first 72 hours, UK steps) already ready to merge
              </li>
            </ul>
          </div>
        )}
      </Card>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} data-testid="button-back">
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onSaveProgress} data-testid="button-save-progress">
            Save Progress
          </Button>
          <Button onClick={handleNext} size="lg" data-testid="button-continue">
            Continue to Payment
          </Button>
        </div>
      </div>
    </div>
  );
}
