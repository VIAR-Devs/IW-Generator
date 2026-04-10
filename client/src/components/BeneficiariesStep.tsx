import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import IslamicInfoCard from "./IslamicInfoCard";
import { Beneficiary } from "@shared/schema";

const beneficiarySchema = z.object({
  relationship: z.enum(["spouse", "child", "parent", "sibling"]),
  fullName: z.string().min(2, "Name is required"),
  dateOfBirth: z.string().optional(),
});

type BeneficiaryForm = z.infer<typeof beneficiarySchema>;

interface BeneficiariesStepProps {
  defaultBeneficiaries?: Beneficiary[];
  onNext: (beneficiaries: Beneficiary[]) => void;
  onBack: () => void;
  onSaveProgress: () => void;
}

export default function BeneficiariesStep({ defaultBeneficiaries = [], onNext, onBack, onSaveProgress }: BeneficiariesStepProps) {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(defaultBeneficiaries);
  const [showForm, setShowForm] = useState(false);

  const form = useForm<BeneficiaryForm>({
    resolver: zodResolver(beneficiarySchema),
    defaultValues: {
      relationship: "child",
      fullName: "",
      dateOfBirth: "",
    },
  });

  const addBeneficiary = (data: BeneficiaryForm) => {
    const newBeneficiary: Beneficiary = {
      id: crypto.randomUUID(),
      ...data,
    };
    setBeneficiaries([...beneficiaries, newBeneficiary]);
    form.reset();
    setShowForm(false);
  };

  const removeBeneficiary = (id: string) => {
    setBeneficiaries(beneficiaries.filter(b => b.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Beneficiaries</h2>
        <p className="text-muted-foreground">Add your family members who will inherit according to Islamic law.</p>
      </div>

      <IslamicInfoCard
        title="Shariah Inheritance Distribution (Faraid)"
        content="Islamic law prescribes specific shares for eligible heirs. Spouses typically receive 1/4 or 1/8, children receive the remainder (with sons receiving twice the share of daughters), and parents receive 1/6 each if children exist. These shares are calculated automatically."
        verse="Allah instructs you concerning your children: for the male, what is equal to the share of two females. (Quran 4:11)"
      />

      <div className="space-y-4">
        {beneficiaries.map((beneficiary) => (
          <Card key={beneficiary.id} className="p-4" data-testid={`beneficiary-card-${beneficiary.id}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <Users className="h-5 w-5 text-primary mt-1" />
                <div className="flex-1">
                  <h4 className="font-medium text-foreground capitalize">{beneficiary.relationship}</h4>
                  <p className="text-sm text-muted-foreground">{beneficiary.fullName}</p>
                  {beneficiary.dateOfBirth && (
                    <p className="text-xs text-muted-foreground mt-1">Born: {beneficiary.dateOfBirth}</p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeBeneficiary(beneficiary.id)}
                data-testid={`button-remove-${beneficiary.id}`}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </Card>
        ))}

        {beneficiaries.length === 0 && (
          <Card className="p-8 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No beneficiaries added yet</p>
          </Card>
        )}
      </div>

      {!showForm ? (
        <Button
          onClick={() => setShowForm(true)}
          variant="outline"
          className="w-full"
          data-testid="button-add-beneficiary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Beneficiary
        </Button>
      ) : (
        <Card className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(addBeneficiary)} className="space-y-4">
              <FormField
                control={form.control}
                name="relationship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-relationship">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="sibling">Sibling</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter beneficiary's full name" {...field} data-testid="input-beneficiary-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} data-testid="input-beneficiary-dob" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <Button type="submit" className="flex-1" data-testid="button-save-beneficiary">
                  Save Beneficiary
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} data-testid="button-cancel">
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} data-testid="button-back">
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onSaveProgress} data-testid="button-save-progress">
            Save Progress
          </Button>
          <Button
            onClick={() => onNext(beneficiaries)}
            disabled={beneficiaries.length === 0}
            data-testid="button-continue"
          >
            Continue to Executors
          </Button>
        </div>
      </div>
    </div>
  );
}
