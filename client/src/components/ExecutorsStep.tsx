import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import IslamicInfoCard from "./IslamicInfoCard";
import { Executor, Guardian } from "@shared/schema";

const executorSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  address: z.string().min(5, "Address is required"),
  relationship: z.string().min(2, "Relationship is required"),
});

type ExecutorForm = z.infer<typeof executorSchema>;

interface ExecutorsStepProps {
  defaultExecutors?: Executor[];
  defaultGuardians?: Guardian[];
  hasMinorChildren?: boolean;
  onNext: (data: { executors: Executor[]; guardians: Guardian[] }) => void;
  onBack: () => void;
  onSaveProgress: () => void;
}

export default function ExecutorsStep({ 
  defaultExecutors = [], 
  defaultGuardians = [],
  hasMinorChildren = false,
  onNext, 
  onBack,
  onSaveProgress
}: ExecutorsStepProps) {
  const [executors, setExecutors] = useState<Executor[]>(defaultExecutors);
  const [guardians, setGuardians] = useState<Guardian[]>(defaultGuardians);
  const [showExecutorForm, setShowExecutorForm] = useState(false);
  const [showGuardianForm, setShowGuardianForm] = useState(false);

  const executorForm = useForm<ExecutorForm>({
    resolver: zodResolver(executorSchema),
    defaultValues: { fullName: "", address: "", relationship: "" },
  });

  const guardianForm = useForm<ExecutorForm>({
    resolver: zodResolver(executorSchema),
    defaultValues: { fullName: "", address: "", relationship: "" },
  });

  const addExecutor = (data: ExecutorForm) => {
    setExecutors([...executors, { id: crypto.randomUUID(), ...data }]);
    executorForm.reset();
    setShowExecutorForm(false);
  };

  const addGuardian = (data: ExecutorForm) => {
    setGuardians([...guardians, { id: crypto.randomUUID(), ...data }]);
    guardianForm.reset();
    setShowGuardianForm(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Executors & Guardians</h2>
        <p className="text-muted-foreground">Appoint trusted individuals to manage your will and care for minor children.</p>
      </div>

      <IslamicInfoCard
        title="Role of Executors"
        content="Executors are responsible for administering your estate according to your will and UK law. Choose trustworthy individuals who are willing to serve. You should appoint at least one executor, though having two is recommended."
      />

      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Executors</h3>
        
        {executors.map((executor) => (
          <Card key={executor.id} className="p-4" data-testid={`executor-card-${executor.id}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <UserCheck className="h-5 w-5 text-primary mt-1" />
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{executor.fullName}</h4>
                  <p className="text-sm text-muted-foreground">{executor.relationship}</p>
                  <p className="text-xs text-muted-foreground mt-1">{executor.address}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setExecutors(executors.filter(e => e.id !== executor.id))}
                data-testid={`button-remove-executor-${executor.id}`}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </Card>
        ))}

        {executors.length === 0 && (
          <Card className="p-6 text-center bg-muted/30">
            <p className="text-sm text-muted-foreground">No executors appointed yet</p>
          </Card>
        )}

        {!showExecutorForm ? (
          <Button
            onClick={() => setShowExecutorForm(true)}
            variant="outline"
            className="w-full"
            data-testid="button-add-executor"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Executor
          </Button>
        ) : (
          <Card className="p-6">
            <Form {...executorForm}>
              <form onSubmit={executorForm.handleSubmit(addExecutor)} className="space-y-4">
                <FormField
                  control={executorForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Executor's full name" {...field} data-testid="input-executor-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={executorForm.control}
                  name="relationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Brother, Friend, Solicitor" {...field} data-testid="input-executor-relationship" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={executorForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Full address" {...field} data-testid="input-executor-address" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" data-testid="button-save-executor">
                    Save Executor
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowExecutorForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </Card>
        )}
      </div>

      {hasMinorChildren && (
        <div className="space-y-4 pt-6 border-t">
          <div>
            <h3 className="font-semibold text-foreground mb-2">Guardians for Minor Children</h3>
            <p className="text-sm text-muted-foreground">Appoint guardians to care for your children if both parents pass away.</p>
          </div>

          {guardians.map((guardian) => (
            <Card key={guardian.id} className="p-4" data-testid={`guardian-card-${guardian.id}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <UserCheck className="h-5 w-5 text-primary mt-1" />
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{guardian.fullName}</h4>
                    <p className="text-sm text-muted-foreground">{guardian.relationship}</p>
                    <p className="text-xs text-muted-foreground mt-1">{guardian.address}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setGuardians(guardians.filter(g => g.id !== guardian.id))}
                  data-testid={`button-remove-guardian-${guardian.id}`}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </Card>
          ))}

          {!showGuardianForm ? (
            <Button
              onClick={() => setShowGuardianForm(true)}
              variant="outline"
              className="w-full"
              data-testid="button-add-guardian"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Guardian
            </Button>
          ) : (
            <Card className="p-6">
              <Form {...guardianForm}>
                <form onSubmit={guardianForm.handleSubmit(addGuardian)} className="space-y-4">
                  <FormField
                    control={guardianForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Guardian's full name" {...field} data-testid="input-guardian-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={guardianForm.control}
                    name="relationship"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relationship</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g., Sister, Uncle" {...field} data-testid="input-guardian-relationship" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={guardianForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Full address" {...field} data-testid="input-guardian-address" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1" data-testid="button-save-guardian">
                      Save Guardian
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowGuardianForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </Card>
          )}
        </div>
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
            onClick={() => onNext({ executors, guardians })}
            disabled={executors.length === 0}
            data-testid="button-continue"
          >
            Continue to Bequests
          </Button>
        </div>
      </div>
    </div>
  );
}
