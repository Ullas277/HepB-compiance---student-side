/** Hepatitis B drawer for static preview (preview.html). */
(function () {
  const ICON_CLOSE =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>';
  const ICON_CHEVRON_UP =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 15l-6-6-6 6"/></svg>';

  const RECORD_ICON_SRC = {
    adult: 'assets/hepb/adult-immunization.svg',
    childhood: 'assets/hepb/childhood-immunization.svg',
    titer: 'assets/hepb/titer.svg',
  };

  function recordIconHtml(id) {
    const src = RECORD_ICON_SRC[id];
    if (!src) return '';
    return `<span class="hepb-record-card__icon"><img src="${src}" alt="" width="32" height="32" /></span>`;
  }

  function radioHtml(checked) {
    const svg = checked
      ? '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.75"/><circle cx="12" cy="12" r="5.5" fill="currentColor"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><circle cx="12" cy="12" r="10"/></svg>';
    return `<span class="hepb-record-card__radio" aria-hidden="true">${svg}</span>`;
  }

  const HEPB_LOW_EQUIVOCAL_ALERT =
    'Your Titer lab report results have returned as Low/ Equivocal. Please contact your school admin to reset the HepB compliance process.';
  const HEPB_ADMIN_COMMENT_APPROVED = 'This is a test comment from the admin.';
  const HEPB_ADMIN_COMMENT_LOW_EQUIVOCAL =
    'This record is not approved because the titer lab report returned low/equivocal results.';
  const HEPB_FLOW5_NEGATIVE_ALERT =
    'Your Titer lab report results have returned as Negative. Hence your vaccination report has been disapproved. You can opt for re-vaccination or ask you school admin to reset the HepB compliance process.';
  const HEPB_REVACCINATION_OPTIONS = [
    { id: 'series-3', title: '3 dose series', meta: ['3 doses', '3 documents needed'] },
    { id: 'booster', title: 'Booster dose', meta: ['1 dose', '1 document needed'] },
  ];
  const HEPB_FLOW5_REVAC_DOSE_DATES = {
    dose1: '07/08/2025',
    dose2: '11/10/2025',
    dose3: '11/10/2025',
  };
  const ICON_SYRINGE =
    '<svg viewBox="0 0 28 28" fill="none" aria-hidden="true"><path d="M8 20.5L18.5 10M18.5 10L21 7.5M18.5 10L16 12.5M6.5 22L8 20.5M21 7.5L23.5 5M21 7.5L18.5 10" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 23L7 21" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>';

  const GUIDELINES = [
    '3 dose series OR 2 Heplisav-B vaccinations required OR a Positive Surface Antibody titer lab report',
    'If titer is negative/low/equivocal, must repeat 3 dose or 2 dose Heplisav-B series',
    'Repeat TITER is required',
    'If your repeat titer is negative, please submit a non-convertor',
    'Declinations are not accepted',
  ];

  const state = {
    open: false,
    drawerPanelOpen: false,
    step: 'select-record',
    selected: null,
    uploadOpen: false,
    uploadPanelOpen: false,
    draft: { doseDate: '', notes: '' },
    saved: null,
    headerStatus: 'Get Started',
    titerResult: null,
    lowEquivocalAlert: false,
    negativeAlert: false,
    adminComment: HEPB_ADMIN_COMMENT_APPROVED,
    previewFlowId: null,
    scenarioId: null,
    flow5Screen: 'sc1',
    selectedRevacc: null,
  };

  let rootEl = null;
  const DRAWER_TRANSITION_MS = 320;

  function isFlow5NegativePreviewFlow() {
    return (
      state.negativeAlert &&
      (state.previewFlowId === 'titer-negative' || state.previewFlowId === 'titer-negative-disapproved')
    );
  }

  function flow5RevaccApprovedOnSc2() {
    return state.previewFlowId !== 'titer-negative-disapproved';
  }

  function displayHeaderStatus() {
    if (isFlow5NegativePreviewFlow()) {
      if (state.flow5Screen === 'sc2') {
        return flow5RevaccApprovedOnSc2() ? 'Approved' : 'Disapproved';
      }
      return 'Disapproved';
    }
    return state.headerStatus;
  }

  function statusClass(status) {
    const map = {
      'Get Started': 'status-pill--get-started',
      'In Progress': 'status-pill--in-progress',
      'Pending Review': 'status-pill--pending-review',
      Approved: 'status-pill--approved',
      'Not Approved': 'status-pill--not-approved',
      Disapproved: 'status-pill--disapproved',
    };
    return map[status] || 'status-pill--get-started';
  }

  function renderSelectStep() {
    const cards = [
      {
        id: 'adult',
        title: 'Adult immunisation record',
        meta: ['3 doses', '3 documents needed'],
      },
      {
        id: 'childhood',
        title: 'Childhood immunisation record',
        meta: ['3 doses', '3 documents needed'],
      },
      { id: 'titer', title: 'Titer lab report', meta: ['1 dose', '1 document needed'] },
    ]
      .map(
        (c) => `
      <button type="button" class="hepb-record-card${state.selected === c.id ? ' hepb-record-card--selected' : ''}" data-select="${c.id}">
        ${radioHtml(state.selected === c.id)}
        ${recordIconHtml(c.id)}
        <span class="hepb-record-card__text">
          <span class="hepb-record-card__title">${c.title}</span>
          <span class="hepb-record-card__meta">${c.meta.map((line) => `<span class="hepb-record-card__meta-line">${line}</span>`).join('')}</span>
        </span>
      </button>`,
      )
      .join('');

    return `
      <div class="hepb-step hepb-step--select">
        <img class="hepb-step__illustration" src="assets/hepb/upload-illustration.svg" alt="" width="168" height="228" />
        <div class="hepb-step__intro">
          <p class="hepb-step__heading">Please select a vaccination record that you want to submit.</p>
          <p class="hepb-step__note"><strong>Note</strong>: You can only upload any one of these 3 records.</p>
        </div>
        <div class="hepb-record-cards">${cards}</div>
        <button type="button" class="hepb-btn hepb-btn--primary" data-action="continue" ${state.selected ? '' : 'disabled'}>Continue</button>
        <div class="hepb-or-block">
          <span class="hepb-or-block__label">OR</span>
          <p class="hepb-or-block__text">You can choose to upload a <button type="button" class="hepb-link">Declination form</button></p>
        </div>
      </div>`;
  }

  function renderDocumentsStep() {
    const rows = [
      { id: 'titer', title: 'Titer lab report', sub: '1 dose | 1 document needed', openUpload: true },
      { id: 'adult', title: 'Adult immunization record', sub: '3 doses | 3 documents needed' },
      { id: 'childhood', title: 'Childhood immunization record', sub: '3 doses | 3 documents needed' },
    ]
      .map(
        (r) => `
      <div class="hepb-doc-row">
        <span class="hepb-doc-row__icon"><img src="${RECORD_ICON_SRC[r.id]}" alt="" width="28" height="28" /></span>
        <span class="hepb-doc-row__text">
          <span class="hepb-doc-row__title">${r.title}</span>
          <span class="hepb-doc-row__subtitle">${r.sub}</span>
        </span>
        <button type="button" class="hepb-doc-row__add" aria-label="Add ${r.title}" ${r.openUpload ? 'data-action="open-upload"' : ''}>+</button>
      </div>`,
      )
      .join('');

    return `
      <div class="hepb-step hepb-step--documents">
        <p class="hepb-step__section-title">Which vaccination documents do you want to submit?</p>
        <div class="hepb-doc-list">${rows}</div>
      </div>`;
  }

  function renderFlow5Sc1RecordsStep() {
    if (!state.saved) return '';
    const revaccinationCards = HEPB_REVACCINATION_OPTIONS.map((option, index) => {
      const orLabel =
        index > 0 ? `<p class="hepb-or-block__label hepb-revaccination-row__or">Or</p>` : '';
      const selected = state.selectedRevacc === option.id;
      const metaHtml = option.meta
        .map((line) => `<span class="hepb-record-card__meta-line">${line}</span>`)
        .join('');
      return `${orLabel}
      <button type="button" class="hepb-record-card${selected ? ' hepb-record-card--selected' : ''}" data-revacc="${option.id}">
        ${radioHtml(selected)}
        ${recordIconHtml('adult')}
        <span class="hepb-record-card__text">
          <span class="hepb-record-card__title">${option.title}</span>
          <span class="hepb-record-card__meta">${metaHtml}</span>
        </span>
      </button>`;
    }).join('');

    return `
      <div class="hepb-step hepb-step--records hepb-step--flow5-sc1">
        ${renderFlow5NegativeAlertHtml()}
        <p class="hepb-step__section-title hepb-revaccination__title">Re-vaccination</p>
        <div class="hepb-revaccination-row">${revaccinationCards}</div>
        <div class="hepb-step__section-head hepb-step__section-head--records">
          <p class="hepb-step__section-title">Vaccination records</p>
          <p class="hepb-drawer__uploaded">Uploaded on: 09/01/2024</p>
        </div>
        ${renderFlow5TiterRecord(false)}
      </div>`;
  }

  function renderFlow5NegativeAlertHtml() {
    return `
          <div class="hepb-alert hepb-alert--danger" role="alert">
            <span class="hepb-alert__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            </span>
            <p class="hepb-alert__text">${HEPB_FLOW5_NEGATIVE_ALERT}</p>
          </div>`;
  }

  function renderFlow5TiterRecord(includeNegativeAlert) {
    const alertHtml = includeNegativeAlert ? renderFlow5NegativeAlertHtml() : '';
    return `
        <article class="hepb-record-detail">
          <div class="hepb-record-detail__head">
            <span class="hepb-record-detail__icon"><img src="${RECORD_ICON_SRC.titer}" alt="" width="28" height="28" /></span>
            <span class="hepb-record-detail__text">
              <span class="hepb-record-detail__title">Titer lab report</span>
              <span class="hepb-record-detail__subtitle">1 document uploaded</span>
            </span>
            <span class="hepb-result-chip hepb-result-chip--negative">Negative</span>
          </div>
          <hr class="hepb-record-detail__rule" />
          ${alertHtml}
          <div class="hepb-record-detail__fields">
            <div class="hepb-field-readonly">
              <span class="hepb-field-readonly__label">Titer dose date</span>
              <span class="hepb-field-readonly__value">${state.saved.doseDate}</span>
            </div>
            <div class="hepb-field-readonly">
              <span class="hepb-field-readonly__label">Notes</span>
              <span class="hepb-field-readonly__value">${state.saved.notes}</span>
            </div>
          </div>
          <button type="button" class="hepb-link hepb-link--block">View Document (New tab)</button>
        </article>`;
  }

  function renderFlow5Sc2RecordsStep() {
    const revaccApproved = flow5RevaccApprovedOnSc2();
    const revaccStatus = revaccApproved ? 'Approved' : 'Disapproved';
    const revaccClass = revaccApproved ? 'status-pill--approved' : 'status-pill--disapproved';
    return `
      <div class="hepb-step hepb-step--records hepb-step--flow5-sc2">
        <div class="hepb-step__section-head hepb-step__section-head--records">
          <p class="hepb-step__section-title">Re-vaccination</p>
          <p class="hepb-drawer__uploaded">Uploaded on: 09/01/2024</p>
        </div>
        <article class="hepb-record-detail hepb-record-detail--revacc">
          <div class="hepb-record-detail__head">
            <span class="hepb-record-detail__icon">${ICON_SYRINGE}</span>
            <span class="hepb-record-detail__text">
              <span class="hepb-record-detail__title">3 dose series</span>
              <span class="hepb-record-detail__subtitle">3 doses | 3 documents uploaded</span>
            </span>
            <span class="status-pill ${revaccClass}">${revaccStatus}</span>
          </div>
          <hr class="hepb-record-detail__rule" />
          <div class="hepb-record-detail__fields hepb-record-detail__fields--dose-grid">
            <div class="hepb-field-readonly">
              <span class="hepb-field-readonly__label">Dose 1 Date</span>
              <span class="hepb-field-readonly__value">${HEPB_FLOW5_REVAC_DOSE_DATES.dose1}</span>
            </div>
            <div class="hepb-field-readonly">
              <span class="hepb-field-readonly__label">Dose 2 Date</span>
              <span class="hepb-field-readonly__value">${HEPB_FLOW5_REVAC_DOSE_DATES.dose2}</span>
            </div>
            <div class="hepb-field-readonly">
              <span class="hepb-field-readonly__label">Dose 3 Date</span>
              <span class="hepb-field-readonly__value">${HEPB_FLOW5_REVAC_DOSE_DATES.dose3}</span>
            </div>
          </div>
          <div class="hepb-field-readonly hepb-record-detail__notes">
            <span class="hepb-field-readonly__label">Notes</span>
            <span class="hepb-field-readonly__value">${state.saved.notes}</span>
          </div>
          <button type="button" class="hepb-link hepb-link--block">View Documents (New tab)</button>
        </article>
        <div class="hepb-step__section-head hepb-step__section-head--records">
          <p class="hepb-step__section-title">Vaccination records</p>
          <p class="hepb-drawer__uploaded">Uploaded on: 09/01/2024</p>
        </div>
        ${renderFlow5TiterRecord(true)}
      </div>`;
  }

  function renderRecordsStep() {
    if (!state.saved) return '';
    if (isFlow5NegativePreviewFlow()) {
      if (state.flow5Screen === 'sc2') return renderFlow5Sc2RecordsStep();
      return renderFlow5Sc1RecordsStep();
    }
    const isPendingReview = state.headerStatus === 'Pending Review';
    const recordStatus = isPendingReview
      ? `<span class="status-pill status-pill--pending-review">Pending Review</span>`
      : state.lowEquivocalAlert
        ? `<span class="status-pill status-pill--not-approved">Not Approved</span>`
        : state.titerResult
          ? `<span class="hepb-result-chip${state.titerResult === 'Negative' ? ' hepb-result-chip--negative' : ''}">${state.titerResult}</span>`
          : '';

    return `
      <div class="hepb-step hepb-step--records${isPendingReview ? ' hepb-step--records-pending' : ''}">
        ${
          state.lowEquivocalAlert
            ? `<div class="hepb-alert hepb-alert--danger" role="alert">
          <span class="hepb-alert__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
          </span>
          <p class="hepb-alert__text">${HEPB_LOW_EQUIVOCAL_ALERT}</p>
        </div>`
            : ''
        }
        <div class="hepb-step__section-head">
          <p class="hepb-step__section-title">Vaccination records</p>
          <p class="hepb-drawer__uploaded">Uploaded on: 09/01/2024</p>
        </div>
        <article class="hepb-record-detail">
          <div class="hepb-record-detail__head">
            <span class="hepb-record-detail__icon"><img src="${RECORD_ICON_SRC.titer}" alt="" width="28" height="28" /></span>
            <span class="hepb-record-detail__text">
              <span class="hepb-record-detail__title">Titer lab report</span>
              <span class="hepb-record-detail__subtitle">1 document uploaded</span>
            </span>
            ${recordStatus}
          </div>
          <hr class="hepb-record-detail__rule" />
          <div class="hepb-record-detail__fields">
            <div class="hepb-field-readonly">
              <span class="hepb-field-readonly__label">Titer dose date</span>
              <span class="hepb-field-readonly__value">${state.saved.doseDate}</span>
            </div>
            <div class="hepb-field-readonly">
              <span class="hepb-field-readonly__label">Notes</span>
              <span class="hepb-field-readonly__value">${state.saved.notes}</span>
            </div>
          </div>
          <button type="button" class="hepb-link hepb-link--block">View Document (New tab)</button>
          ${
            isPendingReview
              ? ''
              : `<hr class="hepb-record-detail__rule hepb-record-detail__rule--after-link" />
          <div class="hepb-record-detail__admin-comments">
            <span class="hepb-field-readonly__label">Comments by admin</span>
            <p class="hepb-record-detail__comment">${state.adminComment}</p>
          </div>`
          }
        </article>
      </div>`;
  }

  function renderUploadSlide() {
    if (!state.uploadOpen) return '';
    const openClass = state.uploadPanelOpen ? ' hepb-upload-layer--open' : '';
    return `
      <div class="hepb-upload-layer${openClass}">
        <div class="hepb-upload-slide" role="dialog" aria-labelledby="hepb-upload-title">
          <div class="hepb-upload-card">
            <button type="button" class="hepb-upload-card__header" id="hepb-upload-title" data-action="close-upload" aria-label="Close titer lab record">
              <span>Titer lab record</span>
              ${ICON_CHEVRON_UP}
            </button>
            <div class="hepb-upload-card__body">
              <label class="hepb-field">
                <span class="hepb-field__label">Titer Dose date *</span>
                <span class="hepb-field__control hepb-field__control--date">
                  <input type="text" placeholder="MM/DD/YYYY" data-field="doseDate" value="${state.draft.doseDate}" />
                </span>
              </label>
              <label class="hepb-field">
                <span class="hepb-field__label">Notes</span>
                <div class="hepb-rte">
                  <div class="hepb-rte__toolbar" aria-hidden="true">
                    <span>Paragraph</span><span>B</span><span>I</span><span>U</span><span>•</span><span>1.</span>
                  </div>
                  <textarea class="hepb-rte__area" rows="6" data-field="notes">${state.draft.notes}</textarea>
                  <span class="hepb-rte__count">2000 characters left</span>
                </div>
              </label>
              <div class="hepb-upload-drop">
                <span>Upload Files</span>
                <p class="hepb-upload-drop__hint">Supported formats: .pdf, .doc, .docx, .jpg, .jpeg, .png, .gif, .bmp, .tiff, .heic (Max file size: 25 MB). For best viewing experience, upload documents in PDF format.</p>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }

  function transitionMs() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : DRAWER_TRANSITION_MS;
  }

  function animateUploadOpen() {
    if (!state.uploadOpen || state.uploadPanelOpen) return;
    const layer = rootEl?.querySelector('.hepb-upload-layer');
    if (!layer) return;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        layer.classList.add('hepb-upload-layer--open');
        state.uploadPanelOpen = true;
      });
    });
  }

  function applyFlow4RecordsState() {
    state.saved = {
      doseDate: state.draft.doseDate || '07/08/2025',
      notes: state.draft.notes || 'This is a test note.',
    };
    state.step = 'records';
    state.selected = 'titer';
    state.headerStatus = 'Not Approved';
    state.titerResult = null;
    state.lowEquivocalAlert = true;
    state.negativeAlert = false;
    state.adminComment = HEPB_ADMIN_COMMENT_LOW_EQUIVOCAL;
    state.previewFlowId = 'titer-low-equivocal';
  }

  function applyFlow5RecordsState() {
    state.saved = {
      doseDate: state.draft.doseDate || '07/08/2025',
      notes: state.draft.notes || 'This is a test note.',
    };
    state.step = 'records';
    state.selected = 'titer';
    state.headerStatus = 'Disapproved';
    state.titerResult = 'Negative';
    state.lowEquivocalAlert = false;
    state.negativeAlert = true;
    state.adminComment = '';
    state.previewFlowId =
      state.scenarioId === 'titer-negative-disapproved' ? 'titer-negative-disapproved' : 'titer-negative';
    state.flow5Screen = 'sc1';
    state.selectedRevacc = null;
  }

  function applyPendingReviewState() {
    state.saved = {
      doseDate: state.draft.doseDate || '07/08/2025',
      notes: state.draft.notes || 'This is a test note.',
    };
    state.step = 'records';
    state.selected = 'titer';
    state.headerStatus = 'Pending Review';
    state.titerResult = null;
    state.lowEquivocalAlert = false;
    state.negativeAlert = false;
    state.adminComment = '';
    state.previewFlowId = null;
  }

  function applyFlow3RecordsState() {
    state.saved = {
      doseDate: state.draft.doseDate || '07/08/2025',
      notes: state.draft.notes || 'This is a test note.',
    };
    state.step = 'records';
    state.selected = 'titer';
    state.headerStatus = 'Approved';
    state.titerResult = 'Positive';
    state.lowEquivocalAlert = false;
    state.negativeAlert = false;
    state.adminComment = HEPB_ADMIN_COMMENT_APPROVED;
    state.previewFlowId = 'titer-approved';
  }

  function commitSubmittedRecords() {
    state.uploadOpen = false;
    state.uploadPanelOpen = false;
    const applyOutcome = SCENARIO_OUTCOMES[state.scenarioId];
    if (applyOutcome) {
      applyOutcome();
      return;
    }
    applyPendingReviewState();
  }

  function closeUploadSlide(done) {
    const layer = rootEl?.querySelector('.hepb-upload-layer');
    if (layer && state.uploadPanelOpen) {
      layer.classList.remove('hepb-upload-layer--open');
      window.setTimeout(() => {
        state.uploadOpen = false;
        state.uploadPanelOpen = false;
        if (done) done();
        render();
      }, transitionMs());
      return;
    }
    state.uploadOpen = false;
    state.uploadPanelOpen = false;
    if (done) done();
    render();
  }

  function renderChromeAction() {
    if (state.uploadOpen) {
      return '<button type="button" class="hepb-btn hepb-btn--primary hepb-drawer__chrome-save" data-action="save-upload">Submit for review</button>';
    }
    const isFlow5Sc1 = state.saved && isFlow5NegativePreviewFlow() && state.flow5Screen === 'sc1';
    if (isFlow5Sc1) {
      const disabled = state.selectedRevacc ? '' : ' disabled';
      return `<button type="button" class="hepb-btn hepb-btn--primary hepb-drawer__chrome-save" data-action="flow5-continue"${disabled}>Continue</button>`;
    }
    return '';
  }

  function render() {
    if (!rootEl) return;
    if (!state.open) {
      rootEl.innerHTML = '';
      rootEl.hidden = true;
      return;
    }
    rootEl.hidden = false;

    const content = state.saved
      ? renderRecordsStep()
      : state.step === 'select-record'
        ? renderSelectStep()
        : state.step === 'documents'
          ? renderDocumentsStep()
          : renderSelectStep();

    const drawerOpenClass = state.drawerPanelOpen
      ? ' hepb-drawer-root--open hepb-drawer-root--steady'
      : '';

    rootEl.innerHTML = `
      <div class="hepb-drawer-root${drawerOpenClass}" role="presentation">
        <button type="button" class="hepb-drawer-root__backdrop" data-action="close" aria-label="Close Hepatitis B drawer"></button>
        <div class="hepb-drawer" role="dialog" aria-modal="true">
          <header class="hepb-drawer__chrome">
            <button type="button" class="hepb-drawer__close" data-action="close" aria-label="Close">${ICON_CLOSE}</button>
            <h2 class="hepb-drawer__chrome-title">Hepatitis B (HepB)</h2>
            ${renderChromeAction()}
          </header>
          <div class="hepb-drawer__layout">
            <div class="hepb-drawer__main">
              <div class="hepb-drawer__subheader">
                <div class="hepb-drawer__student">
                  <p class="hepb-drawer__req-title">Hepatitis B (HepB)</p>
                  <p class="hepb-drawer__student-line">Cain, Jenny <span class="hepb-drawer__student-email">(ExxJenny.Cain@example.com)</span></p>
                </div>
                <div class="hepb-drawer__meta">
                  <span class="status-pill ${statusClass(displayHeaderStatus())}">${displayHeaderStatus()}</span>
                  <p class="hepb-drawer__due${displayHeaderStatus() === 'Approved' ? ' hepb-drawer__due--approved' : ''}">Due on 09/01/2024</p>
                </div>
              </div>
              <div class="hepb-drawer__content">${content}</div>
              ${renderUploadSlide()}
            </div>
            <aside class="hepb-drawer__guidelines">
              <h3 class="hepb-drawer__guidelines-title">Guidelines For Students</h3>
              <ul>${GUIDELINES.map((g) => `<li>${g}</li>`).join('')}</ul>
            </aside>
          </div>
        </div>
      </div>`;

    document.body.classList.add('hepb-drawer-body-lock');
    const panel = rootEl.querySelector('.hepb-drawer-root');
    if (panel && !state.drawerPanelOpen) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          panel.classList.add('hepb-drawer-root--open');
          state.drawerPanelOpen = true;
        });
      });
    }

    rootEl.querySelectorAll('[data-action="close"]').forEach((btn) => {
      btn.addEventListener('click', handleChromeClose);
    });
    rootEl.querySelector('.hepb-drawer-root__backdrop')?.addEventListener('click', close);

    rootEl.querySelectorAll('[data-select]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.selected = btn.getAttribute('data-select');
        if (state.uploadOpen) {
          closeUploadSlide();
          return;
        }
        render();
      });
    });

    rootEl.querySelectorAll('[data-revacc]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.selectedRevacc = btn.getAttribute('data-revacc');
        render();
      });
    });

    rootEl.querySelector('[data-action="flow5-continue"]')?.addEventListener('click', () => {
      if (!state.selectedRevacc) return;
      if (state.selectedRevacc === 'series-3') {
        state.flow5Screen = 'sc2';
        state.headerStatus = flow5RevaccApprovedOnSc2() ? 'Approved' : 'Disapproved';
        render();
      }
    });

    rootEl.querySelector('[data-action="continue"]')?.addEventListener('click', () => {
      if (!state.selected) return;
      if (state.selected === 'titer') {
        state.uploadOpen = true;
        state.uploadPanelOpen = false;
        render();
        return;
      }
      state.step = 'documents';
      render();
    });

    rootEl.querySelector('[data-action="open-upload"]')?.addEventListener('click', () => {
      state.uploadOpen = true;
      state.uploadPanelOpen = false;
      render();
    });

    rootEl.querySelector('[data-action="close-upload"]')?.addEventListener('click', () => {
      closeUploadSlide();
    });

    rootEl.querySelectorAll('[data-action="save-upload"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const dose = rootEl.querySelector('[data-field="doseDate"]');
        const notes = rootEl.querySelector('[data-field="notes"]');
        state.draft.doseDate = dose?.value || '07/08/2025';
        state.draft.notes = notes?.value || 'This is a test note.';
        commitSubmittedRecords();
        render();
      });
    });

    rootEl.querySelectorAll('[data-field]').forEach((el) => {
      el.addEventListener('input', () => {
        if (el.getAttribute('data-field') === 'doseDate') state.draft.doseDate = el.value;
        if (el.getAttribute('data-field') === 'notes') state.draft.notes = el.value;
      });
    });

    animateUploadOpen();
  }

  function open() {
    const scenario = window.PrototypeControls?.resolveDrawerScenarioForOpen?.() || 'titer-get-started';
    applyScenario(scenario);
  }

  function openGetStartedFlow() {
    state.open = true;
    state.drawerPanelOpen = false;
    state.step = 'select-record';
    state.selected = null;
    state.uploadOpen = false;
    state.uploadPanelOpen = false;
    state.saved = null;
    state.headerStatus = 'Get Started';
    state.titerResult = null;
    state.lowEquivocalAlert = false;
    state.negativeAlert = false;
    state.adminComment = HEPB_ADMIN_COMMENT_APPROVED;
    state.previewFlowId = null;
    state.scenarioId = null;
    state.flow5Screen = 'sc1';
    state.selectedRevacc = null;
    state.draft = { doseDate: '', notes: '' };
    render();
  }

  /** Outcome for a scenario. The selection and form steps stay on that scenario and do not change the others. */
  const SCENARIO_OUTCOMES = {
    'titer-approved': applyFlow3RecordsState,
    'titer-low-equivocal': applyFlow4RecordsState,
    'titer-negative': applyFlow5RecordsState,
    'titer-negative-disapproved': applyFlow5RecordsState,
  };

  function openFlowAtSelection(scenarioId) {
    state.open = true;
    state.drawerPanelOpen = false;
    state.step = 'select-record';
    state.selected = null;
    state.uploadOpen = false;
    state.uploadPanelOpen = false;
    state.saved = null;
    state.headerStatus = 'Get Started';
    state.titerResult = null;
    state.lowEquivocalAlert = false;
    state.negativeAlert = false;
    state.adminComment = '';
    state.previewFlowId = scenarioId;
    state.scenarioId = scenarioId;
    state.flow5Screen = 'sc1';
    state.selectedRevacc = null;
    state.draft = { doseDate: '', notes: '' };
    render();
  }

  function applyScenario(scenarioId) {
    if (SCENARIO_OUTCOMES[scenarioId]) {
      openFlowAtSelection(scenarioId);
      return;
    }
    openGetStartedFlow();
  }

  function handleChromeClose() {
    if (state.uploadOpen) {
      closeUploadSlide();
      return;
    }
    close();
  }

  function close() {
    if (!state.open) return;
    const panel = rootEl?.querySelector('.hepb-drawer-root');
    if (!panel) {
      state.open = false;
      document.body.classList.remove('hepb-drawer-body-lock');
      render();
      return;
    }
    panel.classList.remove('hepb-drawer-root--open');
    document.body.classList.remove('hepb-drawer-body-lock');
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : DRAWER_TRANSITION_MS;
    window.setTimeout(() => {
      state.open = false;
      state.drawerPanelOpen = false;
      render();
    }, duration);
  }

  function init() {
    rootEl = document.getElementById('hepb-drawer-root');
    if (!rootEl) {
      rootEl = document.createElement('div');
      rootEl.id = 'hepb-drawer-root';
      document.body.appendChild(rootEl);
    }
  }

  function isOpen() {
    return state.open;
  }

  window.HepBDrawer = { init, open, close, applyScenario, isOpen };
})();
