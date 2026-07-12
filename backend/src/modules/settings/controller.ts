import { Request, Response } from 'express';
import { asyncHandler } from '../../common/asyncHandler';
import { updateSettingsSchema } from './validators';
import * as settingsService from './service';

export const getSettingsHandler = asyncHandler(async (_req: Request, res: Response) => {
  const settings = await settingsService.getSettings();
  res.json(settings);
});

export const updateSettingsHandler = asyncHandler(async (req: Request, res: Response) => {
  const input = updateSettingsSchema.parse(req.body);
  const settings = await settingsService.updateSettings(input);
  res.json(settings);
});
