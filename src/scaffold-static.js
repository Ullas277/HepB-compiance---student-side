/** Static renderer - no build step. Serve the project root over HTTP. */
(function () {
  const rows = [
    {
      requirement: 'Hepatitis A',
      category: 'HEALTH & IMMUNIZATION',
      status: 'Get Started',
      dueDate: '-',
      followUpDate: '-',
      expirationDate: '-',
      reason: '-',
      comment: '-',
    },
    {
      requirement: 'Flu (Influenza)',
      category: 'HEALTH & IMMUNIZATION',
      status: 'Not Approved',
      dueDate: '08/01/2022',
      followUpDate: '-',
      expirationDate: '02/15/2023',
      reason: 'Unable to open Document',
      comment: 'Please upload a document to review.',
      expirationDateDanger: true,
    },
    {
      requirement: 'Polio - Update',
      category: 'HEALTH & IMMUNIZATION',
      status: 'Get Started',
      dueDate: '-',
      followUpDate: '-',
      expirationDate: '-',
      reason: '-',
      comment: '-',
    },
    {
      requirement: 'Hepatitis B',
      category: 'HEALTH & IMMUNIZATION',
      status: 'Get Started',
      dueDate: '10/01/2023',
      followUpDate: '-',
      expirationDate: '-',
      reason: '-',
      comment: '-',
    },
    {
      requirement: 'MMR',
      category: 'HEALTH & IMMUNIZATION',
      status: 'Pending Review',
      dueDate: '09/15/2023',
      followUpDate: '-',
      expirationDate: '12/23/2023',
      reason: 'Pending Clarification from School',
      comment: 'XYZ',
      expirationDateDanger: true,
    },
    {
      requirement: 'Varicella',
      category: 'HEALTH & IMMUNIZATION',
      status: 'Approved',
      dueDate: '-',
      followUpDate: '-',
      expirationDate: '-',
      reason: '-',
      comment: '-',
    },
    {
      requirement: 'Tdap',
      category: 'HEALTH & IMMUNIZATION',
      status: 'Expired',
      dueDate: '03/01/2022',
      followUpDate: '-',
      expirationDate: '03/01/2023',
      reason: '-',
      comment: '-',
      expirationDateDanger: true,
    },
    {
      requirement: 'TB Test',
      category: 'HEALTH & IMMUNIZATION',
      status: 'Not Approved',
      dueDate: '06/15/2022',
      followUpDate: '04/05/2024',
      expirationDate: '-',
      reason: '-',
      comment: '-',
      followUpDateDanger: true,
    },
    {
      requirement: 'CPR NEW',
      category: 'MEMBERSHIPS & LICENSURE',
      status: 'Get Started',
      dueDate: '-',
      followUpDate: '-',
      expirationDate: '-',
      reason: '-',
      comment: '-',
    },
    {
      requirement: 'RN License Verification',
      category: 'MEMBERSHIPS & LICENSURE',
      status: 'Not Approved',
      dueDate: '01/01/2023',
      followUpDate: '-',
      expirationDate: '01/01/2024',
      reason: 'Document not legible',
      comment: 'Please re-upload a clear copy.',
      expirationDateDanger: true,
    },
    {
      requirement: 'HIPAA Training',
      category: 'ATTESTATIONS & ACKNOWLEDGMENTS',
      status: 'In Progress',
      dueDate: '-',
      followUpDate: '-',
      expirationDate: '-',
      reason: '-',
      comment: '-',
    },
    {
      requirement: 'Consent of Release',
      category: 'ATTESTATIONS & ACKNOWLEDGMENTS',
      status: 'In Progress',
      dueDate: '-',
      followUpDate: '04/05/2024',
      expirationDate: '-',
      reason: '-',
      comment: '-',
      followUpDateDanger: true,
    },
    {
      requirement: 'Consent of Treatment',
      category: 'ATTESTATIONS & ACKNOWLEDGMENTS',
      status: 'Pending Review',
      dueDate: '-',
      followUpDate: '-',
      expirationDate: '12/23/2023',
      reason: '-',
      comment: 'Please upload a signed document to review.',
      commentShowMore: true,
      expirationDateDanger: true,
    },
    {
      requirement: 'OSHA Training',
      category: 'ATTESTATIONS & ACKNOWLEDGMENTS',
      status: 'Not Approved',
      dueDate: '05/01/2022',
      followUpDate: '-',
      expirationDate: '05/01/2023',
      reason: '-',
      comment: '-',
      expirationDateDanger: true,
    },
    {
      requirement: 'Professional Liability Insurance',
      category: 'MEMBERSHIPS & LICENSURE',
      status: 'Get Started',
      dueDate: '-',
      followUpDate: '-',
      expirationDate: '-',
      reason: '-',
      comment: '-',
    },
  ];

  const icons = {
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
    grid:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
    bell:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>',
    help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 115 1c0 2-2.5 2-2.5 4"/><path d="M12 17h.01"/></svg>',
    chat:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 15a4 4 0 01-4 4H8l-5 3V7a4 4 0 014-4h10a4 4 0 014 4z"/></svg>',
    sparkles:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/><path d="M19 13l.75 2.25L22 16l-2.25.75L19 19l-.75-2.25L16 16l2.25-.75L19 13z"/></svg>',
    chevron:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="compliance-user__chevron" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
    wrench:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.1 2.1-3.4-3.4 2.1-2.1z"/></svg>',
    download:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/></svg>',
    sort: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M8 9l4-4 4 4"/><path d="M8 15l4 4 4-4"/></svg>',
    share:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 3.9M15.4 6.6L8.6 10.5"/></svg>',
  };

  function statusClass(status) {
    switch (status) {
      case 'Get Started':
        return 'status-pill--get-started';
      case 'Not Approved':
        return 'status-pill--not-approved';
      case 'In Progress':
        return 'status-pill--in-progress';
      case 'Pending Review':
        return 'status-pill--pending-review';
      case 'Approved':
        return 'status-pill--approved';
      case 'Expired':
        return 'status-pill--expired';
      default:
        return 'status-pill--get-started';
    }
  }

  function cellDate(value, danger) {
    const cls = danger ? 'cell-danger' : value === '-' ? 'cell-muted' : '';
    return `<td class="${cls}">${value}</td>`;
  }

  function rowHtml(row) {
    const comment =
      row.comment +
      (row.commentShowMore
        ? ' <button type="button" class="compliance-show-more">Show More</button>'
        : '');
    const commentClass = row.comment === '-' ? 'cell-muted' : '';
    const reasonClass = row.reason === '-' ? 'cell-muted' : '';
    const isHepB = row.requirement === 'Hepatitis B';
    const displayStatus = isHepB ? 'Get Started' : row.status;
    const rowClass = isHepB ? ' class="compliance-table__row--interactive"' : '';
    const rowData = isHepB ? ' data-hepb-row="1"' : '';
    const statusCell = isHepB
      ? `<td><button type="button" class="status-pill ${statusClass(displayStatus)} status-pill--interactive" data-hepb-open="1">${displayStatus}</button></td>`
      : `<td><span class="status-pill ${statusClass(displayStatus)}">${displayStatus}</span></td>`;

    return `<tr${rowClass}${rowData}>
      <td>${row.requirement}</td>
      <td class="cell-category">${row.category}</td>
      ${statusCell}
      ${cellDate(row.dueDate, row.dueDateDanger)}
      ${cellDate(row.followUpDate, row.followUpDateDanger)}
      ${cellDate(row.expirationDate, row.expirationDateDanger)}
      <td class="${reasonClass}">${row.reason}</td>
      <td class="${commentClass}">${comment}</td>
      <td class="cell-share">${icons.share}</td>
    </tr>`;
  }

  const mount = document.getElementById('compliance-root');
  if (!mount) return;

  function renderCompliance() {
  mount.innerHTML = `
    <div class="compliance-app">
      <header class="compliance-topbar">
        <div class="compliance-topbar__left">
          <button type="button" class="compliance-topbar__menu" aria-label="Menu">${icons.menu}</button>
          <h1 class="compliance-topbar__title">Compliance</h1>
        </div>
        <div class="compliance-topbar__right">
          <button type="button" class="compliance-icon-btn" aria-label="Apps">${icons.grid}</button>
          <button type="button" class="compliance-icon-btn" aria-label="Notifications">
            ${icons.bell}
            <span class="compliance-badge-count">3</span>
          </button>
          <button type="button" class="compliance-help-btn" aria-label="Help">${icons.help}</button>
          <button type="button" class="compliance-btn compliance-btn--chat">${icons.chat} Chat</button>
          <button type="button" class="compliance-btn compliance-btn--leo">${icons.sparkles} Ask Leo</button>
          <div class="compliance-user">
            <span>Ashwini HSH Exxat (Nursing under Graduate Test)</span>
            ${icons.chevron}
          </div>
        </div>
      </header>

      <div class="compliance-info-banner" role="status">
        New to Exxat? Watch <a href="#">this tutorial</a> about your compliance section. More questions? See these <a href="#">FAQs</a>.
      </div>

      <section class="compliance-summary" aria-label="Summary for mandatory requirements">
        <div class="compliance-summary__left">
          <span>Summary for mandatory requirements:</span>
          <div class="compliance-summary__counts">
            <span class="compliance-summary-chip compliance-summary-chip--success">
              <span class="compliance-summary-chip__num">1</span>
              <span class="compliance-summary-chip__label">Approved</span>
            </span>
            <span class="compliance-summary-chip compliance-summary-chip--pending">
              <span class="compliance-summary-chip__num">1</span>
              <span class="compliance-summary-chip__label">Pending Review</span>
            </span>
            <span class="compliance-summary-chip compliance-summary-chip--attention">
              <span class="compliance-summary-chip__num">13</span>
              <span class="compliance-summary-chip__label">Needs Attention</span>
            </span>
          </div>
        </div>
        <div class="compliance-summary__tools">
          <button type="button" class="compliance-icon-btn" aria-label="Settings">${icons.wrench}</button>
          <button type="button" class="compliance-icon-btn" aria-label="Download">${icons.download}</button>
        </div>
      </section>

      <div class="compliance-table-wrap">
        <table class="compliance-table">
          <colgroup>
            <col class="col-req" />
            <col class="col-cat" />
            <col class="col-status" />
            <col class="col-date" />
            <col class="col-date" />
            <col class="col-date" />
            <col class="col-reason" />
            <col class="col-comment" />
            <col class="col-incl" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col"><span class="compliance-table__sort">Mandatory Requirement (15) ${icons.sort}</span></th>
              <th scope="col"><span class="compliance-table__sort">Categories ${icons.sort}</span></th>
              <th scope="col">Status</th>
              <th scope="col">Due Date</th>
              <th scope="col">Follow-up Date</th>
              <th scope="col">Expiration Date</th>
              <th scope="col">Reason</th>
              <th scope="col">Comment</th>
              <th scope="col">Incl Pro</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(rowHtml).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  function openHepBDrawer(e) {
    if (e.target.closest('.compliance-show-more')) return;
    if (window.PrototypeControls?.openDrawerForCurrentScenario) {
      window.PrototypeControls.openDrawerForCurrentScenario();
      return;
    }
    const scenario = window.PrototypeControls?.resolveDrawerScenarioForOpen?.() ?? 'titer-get-started';
    if (window.HepBDrawer?.applyScenario) {
      window.HepBDrawer.applyScenario(scenario);
      return;
    }
    if (window.HepBDrawer?.open) window.HepBDrawer.open();
  }

  mount.querySelectorAll('[data-hepb-row]').forEach((row) => {
    row.addEventListener('click', openHepBDrawer);
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openHepBDrawer(e);
      }
    });
    row.setAttribute('tabindex', '0');
  });

  if (window.HepBDrawer) {
    window.HepBDrawer.init();
  }
  }

  window.CompliancePrototype = {
    setHepBRowStatus() {
      const hepB = rows.find((r) => r.requirement === 'Hepatitis B');
      if (hepB) hepB.status = 'Get Started';
      renderCompliance();
    },
    render: renderCompliance,
  };

  renderCompliance();
})();
