import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { WillFormData } from "@shared/schema";
import { CheckCircle2, Edit, AlertCircle } from "lucide-react";

interface ReviewStepProps {
  formData: WillFormData;
  onNext: () => void;
  onBack: () => void;
  onEditStep: (stepNumber: number) => void;
  isPreviewMode?: boolean;
}

export default function ReviewStep({ formData, onNext, onBack, onEditStep, isPreviewMode = false }: ReviewStepProps) {
  const [confirmationChecked, setConfirmationChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  
  const canProceed = confirmationChecked && privacyChecked;

  return (
    <div className="space-y-6">
      {!isPreviewMode && (
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Review Your Will</h2>
          <p className="text-muted-foreground">
            Please review all the information below. Click Edit if you need to make any changes.
          </p>
        </div>
      )}

      {/* Basic Details */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
          <div>
            <CardTitle className="text-lg">Basic Details</CardTitle>
            <CardDescription>Your identity and contact information</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditStep(1)}
            data-testid="button-edit-basic-details"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {formData.basicDetails.fullName && (
            <div className="flex justify-between flex-wrap gap-1">
              <span className="text-muted-foreground">Full Name:</span>
              <span className="font-medium" data-testid="text-review-name">{formData.basicDetails.fullName}</span>
            </div>
          )}
          {formData.basicDetails.addressLine1 && (
            <div className="flex justify-between flex-wrap gap-1">
              <span className="text-muted-foreground">Address:</span>
              <span className="font-medium text-right">{formData.basicDetails.addressLine1}</span>
            </div>
          )}
          <div className="flex justify-between flex-wrap gap-1">
            <span className="text-muted-foreground">City & Postcode:</span>
            <span className="font-medium">{formData.basicDetails.city} {formData.basicDetails.postcode}</span>
          </div>
          {formData.basicDetails.burialCountry && (
            <div className="flex justify-between flex-wrap gap-1">
              <span className="text-muted-foreground">Burial Country:</span>
              <span className="font-medium">{formData.basicDetails.burialCountry}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Executors */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
          <div>
            <CardTitle className="text-lg">Executors</CardTitle>
            <CardDescription>People managing your estate</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditStep(2)}
            data-testid="button-edit-executors"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          {formData.executors.length > 0 ? (
            <div className="space-y-3">
              {formData.executors.map((executor, index) => (
                <div key={index} className="pb-3 border-b last:border-b-0 last:pb-0">
                  <div className="font-medium" data-testid={`text-executor-name-${index}`}>{executor.name}</div>
                  {executor.address && <div className="text-sm text-muted-foreground">{executor.address}</div>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No executors added</p>
          )}
        </CardContent>
      </Card>

      {/* Guardians */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
          <div>
            <CardTitle className="text-lg">Guardians</CardTitle>
            <CardDescription>Guardians for your children</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditStep(3)}
            data-testid="button-edit-guardians"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          {formData.children.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Children:</p>
              <div className="flex flex-wrap gap-2">
                {formData.children.map((child, index) => (
                  <Badge key={index} variant="secondary" data-testid={`badge-child-${index}`}>
                    {child.name} ({child.gender === "male" ? "M" : "F"}, {child.dateOfBirth})
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {formData.guardians.length > 0 ? (
            <div className="space-y-3">
              {formData.guardians.map((guardian, index) => (
                <div key={index} className="pb-3 border-b last:border-b-0 last:pb-0">
                  <div className="font-medium" data-testid={`text-guardian-name-${index}`}>{guardian.name}</div>
                  {guardian.address && <div className="text-sm text-muted-foreground">{guardian.address}</div>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No guardians added</p>
          )}
        </CardContent>
      </Card>

      {/* Funeral Preferences */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
          <div>
            <CardTitle className="text-lg">Funeral Preferences</CardTitle>
            <CardDescription>Your Islamic funeral wishes</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditStep(4)}
            data-testid="button-edit-funeral"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between flex-wrap gap-1">
            <span className="text-muted-foreground">Post-mortem restrictions:</span>
            <span className="font-medium">{formData.funeralPreferences.restrictPostMortem ? "Yes" : "No"}</span>
          </div>
          <div className="flex justify-between flex-wrap gap-1">
            <span className="text-muted-foreground">Organ donation:</span>
            <span className="font-medium">{formData.funeralPreferences.organDonation ? "Permitted" : "Not permitted"}</span>
          </div>
          {formData.funeralPreferences.imamOrMasjid && (
            <div className="flex justify-between flex-wrap gap-1">
              <span className="text-muted-foreground">Imam/Masjid:</span>
              <span className="font-medium text-right">{formData.funeralPreferences.imamOrMasjid}</span>
            </div>
          )}
          {formData.funeralPreferences.cemetery && (
            <div className="flex justify-between flex-wrap gap-1">
              <span className="text-muted-foreground">Preferred cemetery:</span>
              <span className="font-medium text-right">{formData.funeralPreferences.cemetery}</span>
            </div>
          )}
          {formData.funeralPreferences.charityAtFuneral && (
            <div className="flex justify-between flex-wrap gap-1">
              <span className="text-muted-foreground">Charity donations:</span>
              <span className="font-medium text-right">{formData.funeralPreferences.charityAtFuneral}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Wasiyyah */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
          <div>
            <CardTitle className="text-lg">Wasiyyah (Charitable Bequest)</CardTitle>
            <CardDescription>Up to 1/3 of estate</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditStep(5)}
            data-testid="button-edit-wasiyyah"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          {formData.wasiyyah.enabled && formData.wasiyyah.beneficiaries.length > 0 ? (
            <div className="space-y-2">
              {formData.wasiyyah.beneficiaries.map((beneficiary, index) => (
                <div key={index} className="flex justify-between flex-wrap gap-1 pb-2 border-b last:border-b-0" data-testid={`wasiyyah-beneficiary-${index}`}>
                  <span className="font-medium">{beneficiary.name}</span>
                  <Badge variant="secondary">{beneficiary.percentage}%</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No wasiyyah beneficiaries</p>
          )}
        </CardContent>
      </Card>

      {/* Heirs Snapshot */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
          <div>
            <CardTitle className="text-lg">Heirs Information</CardTitle>
            <CardDescription>For Faraid calculations</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditStep(6)}
            data-testid="button-edit-heirs"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between flex-wrap gap-1">
            <span className="text-muted-foreground">Married:</span>
            <span className="font-medium">{formData.heirsSnapshot.hasSpouse ? "Yes" : "No"}</span>
          </div>
          {(formData.heirsSnapshot.numberOfSons > 0 || formData.heirsSnapshot.numberOfDaughters > 0) && (
            <div className="flex justify-between flex-wrap gap-1">
              <span className="text-muted-foreground">Children:</span>
              <span className="font-medium">
                {formData.heirsSnapshot.numberOfSons} son(s), {formData.heirsSnapshot.numberOfDaughters} daughter(s)
              </span>
            </div>
          )}
          <div className="flex justify-between flex-wrap gap-1">
            <span className="text-muted-foreground">Parents:</span>
            <span className="font-medium">
              {formData.heirsSnapshot.motherAlive && "Mother"}{formData.heirsSnapshot.motherAlive && formData.heirsSnapshot.fatherAlive && ", "}{formData.heirsSnapshot.fatherAlive && "Father"}
              {!formData.heirsSnapshot.motherAlive && !formData.heirsSnapshot.fatherAlive && "None"}
            </span>
          </div>
          {formData.heirsSnapshot.madhhab && (
            <div className="flex justify-between flex-wrap gap-1">
              <span className="text-muted-foreground">Madhhab:</span>
              <span className="font-medium">
                {(() => {
                  const MADHHAB_LABELS: Record<string, string> = {
                    hanafi: "Hanafi",
                    shafi: "Shafi'i",
                    maliki: "Maliki",
                    hanbali: "Hanbali",
                    not_sure: "Not sure / No preference"
                  };
                  return MADHHAB_LABELS[formData.heirsSnapshot.madhhab] || formData.heirsSnapshot.madhhab;
                })()}
              </span>
            </div>
          )}
          {formData.heirsSnapshot.otherHeirs && (
            <div>
              <span className="text-muted-foreground block mb-1">Other heirs:</span>
              <span className="text-sm">{formData.heirsSnapshot.otherHeirs}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Optional Add-Ons */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
          <div>
            <CardTitle className="text-lg">Optional Add-Ons</CardTitle>
            <CardDescription>Additional guidance included</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditStep(7)}
            data-testid="button-edit-addons"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {formData.optionalAddOns.letterOfWishesEnabled && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-sm">Letter of Wishes</span>
              </div>
            )}
            {formData.optionalAddOns.guidanceForGuardiansEnabled && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-sm">Guidance for Guardians</span>
              </div>
            )}
            {formData.optionalAddOns.guidanceForExecutorsEnabled && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-sm">Guidance for Executors</span>
              </div>
            )}
            {!formData.optionalAddOns.letterOfWishesEnabled && 
             !formData.optionalAddOns.guidanceForGuardiansEnabled && 
             !formData.optionalAddOns.guidanceForExecutorsEnabled && (
              <p className="text-sm text-muted-foreground">No optional add-ons selected</p>
            )}
          </div>
        </CardContent>
      </Card>

      {!isPreviewMode && (
        <>
          <Separator />

          {/* Legal Consent Section */}
          <Card className="border-primary/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                Legal Confirmation
              </CardTitle>
              <CardDescription>Please read and confirm the following before proceeding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Checkbox 
                  id="confirmation" 
                  checked={confirmationChecked}
                  onCheckedChange={(checked) => setConfirmationChecked(checked === true)}
                  data-testid="checkbox-confirmation"
                />
                <Label htmlFor="confirmation" className="text-sm leading-relaxed cursor-pointer">
                  I confirm that all the information I have provided is accurate and complete to the best of my knowledge. 
                  I understand that this will is intended to distribute my estate according to Islamic inheritance principles (Faraid) 
                  and UK law. <span className="text-destructive">*</span>
                </Label>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox 
                  id="privacy" 
                  checked={privacyChecked}
                  onCheckedChange={(checked) => setPrivacyChecked(checked === true)}
                  data-testid="checkbox-privacy"
                />
                <Label htmlFor="privacy" className="text-sm leading-relaxed cursor-pointer">
                  I consent to my personal data being processed in accordance with the Privacy Policy and GDPR regulations. 
                  I understand my data will be stored securely and used only for the purpose of generating my Islamic will. <span className="text-destructive">*</span>
                </Label>
              </div>
            </CardContent>
          </Card>

          <div className={`border rounded-lg p-4 ${canProceed ? "bg-muted/50" : "bg-muted/30 border-muted"}`}>
            <div className="flex items-start gap-3">
              <CheckCircle2 className={`h-5 w-5 mt-0.5 flex-shrink-0 ${canProceed ? "text-primary" : "text-muted-foreground"}`} />
              <div>
                <p className="font-medium mb-1">{canProceed ? "Ready to proceed" : "Please confirm the checkboxes above"}</p>
                <p className="text-sm text-muted-foreground">
                  Once you confirm, you'll proceed to payment. Your will will be generated after successful payment.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={onBack}
              data-testid="button-back"
            >
              Back
            </Button>
            <Button 
              onClick={onNext}
              className="flex-1"
              disabled={!canProceed}
              data-testid="button-proceed-payment"
            >
              Proceed to Payment
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
