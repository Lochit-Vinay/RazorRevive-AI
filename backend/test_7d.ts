import { getDashboardMetrics } from './src/controllers/dashboard.controller';

const req: any = { query: { range: '7d' } };
const res: any = {
  json: (data: any) => console.log("7D KPIs:", JSON.stringify(data.current, null, 2))
};
const next = (err: any) => console.error(err);

getDashboardMetrics(req, res, next);
