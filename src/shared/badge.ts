export interface BadgeState {
  text: string;
  color: string;
}

/** Badge shown on the toolbar icon for the given enabled state. */
export function badgeFor(enabled: boolean, labels: { on: string; off: string }): BadgeState {
  return enabled ? { text: labels.on, color: '#2e7d32' } : { text: labels.off, color: '#757575' };
}
