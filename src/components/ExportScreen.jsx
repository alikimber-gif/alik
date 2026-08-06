import { useState } from 'react';
import { CRITERIA, calculateSignificance, getEngagementLevel } from '../data/criteria';

const LEVEL_LABELS = { lower: 'Lower', moderate: 'Moderate', higher: 'Higher' };

function buildTextExport(formData) {
  const significance = calculateSignificance(formData.criteria);
  const engagement = getEngagementLevel(significance);

  let text = '';
  text += 'SIGNIFICANCE AND ENGAGEMENT ASSESSMENT\n';
  text += '=======================================\n\n';
  text += `Decision: ${formData.title}\n`;
  text += `Staff member: ${formData.staffName}\n`;
  text += `Directorate: ${formData.directorate}\n`;
  text += `Date: ${formData.date}\n\n`;

  text += 'STRATEGIC ASSETS\n';
  text += '----------------\n';
  if (formData.strategicAssets.length > 0) {
    formData.strategicAssets.forEach(a => { text += `- ${a}\n`; });
  } else {
    text += 'None\n';
  }
  text += '\n';

  text += 'ASSESSMENT\n';
  text += '----------\n\n';
  CRITERIA.forEach(c => {
    const val = formData.criteria[c.id];
    text += `${c.id}. ${c.title}\n`;
    text += `   Rating: ${LEVEL_LABELS[val.rating] || 'Not rated'}\n`;
    text += `   Explanation: ${val.explanation}\n\n`;
  });

  if (significance) {
    text += `OVERALL SIGNIFICANCE: ${LEVEL_LABELS[significance]}\n`;
    text += '(This is a suggested rating based on the criteria above. ';
    text += 'Significance is a judgement call.)\n\n';
  }

  if (engagement) {
    text += `RECOMMENDED ENGAGEMENT LEVEL: ${engagement.level}\n`;
    text += `${engagement.description}\n\n`;
  }

  text += 'REMINDER: Engagement with Maori and iwi should be considered regardless ';
  text += 'of significance rating. Views should be sought early.\n';

  return text;
}

export default function ExportScreen({ formData, onBack, onReset }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const text = buildTextExport(formData);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="screen">
      <h2 className="screen-title">Save your assessment</h2>

      <div className="save-reminder">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 2L18 18H2L10 2Z" stroke="#B35A00" strokeWidth="1.5" fill="none"/>
          <path d="M10 8V12" stroke="#B35A00" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="10" cy="15" r="0.75" fill="#B35A00"/>
        </svg>
        <p>
          Save this to your NDocs folder for your records before completing.
        </p>
      </div>

      <div className="export-actions">
        <button className="btn btn-primary btn-full" onClick={handlePrint}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="4" y="1" width="10" height="5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <rect x="1" y="6" width="16" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <rect x="4" y="11" width="10" height="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          </svg>
          Export as PDF (print)
        </button>

        <button className="btn btn-secondary btn-full" onClick={handleCopy}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="5" y="5" width="10" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <path d="M3 13V2C3 1.5 3.5 1 4 1H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          </svg>
          {copied ? 'Copied to clipboard' : 'Copy as text'}
        </button>
      </div>

      <div className="button-row">
        <button className="btn btn-secondary" onClick={onBack}>Back to summary</button>
      </div>

      <div className="reset-section">
        <button className="btn-link" onClick={onReset}>
          Start a new assessment
        </button>
      </div>
    </div>
  );
}
