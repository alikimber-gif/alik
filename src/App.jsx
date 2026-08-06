import { useState, useEffect, useCallback } from 'react';
import StepIndicator from './components/StepIndicator';
import StartScreen from './components/StartScreen';
import StrategicAssetScreen from './components/StrategicAssetScreen';
import AssessmentScreen from './components/AssessmentScreen';
import SummaryScreen from './components/SummaryScreen';
import ExportScreen from './components/ExportScreen';
import './App.css';

const STORAGE_KEY = 'ncc-significance-assessment';

function createInitialState() {
  return {
    title: '',
    staffName: '',
    directorate: '',
    date: new Date().toISOString().split('T')[0],
    strategicAssets: [],
    criteria: {
      1: { rating: '', explanation: '' },
      2: { rating: '', explanation: '' },
      3: { rating: '', explanation: '' },
      4: { rating: '', explanation: '' },
      5: { rating: '', explanation: '' },
      6: { rating: '', explanation: '' },
      7: { rating: '', explanation: '' },
    }
  };
}

function App() {
  const [step, setStep] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '-step');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : createInitialState();
    } catch {
      return createInitialState();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      localStorage.setItem(STORAGE_KEY + '-step', String(step));
    } catch {
      // Storage full or unavailable
    }
  }, [formData, step]);

  const updateFormData = useCallback((updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const updateCriterion = useCallback((id, updates) => {
    setFormData(prev => ({
      ...prev,
      criteria: {
        ...prev.criteria,
        [id]: { ...prev.criteria[id], ...updates }
      }
    }));
  }, []);

  const goNext = useCallback(() => {
    setStep(s => Math.min(s + 1, 4));
    window.scrollTo(0, 0);
  }, []);

  const goBack = useCallback(() => {
    setStep(s => Math.max(s - 1, 0));
    window.scrollTo(0, 0);
  }, []);

  const resetForm = useCallback(() => {
    if (window.confirm('This will clear all your answers. Are you sure?')) {
      setFormData(createInitialState());
      setStep(0);
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_KEY + '-step');
      } catch {
        // Ignore
      }
    }
  }, []);

  function renderScreen() {
    switch (step) {
      case 0:
        return (
          <StartScreen
            formData={formData}
            updateFormData={updateFormData}
            onNext={goNext}
          />
        );
      case 1:
        return (
          <StrategicAssetScreen
            formData={formData}
            updateFormData={updateFormData}
            updateCriterion={updateCriterion}
            onNext={goNext}
            onBack={goBack}
          />
        );
      case 2:
        return (
          <AssessmentScreen
            formData={formData}
            updateCriterion={updateCriterion}
            onNext={goNext}
            onBack={goBack}
          />
        );
      case 3:
        return (
          <SummaryScreen
            formData={formData}
            onNext={goNext}
            onBack={goBack}
          />
        );
      case 4:
        return (
          <ExportScreen
            formData={formData}
            onBack={goBack}
            onReset={resetForm}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">Significance and Engagement Assessment</h1>
          <span className="app-org">Nelson City Council</span>
        </div>
        {step > 0 && (
          <button className="btn-link header-reset" onClick={resetForm}>
            New
          </button>
        )}
      </header>

      <StepIndicator currentStep={step} />

      <main className="app-main">
        {renderScreen()}
      </main>
    </div>
  );
}

export default App;
