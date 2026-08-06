import { CRITERIA, ENGAGEMENT_TOOLS, calculateSignificance, getEngagementLevel } from '../data/criteria';

const LEVEL_LABELS = { lower: 'Lower', moderate: 'Moderate', higher: 'Higher' };

export default function SummaryScreen({ formData, onNext, onBack }) {
  const significance = calculateSignificance(formData.criteria);
  const engagement = getEngagementLevel(significance);

  return (
    <div className="screen summary-screen">
      <h2 className="screen-title">Summary</h2>

      <div className="summary-header">
        <h3>{formData.title}</h3>
        <p>{formData.staffName} &middot; {formData.directorate} &middot; {formData.date}</p>
      </div>

      {formData.strategicAssets.length > 0 && (
        <div className="summary-section">
          <h4>Strategic assets involved</h4>
          <ul className="asset-list">
            {formData.strategicAssets.map(a => <li key={a}>{a}</li>)}
          </ul>
        </div>
      )}

      <div className="summary-section">
        <h4>Assessment ratings</h4>
        <div className="ratings-table">
          {CRITERIA.map(c => {
            const val = formData.criteria[c.id];
            return (
              <div key={c.id} className="rating-row">
                <div className="rating-row-left">
                  <span className="rating-row-number">{c.id}.</span>
                  <span className="rating-row-title">{c.title}</span>
                </div>
                <span className={`rating-badge rating-badge-${val.rating}`}>
                  {LEVEL_LABELS[val.rating] || 'Not rated'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="summary-section">
        <h4>Explanations</h4>
        {CRITERIA.map(c => {
          const val = formData.criteria[c.id];
          return (
            <div key={c.id} className="explanation-row">
              <strong>{c.id}. {c.title}</strong>
              <span className={`rating-badge-sm rating-badge-${val.rating}`}>
                {LEVEL_LABELS[val.rating]}
              </span>
              <p>{val.explanation}</p>
            </div>
          );
        })}
      </div>

      {significance && (
        <div className="summary-section significance-box">
          <h4>Suggested significance</h4>
          <p className="significance-result">
            Based on your ratings, this decision leans toward{' '}
            <strong className={`sig-${significance}`}>{LEVEL_LABELS[significance]}</strong>{' '}
            significance.
          </p>
          <p className="significance-caveat">
            Significance is a judgement call, not a formula. One criterion at a
            high degree can outweigh several at a low degree, and the other way
            around. You make the final call. This tool organises your thinking.
          </p>
        </div>
      )}

      {engagement && (
        <div className="summary-section engagement-box">
          <h4>Suggested engagement level</h4>
          <p className="engagement-level">
            <strong>{engagement.level}</strong>
          </p>
          <p>{engagement.description}</p>
        </div>
      )}

      <div className="summary-section maori-box">
        <h4>Engagement with Maori and iwi</h4>
        <p>
          Regardless of the significance rating, consider engagement with Maori
          and iwi on this decision. Views should be sought early in the process.
        </p>
      </div>

      <div className="summary-section">
        <h4>Engagement tools to consider</h4>
        {Object.entries(ENGAGEMENT_TOOLS).map(([channel, tools]) => (
          <div key={channel} className="tools-group">
            <h5>{channel}</h5>
            <div className="tools-list">
              {tools.map(tool => (
                <span key={tool} className="tool-chip">{tool}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="button-row">
        <button className="btn btn-secondary" onClick={onBack}>Back</button>
        <button className="btn btn-primary" onClick={onNext}>Save or export</button>
      </div>
    </div>
  );
}
