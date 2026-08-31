import { z, ZodError } from 'zod';
const s = z.object({ body: z.object({ key: z.string() }) });
try {
  s.parse({ body: {} });
} catch (e: any) {
  console.log('is ZodError?', e instanceof ZodError);
  console.log('e.name:', e.name);
}
