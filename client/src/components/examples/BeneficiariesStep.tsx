import { useState } from 'react';
import BeneficiariesStep from '../BeneficiariesStep';

export default function BeneficiariesStepExample() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <BeneficiariesStep
        onNext={(beneficiaries) => console.log('Beneficiaries:', beneficiaries)}
        onBack={() => console.log('Going back')}
        onSaveProgress={() => console.log('Save progress clicked')}
      />
    </div>
  );
}
