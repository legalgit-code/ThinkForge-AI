import React, { useState } from 'react';
import './App.css';

const STEPS = ['Goal Analysis', 'Task Breakdown', 'Weekly Plan', 'Verification'];

function App() {
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeStep, setActiveStep] = useState(-1);
  const [error, setError] = useState('');

  const analyze = async () => {
    if (!goal.trim()) return;
    setLoading(true);
    setResult(null);
    setError('');
    setActiveStep(0);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal })
      });
      const data = await res.json();
      setResult(data);
      setActiveStep(4);
    } catch (e) {
      setError('Backend not running. Open new terminal and run: cd ~/Desktop/thinkforge-ai/backend && uvicorn main:app --reload --port 8000');
    }
    setLoading(false);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">THINKFORGE AI</div>
        <p className="tagline">Forging Ideas Into Solutions Through Reasoning</p>
        <p className="hackathon">Microsoft Build Hackathon 2026 — Reasoning Agents Track</p>
      </header>

      <div className="workspace">
        <div className="input-section">
          <h2 className="section-title">Enter Your Goal</h2>
          <textarea className="goal-input" value={goal}
            onChange={e => setGoal(e.target.value)}
            placeholder="e.g. I want a cybersecurity job in 6 months..." rows={4} />
          <div className="examples">
            {['Cybersecurity job in 6 months','Learn machine learning','Launch my startup'].map(ex => (
              <button key={ex} className="example-btn" onClick={() => setGoal(ex)}>{ex}</button>
            ))}
          </div>
          <button className="forge-btn" onClick={analyze} disabled={loading}>
            {loading ? 'AI Agents Working...' : 'Forge Solution'}
          </button>
          {error && <p className="error">{error}</p>}
        </div>

        <div className="thinkflow">
          <h3 className="section-title">ThinkFlow</h3>
          <p className="thinkflow-sub">Live agent reasoning</p>
          {STEPS.map((step, i) => (
            <div key={i} className={'flow-step' + (activeStep > i ? ' done' : '') + (activeStep === i && loading ? ' active' : '')}>
              <div className="step-circle">{activeStep > i ? 'v' : i + 1}</div>
              <div className="step-info">
                <span className="step-name">{step}</span>
                {activeStep === i && loading && <span className="step-status">Processing...</span>}
                {activeStep > i && <span className="step-done">Complete</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {result && (
        <div className="results">
          <h2 className="section-title">Analysis Complete</h2>
          {result.steps && result.steps.map((s: any) => (
            <div key={s.step} className="result-card">
              <div className="result-header">
                <span className="step-badge">{s.step}</span>
                <h3>{s.title}</h3>
              </div>
              <pre className="result-body">{s.result}</pre>
            </div>
          ))}
        </div>
      )}
      <footer className="footer">ThinkForge AI — Powered by LLaMA 3.1 — Zero Data Leaks</footer>
    </div>
  );
}
export default App;
