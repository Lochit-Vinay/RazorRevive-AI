const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const c = await prisma.recoveryCase.findUnique({where: {id: '27709e27-f6a7-4255-b1e4-a4a1d3802918'}});
  console.log('Case:', c);
  const a = await prisma.recoveryAction.findMany({where: {recoveryCaseId: '27709e27-f6a7-4255-b1e4-a4a1d3802918'}});
  console.log('Actions:', a);
}
main().catch(console.error).finally(() => prisma.$disconnect());
