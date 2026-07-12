import { Request, Response } from 'express';
import { asyncHandler } from '../../common/asyncHandler';
import { UnauthorizedError } from '../../common/errors';
import { completeTripSchema, createTripSchema, listTripsQuerySchema } from './validators';
import * as tripService from './service';

function requireUserId(req: Request): string {
  if (!req.user) throw new UnauthorizedError();
  return req.user.sub;
}

export const createTripHandler = asyncHandler(async (req: Request, res: Response) => {
  const input = createTripSchema.parse(req.body);
  const trip = await tripService.createTrip(input, requireUserId(req));
  res.status(201).json(trip);
});

export const listTripsHandler = asyncHandler(async (req: Request, res: Response) => {
  const query = listTripsQuerySchema.parse(req.query);
  const trips = await tripService.listTrips(query);
  res.json(trips);
});

export const getTripHandler = asyncHandler(async (req: Request, res: Response) => {
  const trip = await tripService.getTrip(req.params.id);
  res.json(trip);
});

export const dispatchTripHandler = asyncHandler(async (req: Request, res: Response) => {
  const trip = await tripService.dispatchTrip(req.params.id, requireUserId(req));
  res.json(trip);
});

export const completeTripHandler = asyncHandler(async (req: Request, res: Response) => {
  const input = completeTripSchema.parse(req.body);
  const trip = await tripService.completeTrip(req.params.id, input, requireUserId(req));
  res.json(trip);
});

export const cancelTripHandler = asyncHandler(async (req: Request, res: Response) => {
  const trip = await tripService.cancelTrip(req.params.id, requireUserId(req));
  res.json(trip);
});
