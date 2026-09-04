import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const cases = await prisma.recoveryCase.findMany({
    include: {
      aiDecisions: true,
      guardrailEvaluations: true,
      payment: {
        include: { customer: true }
      }
    }
  });
  
  const c = cases.find(c => c.payment.customer.name.includes("Demo 3") || c.aiDecisions.some(a => a.recommendedAction === 'ESCALATE'));
  console.log(JSON.stringify(c, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
