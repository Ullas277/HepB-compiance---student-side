import {
  HEPB_FLOW5_NEGATIVE_ALERT,
  HEPB_FLOW5_REVAC_DOSE_DATES,
  HEPB_REVACCINATION_OPTIONS,
  type HepBFlow5RevaccinationChoice,
} from './hepbConstants';
import { Fragment } from 'react';
import {
  IconAdultImmunization,
  IconInfo,
  IconRadioChecked,
  IconRadioUnchecked,
  IconSyringe,
  IconTiter,
} from './HepbIcons';
import { StatusPill } from '../StatusPill';
import type { ComplianceStatus } from '../../data/complianceRows';

type UploadDraft = {
  doseDate: string;
  notes: string;
};

type HepBFlow5NegativeRecordsProps = {
  savedUpload: UploadDraft;
  screen: 'sc1' | 'sc2';
  selectedRevaccination?: HepBFlow5RevaccinationChoice | null;
  onRevaccinationSelect?: (choice: HepBFlow5RevaccinationChoice) => void;
  revaccOutcomeOnSc2?: ComplianceStatus;
};

function Flow5NegativeAlert() {
  return (
    <div className="hepb-alert hepb-alert--danger" role="alert">
      <span className="hepb-alert__icon" aria-hidden>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      </span>
      <p className="hepb-alert__text">{HEPB_FLOW5_NEGATIVE_ALERT}</p>
    </div>
  );
}

function Flow5TiterRecord({
  savedUpload,
  includeNegativeAlert = false,
}: {
  savedUpload: UploadDraft;
  includeNegativeAlert?: boolean;
}) {
  return (
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
        <span className="hepb-result-chip hepb-result-chip--negative">Negative</span>
      </div>
      <hr className="hepb-record-detail__rule" />
      {includeNegativeAlert ? <Flow5NegativeAlert /> : null}
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
    </article>
  );
}

export function HepBFlow5NegativeRecords({
  savedUpload,
  screen,
  selectedRevaccination = null,
  onRevaccinationSelect,
  revaccOutcomeOnSc2 = 'Approved',
}: HepBFlow5NegativeRecordsProps) {
  if (screen === 'sc2') {
    return (
      <div className="hepb-step hepb-step--records hepb-step--flow5-sc2">
        <div className="hepb-step__section-head hepb-step__section-head--records">
          <p className="hepb-step__section-title">Re-vaccination</p>
          <p className="hepb-drawer__uploaded">Uploaded on: 09/01/2024</p>
        </div>
        <article className="hepb-record-detail hepb-record-detail--revacc">
          <div className="hepb-record-detail__head">
            <span className="hepb-record-detail__icon">
              <IconSyringe />
            </span>
            <span className="hepb-record-detail__text">
              <span className="hepb-record-detail__title">
                3 dose series
                <IconInfo />
              </span>
              <span className="hepb-record-detail__subtitle">3 doses | 3 documents uploaded</span>
            </span>
            <StatusPill status={revaccOutcomeOnSc2} />
          </div>
          <hr className="hepb-record-detail__rule" />
          <div className="hepb-record-detail__fields hepb-record-detail__fields--dose-grid">
            <div className="hepb-field-readonly">
              <span className="hepb-field-readonly__label">Dose 1 Date</span>
              <span className="hepb-field-readonly__value">{HEPB_FLOW5_REVAC_DOSE_DATES.dose1}</span>
            </div>
            <div className="hepb-field-readonly">
              <span className="hepb-field-readonly__label">Dose 2 Date</span>
              <span className="hepb-field-readonly__value">{HEPB_FLOW5_REVAC_DOSE_DATES.dose2}</span>
            </div>
            <div className="hepb-field-readonly">
              <span className="hepb-field-readonly__label">Dose 3 Date</span>
              <span className="hepb-field-readonly__value">{HEPB_FLOW5_REVAC_DOSE_DATES.dose3}</span>
            </div>
          </div>
          <div className="hepb-field-readonly hepb-record-detail__notes">
            <span className="hepb-field-readonly__label">Notes</span>
            <span className="hepb-field-readonly__value">{savedUpload.notes}</span>
          </div>
          <button type="button" className="hepb-link hepb-link--block">
            View Documents (New tab)
          </button>
        </article>

        <div className="hepb-step__section-head hepb-step__section-head--records">
          <p className="hepb-step__section-title">Vaccination records</p>
          <p className="hepb-drawer__uploaded">Uploaded on: 09/01/2024</p>
        </div>
        <Flow5TiterRecord savedUpload={savedUpload} includeNegativeAlert />
      </div>
    );
  }

  return (
    <div className="hepb-step hepb-step--records hepb-step--flow5-sc1">
      <Flow5NegativeAlert />

      <p className="hepb-step__section-title hepb-revaccination__title">Re-vaccination</p>
      <div className="hepb-revaccination-row">
        {HEPB_REVACCINATION_OPTIONS.map((option, index) => {
          const selected = selectedRevaccination === option.id;
          return (
          <Fragment key={option.id}>
            {index > 0 ? (
              <p className="hepb-or-block__label hepb-revaccination-row__or">Or</p>
            ) : null}
            <button
              type="button"
              className={`hepb-record-card${selected ? ' hepb-record-card--selected' : ''}`}
              onClick={() => onRevaccinationSelect?.(option.id)}
            >
              <span className="hepb-record-card__radio" aria-hidden>
                {selected ? <IconRadioChecked /> : <IconRadioUnchecked />}
              </span>
              <span className="hepb-record-card__icon">
                <IconAdultImmunization />
              </span>
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
          </Fragment>
          );
        })}
      </div>

      <div className="hepb-step__section-head hepb-step__section-head--records">
        <p className="hepb-step__section-title">Vaccination records</p>
        <p className="hepb-drawer__uploaded">Uploaded on: 09/01/2024</p>
      </div>
      <Flow5TiterRecord savedUpload={savedUpload} />
    </div>
  );
}
