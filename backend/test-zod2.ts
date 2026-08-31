import { z } from 'zod';
const caseIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Case ID cannot be empty')
  })
});

const req = { params: { id: '123' } };
const { params } = caseIdSchema.parse({ params: req.params });
console.log('id is:', params.id);
