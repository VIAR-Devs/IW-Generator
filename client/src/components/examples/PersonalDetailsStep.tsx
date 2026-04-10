import PersonalDetailsStep from '../PersonalDetailsStep';

export default function PersonalDetailsStepExample() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <PersonalDetailsStep
        onNext={(data) => console.log('Personal details submitted:', data)}
        onSaveProgress={() => console.log('Save progress clicked')}
      />
    </div>
  );
}
