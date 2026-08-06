import { useState } from 'react';
import { CRITERIA } from '../data/criteria';
import CriterionCard from './CriterionCard';
import ProgressBar from './ProgressBar';

export default function AssessmentScreen({ formData, updateCriterion, onNext, onBack }) {
  const [showErrors, setShowErrors] = useState(false);

  const completedCount = CRITERIA.filter(c => {
    const val = formData.criteria[c.id];
    return val.rating && val.explanation.trim().length > 0;
  }).length;

  const incomplete = CRITERIA.filter(c => {
    const val = formData.criteria[c.id];
    return !val.rating || !val.explanation.trim();
  });

  function handleNext() {
    if (incomplete.length > 0) {
      setShowErrors(true);
      const firstIncomplete = document.getElementById(`criterion-${incomplete[0].id}`);
      if (firstIncomplete) {
        firstIncomplete.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }
    onNext();
  }

  return (
    <div className="screen">
      <h2 className="screen-title">Assessment</h2>
      <p className="screen-intro">
        Rate each criterion and explain your reasoning.
      </p>

      <ProgressBar
        current={completedCount}
        total={7}
        label="Criteria completed"
      />

      {showErrors && incomplete.length > 0 && (
        <div className="error-banner">
          {incomplete.length} {incomplete.length === 1 ? 'criterion needs' : 'criteria need'} a
          rating and explanation before you can continue.
        </div>
      )}

      <div className="criteria-list">
        {CRITERIA.map(criterion => (
          <CriterionCard
            key={criterion.id}
            criterion={criterion}
            value={formData.criteria[criterion.id]}
            onChange={val => updateCriterion(criterion.id, val)}
          />
        ))}
      </div>

      <div className="button-row">
        <button className="btn btn-secondary" onClick={onBack}>Back</button>
        <button className="btn btn-primary" onClick={handleNext}>
          View summary
        </button>
      </div>
    </div>
  );
}
