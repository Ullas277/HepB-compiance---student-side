import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const HEPB_DRAWER_TRANSITION_MS = 320;
import {
  DOCUMENT_ROWS,
  HEPB_ADMIN_COMMENT_APPROVED,
  HEPB_ADMIN_COMMENT_LOW_EQUIVOCAL,
  HEPB_GUIDELINES,
  HEPB_LOW_EQUIVOCAL_ALERT,
  HEPB_STUDENT,
  RECORD_OPTIONS,
  type RecordChoice,
} from './hepbConstants';
import type { ComplianceStatus } from '../../data/complianceRows';
import {
  IconAdultImmunization,
  IconCalendar,
  IconChevronUp,
  IconChildImmunization,
  IconClose,
  IconCloudUpload,
  IconInfo,
  IconPen,
  IconPlus,
  IconRadioChecked,
  IconRadioUnchecked,
  IconThumbsDown,
  IconTiter,
} from './HepbIcons';
import {
  flow5RevaccApprovedOnSc2,
  isFlow5NegativeDrawerScenario,
  type HepBDrawerScenarioId,
} from '../PrototypeControls';
import { StatusPill } from '../StatusPill';
import { HepBFlow5NegativeRecords } from './HepBFlow5NegativeRecords';
import type { HepBFlow5RevaccinationChoice } from './hepbConstants';

type HepbStep = 'select-record' | 'documents' | 'records';

type HepatitisBDrawerProps = {
  onClose: () => void;
  scenario?: HepBDrawerScenarioId;
};

type UploadDraft = {
  doseDate: string;
  notes: string;
};

function initialFromScenario(_scenario: HepBDrawerScenarioId | undefined) {
  return {
    step: 'select-record' as HepbStep,
    selectedRecord: null as RecordChoice | null,
    savedUpload: null as UploadDraft | null,
    headerStatus: 'Get Started' as const,
    titerResult: null as 'Positive' | 'Negative' | null,
  };
}

export function HepatitisBDrawer({ onClose, scenario }: HepatitisBDrawerProps) {
  const initial = initialFromScenario(scenario);
  const [panelOpen, setPanelOpen] = useState(false);
  const [step, setStep] = useState<HepbStep>(initial.step);
  const [selectedRecord, setSelectedRecord] = useState<RecordChoice | null>(initial.selectedRecord);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadSlideOpen, setUploadSlideOpen] = useState(false);
  const [uploadDraft, setUploadDraft] = useState<UploadDraft>({ doseDate: '', notes: '' });
  const [savedUpload, setSavedUpload] = useState<UploadDraft | null>(initial.savedUpload);
  const [headerStatus, setHeaderStatus] = useState<ComplianceStatus>(initial.headerStatus);
  const [titerResult, setTiterResult] = useState<'Positive' | 'Negative' | null>(initial.titerResult);
  const [flow5Screen, setFlow5Screen] = useState<'sc1' | 'sc2'>('sc1');
  const [selectedRevaccination, setSelectedRevaccination] = useState<HepBFlow5RevaccinationChoice | null>(
    null,
  );

  const isPendingReview = headerStatus === 'Pending Review';
  const isFlow5NegativeFlow =
    isFlow5NegativeDrawerScenario(scenario) && titerResult === 'Negative' && savedUpload != null;
  const drawerHeaderStatus: ComplianceStatus = isFlow5NegativeFlow
    ? flow5Screen === 'sc2'
      ? flow5RevaccApprovedOnSc2(scenario)
        ? 'Approved'
        : 'Disapproved'
      : 'Disapproved'
    : headerStatus;
  const isLowEquivocalOutcome = headerStatus === 'Not Approved';
  const adminComment = isLowEquivocalOutcome
    ? HEPB_ADMIN_COMMENT_LOW_EQUIVOCAL
    : HEPB_ADMIN_COMMENT_APPROVED;

  useEffect(() => {
    const next = initialFromScenario(scenario);
    setStep(next.step);
    setSelectedRecord(next.selectedRecord);
    setSavedUpload(next.savedUpload);
    setHeaderStatus(next.headerStatus);
    setTiterResult(next.titerResult);
    setFlow5Screen('sc1');
    setSelectedRevaccination(null);
    setUploadOpen(false);
    setUploadSlideOpen(false);
  }, [scenario]);

  useEffect(() => {
    document.body.classList.add('hepb-drawer-body-lock');
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setPanelOpen(true));
    });
    return () => {
      cancelAnimationFrame(frame);
      document.body.classList.remove('hepb-drawer-body-lock');
    };
  }, []);

  useEffect(() => {
    if (!uploadOpen) {
      setUploadSlideOpen(false);
      return;
    }
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setUploadSlideOpen(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [uploadOpen]);

  function transitionMs() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : HEPB_DRAWER_TRANSITION_MS;
  }

  function closeUpload(afterClose?: () => void) {
    setUploadSlideOpen(false);
    window.setTimeout(() => {
      setUploadOpen(false);
      afterClose?.();
    }, transitionMs());
  }

  function openUpload() {
    setUploadOpen(true);
  }

  function handleDismiss() {
    setPanelOpen(false);
    document.body.classList.remove('hepb-drawer-body-lock');
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 0
      : HEPB_DRAWER_TRANSITION_MS;
    window.setTimeout(onClose, duration);
  }

  function handleChromeClose() {
    if (uploadOpen) {
      closeUpload();
      return;
    }
    handleDismiss();
  }

  function handleContinue() {
    if (!selectedRecord) return;
    if (selectedRecord === 'titer') {
      openUpload();
      return;
    }
    setStep('documents');
  }

  function handleFlow5Continue() {
    if (!selectedRevaccination) return;
    if (selectedRevaccination === 'series-3') {
      setFlow5Screen('sc2');
      setHeaderStatus(flow5RevaccApprovedOnSc2(scenario) ? 'Approved' : 'Disapproved');
    }
  }

  function handleSelectRecord(id: RecordChoice) {
    setSelectedRecord(id);
    if (uploadOpen) closeUpload();
  }

  function handleSaveUpload() {
    setUploadSlideOpen(false);
    setUploadOpen(false);
    setSavedUpload({
      doseDate: uploadDraft.doseDate || '07/08/2025',
      notes: uploadDraft.notes || 'This is a test note.',
    });
    setStep('records');
    setSelectedRecord('titer');
    if (scenario === 'titer-approved') {
      setHeaderStatus('Approved');
      setTiterResult('Positive');
      return;
    }
    if (scenario === 'titer-low-equivocal') {
      setHeaderStatus('Not Approved');
      setTiterResult(null);
      return;
    }
    if (isFlow5NegativeDrawerScenario(scenario)) {
      setHeaderStatus('Disapproved');
      setTiterResult('Negative');
      setFlow5Screen('sc1');
      setSelectedRevaccination(null);
      return;
    }
    setHeaderStatus('Pending Review');
    setTiterResult(null);
  }

  function renderRecordIcon(id: RecordChoice) {
    switch (id) {
      case 'adult':
        return <IconAdultImmunization />;
      case 'childhood':
        return <IconChildImmunization />;
      case 'titer':
        return <IconTiter />;
    }
  }

  return createPortal(
    <div
      className={`hepb-drawer-root${panelOpen ? ' hepb-drawer-root--open' : ''}`}
      role="presentation"
    >
      <button
        type="button"
        className="hepb-drawer-root__backdrop"
        aria-label="Close Hepatitis B drawer"
        onClick={handleDismiss}
      />
      <div className="hepb-drawer" role="dialog" aria-modal="true" aria-labelledby="hepb-drawer-title">
        <header className="hepb-drawer__chrome">
          <button
            type="button"
            className="hepb-drawer__close"
            aria-label={uploadOpen ? 'Close titer upload panel' : 'Close Hepatitis B drawer'}
            onClick={handleChromeClose}
          >
            <IconClose />
          </button>
          <h2 id="hepb-drawer-title" className="hepb-drawer__chrome-title">
            Hepatitis B (HepB)
          </h2>
          {uploadOpen ? (
            <button type="button" className="hepb-btn hepb-btn--primary hepb-drawer__chrome-save" onClick={handleSaveUpload}>
              Submit for review
            </button>
          ) : isFlow5NegativeFlow && flow5Screen === 'sc1' ? (
            <button
              type="button"
              className="hepb-btn hepb-btn--primary hepb-drawer__chrome-save"
              disabled={!selectedRevaccination}
              onClick={handleFlow5Continue}
            >
              Continue
            </button>
          ) : null}
        </header>

        <div className="hepb-drawer__layout">
          <div className="hepb-drawer__main">
            <div className="hepb-drawer__subheader">
              <div className="hepb-drawer__student">
                <p className="hepb-drawer__req-title">Hepatitis B (HepB)</p>
                <p className="hepb-drawer__student-line">
                  {HEPB_STUDENT.name}{' '}
                  <span className="hepb-drawer__student-email">({HEPB_STUDENT.email})</span>
                </p>
              </div>
              <div className="hepb-drawer__meta">
                <StatusPill status={drawerHeaderStatus} />
                <p
                  className={`hepb-drawer__due${drawerHeaderStatus === 'Approved' ? ' hepb-drawer__due--approved' : ''}`}
                >
                  Due on 09/01/2024
                  <button type="button" className="hepb-drawer__due-edit" aria-label="Edit due date">
                    <IconPen />
                  </button>
                </p>
              </div>
            </div>

            <div className="hepb-drawer__content">
              {savedUpload && isFlow5NegativeFlow ? (
                <HepBFlow5NegativeRecords
                  savedUpload={savedUpload}
                  screen={flow5Screen}
                  selectedRevaccination={selectedRevaccination}
                  onRevaccinationSelect={setSelectedRevaccination}
                  revaccOutcomeOnSc2={
                    flow5RevaccApprovedOnSc2(scenario) ? 'Approved' : 'Disapproved'
                  }
                />
              ) : null}
              {savedUpload && !isFlow5NegativeFlow ? (
                <div
                  className={`hepb-step hepb-step--records${isPendingReview ? ' hepb-step--records-pending' : ''}`}
                >
                  {isLowEquivocalOutcome ? (
                    <div className="hepb-alert hepb-alert--danger" role="alert">
                      <span className="hepb-alert__icon" aria-hidden>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 8v4M12 16h.01" />
                        </svg>
                      </span>
                      <p className="hepb-alert__text">{HEPB_LOW_EQUIVOCAL_ALERT}</p>
                    </div>
                  ) : null}
                  <div className="hepb-step__section-head">
                    <p className="hepb-step__section-title">Vaccination records</p>
                    <p className="hepb-drawer__uploaded">Uploaded on: 09/01/2024</p>
                  </div>
                  <article className="hepb-record-detail">
                    <div className="hepb-record-detail__head">
                      <span className="hepb-record-detail__icon">
                        <IconTiter />
                      </span>
                      <span className="hepb-record-detail__text">
                        <span className="hepb-record-detail__title">
                          Titer lab report
                          <IconInfo />
                        </span>
                        <span className="hepb-record-detail__subtitle">1 document uploaded</span>
                      </span>
                      {isPendingReview ? (
                        <StatusPill status="Pending Review" />
                      ) : isLowEquivocalOutcome ? (
                        <StatusPill status="Not Approved" />
                      ) : titerResult ? (
                        <span
                          className={`hepb-result-chip${titerResult === 'Negative' ? ' hepb-result-chip--negative' : ''}`}
                        >
                          {titerResult}
                        </span>
                      ) : null}
                    </div>
                    <hr className="hepb-record-detail__rule" />
                    <div className="hepb-record-detail__fields">
                      <div className="hepb-field-readonly">
                        <span className="hepb-field-readonly__label">Titer dose date</span>
                        <span className="hepb-field-readonly__value">{savedUpload.doseDate}</span>
                      </div>
                      <div className="hepb-field-readonly">
                        <span className="hepb-field-readonly__label">Notes</span>
                        <span className="hepb-field-readonly__value">{savedUpload.notes}</span>
                      </div>
                    </div>
                    <button type="button" className="hepb-link hepb-link--block">
                      View Document (New tab)
                    </button>
                    {!isPendingReview && !isFlow5NegativeFlow ? (
                      <>
                        <hr className="hepb-record-detail__rule hepb-record-detail__rule--after-link" />
                        <div className="hepb-record-detail__admin-comments">
                          <span className="hepb-field-readonly__label">Comments by admin</span>
                          <p className="hepb-record-detail__comment">{adminComment}</p>
                        </div>
                      </>
                    ) : null}
                  </article>
                </div>
              ) : null}

              {!savedUpload && step === 'select-record' ? (
                <div className="hepb-step hepb-step--select">
                  <img
                    className="hepb-step__illustration"
                    src="/assets/hepb/upload-illustration.svg"
                    alt=""
                    width={168}
                    height={228}
                  />
                  <div className="hepb-step__intro">
                    <p className="hepb-step__heading">Please select a vaccination record that you want to submit.</p>
                    <p className="hepb-step__note">
                      <strong>Note</strong>: You can only upload any one of these 3 records.
                    </p>
                  </div>
                  <div className="hepb-record-cards">
                    {RECORD_OPTIONS.map((option) => {
                      const selected = selectedRecord === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          className={`hepb-record-card${selected ? ' hepb-record-card--selected' : ''}`}
                          onClick={() => handleSelectRecord(option.id)}
                        >
                          <span className="hepb-record-card__radio" aria-hidden>
                            {selected ? <IconRadioChecked /> : <IconRadioUnchecked />}
                          </span>
                          <span className="hepb-record-card__icon">{renderRecordIcon(option.id)}</span>
                          <span className="hepb-record-card__text">
                            <span className="hepb-record-card__title">
                              {option.title}
                              <IconInfo />
                            </span>
                            <span className="hepb-record-card__meta">
                              {option.metaLines.map((line) => (
                                <span key={line} className="hepb-record-card__meta-line">
                                  {line}
                                </span>
                              ))}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    className="hepb-btn hepb-btn--primary"
                    disabled={!selectedRecord}
                    onClick={handleContinue}
                  >
                    Continue
                  </button>
                  <div className="hepb-or-block">
                    <span className="hepb-or-block__label">OR</span>
                    <p className="hepb-or-block__text">
                      You can choose to upload a <button type="button" className="hepb-link">Declination form</button>
                    </p>
                  </div>
                </div>
              ) : null}

              {!savedUpload && step === 'documents' ? (
                <div className="hepb-step hepb-step--documents">
                  <p className="hepb-step__section-title">Which vaccination documents do you want to submit?</p>
                  <div className="hepb-doc-list">
                    {DOCUMENT_ROWS.map((row) => (
                      <div key={row.id} className="hepb-doc-row">
                        <span className="hepb-doc-row__icon">{renderRecordIcon(row.id)}</span>
                        <span className="hepb-doc-row__text">
                          <span className="hepb-doc-row__title">
                            {row.title}
                            <IconInfo />
                          </span>
                          <span className="hepb-doc-row__subtitle">{row.subtitle}</span>
                        </span>
                        <button
                          type="button"
                          className="hepb-doc-row__add"
                          aria-label={`Add ${row.title}`}
                          onClick={() => {
                            if (row.id === 'titer') openUpload();
                          }}
                        >
                          <IconPlus />
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="hepb-or-block__label hepb-or-block__label--center">OR</p>
                  <p className="hepb-step__section-title">Would you like to decline submitting a vaccination report?</p>
                  <div className="hepb-doc-row hepb-doc-row--single">
                    <span className="hepb-doc-row__icon">
                      <IconThumbsDown />
                    </span>
                    <span className="hepb-doc-row__text">
                      <span className="hepb-doc-row__title">Declination form</span>
                    </span>
                    <button type="button" className="hepb-doc-row__add" aria-label="Add declination form">
                      <IconPlus />
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            {uploadOpen ? (
              <div className={`hepb-upload-layer${uploadSlideOpen ? ' hepb-upload-layer--open' : ''}`}>
                <div className="hepb-upload-slide" role="dialog" aria-labelledby="hepb-upload-title">
                  <div className="hepb-upload-card">
                    <button
                      type="button"
                      className="hepb-upload-card__header"
                      id="hepb-upload-title"
                      aria-label="Close titer lab record"
                      onClick={() => closeUpload()}
                    >
                      <span>Titer lab record</span>
                      <IconChevronUp />
                    </button>
                    <div className="hepb-upload-card__body">
                      <label className="hepb-field">
                        <span className="hepb-field__label">Titer Dose date *</span>
                        <span className="hepb-field__control hepb-field__control--date">
                          <input
                            type="text"
                            placeholder="MM/DD/YYYY"
                            value={uploadDraft.doseDate}
                            onChange={(e) => setUploadDraft((d) => ({ ...d, doseDate: e.target.value }))}
                          />
                          <IconCalendar />
                        </span>
                      </label>
                      <label className="hepb-field">
                        <span className="hepb-field__label">Notes</span>
                        <div className="hepb-rte">
                          <div className="hepb-rte__toolbar" aria-hidden>
                            <span>Paragraph</span>
                            <span>B</span>
                            <span>I</span>
                            <span>U</span>
                            <span>•</span>
                            <span>1.</span>
                          </div>
                          <textarea
                            className="hepb-rte__area"
                            rows={6}
                            value={uploadDraft.notes}
                            onChange={(e) => setUploadDraft((d) => ({ ...d, notes: e.target.value }))}
                          />
                          <span className="hepb-rte__count">2000 characters left</span>
                        </div>
                      </label>
                      <div className="hepb-upload-drop">
                        <IconCloudUpload />
                        <span>Upload Files</span>
                        <p className="hepb-upload-drop__hint">
                          Supported formats: .pdf, .doc, .docx, .jpg, .jpeg, .png, .gif, .bmp, .tiff, .heic (Max file
                          size: 25 MB). For best viewing experience, upload documents in PDF format.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <aside className="hepb-drawer__guidelines" aria-label="Guidelines for students">
            <h3 className="hepb-drawer__guidelines-title">Guidelines For Students</h3>
            <ul>
              {HEPB_GUIDELINES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </div>,
    document.body,
  );
}
