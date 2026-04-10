import { Info } from "lucide-react";
import { Card } from "@/components/ui/card";

interface IslamicInfoCardProps {
  title: string;
  content: string;
  verse?: string;
}

export default function IslamicInfoCard({ title, content, verse }: IslamicInfoCardProps) {
  return (
    <Card className="p-6 border-l-4 border-l-primary bg-primary/5">
      <div className="flex gap-3">
        <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="space-y-2 flex-1">
          <h4 className="font-semibold text-foreground">{title}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{content}</p>
          {verse && (
            <p className="text-sm italic text-primary/80 pt-2 border-t border-primary/20">
              {verse}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
