/** Bottom-left prototype panel — theme + HepB scenarios (static preview). */
(function () {
  const STORAGE_THEME = 'hepb-prototype-theme';
  const STORAGE_SCENARIO = 'hepb-prototype-scenario';

  const THEMES = [
    { id: 'theme-blue-light', label: 'Blue · Light' },
    { id: 'theme-blue-dark', label: 'Blue · Dark' },
    { id: 'theme-purple-light', label: 'Purple · Light' },
    { id: 'theme-purple-dark', label: 'Purple · Dark' },
    { id: 'theme-highcontrast-light', label: 'High contrast · Light' },
    { id: 'theme-highcontrast-dark', label: 'High contrast · Dark' },
  ];

  const SCENARIO_GROUPS = [
    {
      label: 'ADULT IMMUNISATION',
      options: [{ id: 'adult-placeholder', label: '1 · —', disabled: true }],
    },
    {
      label: 'CHILDHOOD IMMUNISATION',
      options: [{ id: 'childhood-placeholder', label: '2 · —', disabled: true }],
    },
    {
      label: 'TITER LAB REPORT',
      options: [
        { id: 'titer-approved', label: '· Approved (flow 3)' },
        { id: 'titer-low-equivocal', label: '· Low/equivocal (flow 4)' },
        { id: 'titer-negative', label: '· Negative -> revac (3 dose - approved)' },
        { id: 'titer-negative-disapproved', label: '· Negative -> revac (3 dose - Disapproved)' },
      ],
    },
  ];

  const TITER_PREVIEW_SCENARIOS = new Set([
    'titer-approved',
    'titer-low-equivocal',
    'titer-negative',
    'titer-negative-disapproved',
  ]);

  const SCENARIO_INITIAL = 'adult-placeholder';

  const FLOW_COMPLETE_KEY = 'hepb-flow-complete';
  const SUBMIT_TARGET_KEY = 'hepb-prototype-submit-target';
  const SCENARIO_CHANGE_EVENT = 'hepb-prototype-scenario-change';

  function normalizeStoredScenario(value) {
    if (value === 'titer-approved') return 'titer-approved';
    if (value === 'titer-low-equivocal') return 'titer-low-equivocal';
    if (value === 'titer-negative') return 'titer-negative';
    if (value === 'titer-negative-disapproved') return 'titer-negative-disapproved';
    if (value === 'titer-get-started') return SCENARIO_INITIAL;
    if (value === 'childhood-placeholder') return 'childhood-placeholder';
    return SCENARIO_INITIAL;
  }

  function scenarioOptionsHtml(selectedId) {
    return SCENARIO_GROUPS.map(
      (group) => `
      <optgroup label="${group.label}">
        ${group.options
          .map(
            (option) =>
              `<option value="${option.id}"${option.disabled ? ' disabled' : ''}${option.id === selectedId ? ' selected' : ''}>${option.label}</option>`,
          )
          .join('')}
      </optgroup>`,
    ).join('');
  }

  function clearFlowProgress() {
    sessionStorage.removeItem(FLOW_COMPLETE_KEY);
    localStorage.removeItem(FLOW_COMPLETE_KEY);
  }

  function clearFlowComplete() {
    clearFlowProgress();
    sessionStorage.removeItem(SUBMIT_TARGET_KEY);
  }

  function mapPrototypeScenarioToDrawer(prototypeId) {
    if (TITER_PREVIEW_SCENARIOS.has(prototypeId)) return prototypeId;
    return 'titer-get-started';
  }

  function resetOnScenarioChange(prototypeId) {
    clearFlowComplete();
    if (window.HepBDrawer?.close) {
      window.HepBDrawer.close();
    }
    window.dispatchEvent(
      new CustomEvent(SCENARIO_CHANGE_EVENT, {
        detail: { scenario: mapPrototypeScenarioToDrawer(prototypeId) },
      }),
    );
  }

  function flowSummaryLabel(scenarioId) {
    if (scenarioId === 'titer-approved') return 'Flow 3 · Approved';
    if (scenarioId === 'titer-low-equivocal') return 'Flow 4 · Low/equivocal';
    if (scenarioId === 'titer-negative') return 'Flow 5 · Negative -> revac (3 dose - approved)';
    if (scenarioId === 'titer-negative-disapproved') {
      return 'Flow 5 · Negative -> revac (3 dose - Disapproved)';
    }
    return 'Upload · table row';
  }

  function themeLabel(themeId) {
    return THEMES.find((t) => t.id === themeId)?.label ?? 'Blue · Light';
  }

  function updatePanelHeadSummary(root) {
    const summaryEl = root?.querySelector('[data-prototype-head-summary]');
    if (!summaryEl) return;
    const scenarioId = getActiveScenarioId();
    const themeId = localStorage.getItem(STORAGE_THEME) || 'theme-blue-light';
    summaryEl.textContent = `${flowSummaryLabel(scenarioId)} · ${themeLabel(themeId)}`;
  }

  function applyTheme(themeId) {
    const html = document.documentElement;
    THEMES.forEach((t) => html.classList.remove(t.id));
    html.classList.add(themeId);
    localStorage.setItem(STORAGE_THEME, themeId);
  }

  function applyScenarioToStorage(scenarioId) {
    localStorage.setItem(STORAGE_SCENARIO, scenarioId);
  }

  function getActiveScenarioId() {
    const select = document.querySelector('[data-prototype-scenario]');
    if (select?.value) return select.value;
    return normalizeStoredScenario(localStorage.getItem(STORAGE_SCENARIO));
  }

  function resolveDrawerScenarioForOpen() {
    return getActiveScenarioId();
  }

  function openDrawerForCurrentScenario() {
    clearFlowComplete();
    const scenario = resolveDrawerScenarioForOpen();
    if (window.HepBDrawer?.applyScenario) {
      window.HepBDrawer.applyScenario(scenario);
      return;
    }
    if (window.HepBDrawer?.open) window.HepBDrawer.open();
  }

  function shouldOpenFromUrl() {
    return (
      window.location.hash === '#hepb' ||
      new URLSearchParams(window.location.search).has('hepb')
    );
  }

  function mountPanel() {
    const savedTheme = localStorage.getItem(STORAGE_THEME) || 'theme-blue-light';
    const savedScenario = normalizeStoredScenario(localStorage.getItem(STORAGE_SCENARIO));
    const initialScenario = TITER_PREVIEW_SCENARIOS.has(savedScenario) ? savedScenario : SCENARIO_INITIAL;
    clearFlowComplete();
    applyTheme(savedTheme);

    const root = document.createElement('div');
    root.className = 'prototype-panel prototype-panel--collapsed';
    root.innerHTML = `
      <button type="button" class="prototype-panel__head" aria-expanded="false" aria-controls="prototype-panel-body">
        <span class="prototype-panel__title">
          <span class="prototype-panel__kicker">PROTOTYPE · SCENARIO</span>
          <span class="prototype-panel__summary" data-prototype-head-summary></span>
        </span>
        <span class="prototype-panel__toggle-icon" aria-hidden="true">+</span>
      </button>
      <div id="prototype-panel-body" class="prototype-panel__body">
        <label class="prototype-panel__field">
          <span class="prototype-panel__label">Prototype version</span>
          <select class="prototype-panel__select" data-prototype-scenario>
            ${scenarioOptionsHtml(initialScenario)}
          </select>
        </label>
        <label class="prototype-panel__field">
          <span class="prototype-panel__label">Theme</span>
          <select class="prototype-panel__select" data-prototype-theme>
            ${THEMES.map((t) => `<option value="${t.id}"${t.id === savedTheme ? ' selected' : ''}>${t.label}</option>`).join('')}
          </select>
        </label>
        <p class="prototype-panel__hint">
          Each scenario is separate. Open Hep B from the table row to view only the selected flow. Changing
          version closes the drawer.
        </p>
      </div>`;

    document.body.appendChild(root);

    const scenarioSelect = root.querySelector('[data-prototype-scenario]');

    root.querySelector('[data-prototype-theme]')?.addEventListener('change', (e) => {
      applyTheme(e.target.value);
      updatePanelHeadSummary(root);
    });

    scenarioSelect?.addEventListener('change', (e) => {
      const id = e.target.value;
      applyScenarioToStorage(id);
      resetOnScenarioChange(id);
      updatePanelHeadSummary(root);
    });

    function setCollapsed(collapsed) {
      root.classList.toggle('prototype-panel--collapsed', collapsed);
      const head = root.querySelector('.prototype-panel__head');
      const icon = root.querySelector('.prototype-panel__toggle-icon');
      if (head) head.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      if (icon) icon.textContent = collapsed ? '+' : '−';
      if (collapsed) {
        document.removeEventListener('mousedown', onOutsidePointerDown);
      } else {
        document.addEventListener('mousedown', onOutsidePointerDown);
      }
    }

    function onOutsidePointerDown(e) {
      if (!root.contains(e.target)) setCollapsed(true);
    }

    root.querySelector('.prototype-panel__head')?.addEventListener('click', () => {
      setCollapsed(!root.classList.contains('prototype-panel--collapsed'));
    });

    if (window.CompliancePrototype?.setHepBRowStatus) {
      window.CompliancePrototype.setHepBRowStatus();
    }

    updatePanelHeadSummary(root);
    if (shouldOpenFromUrl()) openDrawerForCurrentScenario();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountPanel);
  } else {
    mountPanel();
  }

  window.PrototypeControls = {
    applyTheme,
    resolveDrawerScenarioForOpen,
    openDrawerForCurrentScenario,
    THEMES,
    SCENARIO_GROUPS,
  };
})();
