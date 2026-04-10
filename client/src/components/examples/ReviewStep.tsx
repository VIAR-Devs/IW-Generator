import ReviewStep from '../ReviewStep';

export default function ReviewStepExample() {
  const mockFormData = {
    personalDetails: {
      fullName: "Ahmed Khan",
      dateOfBirth: "1985-03-15",
      address: "123 High Street, London",
      postcode: "SW1A 1AA",
      maritalStatus: "married" as const,
    },
    familyStructure: {
      hasSpouse: true,
      hasChildren: true,
      hasParents: true,
      hasSiblings: true,
    },
    beneficiaries: [
      { id: "1", relationship: "spouse" as const, fullName: "Fatima Khan" },
      { id: "2", relationship: "child" as const, fullName: "Omar Khan", dateOfBirth: "2010-05-20" },
      { id: "3", relationship: "child" as const, fullName: "Aisha Khan", dateOfBirth: "2012-08-14" },
    ],
    executors: [
      { id: "1", fullName: "Hassan Ali", address: "456 Park Road, Birmingham B1 1AA", relationship: "Brother" },
    ],
    guardians: [
      { id: "1", fullName: "Maryam Ali", address: "456 Park Road, Birmingham B1 1AA", relationship: "Sister-in-law" },
    ],
    bequests: [
      { id: "1", description: "£5,000 to Islamic Relief charity", recipient: "Islamic Relief", value: "£5,000" },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ReviewStep
        formData={mockFormData}
        onBack={() => console.log('Going back')}
        onSubmit={() => console.log('Generating will...')}
        onSaveProgress={() => console.log('Save progress clicked')}
      />
    </div>
  );
}
