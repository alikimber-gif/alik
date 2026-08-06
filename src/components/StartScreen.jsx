import { useState } from 'react';

export default function StartScreen({ formData, updateFormData, onNext }) {
  const [errors, setErrors] = useState({});

  function validate() {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Enter the decision or report title.';
    if (!formData.staffName.trim()) newErrors.staffName = 'Enter your name.';
    if (!formData.directorate.trim()) newErrors.directorate = 'Enter your directorate.';
    if (!formData.date) newErrors.date = 'Enter the date.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleNext() {
    if (validate()) onNext();
  }

  return (
    <div className="screen">
      <p className="screen-intro">
        Answer the questions below to assess how significant this decision is and
        how the community should be involved.
      </p>

      <div className="form-group">
        <label htmlFor="title">Decision or report title</label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={e => updateFormData({ title: e.target.value })}
          placeholder="e.g. Proposal to sell 12 Halifax Street"
          className={errors.title ? 'input-error' : ''}
        />
        {errors.title && <span className="error-text">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="staffName">Your name</label>
        <input
          id="staffName"
          type="text"
          value={formData.staffName}
          onChange={e => updateFormData({ staffName: e.target.value })}
          className={errors.staffName ? 'input-error' : ''}
        />
        {errors.staffName && <span className="error-text">{errors.staffName}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="directorate">Directorate</label>
        <input
          id="directorate"
          type="text"
          value={formData.directorate}
          onChange={e => updateFormData({ directorate: e.target.value })}
          placeholder="e.g. Infrastructure"
          className={errors.directorate ? 'input-error' : ''}
        />
        {errors.directorate && <span className="error-text">{errors.directorate}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          value={formData.date}
          onChange={e => updateFormData({ date: e.target.value })}
          className={errors.date ? 'input-error' : ''}
        />
        {errors.date && <span className="error-text">{errors.date}</span>}
      </div>

      <div className="button-row">
        <button className="btn btn-primary" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
}
