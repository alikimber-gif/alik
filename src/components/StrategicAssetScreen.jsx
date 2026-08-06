import { STRATEGIC_ASSETS } from '../data/criteria';

export default function StrategicAssetScreen({ formData, updateFormData, updateCriterion, onNext, onBack }) {
  function toggleAsset(asset) {
    const current = formData.strategicAssets;
    const updated = current.includes(asset)
      ? current.filter(a => a !== asset)
      : [...current, asset];
    updateFormData({ strategicAssets: updated });
  }

  function handleNext() {
    if (formData.strategicAssets.length === 0) {
      updateCriterion(1, {
        rating: 'lower',
        explanation: formData.criteria[1].explanation || 'No strategic assets are affected by this decision.'
      });
    }
    onNext();
  }

  return (
    <div className="screen">
      <h2 className="screen-title">Strategic assets</h2>
      <p className="screen-intro">
        Does this decision involve any of Council's strategic assets?
        Tick all that apply. If none apply, leave them unchecked and continue.
      </p>

      <div className="checkbox-list">
        {STRATEGIC_ASSETS.map(asset => (
          <label key={asset} className="checkbox-item">
            <input
              type="checkbox"
              checked={formData.strategicAssets.includes(asset)}
              onChange={() => toggleAsset(asset)}
            />
            <span className="checkbox-label">{asset}</span>
          </label>
        ))}
      </div>

      {formData.strategicAssets.length === 0 && (
        <p className="info-note">
          If none of these apply, the first criterion (strategic asset) will be
          set to Lower significance. You can edit this in the next step.
        </p>
      )}

      <div className="button-row">
        <button className="btn btn-secondary" onClick={onBack}>Back</button>
        <button className="btn btn-primary" onClick={handleNext}>Next</button>
      </div>
    </div>
  );
}
