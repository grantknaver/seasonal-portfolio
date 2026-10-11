/* The intro Loom between the hero and the trust section.
   Paste the Loom share link here (e.g. https://www.loom.com/share/abc123...) and it goes live.
   While it's empty, the section only shows in dev (npm run dev), never on the live site. */
export const INTRO_LOOM_URL = 'https://www.loom.com/share/210459f40dad4bf9828fea35b65851ce';

/* The intro video, served from our own site (public/video/intro.mp4) so it shows a branded
   cover, not a preview of the recording, and starts with sound on the first click.
   It's the same recording as the Loom above; re-export it here if the Loom is re-recorded. */
export const INTRO_VIDEO_SRC = '/video/intro.mp4';

/* The recording's actual video shape (1920 × 1080), so the player has no black bars. */
export const INTRO_LOOM_ASPECT = '16 / 9';

/* Turns a share link into the embeddable player URL. */
export const loomEmbedUrl = (shareUrl: string) => {
  const id = shareUrl.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/)?.[1];
  if (!id) return '';
  const params = new URLSearchParams({
    hide_owner: 'true',
    hide_share: 'true',
    hide_title: 'true',
    hideEmbedTopBar: 'true',
  });
  return `https://www.loom.com/embed/${id}?${params.toString()}`;
};
