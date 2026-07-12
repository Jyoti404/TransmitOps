import { redis } from '../../common/redisClient';
import { DashboardKpiQuery } from './validators';

const KPI_KEY_PREFIX = 'dashboard:kpis:';
const KPI_TTL_SECONDS = 30;

export function buildKpiCacheKey(filters: DashboardKpiQuery): string {
  const parts = (Object.keys(filters) as Array<keyof DashboardKpiQuery>)
    .sort()
    .map((key) => `${key}=${filters[key] ?? ''}`);
  return `${KPI_KEY_PREFIX}${parts.join('&')}`;
}


export async function getCachedKpis<T>(key: string): Promise<T | null> {
  try {
    const cached = await redis.get(key);
    return cached ? (JSON.parse(cached) as T) : null;
  } catch {
    return null;
  }
}

export async function setCachedKpis(key: string, value: unknown): Promise<void> {
  try {
    await redis.set(key, JSON.stringify(value), 'EX', KPI_TTL_SECONDS);
  } catch {
    // best-effort cache write; a failed write just means the next read recomputes
  }
}

// Dataset is small at hackathon scale, so KEYS is fine here; swap for a
// SCAN-based cursor if this ever runs against a large production Redis.
export async function invalidateKpiCache(): Promise<void> {
  try {
    const keys = await redis.keys(`${KPI_KEY_PREFIX}*`);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch {
    // best-effort invalidation; worst case the 30s TTL catches up
  }
}
