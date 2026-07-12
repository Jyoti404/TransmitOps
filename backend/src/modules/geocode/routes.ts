import { Router } from 'express';
import { requireAuth } from '../../common/middleware/auth';
import { searchLocationsHandler } from './controller';

export const geocodeRouter = Router();

geocodeRouter.use(requireAuth);

/**
 * @openapi
 * /geocode/search:
 *   get:
 *     tags: [Geocode]
 *     summary: Address autocomplete suggestions (proxies OpenStreetMap Nominatim, India-biased, Redis-cached)
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema: { type: string, minLength: 3 }
 *     responses:
 *       200:
 *         description: Up to 5 { label, lat, lon } suggestions, empty array if none or on upstream failure
 */
geocodeRouter.get('/search', searchLocationsHandler);
