import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Updating cases to recent dates...');
  const cases = await prisma.recoveryCase.findMany();
  
  for (let i = 0; i < cases.length; i++) {
    // Randomize dates between now and 48 hours ago
    const randomHoursAgo = Math.random() * 48;
    const newDate = new Date(Date.now() - randomHoursAgo * 60 * 60 * 1000);
    
    await prisma.recoveryCase.update({
      where: { id: cases[i].id },
      data: { 
        createdAt: newDate,
        updatedAt: newDate
      }
    });

    // Also update associated actions and logs to match
    await prisma.recoveryAction.updateMany({
      where: { recoveryCaseId: cases[i].id },
      data: { executedAt: newDate }
    });

    await prisma.auditLog.updateMany({
      where: { recoveryCaseId: cases[i].id },
      data: { createdAt: newDate }
    });

    await prisma.paymentFailure.updateMany({
      where: { payment: { cases: { some: { id: cases[i].id } } } },
      data: { createdAt: newDate }
    });
  }
  console.log(`Updated ${cases.length} cases to recent dates.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
