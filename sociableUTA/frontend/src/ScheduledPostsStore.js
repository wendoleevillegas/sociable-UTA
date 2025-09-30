// Simple localStorage-backed store for scheduled posts
// Shape of a stored scheduled post:
// {
//   id: string,
//   title: string,
//   text: string,
//   startISO: string, // ISO datetime string
//   endISO?: string,
//   platform: 'Facebook'|'Instagram'|'LinkedIn'|'X',
//   mediaType?: 'image'|'video'|null,
//   mediaUrl?: string|null
// }

const STORAGE_KEY = 'scheduled_posts_v1';

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore quota errors
  }
}

export function addScheduledPosts(posts) {
  const current = readAll();
  // de-dup by id
  const map = new Map(current.map(p => [p.id, p]));
  posts.forEach(p => map.set(p.id, p));
  writeAll([...map.values()]);
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('scheduled-posts-updated'));
    }
  } catch {}
}

export function getScheduledPosts() {
  return readAll();
}

const PLATFORM_COLORS = {
  Facebook: '#1877F2',
  Instagram: '#E4405F',
  LinkedIn: '#0A66C2',
  X: '#000000'
};

export function getScheduledEvents({ platform } = {}) {
  const list = readAll();
  const filtered = platform ? list.filter(p => p.platform?.toLowerCase() === platform.toLowerCase()) : list;
  return filtered.map(p => ({
    id: p.id,
    title: p.title || 'Scheduled Post',
    start: p.startISO,
    end: p.endISO || p.startISO,
    backgroundColor: PLATFORM_COLORS[p.platform] || '#888',
    borderColor: PLATFORM_COLORS[p.platform] || '#888',
    description: p.text || '',
    platform: p.platform,
    type: 'scheduled',
    extendedProps: {
      description: p.text || '',
      platform: p.platform,
      type: 'scheduled',
      mediaType: p.mediaType || null,
      mediaUrl: p.mediaUrl || null,
      source: 'scheduled-local'
    }
  }));
}

export function clearScheduledPosts() {
  writeAll([]);
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('scheduled-posts-updated'));
    }
  } catch {}
}
