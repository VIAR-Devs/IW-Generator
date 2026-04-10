import StepIndicator from '../StepIndicator';

export default function StepIndicatorExample() {
  const steps = [
    { id: 1, title: "Personal Info", description: "Basic details" },
    { id: 2, title: "Beneficiaries", description: "Family members" },
    { id: 3, title: "Executors", description: "Will executors" },
    { id: 4, title: "Review", description: "Final review" },
  ];

  return (
    <div className="p-6">
      <StepIndicator steps={steps} currentStep={2} />
    </div>
  );
}
