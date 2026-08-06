import { useState } from 'react';

const LEVEL_LABELS = {
  lower: 'Lower',
  moderate: 'Moderate',
  higher: 'Higher'
};

export default function CriterionCard({ criterion, value, onChange }) {
  const [showReference, setShowReference] = useState(false);

  const isComplete = value.rating && value.explanation.trim().length > 0;

  return (
    <div className={`criterion-card ${isComplete ? 'criterion-complete' : ''}`} id={`criterion-${criterion.id}`}>
      <div className="criterion-header">
        <span className="criterion-number">{criterion.id}</span>
        <div>
          <h3 className="criterion-title">{criterion.title}</h3>
          <p className="criterion-description">{criterion.description}</p>
        </div>
        {isComplete && (
          <span className="criterion-check" aria-label="Complete">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="10" fill="#2E8540"/>
              <path d="M6 10L9 13L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        )}
      </div>

      <div className="rating-selector">
        {['lower', 'moderate', 'higher'].map(level => (
          <button
            key={level}
            className={`rating-btn rating-${level} ${value.rating === level ? 'selected' : ''}`}
            onClick={() => onChange({ ...value, rating: level })}
            type="button"
          >
            {LEVEL_LABELS[level]}
          </button>
        ))}
      </div>

      <button
        className="reference-toggle"
        onClick={() => setShowReference(!showReference)}
        type="button"
      >
        {showReference ? 'Hide' : 'Show'} reference guide
        <svg
          width="12" height="12" viewBox="0 0 12 12"
          className={`chevron ${showReference ? 'open' : ''}`}
        >
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      </button>

      {showReference && (
        <div className="reference-text">
          {['lower', 'moderate', 'higher'].map(level => (
            <div
              key={level}
              className={`reference-item ${value.rating === level ? 'reference-selected' : ''}`}
            >
              <strong className={`reference-level reference-level-${level}`}>
                {LEVEL_LABELS[level]}:
              </strong>{' '}
              {criterion.levels[level]}
            </div>
          ))}
        </div>
      )}

      <div className="form-group">
        <label htmlFor={`explanation-${criterion.id}`}>
          Explanation of assessment <span className="required">*</span>
        </label>
        <textarea
          id={`explanation-${criterion.id}`}
          value={value.explanation}
          onChange={e => onChange({ ...value, explanation: e.target.value })}
          placeholder="Be specific. This becomes the formal record."
          rows={3}
          className={!value.explanation.trim() && value.rating ? 'input-warning' : ''}
        />
        <p className="field-note">
          This becomes the record if the decision is judicially reviewed. Be
          specific about why you chose this rating.
        </p>
      </div>
    </div>
  );
}
