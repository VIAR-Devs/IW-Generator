import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { guardianSchema, childSchema, type Guardian, type Child } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, User, Baby, Pencil } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import IslamicInfoCard from "./IslamicInfoCard";
import { nanoid } from "nanoid";

interface NewGuardiansStepProps {
  defaultGuardians?: Guardian[];
  defaultChildren?: Child[];
  onNext: (data: { guardians: Guardian[]; children: Child[] }) => void;
  onBack: () => void;
  onSaveProgress: () => void;
}

export default function NewGuardiansStep({ 
  defaultGuardians = [], 
  defaultChildren = [],
  onNext, 
  onBack, 
  onSaveProgress 
}: NewGuardiansStepProps) {
  const [guardians, setGuardians] = useState<Guardian[]>(defaultGuardians);
  const [children, setChildren] = useState<Child[]>(defaultChildren);
  const [showSecondaryGuardian, setShowSecondaryGuardian] = useState(defaultGuardians.length > 1);
  const [showChildForm, setShowChildForm] = useState(false);
  const [hasChildrenUnder18, setHasChildrenUnder18] = useState<boolean | null>(
    defaultGuardians.length > 0 || defaultChildren.length > 0 ? true : null
  );

  const primaryForm = useForm<Guardian>({
    resolver: zodResolver(guardianSchema),
    defaultValues: guardians[0] || {
      id: nanoid(),
      name: "",
      address: "",
    },
  });

  const secondaryForm = useForm<Guardian>({
    resolver: zodResolver(guardianSchema),
    defaultValues: guardians[1] || {
      id: nanoid(),
      name: "",
      address: "",
    },
  });

  const [editingChildId, setEditingChildId] = useState<string | null>(null);

  const childForm = useForm<Child>({
    resolver: zodResolver(childSchema),
    mode: "onBlur",
    defaultValues: {
      id: nanoid(),
      name: "",
      gender: undefined as unknown as "male" | "female",
      dateOfBirth: "",
    },
  });

  const addChild = (data: Child) => {
    if (editingChildId) {
      setChildren(children.map(c => c.id === editingChildId ? { ...data, id: editingChildId } : c));
      setEditingChildId(null);
    } else {
      setChildren([...children, { ...data, id: nanoid() }]);
    }
    childForm.reset({ id: nanoid(), name: "", gender: undefined as unknown as "male" | "female", dateOfBirth: "" });
    setShowChildForm(false);
  };

  const editChild = (child: Child) => {
    setEditingChildId(child.id);
    childForm.reset({
      id: child.id,
      name: child.name,
      gender: child.gender,
      dateOfBirth: child.dateOfBirth,
    });
    setShowChildForm(true);
  };

  const removeChild = (id: string) => {
    setChildren(children.filter(c => c.id !== id));
  };

  const handleNext = () => {
    if (hasChildrenUnder18 === false) {
      onNext({ guardians: [], children: [] });
      return;
    }

    const primaryGuardian = primaryForm.getValues();
    const secondaryGuardian = secondaryForm.getValues();

    const validGuardians = [primaryGuardian];
    if (showSecondaryGuardian && secondaryGuardian.name) {
      validGuardians.push(secondaryGuardian);
    }

    onNext({ guardians: validGuardians, children });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Guardians for Children</h2>
        <p className="text-muted-foreground">
          If you have children under 18, you'll need to appoint guardians to care for them.
        </p>
      </div>

      {hasChildrenUnder18 === null && (
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Do you have children under 18?</h3>
            <p className="text-sm text-muted-foreground">
              If you have children who are currently under 18 years old, you'll need to appoint guardians to care for them if both parents pass away.
            </p>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setHasChildrenUnder18(true)}
                className="flex-1"
                data-testid="button-has-children-yes"
              >
                Yes, I have children under 18
              </Button>
              <Button
                variant="outline"
                onClick={() => setHasChildrenUnder18(false)}
                className="flex-1"
                data-testid="button-has-children-no"
              >
                No, I don't have children under 18
              </Button>
            </div>
          </div>
        </Card>
      )}

      {hasChildrenUnder18 === false && (
        <Card className="p-6">
          <div className="space-y-4">
            <p className="text-foreground">
              You indicated you don't have children under 18. No guardian information is required.
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setHasChildrenUnder18(null)}
              data-testid="button-change-answer-no"
            >
              Change Answer
            </Button>
          </div>
        </Card>
      )}

      {hasChildrenUnder18 === true && (
        <>
          <Card className="p-4 bg-muted/30">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                You indicated you have children under 18
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setHasChildrenUnder18(null);
                  setGuardians([]);
                  setChildren([]);
                  primaryForm.reset({ id: nanoid(), name: "", address: "" });
                  secondaryForm.reset({ id: nanoid(), name: "", address: "" });
                  setShowSecondaryGuardian(false);
                }}
                data-testid="button-change-answer"
              >
                Change Answer
              </Button>
            </div>
          </Card>

          <IslamicInfoCard
            title="Guardian Responsibilities"
            content="A guardian will take care of your children's upbringing, education, and wellbeing. Choose someone who shares your values and who you trust to raise your children according to Islamic principles."
          />

          <Form {...primaryForm}>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Primary Guardian</h3>
          </div>
          <div className="space-y-4">
            <FormField
              control={primaryForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Guardian's full name"
                      {...field}
                      data-testid="input-primary-guardian-name"
                    />
                  </FormControl>
                  <FormDescription>Who should be the guardian of your children if both parents pass away?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={primaryForm.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Guardian's address"
                      {...field}
                      data-testid="input-primary-guardian-address"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>
          </Form>

          {!showSecondaryGuardian && (
            <Button
              variant="outline"
              onClick={() => setShowSecondaryGuardian(true)}
              className="w-full"
              data-testid="button-add-secondary-guardian"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Secondary Guardian (Optional)
            </Button>
          )}

          {showSecondaryGuardian && (
            <Form {...secondaryForm}>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Secondary Guardian</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowSecondaryGuardian(false);
                  secondaryForm.reset({ id: nanoid(), name: "", address: "" });
                }}
                data-testid="button-remove-secondary-guardian"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <FormField
                control={secondaryForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Secondary guardian's full name"
                        {...field}
                        data-testid="input-secondary-guardian-name"
                      />
                    </FormControl>
                    <FormDescription>Do you want to name a second guardian as backup?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={secondaryForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Secondary guardian's address"
                        {...field}
                        data-testid="input-secondary-guardian-address"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>
            </Form>
          )}

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Baby className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Children Information</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Add your children under 18 with their name, gender, and date of birth.
            </p>

            {children.length > 0 && (
              <div className="space-y-2 mb-4">
                {children.map((child) => (
                  <div key={child.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{child.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {child.gender === "male" ? "Male" : "Female"} • Born: {child.dateOfBirth}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => editChild(child)}
                        data-testid={`button-edit-child-${child.id}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeChild(child.id)}
                        data-testid={`button-remove-child-${child.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!showChildForm && (
              <Button
                variant="outline"
                onClick={() => setShowChildForm(true)}
                className="w-full"
                data-testid="button-add-child"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Child
              </Button>
            )}

            {showChildForm && (
              <Form {...childForm}>
                <form onSubmit={childForm.handleSubmit(addChild)} className="space-y-4 mt-4 p-4 border rounded-lg">
                  <FormField
                    control={childForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Child's Name <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Full name"
                            {...field}
                            data-testid="input-child-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={childForm.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender <span className="text-destructive">*</span></FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-child-gender">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={childForm.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            data-testid="input-child-dob"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2">
                    <Button type="submit" data-testid="button-save-child">
                      {editingChildId ? "Update Child" : "Save Child"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowChildForm(false);
                        setEditingChildId(null);
                        childForm.reset({ id: nanoid(), name: "", gender: undefined as unknown as "male" | "female", dateOfBirth: "" });
                      }}
                      data-testid="button-cancel-child"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </Card>
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
          <Button
            onClick={handleNext}
            disabled={hasChildrenUnder18 === null || (hasChildrenUnder18 === true && !primaryForm.getValues().name)}
            data-testid="button-continue"
          >
            Continue to Funeral Preferences
          </Button>
        </div>
      </div>
    </div>
  );
}
