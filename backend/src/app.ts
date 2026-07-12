import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { swaggerSpec } from './config/swagger';
import { errorHandler, notFoundHandler } from './common/errorHandler';
import { authRouter } from './modules/auth/routes';
import { vehicleRouter } from './modules/vehicle/routes';
import { driverRouter } from './modules/driver/routes';
import { tripRouter } from './modules/trip/routes';
import { maintenanceRouter } from './modules/maintenance/routes';
import { expenseRouter, fuelLogRouter } from './modules/fuelExpense/routes';
import { dashboardRouter } from './modules/dashboard/routes';
import './modules/dashboard/cacheInvalidation';
import { internalRouter } from './modules/internal/routes';
import { reportsRouter } from './modules/reports/routes';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.corsOrigin, credentials: true }));
  app.use(express.json());

  app.get('/health', (_req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use('/api/auth', authRouter);
  app.use('/api/vehicles', vehicleRouter);
  app.use('/api/drivers', driverRouter);
  app.use('/api/trips', tripRouter);
  app.use('/api/maintenance', maintenanceRouter);
  app.use('/api/fuel-logs', fuelLogRouter);
  app.use('/api/expenses', expenseRouter);
  app.use('/api/dashboard', dashboardRouter);
  app.use('/api/internal', internalRouter);
  app.use('/api/reports', reportsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
