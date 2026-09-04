const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Updating cases to recent dates...');
  const cases = await prisma.recoveryCase.findMany();
  
  for (let i = 0; i < cases.length; i++) {
    // Distribute cases across the last 40 days
    // 20% in last 24h
    // 30% in last 7d
    // 30% in last 30d
    // 20% > 30d
    const rand = Math.random();
    let hoursAgo = 0;
    
    if (rand < 0.2) {
      hoursAgo = Math.random() * 23; // last 24h
    } else if (rand < 0.5) {
      hoursAgo = 24 + Math.random() * (24 * 6); // last 7d
    } else if (rand < 0.8) {
      hoursAgo = 24 * 7 + Math.random() * (24 * 23); // last 30d
    } else {
      hoursAgo = 24 * 30 + Math.random() * (24 * 10); // > 30d
    }
    
    const newDate = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
    
    await prisma.recoveryCase.update({
      where: { id: cases[i].id },
      data: { 
        createdAt: newDate,
        updatedAt: newDate
      }
    });

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
  console.log(`Updated ${cases.length} cases to distributed dates.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
