export const HEPB_GUIDELINES = [
  '3 dose series OR 2 Heplisav-B vaccinations required OR a Positive Surface Antibody titer lab report',
  'If titer is negative/low/equivocal, must repeat 3 dose or 2 dose Heplisav-B series',
  'Repeat TITER is required',
  'If your repeat titer is negative, please submit a non-convertor',
  'Declinations are not accepted',
] as const;

export const HEPB_STUDENT = {
  name: 'Cain, Jenny',
  email: 'ExxJenny.Cain@example.com',
} as const;

export const HEPB_LOW_EQUIVOCAL_ALERT =
  'Your Titer lab report results have returned as Low/ Equivocal. Please contact your school admin to reset the HepB compliance process.';

export const HEPB_ADMIN_COMMENT_APPROVED = 'This is a test comment from the admin.';

export const HEPB_ADMIN_COMMENT_LOW_EQUIVOCAL =
  'This record is not approved because the titer lab report returned low/equivocal results.';

/** Flow 5 — negative titer outcome (sc1 alert at top; sc2 alert above titer record). */
export const HEPB_FLOW5_NEGATIVE_ALERT =
  'Your Titer lab report results have returned as Negative. Hence your vaccination report has been disapproved. You can opt for re-vaccination or ask you school admin to reset the HepB compliance process.';

export const HEPB_FLOW5_REVAC_DOSE_DATES = {
  dose1: '07/08/2025',
  dose2: '11/10/2025',
  dose3: '11/10/2025',
} as const;

export const HEPB_REVACCINATION_OPTIONS = [
  {
    id: 'series-3',
    title: '3 dose series',
    metaLines: ['3 doses', '3 documents needed'] as [string, string],
  },
  {
    id: 'booster',
    title: 'Booster dose',
    metaLines: ['1 dose', '1 document needed'] as [string, string],
  },
] as const;

export type HepBFlow5RevaccinationChoice = (typeof HEPB_REVACCINATION_OPTIONS)[number]['id'];

export type RecordChoice = 'adult' | 'childhood' | 'titer';

export const RECORD_OPTIONS: {
  id: RecordChoice;
  title: string;
  metaLines: [string] | [string, string];
}[] = [
  { id: 'adult', title: 'Adult immunisation record', metaLines: ['3 doses', '3 documents needed'] },
  {
    id: 'childhood',
    title: 'Childhood immunisation record',
    metaLines: ['3 doses', '3 documents needed'],
  },
  { id: 'titer', title: 'Titer lab report', metaLines: ['1 dose', '1 document needed'] },
];

export const DOCUMENT_ROWS: {
  id: RecordChoice | 'declination';
  title: string;
  subtitle: string;
}[] = [
  { id: 'adult', title: 'Adult immunization record', subtitle: '3 doses | 3 documents needed' },
  { id: 'childhood', title: 'Childhood immunization record', subtitle: '3 doses | 3 documents needed' },
  { id: 'titer', title: 'Titer lab report', subtitle: '1 dose | 1 document needed' },
];
