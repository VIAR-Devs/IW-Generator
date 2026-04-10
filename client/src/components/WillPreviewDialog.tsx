import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { WillFormData } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import ReviewStep from "./ReviewStep";

interface WillPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: WillFormData | null;
  onEdit: () => void;
  onEditStep?: (stepNumber: number) => void;
  lastUpdated?: string;
}

export function WillPreviewDialog({ 
  open, 
  onOpenChange, 
  formData, 
  onEdit,
  onEditStep,
  lastUpdated 
}: WillPreviewDialogProps) {
  const { toast } = useToast();

  const handleDownload = () => {
    toast({
      title: "Downloading Will",
      description: "Your Islamic Will PDF is being prepared for download...",
    });
  };

  const handleEditSection = (stepNumber: number) => {
    if (onEditStep) {
      onEditStep(stepNumber);
    } else {
      onEdit();
    }
    onOpenChange(false);
  };

  if (!formData) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-[95vw] max-h-[90vh] overflow-y-auto" data-testid="dialog-will-preview">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-accent" />
            My Islamic Will Preview
          </DialogTitle>
          <DialogDescription>
            Review your will details below. Click Edit on any section to make changes.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <ReviewStep
            formData={formData}
            onNext={() => {}}
            onBack={() => {}}
            onEditStep={handleEditSection}
            isPreviewMode={true}
          />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 mt-6 border-t">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={onEdit}
              data-testid="button-preview-edit"
            >
              Edit Will
            </Button>
            <Button 
              className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 border-0"
              onClick={handleDownload}
              data-testid="button-preview-download"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>

          {lastUpdated && (
            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground">
                Last updated: {lastUpdated}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
