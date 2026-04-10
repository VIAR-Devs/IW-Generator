import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import IslamicInfoCard from "./IslamicInfoCard";

const personalDetailsSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  address: z.string().min(5, "Address is required"),
  postcode: z.string().min(5, "Valid UK postcode is required"),
  maritalStatus: z.enum(["single", "married", "widowed", "divorced"]),
  hasSpouse: z.boolean(),
  hasChildren: z.boolean(),
  hasParents: z.boolean(),
  hasSiblings: z.boolean(),
});

type PersonalDetailsForm = z.infer<typeof personalDetailsSchema>;

interface PersonalDetailsStepProps {
  defaultValues?: Partial<PersonalDetailsForm>;
  onNext: (data: PersonalDetailsForm) => void;
  onSaveProgress: () => void;
}

export default function PersonalDetailsStep({ defaultValues, onNext, onSaveProgress }: PersonalDetailsStepProps) {
  const form = useForm<PersonalDetailsForm>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {
      fullName: "",
      dateOfBirth: "",
      address: "",
      postcode: "",
      maritalStatus: "single",
      hasSpouse: false,
      hasChildren: false,
      hasParents: false,
      hasSiblings: false,
      ...defaultValues,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Personal Details</h2>
        <p className="text-muted-foreground">Please provide your basic information to begin creating your Islamic will.</p>
      </div>

      <IslamicInfoCard
        title="UK Legal Requirements"
        content="To create a valid will in the UK, you must be at least 18 years old and of sound mind. This will follows both UK legal standards and Shariah principles."
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Legal Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name as it appears on official documents" {...field} data-testid="input-fullname" />
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
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input type="date" {...field} data-testid="input-dob" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Residential Address</FormLabel>
                <FormControl>
                  <Input placeholder="Street address" {...field} data-testid="input-address" />
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
                  <Input placeholder="E.g., SW1A 1AA" {...field} data-testid="input-postcode" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maritalStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marital Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-marital-status">
                      <SelectValue placeholder="Select your marital status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-medium text-foreground">Family Structure</h3>
            <p className="text-sm text-muted-foreground">This information helps calculate Shariah-compliant inheritance shares.</p>

            <div className="space-y-3">
              <FormField
                control={form.control}
                name="hasSpouse"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} data-testid="checkbox-has-spouse" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">I have a spouse</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasChildren"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} data-testid="checkbox-has-children" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">I have children</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasParents"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} data-testid="checkbox-has-parents" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">I have living parents</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasSiblings"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} data-testid="checkbox-has-siblings" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">I have siblings</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onSaveProgress} data-testid="button-save-progress">
              Save Progress
            </Button>
            <Button type="submit" size="lg" data-testid="button-continue">
              Continue to Beneficiaries
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
