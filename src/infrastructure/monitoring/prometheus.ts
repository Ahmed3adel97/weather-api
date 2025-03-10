import client from 'prom-client';
import expressPrometheusMiddleware from 'express-prometheus-middleware';

// ✅ Extend global type to avoid TypeScript error
declare global {
  var metricsRegistered: boolean;
}

// ✅ Prevent multiple registrations
if (!global.metricsRegistered) {
  client.collectDefaultMetrics();
  global.metricsRegistered = true;
}

export const prometheusMiddleware = expressPrometheusMiddleware({
  metricsPath: '/metrics',
  collectDefaultMetrics: false, // ✅ Avoid duplicate collection
});
