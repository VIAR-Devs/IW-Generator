import BequestsStep from '../BequestsStep';

export default function BequestsStepExample() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <BequestsStep
        onNext={(bequests) => console.log('Bequests:', bequests)}
        onBack={() => console.log('Going back')}
        onSaveProgress={() => console.log('Save progress clicked')}
      />
    </div>
  );
}
