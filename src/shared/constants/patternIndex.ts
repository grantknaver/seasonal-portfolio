import { Lens } from './lens';

/* The Pattern Index lives on its own site. Change the base URL here only
   (e.g. to https://patterns.glkfreelance.com later). */
export const PATTERN_INDEX_URL = 'https://pattern-index.pages.dev';

export const patternIndexUrl = (path = '/') =>
  `${PATTERN_INDEX_URL}${path.startsWith('/') ? path : `/${path}`}`;

/* Lens pages on the Index. Individual /patterns/<slug> pages are not linked yet. */
export const PATTERN_INDEX_LENS: Record<Lens, { path: string; text: string }> = {
  [Lens.Clarity]: { path: '/lenses/clarity', text: 'Explore Clarity patterns' },
  [Lens.Trust]: { path: '/lenses/trust', text: 'See how Trust can be shown' },
  [Lens.Momentum]: { path: '/lenses/momentum', text: 'Explore Momentum directions' },
  [Lens.AILegibility]: { path: '/lenses/ai-legibility', text: 'See AI Legibility patterns' },
};
