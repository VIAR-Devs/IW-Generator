import ExecutorsStep from '../ExecutorsStep';

export default function ExecutorsStepExample() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <ExecutorsStep
        hasMinorChildren={true}
        onNext={(data) => console.log('Executors & Guardians:', data)}
        onBack={() => console.log('Going back')}
        onSaveProgress={() => console.log('Save progress clicked')}
      />
    </div>
  );
}
