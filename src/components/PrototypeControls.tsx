import { useEffect, useRef, useState } from 'react';

const STORAGE_THEME = 'hepb-prototype-theme';
export const STORAGE_SCENARIO = 'hepb-prototype-scenario';

export const PROTOTYPE_THEMES = [
  { id: 'theme-blue-light', label: 'Blue · Light' },
  { id: 'theme-blue-dark', label: 'Blue · Dark' },
  { id: 'theme-purple-light', label: 'Purple · Light' },
  { id: 'theme-purple-dark', label: 'Purple · Dark' },
  { id: 'theme-highcontrast-light', label: 'High contrast · Light' },
  { id: 'theme-highcontrast-dark', label: 'High contrast · Dark' },
] as const;

export const PROTOTYPE_SCENARIO_GROUPS = [
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
] as const;

export type PrototypeScenarioId =
  | (typeof PROTOTYPE_SCENARIO_GROUPS)[number]['options'][number]['id'];

/** Drawer routing ids (includes table default). */
export type HepBDrawerScenarioId =
  | 'titer-get-started'
  | 'titer-approved'
  | 'titer-low-equivocal'
  | 'titer-negative'
  | 'titer-negative-disapproved';

export const HEPB_TITER_PREVIEW_SCENARIOS = [
  'titer-approved',
  'titer-low-equivocal',
  'titer-negative',
  'titer-negative-disapproved',
] as const;

export function isHepBTiterPreviewScenario(
  id: string,
): id is (typeof HEPB_TITER_PREVIEW_SCENARIOS)[number] {
  return (
    id === 'titer-approved' ||
    id === 'titer-low-equivocal' ||
    id === 'titer-negative' ||
    id === 'titer-negative-disapproved'
  );
}

export function isFlow5NegativeDrawerScenario(
  scenario: HepBDrawerScenarioId | undefined,
): scenario is 'titer-negative' | 'titer-negative-disapproved' {
  return scenario === 'titer-negative' || scenario === 'titer-negative-disapproved';
}

export function flow5RevaccApprovedOnSc2(scenario: HepBDrawerScenarioId | undefined): boolean {
  return scenario !== 'titer-negative-disapproved';
}

export const PROTOTYPE_SCENARIO_INITIAL: PrototypeScenarioId = 'adult-placeholder';

export function prototypeFlowSummaryLabel(scenarioId: PrototypeScenarioId): string {
  if (scenarioId === 'titer-approved') return 'Flow 3 · Approved';
  if (scenarioId === 'titer-low-equivocal') return 'Flow 4 · Low/equivocal';
  if (scenarioId === 'titer-negative') return 'Flow 5 · Negative -> revac (3 dose - approved)';
  if (scenarioId === 'titer-negative-disapproved') {
    return 'Flow 5 · Negative -> revac (3 dose - Disapproved)';
  }
  return 'Upload · table row';
}

export function prototypeThemeLabel(themeId: string): string {
  return PROTOTYPE_THEMES.find((t) => t.id === themeId)?.label ?? 'Blue · Light';
}

export const HEPB_PROTOTYPE_SCENARIO_CHANGE_EVENT = 'hepb-prototype-scenario-change';
const STORAGE_SUBMIT_TARGET = 'hepb-prototype-submit-target';

function normalizeStoredScenario(value: string | null): PrototypeScenarioId {
  if (value === 'titer-approved') return 'titer-approved';
  if (value === 'titer-low-equivocal') return 'titer-low-equivocal';
  if (value === 'titer-negative') return 'titer-negative';
  if (value === 'titer-negative-disapproved') return 'titer-negative-disapproved';
  if (value === 'titer-get-started') return PROTOTYPE_SCENARIO_INITIAL;
  if (value === 'childhood-placeholder') return 'childhood-placeholder';
  return PROTOTYPE_SCENARIO_INITIAL;
}

export function clearHepBFlowProgressStorage() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem('hepb-flow-complete');
  localStorage.removeItem('hepb-flow-complete');
}

export function clearHepBFlowCompleteStorage() {
  clearHepBFlowProgressStorage();
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(STORAGE_SUBMIT_TARGET);
}

export function mapPrototypeScenarioToDrawer(id: PrototypeScenarioId): HepBDrawerScenarioId {
  if (
    id === 'titer-approved' ||
    id === 'titer-low-equivocal' ||
    id === 'titer-negative' ||
    id === 'titer-negative-disapproved'
  ) {
    return id;
  }
  return 'titer-get-started';
}

export function resetHepBFlowForScenarioChange(prototypeId: PrototypeScenarioId) {
  if (typeof window === 'undefined') return;
  clearHepBFlowCompleteStorage();
  window.dispatchEvent(
    new CustomEvent(HEPB_PROTOTYPE_SCENARIO_CHANGE_EVENT, {
      detail: { scenario: mapPrototypeScenarioToDrawer(prototypeId) },
    }),
  );
}

export function resolveHepBDrawerScenarioFromStorage(): HepBDrawerScenarioId {
  if (typeof document !== 'undefined') {
    const select = document.querySelector<HTMLSelectElement>('[data-prototype-scenario]');
    const fromSelect = select?.value;
    if (fromSelect && isHepBTiterPreviewScenario(fromSelect)) return fromSelect;
    if (fromSelect) return 'titer-get-started';
  }
  const id = normalizeStoredScenario(localStorage.getItem(STORAGE_SCENARIO));
  if (isHepBTiterPreviewScenario(id)) return id;
  return 'titer-get-started';
}

function applyTheme(themeId: string) {
  const html = document.documentElement;
  PROTOTYPE_THEMES.forEach((t) => html.classList.remove(t.id));
  html.classList.add(themeId);
  localStorage.setItem(STORAGE_THEME, themeId);
}

export function PrototypeControls() {
  const panelRef = useRef<HTMLDivElement>(null);
  const [themeId, setThemeId] = useState(
    () => localStorage.getItem(STORAGE_THEME) || 'theme-blue-light',
  );
  const [scenarioId, setScenarioId] = useState<PrototypeScenarioId>(() =>
    normalizeStoredScenario(localStorage.getItem(STORAGE_SCENARIO)),
  );
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    applyTheme(themeId);
  }, [themeId]);

  useEffect(() => {
    clearHepBFlowCompleteStorage();
  }, []);

  useEffect(() => {
    if (collapsed) return;

    function handlePointerDown(event: MouseEvent) {
      const panel = panelRef.current;
      if (!panel || panel.contains(event.target as Node)) return;
      setCollapsed(true);
    }

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [collapsed]);

  function handleScenarioChange(id: PrototypeScenarioId) {
    setScenarioId(id);
    localStorage.setItem(STORAGE_SCENARIO, id);
    resetHepBFlowForScenarioChange(id);
  }

  function toggleCollapsed() {
    setCollapsed((c) => !c);
  }

  const headSummary = `${prototypeFlowSummaryLabel(scenarioId)} · ${prototypeThemeLabel(themeId)}`;

  return (
    <div
      ref={panelRef}
      className={`prototype-panel${collapsed ? ' prototype-panel--collapsed' : ''}`}
    >
      <button
        type="button"
        className="prototype-panel__head"
        aria-expanded={!collapsed}
        aria-controls="prototype-panel-body"
        onClick={toggleCollapsed}
      >
        <span className="prototype-panel__title">
          <span className="prototype-panel__kicker">PROTOTYPE · SCENARIO</span>
          <span className="prototype-panel__summary">{headSummary}</span>
        </span>
        <span className="prototype-panel__toggle-icon" aria-hidden>
          {collapsed ? '+' : '−'}
        </span>
      </button>
      <div id="prototype-panel-body" className="prototype-panel__body">
        <label className="prototype-panel__field">
          <span className="prototype-panel__label">Prototype version</span>
          <select
            className="prototype-panel__select"
            data-prototype-scenario
            value={scenarioId}
            onChange={(e) => handleScenarioChange(e.target.value as PrototypeScenarioId)}
          >
            {PROTOTYPE_SCENARIO_GROUPS.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map((option) => (
                  <option key={option.id} value={option.id} disabled={'disabled' in option && option.disabled}>
                    {option.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
        <label className="prototype-panel__field">
          <span className="prototype-panel__label">Theme</span>
          <select
            className="prototype-panel__select"
            value={themeId}
            onChange={(e) => setThemeId(e.target.value)}
          >
            {PROTOTYPE_THEMES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <p className="prototype-panel__hint">
          Each scenario is separate. Open Hep B from the table row to view only the selected flow. Changing
          version closes the drawer.
        </p>
      </div>
    </div>
  );
}
