import './common/bigintJson';
import { createApp } from './app';
import { env } from './config/env';
import { registerCronJobs } from './jobs';

const app = createApp();

app.listen(env.port, () => {
  console.log(`[TransitOps API] listening on http://localhost:${env.port} (${env.nodeEnv})`);
  registerCronJobs();
});
