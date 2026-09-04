import { recoveryEngine } from './src/services/recovery.service';
import { prisma } from './src/db';

async function main() {
  const caseId = "99b56c09-af82-44b5-87ea-222bc6e483fd";
  try {
    // Delete the one I just inserted manually
    await prisma.guardrailEvaluation.deleteMany({ where: { recoveryCaseId: caseId } });
    
    console.log("Calling processRecoveryCase...");
    await recoveryEngine.processRecoveryCase(caseId, false);
    console.log("Done calling processRecoveryCase");

    const cases = await prisma.recoveryCase.findUnique({
      where: { id: caseId },
      include: { aiDecisions: true, guardrailEvaluations: true }
    });
    console.log(JSON.stringify(cases, null, 2));
  } catch (e) {
    console.error("Error!", e);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
