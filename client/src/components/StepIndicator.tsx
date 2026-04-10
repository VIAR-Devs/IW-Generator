import { Check } from "lucide-react";

interface Step {
  id: number;
  title: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress" className="mb-8 w-full">
      <div className="relative w-full overflow-x-hidden">
        {/* Grid container for circles and labels */}
        <div
          className="grid gap-0 mb-2 w-full"
          style={{
            gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`,
          }}
        >
          {steps.map((step, index) => (
            <div key={step.id} className="relative flex flex-col items-center min-w-0">
              {/* Circle */}
              <div
                className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border-2 transition-colors ${
                  step.id < currentStep
                    ? 'border-primary bg-primary text-primary-foreground'
                    : step.id === currentStep
                    ? 'border-primary bg-background text-primary'
                    : 'border-muted bg-background text-muted-foreground'
                }`}
                data-testid={`step-indicator-${step.id}`}
              >
                {step.id < currentStep ? (
                  <Check className="h-4 w-4 sm:h-5 sm:w-5" data-testid={`step-complete-${step.id}`} />
                ) : (
                  <span className="text-xs sm:text-sm font-semibold">{step.id}</span>
                )}
              </div>

              {/* Connecting line - positioned absolutely to not affect layout */}
              {index !== steps.length - 1 && (
                <div
                  className="hidden md:block absolute h-0.5 transition-colors"
                  style={{
                    top: '20px', // Center of h-10 circle
                    left: 'calc(50% + 20px)',
                    right: 'calc(-100% + 20px)',
                  }}
                >
                  <div
                    className={`h-full transition-colors ${
                      step.id < currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                </div>
              )}

              {/* Label */}
              <div className="mt-2 text-center hidden md:block">
                <p
                  className={`text-sm font-medium whitespace-nowrap ${
                    step.id === currentStep ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 whitespace-nowrap">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
