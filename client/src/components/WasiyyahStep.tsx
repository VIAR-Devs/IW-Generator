import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { wasiyyahBeneficiarySchema, type Wasiyyah, type WasiyyahBeneficiary } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Heart, AlertCircle } from "lucide-react";
import IslamicInfoCard from "./IslamicInfoCard";
import { nanoid } from "nanoid";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface WasiyyahStepProps {
  defaultValues?: Wasiyyah;
  onNext: (data: Wasiyyah) => void;
  onBack: () => void;
  onSaveProgress: () => void;
}

export default function WasiyyahStep({ defaultValues, onNext, onBack, onSaveProgress }: WasiyyahStepProps) {
  const [enabled, setEnabled] = useState(defaultValues?.enabled || false);
  const [beneficiaries, setBeneficiaries] = useState<WasiyyahBeneficiary[]>(defaultValues?.beneficiaries || []);
  const [showForm, setShowForm] = useState(false);

  const form = useForm<WasiyyahBeneficiary>({
    resolver: zodResolver(wasiyyahBeneficiarySchema),
    defaultValues: {
      id: nanoid(),
      name: "",
      percentage: 0,
    },
  });

  const totalPercentage = beneficiaries.reduce((sum, b) => sum + (b.percentage || 0), 0);
  const remainingPercentage = 33 - totalPercentage;

  const addBeneficiary = (data: WasiyyahBeneficiary) => {
    const newTotal = totalPercentage + data.percentage;
    if (newTotal > 33) {
      form.setError("percentage", { message: `Cannot exceed 33%. You can allocate up to ${remainingPercentage.toFixed(1)}%` });
      return;
    }
    setBeneficiaries([...beneficiaries, { ...data, id: nanoid() }]);
    form.reset({ id: nanoid(), name: "", percentage: 0 });
    setShowForm(false);
  };

  const removeBeneficiary = (id: string) => {
    setBeneficiaries(beneficiaries.filter(b => b.id !== id));
  };

  const handleNext = () => {
    onNext({
      enabled,
      beneficiaries: enabled ? beneficiaries : [],
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Charitable Bequest (Wasiyyah)</h2>
        <p className="text-muted-foreground">
          In Islam, you may gift up to one-third of your estate to charity or non-heirs through a wasiyyah.
        </p>
      </div>

      <IslamicInfoCard
        title="Understanding Wasiyyah"
        content="A wasiyyah allows you to leave up to one-third of your estate to charities or non-heirs. The remaining two-thirds must be distributed according to Islamic inheritance law (Faraid). This is an opportunity to support causes you care about while ensuring your heirs receive their rightful shares."
      />

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Enable Wasiyyah</h3>
          </div>
          <Switch
            checked={enabled}
            onCheckedChange={setEnabled}
            data-testid="switch-wasiyyah-enabled"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Would you like to gift up to one-third of your estate to charity or non-heirs?
        </p>
      </Card>

      {enabled && (
        <>
          {totalPercentage > 0 && (
            <Card className="p-4 bg-muted/30">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Wasiyyah Allocation</span>
                <span className={`font-semibold ${totalPercentage > 33 ? 'text-destructive' : 'text-foreground'}`}>
                  {totalPercentage.toFixed(1)}% of 33% maximum
                </span>
              </div>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${totalPercentage > 33 ? 'bg-destructive' : 'bg-accent'}`}
                  style={{ width: `${Math.min((totalPercentage / 33) * 100, 100)}%` }}
                />
              </div>
            </Card>
          )}

          {beneficiaries.length > 0 && (
            <div className="space-y-2">
              {beneficiaries.map((beneficiary) => (
                <Card key={beneficiary.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{beneficiary.name}</p>
                      <p className="text-sm text-muted-foreground">{beneficiary.percentage}%</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeBeneficiary(beneficiary.id)}
                      data-testid={`button-remove-beneficiary-${beneficiary.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {!showForm && (
            <Button
              variant="outline"
              onClick={() => setShowForm(true)}
              className="w-full"
              data-testid="button-add-beneficiary"
            >
              <Plus className="h-4 w-4 mr-2" />
              {beneficiaries.length === 0 ? "Add Beneficiary" : "Add Another Beneficiary"}
            </Button>
          )}

          {showForm && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(addBeneficiary)} className="space-y-4">
                <Card className="p-6">
                  <div className="space-y-4">
                    {remainingPercentage <= 0 && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          You have allocated the maximum 33% allowed for Wasiyyah. Remove an existing beneficiary to add more.
                        </AlertDescription>
                      </Alert>
                    )}

                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Beneficiary Name <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Name of charity or individual"
                              {...field}
                              data-testid="input-beneficiary-name"
                              className={form.formState.errors.name ? "border-destructive" : ""}
                            />
                          </FormControl>
                          <FormDescription>
                            e.g., Islamic Relief, Local Masjid, Family Member, etc.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="percentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Percentage of Estate <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                min="0.1"
                                max={remainingPercentage}
                                step="0.1"
                                placeholder="e.g., 10"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                data-testid="input-beneficiary-percentage"
                                className={`${form.formState.errors.percentage ? "border-destructive" : ""}`}
                              />
                              <span className="text-muted-foreground font-medium">%</span>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Maximum allowed: 33% total. Remaining: {remainingPercentage.toFixed(1)}%
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2">
                      <Button type="submit" disabled={remainingPercentage <= 0} data-testid="button-save-beneficiary">
                        Save Beneficiary
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowForm(false);
                          form.reset();
                        }}
                        data-testid="button-cancel-beneficiary"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Card>
              </form>
            </Form>
          )}
        </>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} data-testid="button-back">
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onSaveProgress} data-testid="button-save-progress">
            Save Progress
          </Button>
          <Button onClick={handleNext} data-testid="button-continue">
            Continue to Heirs Information
          </Button>
        </div>
      </div>
    </div>
  );
}
