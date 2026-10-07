/* The intro Loom between the hero and the trust section.
   Paste the Loom share link here (e.g. https://www.loom.com/share/abc123...) and it goes live.
   While it's empty, the section only shows in dev (npm run dev), never on the live site. */
export const INTRO_LOOM_URL = 'https://www.loom.com/share/210459f40dad4bf9828fea35b65851ce';

/* Optional: shown on the poster, e.g. '1:15'. Leave empty to hide. */
export const INTRO_LOOM_DURATION = '1:00';

/* The recording's shape (Loom reports 1920 × 1440), so the player has no black bars. */
export const INTRO_LOOM_ASPECT = '4 / 3';

/* Turns a share link into the embeddable player URL. */
export const loomEmbedUrl = (shareUrl: string) => {
  const id = shareUrl.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/)?.[1];
  if (!id) return '';
  const params = new URLSearchParams({
    autoplay: '1',
    hide_owner: 'true',
    hide_share: 'true',
    hide_title: 'true',
    hideEmbedTopBar: 'true',
  });
  return `https://www.loom.com/embed/${id}?${params.toString()}`;
};
