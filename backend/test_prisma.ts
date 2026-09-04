import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const caseId = "99b56c09-af82-44b5-87ea-222bc6e483fd";
  try {
    const rulesChecked = { 'TEST': 'PASS' };
    const guardrailResult = await prisma.guardrailEvaluation.create({
      data: {
        recoveryCaseId: caseId,
        actionType: "ESCALATE",
        status: "ALLOWED",
        reason: undefined, // undefined test
        rulesChecked: JSON.stringify(rulesChecked)
      }
    });
    console.log("Success!", guardrailResult);
  } catch (e) {
    console.error("Error!", e);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
