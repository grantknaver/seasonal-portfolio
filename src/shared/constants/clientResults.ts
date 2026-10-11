/* Results clients reported back after changes Grant made. Shared without names; they can't be
   independently confirmed, so the site always labels them client-reported, never guaranteed. */
export type ClientResult = { label: string; stat: string; short: string; text: string };

export const CLIENT_RESULTS: ClientResult[] = [
  {
    label: 'Clarity',
    stat: '+14%',
    short: 'primary CTA clicks',
    text: 'more primary CTA clicks after the main message and next step became easier to understand.',
  },
  {
    label: 'Trust',
    stat: '+11%',
    short: 'qualified inquiries',
    text: 'more qualified inquiries after proof, claims, and credibility cues moved closer to the decision point.',
  },
  {
    label: 'Momentum',
    stat: '−16%',
    short: 'drop-off',
    text: 'drop-off after the path from first impression to next action became smoother.',
  },
  {
    label: 'AI legibility',
    stat: '+18%',
    short: 'AI-assisted task completion',
    text: 'AI-assisted task completion after outputs, sources, and next steps became easier to understand.',
  },
];

export const CLIENT_RESULTS_NOTE =
  'Client-reported examples of outcomes, not guarantees. Yours could be lower or higher: actual results depend on the audience, offer, traffic, baseline experience, implementation quality, and how success is measured.';
