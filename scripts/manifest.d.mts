export const TARGETS: Record<string, 'chrome' | 'firefox'>;
export function buildManifest(target: string, version: string): Promise<Record<string, unknown>>;
