import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { basicDetailsSchema, type BasicDetails } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import IslamicInfoCard from "./IslamicInfoCard";

interface BasicDetailsStepProps {
  defaultValues?: Partial<BasicDetails>;
  onNext: (data: BasicDetails) => void;
  onSaveProgress: () => void;
}

export default function BasicDetailsStep({ defaultValues, onNext, onSaveProgress }: BasicDetailsStepProps) {
  const form = useForm<BasicDetails>({
    resolver: zodResolver(basicDetailsSchema),
    defaultValues: {
      fullName: "",
      addressLine1: "",
      city: "",
      postcode: "",
      date: new Date().toISOString().split('T')[0],
      burialCountry: "",
      ...defaultValues,
    },
  });

  const onSubmit = (data: BasicDetails) => {
    onNext(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Basic Details</h2>
        <p className="text-muted-foreground">
          Let's start with your essential information for the will document.
        </p>
      </div>

      <IslamicInfoCard
        title="Identity & Address"
        content="Your full legal name and current address are required to make the will legally valid. This ensures the document can be properly identified and executed."
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Legal Name <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full legal name"
                        {...field}
                        data-testid="input-full-name"
                        className={form.formState.errors.fullName ? "border-destructive" : ""}
                      />
                    </FormControl>
                    <FormDescription>What is your full legal name?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="addressLine1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 1</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Street address"
                        {...field}
                        data-testid="input-address-line1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="City"
                          {...field}
                          data-testid="input-city"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="postcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postcode</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Postcode"
                          {...field}
                          data-testid="input-postcode"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        data-testid="input-date"
                        className={form.formState.errors.date ? "border-destructive" : ""}
                      />
                    </FormControl>
                    <FormDescription>Today's date (auto-filled if form submission date)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="burialCountry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Burial Country Preference (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., United Kingdom, Pakistan, etc."
                        {...field}
                        data-testid="input-burial-country"
                      />
                    </FormControl>
                    <FormDescription>In which country would you prefer to be buried (if feasible)?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onSaveProgress} data-testid="button-save-progress">
              Save Progress
            </Button>
            <Button type="submit" size="lg" data-testid="button-continue">
              Continue to Executors
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
