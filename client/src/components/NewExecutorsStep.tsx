import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { executorSchema, type Executor } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, User } from "lucide-react";
import IslamicInfoCard from "./IslamicInfoCard";
import { nanoid } from "nanoid";

interface NewExecutorsStepProps {
  defaultExecutors?: Executor[];
  onNext: (executors: Executor[]) => void;
  onBack: () => void;
  onSaveProgress: () => void;
}

export default function NewExecutorsStep({ defaultExecutors = [], onNext, onBack, onSaveProgress }: NewExecutorsStepProps) {
  const [executors, setExecutors] = useState<Executor[]>(defaultExecutors);
  const [showBackupForm, setShowBackupForm] = useState(defaultExecutors.length > 1);

  const mainForm = useForm<Executor>({
    resolver: zodResolver(executorSchema),
    defaultValues: executors[0] || {
      id: nanoid(),
      name: "",
      address: "",
    },
  });

  const backupForm = useForm<Executor>({
    resolver: zodResolver(executorSchema),
    defaultValues: executors[1] || {
      id: nanoid(),
      name: "",
      address: "",
    },
  });

  const handleNext = () => {
    const mainExecutor = mainForm.getValues();
    const backupExecutor = backupForm.getValues();

    const validExecutors = [mainExecutor];
    if (showBackupForm && backupExecutor.name && backupExecutor.address) {
      validExecutors.push(backupExecutor);
    }

    onNext(validExecutors);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Executors</h2>
        <p className="text-muted-foreground">
          Choose someone you trust to manage your estate and ensure your wishes are carried out.
        </p>
      </div>

      <IslamicInfoCard
        title="Role of the Executor"
        content="An executor is responsible for administering your estate, paying debts, and distributing assets according to Islamic law and your wishes. Choose someone trustworthy, responsible, and preferably with some knowledge of Islamic inheritance."
      />

      <Form {...mainForm}>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Primary Executor</h3>
          </div>
          <div className="space-y-4">
            <FormField
              control={mainForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Executor's full name"
                      {...field}
                      data-testid="input-main-executor-name"
                    />
                  </FormControl>
                  <FormDescription>Who is your primary executor (person to manage your estate)?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={mainForm.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Executor's full address"
                      {...field}
                      data-testid="input-main-executor-address"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>
      </Form>

      {!showBackupForm && (
        <Button
          variant="outline"
          onClick={() => setShowBackupForm(true)}
          className="w-full"
          data-testid="button-add-backup-executor"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Backup Executor (Optional)
        </Button>
      )}

      {showBackupForm && (
        <Form {...backupForm}>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Backup Executor</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowBackupForm(false);
                  backupForm.reset({ id: nanoid(), name: "", address: "" });
                }}
                data-testid="button-remove-backup-executor"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <FormField
                control={backupForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Backup executor's full name"
                        {...field}
                        data-testid="input-backup-executor-name"
                      />
                    </FormControl>
                    <FormDescription>Do you want to appoint a second or backup executor? (optional)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={backupForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Backup executor's full address"
                        {...field}
                        data-testid="input-backup-executor-address"
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
            disabled={!mainForm.getValues().name || !mainForm.getValues().address}
            data-testid="button-continue"
          >
            Continue to Guardians
          </Button>
        </div>
      </div>
    </div>
  );
}
