import PaymentStep from '../PaymentStep';

export default function PaymentStepExample() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <PaymentStep
        hasAccount={false}
        onBack={() => console.log('Going back')}
        onCreateAccount={(email, password) => console.log('Account created:', email)}
        onPayment={(email) => console.log('Processing payment for:', email)}
      />
    </div>
  );
}
