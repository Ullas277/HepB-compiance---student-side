import type { ComplianceStatus } from '../data/complianceRows';

const statusClass: Record<ComplianceStatus, string> = {
  'Get Started': 'status-pill--get-started',
  'Not Approved': 'status-pill--not-approved',
  Disapproved: 'status-pill--disapproved',
  'In Progress': 'status-pill--in-progress',
  'Pending Review': 'status-pill--pending-review',
  Approved: 'status-pill--approved',
  Expired: 'status-pill--expired',
};

type StatusPillProps = {
  status: ComplianceStatus;
  interactive?: boolean;
  onActivate?: () => void;
};

export function StatusPill({ status, interactive, onActivate }: StatusPillProps) {
  const className = `status-pill ${statusClass[status]}${interactive ? ' status-pill--interactive' : ''}`;

  if (interactive && onActivate) {
    return (
      <button type="button" className={className} onClick={onActivate}>
        {status}
      </button>
    );
  }

  return <span className={className}>{status}</span>;
}
