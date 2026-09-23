/**
 * Extracts 11-character YouTube Video ID from standard YouTube URLs
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

/**
 * Cleans and formats a source title for display on the frontend,
 * replacing generic scaffold titles like 'client' with a clean domain or app name.
 */
export function formatSourceTitle(
  title?: string | null,
  sourceUrl?: string | null,
  sourceType?: string | null
): string {
  const cleanTitle = (title || '').trim();

  // Detect generic Vite/React scaffold names or placeholders
  const isGeneric =
    !cleanTitle ||
    /^(client|vite\s*\+?\s*react|react\s*app|vite\s*app|untitled|home|document|index|web\s*page|index\.html)$/i.test(
      cleanTitle
    );

  if (isGeneric) {
    if (sourceUrl) {
      try {
        const url = new URL(sourceUrl);
        const host = url.hostname.replace(/^www\./, '');
        if (/chai-lm/i.test(host)) {
          return 'ChaiLM Web App';
        }
        const path = url.pathname.replace(/\/$/, '');
        return path && path !== '/' ? `${host}${path}` : host;
      } catch {
        return sourceUrl;
      }
    }
    const type = (sourceType || '').toLowerCase();
    if (type === 'youtube') return 'YouTube Video';
    if (type === 'pdf') return 'PDF Document';
    return 'Web Article';
  }

  return cleanTitle;
}
