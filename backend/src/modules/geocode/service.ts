import { redis } from '../../common/redisClient';

export interface LocationSuggestion {
  label: string;
  lat: number;
  lon: number;
}

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
}

const CACHE_TTL_SECONDS = 60 * 60; // addresses don't change; cache generously to stay well within Nominatim's fair-use limits
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

export async function searchLocations(query: string): Promise<LocationSuggestion[]> {
  const cacheKey = `geocode:${query.toLowerCase()}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached) as LocationSuggestion[];
  } catch {
    // Redis being down shouldn't block autocomplete — fall through to a live fetch.
  }

  const params = new URLSearchParams({
    format: 'json',
    q: query,
    limit: '5',
    countrycodes: 'in', // this fleet's operations are India-based throughout the demo data
  });

  let suggestions: LocationSuggestion[] = [];

  try {
    const response = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
      headers: {
        // Nominatim's usage policy requires a real identifying User-Agent, not a browser UA.
        'User-Agent': 'TransitOps/1.0 (hackathon demo; contact: fleetmanager@transitops.local)',
      },
      signal: AbortSignal.timeout(5000),
    });

    if (response.ok) {
      const results = (await response.json()) as NominatimResult[];
      suggestions = results.map((r) => ({
        label: r.display_name,
        lat: Number(r.lat),
        lon: Number(r.lon),
      }));
    }
  } catch {
    // Geocoding is a convenience feature, not a business rule — a network
    // hiccup or Nominatim being unreachable should degrade to "no suggestions",
    // never break trip creation (which only needs plain text, not coordinates).
    return [];
  }

  try {
    await redis.set(cacheKey, JSON.stringify(suggestions), 'EX', CACHE_TTL_SECONDS);
  } catch {
    // best-effort cache write
  }

  return suggestions;
}
