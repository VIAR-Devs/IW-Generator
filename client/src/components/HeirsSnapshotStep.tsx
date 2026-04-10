import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { heirsSnapshotSchema, type HeirsSnapshot } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import IslamicInfoCard from "./IslamicInfoCard";

interface HeirsSnapshotStepProps {
  defaultValues?: HeirsSnapshot;
  onNext: (data: HeirsSnapshot) => void;
  onBack: () => void;
  onSaveProgress: () => void;
}

export default function HeirsSnapshotStep({ defaultValues, onNext, onBack, onSaveProgress }: HeirsSnapshotStepProps) {
  const form = useForm<HeirsSnapshot>({
    resolver: zodResolver(heirsSnapshotSchema),
    defaultValues: {
      hasSpouse: false,
      numberOfSons: 0,
      numberOfDaughters: 0,
      motherAlive: false,
      fatherAlive: false,
      otherHeirs: "",
      madhhab: undefined,
      ...defaultValues,
    },
  });

  const onSubmit = (data: HeirsSnapshot) => {
    onNext(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Heirs Snapshot (for Optional Schedule D)</h2>
        <p className="text-muted-foreground">
          Provide information about your heirs to help calculate Islamic inheritance shares according to Faraid.
        </p>
      </div>

      <IslamicInfoCard
        title="Islamic Inheritance (Faraid)"
        content="Islamic law prescribes specific shares for each category of heir. This information helps calculate the distribution according to the Quran and Sunnah. The madhhab (school of thought) you follow may affect certain calculations."
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Family Information</h3>
            </div>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="hasSpouse"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="checkbox-has-spouse"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Married</FormLabel>
                      <FormDescription>Are you married (Nikah or civil marriage)?</FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="numberOfSons"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Sons</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          data-testid="input-number-of-sons"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="numberOfDaughters"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Daughters</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          data-testid="input-number-of-daughters"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormDescription>How many sons? How many daughters?</FormDescription>

              <div className="space-y-3">
                <FormLabel>Parents</FormLabel>
                <FormDescription className="mb-2">Are your parents still alive?</FormDescription>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="motherAlive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-mother-alive"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Mother</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fatherAlive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-father-alive"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Father</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="otherHeirs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other Heirs (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., my sisters, my brothers, grandchildren, etc."
                        {...field}
                        data-testid="input-other-heirs"
                      />
                    </FormControl>
                    <FormDescription>
                      List any other potential heirs (siblings, grandchildren, etc.). This helps ensure the Faraid calculations in Schedule D are comprehensive and consider all relevant family members according to Islamic law.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="madhhab"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Madhhab (School of Thought)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-madhhab">
                          <SelectValue placeholder="Select your madhhab" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="hanafi">Hanafi</SelectItem>
                        <SelectItem value="shafi">Shafi'i</SelectItem>
                        <SelectItem value="maliki">Maliki</SelectItem>
                        <SelectItem value="hanbali">Hanbali</SelectItem>
                        <SelectItem value="not_sure">Not sure / No preference</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Which madhhab or calculation approach should be used? If not sure, we will use broad UK-compliant guidance.</FormDescription>
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
                Continue to Scholars & Contacts
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
