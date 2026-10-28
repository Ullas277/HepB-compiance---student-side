import { useEffect, useState } from 'react';
import { complianceRows, type ComplianceStatus } from '../data/complianceRows';
import { HepatitisBDrawer } from './hepb/HepatitisBDrawer';
import {
  clearHepBFlowCompleteStorage,
  HEPB_PROTOTYPE_SCENARIO_CHANGE_EVENT,
  resolveHepBDrawerScenarioFromStorage,
  type HepBDrawerScenarioId,
} from './PrototypeControls';
import {
  IconBell,
  IconChat,
  IconChevronDown,
  IconDownload,
  IconGrid,
  IconHelp,
  IconMenu,
  IconShare,
  IconSort,
  IconSparkles,
  IconWrench,
} from './Icons';
import { StatusPill } from './StatusPill';

function DateCell({
  value,
  danger,
}: {
  value: string;
  danger?: boolean;
}) {
  const muted = value === '-';
  const className = danger ? 'cell-danger' : muted ? 'cell-muted' : undefined;
  return <td className={className}>{value}</td>;
}

function shouldOpenHepbFromUrl() {
  if (typeof window === 'undefined') return false;
  if (window.location.hash === '#hepb') return true;
  return new URLSearchParams(window.location.search).has('hepb');
}

export function ComplianceScreen() {
  const [hepbDrawerOpen, setHepbDrawerOpen] = useState(false);
  const [drawerScenario, setDrawerScenario] = useState<HepBDrawerScenarioId>('titer-get-started');
  const [drawerInstance, setDrawerInstance] = useState(0);

  const tableRows = complianceRows.map((row) =>
    row.requirement === 'Hepatitis B' ? { ...row, status: 'Get Started' as ComplianceStatus } : row,
  );

  useEffect(() => {
    if (shouldOpenHepbFromUrl()) {
      setDrawerScenario(resolveHepBDrawerScenarioFromStorage());
      setHepbDrawerOpen(true);
    }
  }, []);

  function openDrawerWithScenario(scenario: HepBDrawerScenarioId) {
    clearHepBFlowCompleteStorage();
    setDrawerScenario(scenario);
    setDrawerInstance((n) => n + 1);
    setHepbDrawerOpen(true);
  }

  useEffect(() => {
    function onScenarioChange(event: Event) {
      const scenario = (event as CustomEvent<{ scenario: HepBDrawerScenarioId }>).detail.scenario;
      setDrawerScenario(scenario);
      setDrawerInstance((n) => n + 1);
      setHepbDrawerOpen(false);
    }
    window.addEventListener(HEPB_PROTOTYPE_SCENARIO_CHANGE_EVENT, onScenarioChange);
    return () => window.removeEventListener(HEPB_PROTOTYPE_SCENARIO_CHANGE_EVENT, onScenarioChange);
  }, []);

  function openHepbFromTable() {
    openDrawerWithScenario(resolveHepBDrawerScenarioFromStorage());
  }

  return (
    <div className="compliance-app">
      <header className="compliance-topbar">
        <div className="compliance-topbar__left">
          <button type="button" className="compliance-topbar__menu" aria-label="Menu">
            <IconMenu />
          </button>
          <h1 className="compliance-topbar__title">Compliance</h1>
        </div>
        <div className="compliance-topbar__right">
          <button type="button" className="compliance-icon-btn" aria-label="Apps">
            <IconGrid />
          </button>
          <button type="button" className="compliance-icon-btn" aria-label="Notifications">
            <IconBell />
            <span className="compliance-badge-count">3</span>
          </button>
          <button type="button" className="compliance-help-btn" aria-label="Help">
            <IconHelp />
          </button>
          <button type="button" className="compliance-btn compliance-btn--chat">
            <IconChat /> Chat
          </button>
          <button type="button" className="compliance-btn compliance-btn--leo">
            <IconSparkles /> Ask Leo
          </button>
          <div className="compliance-user">
            <span>Ashwini HSH Exxat (Nursing under Graduate Test)</span>
            <IconChevronDown className="compliance-user__chevron" />
          </div>
        </div>
      </header>

      <div className="compliance-info-banner" role="status">
        New to Exxat? Watch <a href="#">this tutorial</a> about your compliance section. More questions? See
        these <a href="#">FAQs</a>.
      </div>

      <section className="compliance-summary" aria-label="Summary for mandatory requirements">
        <div className="compliance-summary__left">
          <span>Summary for mandatory requirements:</span>
          <div className="compliance-summary__counts">
            <span className="compliance-summary-chip compliance-summary-chip--success">
              <span className="compliance-summary-chip__num">1</span>
              <span className="compliance-summary-chip__label">Approved</span>
            </span>
            <span className="compliance-summary-chip compliance-summary-chip--pending">
              <span className="compliance-summary-chip__num">1</span>
              <span className="compliance-summary-chip__label">Pending Review</span>
            </span>
            <span className="compliance-summary-chip compliance-summary-chip--attention">
              <span className="compliance-summary-chip__num">13</span>
              <span className="compliance-summary-chip__label">Needs Attention</span>
            </span>
          </div>
        </div>
        <div className="compliance-summary__tools">
          <button type="button" className="compliance-icon-btn" aria-label="Settings">
            <IconWrench />
          </button>
          <button type="button" className="compliance-icon-btn" aria-label="Download">
            <IconDownload />
          </button>
        </div>
      </section>

      <div className="compliance-table-wrap">
        <table className="compliance-table">
          <colgroup>
            <col className="col-req" />
            <col className="col-cat" />
            <col className="col-status" />
            <col className="col-date" />
            <col className="col-date" />
            <col className="col-date" />
            <col className="col-reason" />
            <col className="col-comment" />
            <col className="col-incl" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">
                <span className="compliance-table__sort">
                  Mandatory Requirement (15) <IconSort />
                </span>
              </th>
              <th scope="col">
                <span className="compliance-table__sort">
                  Categories <IconSort />
                </span>
              </th>
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
            {tableRows.map((row) => {
              const hepbInteractive = row.requirement === 'Hepatitis B';

              return (
              <tr
                key={row.requirement}
                className={hepbInteractive ? 'compliance-table__row--interactive' : undefined}
                tabIndex={hepbInteractive ? 0 : undefined}
                onClick={
                  hepbInteractive
                    ? (e) => {
                        const target = e.target as HTMLElement;
                        if (target.closest('.compliance-show-more')) return;
                        openHepbFromTable();
                      }
                    : undefined
                }
                onKeyDown={
                  hepbInteractive
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          openHepbFromTable();
                        }
                      }
                    : undefined
                }
              >
                <td>{row.requirement}</td>
                <td className="cell-category">{row.category}</td>
                <td>
                  <StatusPill
                    status={row.status}
                    interactive={hepbInteractive}
                    onActivate={openHepbFromTable}
                  />
                </td>
                <DateCell value={row.dueDate} danger={row.dueDateDanger} />
                <DateCell value={row.followUpDate} danger={row.followUpDateDanger} />
                <DateCell value={row.expirationDate} danger={row.expirationDateDanger} />
                <td className={row.reason === '-' ? 'cell-muted' : undefined}>{row.reason}</td>
                <td className={row.comment === '-' ? 'cell-muted' : undefined}>
                  {row.comment}
                  {row.commentShowMore ? (
                    <button type="button" className="compliance-show-more">
                      Show More
                    </button>
                  ) : null}
                </td>
                <td className="cell-share">
                  <IconShare />
                </td>
              </tr>
            );
            })}
          </tbody>
        </table>
      </div>

      {hepbDrawerOpen ? (
        <HepatitisBDrawer
          key={`hepb-${drawerScenario}-${drawerInstance}`}
          scenario={drawerScenario}
          onClose={() => setHepbDrawerOpen(false)}
        />
      ) : null}
    </div>
  );
}
