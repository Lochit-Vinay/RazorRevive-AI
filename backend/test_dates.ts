import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const cases = await prisma.recoveryCase.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  console.log(cases.map(c => c.createdAt));
}
main().catch(console.error).finally(() => prisma.$disconnect());
