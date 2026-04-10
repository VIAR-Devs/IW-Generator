import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { funeralPreferencesSchema, type FuneralPreferences } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Heart, MapPin } from "lucide-react";
import IslamicInfoCard from "./IslamicInfoCard";

interface FuneralPreferencesStepProps {
  defaultValues?: FuneralPreferences;
  onNext: (data: FuneralPreferences) => void;
  onBack: () => void;
  onSaveProgress: () => void;
}

export default function FuneralPreferencesStep({ defaultValues, onNext, onBack, onSaveProgress }: FuneralPreferencesStepProps) {
  const form = useForm<FuneralPreferences>({
    resolver: zodResolver(funeralPreferencesSchema),
    defaultValues: {
      restrictPostMortem: false,
      organDonation: false,
      imamOrMasjid: "",
      cemetery: "",
      charityAtFuneral: "",
      ...defaultValues,
    },
  });

  const onSubmit = (data: FuneralPreferences) => {
    onNext(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Funeral & Burial Preferences</h2>
        <p className="text-muted-foreground">
          Specify your wishes for burial and funeral arrangements according to Islamic practices.
        </p>
      </div>

      <IslamicInfoCard
        title="Islamic Burial Guidelines"
        content="Islamic tradition requires burial to occur as soon as possible after death. The body should be washed, shrouded, and buried without delay. These preferences help your family honor your wishes during a difficult time."
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="p-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="restrictPostMortem"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="checkbox-restrict-postmortem"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Restrict Post-Mortem Examinations</FormLabel>
                      <FormDescription>
                        Do you want to restrict post-mortems to minimal/non-invasive unless required by law?
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="organDonation"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="checkbox-organ-donation"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Organ Donation</FormLabel>
                      <FormDescription>
                        Do you consent to organ donation if Islamically permitted?
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Contact & Location Details</h3>
            </div>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="imamOrMasjid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Masjid or Imam (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Name of masjid or imam"
                        {...field}
                        data-testid="input-imam-masjid"
                      />
                    </FormControl>
                    <FormDescription>Which masjid or imam should be contacted first?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cemetery"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Cemetery (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Name or location of cemetery"
                        {...field}
                        data-testid="input-cemetery"
                      />
                    </FormControl>
                    <FormDescription>Do you have a preferred cemetery?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="charityAtFuneral"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Charity for Sadaqah (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Name of charity"
                        {...field}
                        data-testid="input-charity-funeral"
                      />
                    </FormControl>
                    <FormDescription>Is there a charity you'd like to receive sadaqah at your funeral?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onBack} data-testid="button-back">
              Back
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onSaveProgress} data-testid="button-save-progress">
                Save Progress
              </Button>
              <Button type="submit" data-testid="button-continue">
                Continue to Charitable Bequest
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
