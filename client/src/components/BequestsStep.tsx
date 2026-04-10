import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import IslamicInfoCard from "./IslamicInfoCard";
import { Bequest } from "@shared/schema";

const bequestSchema = z.object({
  description: z.string().min(5, "Description is required"),
  recipient: z.string().min(2, "Recipient name is required"),
  value: z.string().optional(),
});

type BequestForm = z.infer<typeof bequestSchema>;

interface BequestsStepProps {
  defaultBequests?: Bequest[];
  onNext: (bequests: Bequest[]) => void;
  onBack: () => void;
  onSaveProgress: () => void;
}

export default function BequestsStep({ defaultBequests = [], onNext, onBack, onSaveProgress }: BequestsStepProps) {
  const [bequests, setBequests] = useState<Bequest[]>(defaultBequests);
  const [showForm, setShowForm] = useState(false);

  const form = useForm<BequestForm>({
    resolver: zodResolver(bequestSchema),
    defaultValues: { description: "", recipient: "", value: "" },
  });

  const addBequest = (data: BequestForm) => {
    setBequests([...bequests, { id: crypto.randomUUID(), ...data }]);
    form.reset();
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Specific Bequests (Optional)</h2>
        <p className="text-muted-foreground">Leave specific gifts to individuals or charities before the main distribution.</p>
      </div>

      <IslamicInfoCard
        title="Islamic Bequest Limit (Wasiyyah)"
        content="In Islamic law, you may bequeath up to one-third (1/3) of your estate to non-heirs, charities, or for specific purposes. This bequest is distributed before the Faraid inheritance shares are calculated. Bequests to legal heirs require consent from other heirs."
        verse="It is prescribed for you, when death approaches any of you, if he leaves wealth, to make a bequest to parents and near relatives. (Quran 2:180)"
      />

      <div className="space-y-4">
        {bequests.map((bequest) => (
          <Card key={bequest.id} className="p-4" data-testid={`bequest-card-${bequest.id}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <Gift className="h-5 w-5 text-primary mt-1" />
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">To: {bequest.recipient}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{bequest.description}</p>
                  {bequest.value && (
                    <p className="text-xs text-muted-foreground mt-1">Estimated value: {bequest.value}</p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setBequests(bequests.filter(b => b.id !== bequest.id))}
                data-testid={`button-remove-bequest-${bequest.id}`}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </Card>
        ))}

        {bequests.length === 0 && (
          <Card className="p-8 text-center bg-muted/30">
            <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No specific bequests added</p>
            <p className="text-sm text-muted-foreground mt-1">This section is optional</p>
          </Card>
        )}
      </div>

      {!showForm ? (
        <Button
          onClick={() => setShowForm(true)}
          variant="outline"
          className="w-full"
          data-testid="button-add-bequest"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Bequest
        </Button>
      ) : (
        <Card className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(addBequest)} className="space-y-4">
              <FormField
                control={form.control}
                name="recipient"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient</FormLabel>
                    <FormControl>
                      <Input placeholder="Name of person or charity" {...field} data-testid="input-bequest-recipient" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the gift (e.g., 'My gold watch', '£5,000 to Islamic Relief')" 
                        {...field} 
                        data-testid="input-bequest-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Value (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., £1,000" {...field} data-testid="input-bequest-value" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <Button type="submit" className="flex-1" data-testid="button-save-bequest">
                  Save Bequest
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
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
          <Button onClick={() => onNext(bequests)} data-testid="button-continue">
            Continue to Review
          </Button>
        </div>
      </div>
    </div>
  );
}
