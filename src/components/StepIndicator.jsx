const STEPS = [
  'Details',
  'Assets',
  'Assessment',
  'Summary',
  'Save'
];

export default function StepIndicator({ currentStep }) {
  return (
    <div className="step-indicator">
      {STEPS.map((label, i) => (
        <div
          key={label}
          className={`step-dot ${i < currentStep ? 'completed' : ''} ${i === currentStep ? 'active' : ''}`}
        >
          <div className="dot">
            {i < currentStep ? (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <span>{i + 1}</span>
            )}
          </div>
          <span className="step-label">{label}</span>
        </div>
      ))}
    </div>
  );
}
