import { describe, expect, it } from 'vitest';
import { badgeFor } from '../../src/shared/badge';

const labels = { on: 'ON', off: 'OFF' };

describe('badgeFor', () => {
  it('shows the on label when enabled', () => {
    expect(badgeFor(true, labels).text).toBe('ON');
  });

  it('shows the off label when disabled', () => {
    expect(badgeFor(false, labels).text).toBe('OFF');
  });

  it('uses different colors for each state', () => {
    expect(badgeFor(true, labels).color).not.toBe(badgeFor(false, labels).color);
  });
});
