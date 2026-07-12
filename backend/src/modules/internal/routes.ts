import { Router } from 'express';
import { RoleName } from '@prisma/client';
import { requireAuth, requireRole } from '../../common/middleware/auth';
import { asyncHandler } from '../../common/asyncHandler';
import { NotFoundError } from '../../common/errors';
import { jobRegistry } from '../../jobs';

export const internalRouter = Router();

internalRouter.use(requireAuth);

/**
 * @openapi
 * /internal/jobs/{name}/run:
 *   post:
 *     tags: [Internal]
 *     summary: >
 *       DEV/DEMO ONLY — fire a cron job on demand instead of waiting for its
 *       real schedule (e.g. license-expiry-sweep, kpi-snapshot). Fleet Manager only.
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema: { type: string, enum: [license-expiry-sweep, kpi-snapshot] }
 *     responses:
 *       200:
 *         description: Job ran, returns its result and timestamp
 *       404:
 *         description: Unknown job name
 */
internalRouter.post(
  '/jobs/:name/run',
  requireRole(RoleName.FLEET_MANAGER),
  asyncHandler(async (req, res) => {
    const job = jobRegistry[req.params.name];
    if (!job) throw new NotFoundError(`Unknown job '${req.params.name}'`);

    const result = await job();
    res.json({ job: req.params.name, ranAt: new Date().toISOString(), result });
  }),
);
