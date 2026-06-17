import express from 'express';
import type { HealthResponse } from '@cloud-resume/shared-types';

const app = express();
const port = 3000;

app.get('/health', (_req, res) => {
  const response: HealthResponse = { status: 'ok' };
  res.json(response);
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
