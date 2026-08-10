const PALETTE = ['#605dc8', '#2f9e5c', '#c98a2b', '#d64550', '#3f8fd6', '#c85fb0', '#3fa89a', '#8a5fd6'];

export function avatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export function avatarInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || '?';
}
