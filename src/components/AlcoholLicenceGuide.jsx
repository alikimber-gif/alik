import { useState } from 'react'
import './AlcoholLicenceGuide.css'

const APPLICANT_STEPS = [
  {
    id: 1,
    title: 'Decide what type of licence you need',
    subtitle: 'On, Off, Club, or Special?',
    tag: 'Applicant action',
    content: (
      <>
        <p>The type of licence determines what you can sell and when. Choose the one that fits your business:</p>
        <ul>
          <li><strong>On licence</strong> — alcohol consumed on the premises (bar, café, restaurant)</li>
          <li><strong>Off licence</strong> — alcohol sold for consumption elsewhere (bottle store, supermarket)</li>
          <li><strong>Club licence</strong> — members-only club (RSA, sports club)</li>
          <li><strong>Special licence</strong> — one-off event or occasion</li>
        </ul>
        <div className="alg-tip"><strong>Not sure?</strong> Contact the NCC licensing team before you start — they'll point you in the right direction.</div>
      </>
    ),
  },
  {
    id: 2,
    title: 'Check the local rules',
    subtitle: 'Local Alcohol Policy, trading hours, and planning rules',
    tag: 'Applicant action',
    content: (
      <>
        <p>Before applying, check that your premises and proposed hours are permitted under:</p>
        <ul>
          <li>Nelson City Council's <strong>Local Alcohol Policy (LAP)</strong></li>
          <li>District Plan <strong>planning and zoning rules</strong> for your address</li>
          <li>Any <strong>ban areas</strong> or restricted zones that apply</li>
          <li><strong>Food registration</strong> requirements (if selling food alongside alcohol)</li>
        </ul>
        <div className="alg-tip"><strong>Tip:</strong> The LAP sets maximum trading hours in Nelson. Your licence cannot exceed these hours, so check them early.</div>
      </>
    ),
  },
  {
    id: 3,
    title: 'Get qualified',
    subtitle: 'LCQ + Manager\'s Certificate required',
    tag: 'Applicant action',
    content: (
      <>
        <p>Every licensed premises must have a Certified Manager on duty. This requires two things:</p>
        <ul>
          <li>Complete the <strong>LCQ (Licence Controller Qualification)</strong> — a nationally recognised training course</li>
          <li>Apply for a <strong>Manager's Certificate</strong> through Nelson City Council</li>
        </ul>
        <p>The Manager's Certificate application is separate from the premises licence application — start it early.</p>
      </>
    ),
  },
  {
    id: 4,
    title: 'Gather your documents',
    subtitle: 'Plans, ID, host responsibility, and more',
    tag: 'Applicant action',
    content: (
      <>
        <p>You'll need to provide these with your application:</p>
        <ul>
          <li><strong>Site plan</strong> of the premises (floor plan showing licensed area)</li>
          <li><strong>Lease or ownership</strong> documents for the premises</li>
          <li><strong>Host responsibility policy</strong> — how you'll manage intoxication, minors, and transport</li>
          <li><strong>Food and beverage menu</strong> (for on-licences)</li>
          <li><strong>Photo ID</strong> for all applicants / directors</li>
        </ul>
        <div className="alg-tip"><strong>Tip:</strong> A complete application avoids delays. The Council will check completeness within 10 working days — missing documents mean starting the clock over.</div>
      </>
    ),
  },
  {
    id: 5,
    title: 'Submit your application & pay the fee',
    subtitle: 'Online form + correct fee for your licence category',
    tag: 'Applicant action',
    content: (
      <>
        <p>Submit your completed application form online through the NCC website, along with all supporting documents and the correct fee.</p>
        <p>Fees are set by regulation and depend on your licence category and the risk level of your business. Contact NCC to confirm the current fee before submitting.</p>
        <div className="alg-tip"><strong>What happens next?</strong> Once submitted, your application moves to the Council — they take over from here. Processing typically takes several weeks, so apply well ahead of when you need your licence.</div>
      </>
    ),
  },
]

const COUNCIL_STEPS = [
  {
    id: 'C6',
    num: 6,
    title: 'Application check',
    subtitle: 'Completeness confirmed within ~10 working days',
    tag: 'Council action',
    content: (
      <>
        <p>The DLC Secretariat reviews your application to confirm it's complete and correct. You'll be notified within approximately 10 working days of receipt.</p>
        <p>If something's missing, they'll contact you — the clock pauses until the application is complete.</p>
      </>
    ),
  },
  {
    id: 'C7',
    num: 7,
    title: 'Public notice',
    subtitle: 'Posted online and displayed at the premises',
    tag: 'Council action',
    content: (
      <>
        <p>Your application is publicly notified — a notice is posted on the NCC website and two notices are displayed at the premises.</p>
        <p>This opens the <strong>25 working day window</strong> during which the public and reporting agencies may object.</p>
      </>
    ),
  },
  {
    id: 'C8',
    num: 8,
    title: 'Sent to reporting agencies',
    subtitle: 'Police, Medical Officer of Health, Inspector',
    tag: 'Council action',
    content: (
      <>
        <p>Copies of your application are sent to the three statutory reporting agencies:</p>
        <ul>
          <li><strong>New Zealand Police</strong></li>
          <li><strong>Medical Officer of Health</strong> (Nelson Marlborough Health)</li>
          <li><strong>Licensing Inspector</strong> (NCC)</li>
        </ul>
        <p>Each agency reviews the application and may file a report within the 25 working day window.</p>
      </>
    ),
  },
]

function ChevronIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M4.5 6.75L9 11.25l4.5-4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function CheckIcon({ color = 'currentColor' }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 7l4 4 6-6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function StepCard({ step, isCouncil = false, activeId, onToggle, doneIds, onMarkDone }) {
  const stepKey = isCouncil ? step.id : step.id
  const numKey = isCouncil ? step.id : step.id
  const isActive = activeId === stepKey
  const isDone = !isCouncil && doneIds.has(step.id)

  const cardClass = [
    'alg-step-card',
    isCouncil ? 'alg-council' : '',
    isActive ? 'alg-active' : '',
    isDone ? 'alg-checked' : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={cardClass} onClick={() => onToggle(stepKey)}>
      <div className="alg-step-header">
        <div className="alg-step-num">{isCouncil ? step.num : step.id}</div>
        <div className="alg-step-title-wrap">
          <div className="alg-step-title">{step.title}</div>
          <div className="alg-step-subtitle">{step.subtitle}</div>
        </div>
        <div className="alg-step-chevron"><ChevronIcon /></div>
      </div>
      <div className={`alg-step-body${isActive ? ' alg-open' : ''}`}>
        <div className="alg-step-body-inner">
          <div className="alg-step-body-content">
            <div className="alg-step-tag">{step.tag}</div>
            {step.content}
            {!isCouncil && (
              <button
                className={`alg-check-btn${isDone ? ' alg-marked' : ''}`}
                onClick={e => { e.stopPropagation(); onMarkDone(step.id) }}
              >
                <CheckIcon color={isDone ? 'white' : 'currentColor'} />
                {isDone ? 'Done ✓' : 'Mark as done'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AlcoholLicenceGuide() {
  const [activeId, setActiveId] = useState(1)
  const [doneIds, setDoneIds] = useState(new Set())

  function toggleStep(id) {
    setActiveId(prev => prev === id ? null : id)
  }

  function markDone(id) {
    setDoneIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const doneCount = doneIds.size
  const total = 5
  const pct = Math.round((doneCount / total) * 100)
  const allDone = doneCount === total

  return (
    <div className="alg-root">
      <header className="alg-header">
        <div className="alg-header-divider" />
        <div className="alg-header-label">Regulatory Services<br />Alcohol Licensing</div>
      </header>

      <main className="alg-wrap">
        {/* Hero */}
        <div className="alg-hero">
          <div className="alg-eyebrow">Step-by-step guide</div>
          <h1>Applying for an alcohol licence<br />in Whakatū Nelson</h1>
          <p className="alg-hero-sub">Follow these steps to apply for an On, Off, Club, or Special licence. Tap each step to learn more.</p>
        </div>

        {/* Progress tracker */}
        <div className="alg-tracker">
          <svg className="alg-tracker-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm3.5 5.5l-4 5a.75.75 0 01-1.1.1l-2-2a.75.75 0 011.1-1l1.4 1.4 3.5-4.4a.75.75 0 011.1 1z" fill="currentColor"/>
          </svg>
          <div className="alg-tracker-bar-wrap">
            <div className="alg-tracker-bar-fill" style={{ width: `${pct}%`, background: allDone ? '#00AB8E' : '#0077C8' }} />
          </div>
          <div className="alg-tracker-label">
            {allDone
              ? <><strong>All 5 steps ready</strong> — submit your application!</>
              : <><strong>{doneCount}</strong> of {total} steps done</>
            }
          </div>
        </div>

        {/* Phase 1: Applicant steps */}
        <div className="alg-phase-label alg-phase-you">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="4" r="2.5" fill="currentColor"/>
            <path d="M2 12c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          </svg>
          Your steps
        </div>

        <div className="alg-phase-group">
          {APPLICANT_STEPS.map((step, i) => (
            <div key={step.id}>
              <StepCard
                step={step}
                activeId={activeId}
                onToggle={toggleStep}
                doneIds={doneIds}
                onMarkDone={markDone}
              />
              {i < APPLICANT_STEPS.length - 1 && (
                <div className="alg-step-connector"><div className="alg-line" /></div>
              )}
            </div>
          ))}
        </div>

        {/* Connector: You → Council */}
        <div className="alg-section-connector">
          <div className="alg-connector-line" />
          <div className="alg-connector-label">Submitted — Council takes over</div>
          <div className="alg-connector-line" style={{ background: 'linear-gradient(to bottom, #B5C2CB, #B2E0D8)' }} />
        </div>

        {/* Phase 2: Council steps */}
        <div className="alg-phase-label alg-phase-council">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="3" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" fill="none"/>
            <path d="M4 3V2a1 1 0 012 0v1M8 3V2a1 1 0 012 0v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          What the Council does
        </div>

        <div className="alg-phase-group">
          {COUNCIL_STEPS.map((step, i) => (
            <div key={step.id}>
              <StepCard
                step={step}
                isCouncil
                activeId={activeId}
                onToggle={toggleStep}
                doneIds={doneIds}
                onMarkDone={markDone}
              />
              {i < COUNCIL_STEPS.length - 1 && (
                <div className="alg-step-connector alg-council"><div className="alg-line" /></div>
              )}
            </div>
          ))}
        </div>

        {/* Connector: Council → Decision */}
        <div className="alg-section-connector">
          <div className="alg-connector-line" style={{ background: 'linear-gradient(to bottom, #B2E0D8, #FFC72C)' }} />
          <div className="alg-connector-label">25-day window closes</div>
          <div className="alg-connector-line" style={{ background: 'linear-gradient(to bottom, #FFC72C, #B5C2CB)' }} />
        </div>

        {/* Phase 3: Decision */}
        <div className="alg-phase-label alg-phase-decision">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1l1.5 4.5H13L9.5 8l1.5 4.5L7 10 3 12.5 4.5 8 1 5.5h4.5z" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
          </svg>
          Decision process
        </div>

        {/* Branch question */}
        <div>
          <div className="alg-branch-question">
            <div className="alg-branch-icon">?</div>
            <div>
              <div className="alg-branch-text">Any objections or opposition?</div>
              <div className="alg-branch-sub">After 25 working days, the DLC decides how to proceed</div>
            </div>
          </div>
          <div className="alg-branch-paths">
            <div className="alg-branch-path alg-no-obj">
              <div className="alg-branch-path-header">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7l4 4 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                No objections
              </div>
              <div className="alg-branch-path-body">
                <strong>10a — DLC Chair decides on the papers</strong>
                No public hearing needed. The Chair reviews the reports and decides in writing. This is typically faster.
              </div>
            </div>
            <div className="alg-branch-path alg-with-obj">
              <div className="alg-branch-path-header">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 3v4M7 9v1" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Objections filed
              </div>
              <div className="alg-branch-path-body">
                <strong>10b — Public hearing held</strong>
                The District Licensing Committee sits as a panel of 3. You (and objectors) present your case. Decisions are made after the hearing.
              </div>
            </div>
          </div>
        </div>

        {/* Connector to outcome */}
        <div className="alg-section-connector" style={{ margin: '16px 0' }}>
          <div className="alg-connector-line" style={{ background: 'linear-gradient(to bottom, #B5C2CB, #0077C8)' }} />
        </div>

        <div className="alg-phase-label alg-phase-outcome">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7.5l3.5 3.5 6.5-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Outcome
        </div>

        {/* Step 11: Decision issued */}
        <StepCard
          step={{
            id: 'D11',
            num: 11,
            title: 'Decision issued',
            subtitle: 'Granted, declined, or granted with conditions',
            tag: 'Decision',
            content: (
              <>
                <p>The DLC issues its written decision. There are three possible outcomes:</p>
                <ul>
                  <li><strong>Granted</strong> — your licence is issued as applied for</li>
                  <li><strong>Granted with conditions</strong> — your licence is issued with changes (e.g. reduced hours, additional requirements)</li>
                  <li><strong>Declined</strong> — the application does not meet the criteria under the Sale and Supply of Alcohol Act 2012</li>
                </ul>
                <p>If declined, you may appeal to the Alcohol Regulatory and Licensing Authority (ARLA).</p>
              </>
            ),
          }}
          activeId={activeId}
          onToggle={toggleStep}
          doneIds={new Set()}
          onMarkDone={() => {}}
        />

        {/* Outcome banner */}
        <div className="alg-outcome-banner">
          <div className="alg-outcome-icon">🎉</div>
          <div className="alg-outcome-text">
            <h2>Licence in hand — trade safely</h2>
            <p>Your first licence is valid for 1 year. After that, renew every 3 years — file at least 20 working days before expiry. Keep your host responsibility policy current. Your Manager's Certificate must stay in date.</p>
            <div className="alg-outcome-pills">
              <span className="alg-outcome-pill">Renews every 3 years</span>
              <span className="alg-outcome-pill">Manager's cert must be current</span>
              <span className="alg-outcome-pill">File 20 days before expiry</span>
            </div>
          </div>
        </div>

        {/* Help card */}
        <div className="alg-help-card">
          <div className="alg-help-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" fill="currentColor"/>
            </svg>
          </div>
          <div>
            <h3>Need help? Talk to NCC early</h3>
            <p>The licensing team is happy to answer questions before you apply. A pre-application conversation can save significant time and cost.</p>
            <div className="alg-help-contacts">
              <div className="alg-help-contact">
                <svg className="alg-contact-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13.5 10.5l-2-2a1 1 0 00-1.4 0l-.8.8a8.1 8.1 0 01-3.6-3.6l.8-.8a1 1 0 000-1.4L4.5 1A1 1 0 003 1l-.9.9C1.4 2.6 1.2 3.6 1.6 4.6A13 13 0 0011.4 14.4c1 .4 2 .2 2.7-.5l.9-.9a1 1 0 000-1.5z" fill="currentColor"/>
                </svg>
                <a href="tel:035460200">03 546 0200</a>
              </div>
              <div className="alg-help-contact">
                <svg className="alg-contact-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 3h12a1 1 0 011 1v8a1 1 0 01-1 1H2a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                  <path d="M1 4l7 5 7-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                <a href="mailto:regulatory@ncc.govt.nz">regulatory@ncc.govt.nz</a>
              </div>
              <div className="alg-help-contact">
                <svg className="alg-contact-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1.5a5 5 0 100 10A5 5 0 008 1.5zM8 9V8M8 6v-.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
                110 Trafalgar Street, Whakatū Nelson
              </div>
            </div>
          </div>
        </div>

        <div className="alg-footer">
          Indicative timings only — actual time depends on application complexity, completeness, and any hearings.<br />
          Working days exclude 20 December – 15 January and mondayised public holidays.<br />
          <strong>Nelson City Council</strong> · ncc.govt.nz
        </div>
      </main>
    </div>
  )
}
