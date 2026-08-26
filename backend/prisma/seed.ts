import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create a default merchant
  const merchant = await prisma.merchant.upsert({
    where: { email: 'demo@razorpay.com' },
    update: {},
    create: {
      name: 'Razorpay Demo Merchant',
      email: 'demo@razorpay.com',
    },
  });

  console.log(`Created merchant: ${merchant.name}`);

  // Create customers
  const customers = [];
  for (let i = 1; i <= 50; i++) {
    const customer = await prisma.customer.create({
      data: {
        merchantId: merchant.id,
        email: `customer${i}@example.com`,
        name: `Customer ${i}`,
        lifetimeValue: Math.floor(Math.random() * 50000) + 1000,
        successCount: Math.floor(Math.random() * 10) + 1,
        failureCount: Math.floor(Math.random() * 3),
      },
    });
    customers.push(customer);
  }

  console.log(`Created ${customers.length} customers`);

  // Create successful payments
  for (let i = 0; i < 200; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    await prisma.payment.create({
      data: {
        customerId: customer.id,
        amount: Math.floor(Math.random() * 5000) + 100,
        status: 'SUCCESS',
        paymentMethod: ['CARD', 'UPI', 'NETBANKING'][Math.floor(Math.random() * 3)],
      },
    });
  }

  // Create failed payments (revenue at risk)
  const failureReasons = [
    'temporary_network_failure',
    'insufficient_funds',
    'bank_decline',
    'expired_card',
    'invalid_payment_method',
    'timeout'
  ];

  let failedCount = 0;
  for (let i = 0; i < 50; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const amount = Math.floor(Math.random() * 10000) + 500;
    const reason = failureReasons[Math.floor(Math.random() * failureReasons.length)];

    const payment = await prisma.payment.create({
      data: {
        customerId: customer.id,
        amount,
        status: 'FAILED',
        paymentMethod: ['CARD', 'UPI', 'NETBANKING'][Math.floor(Math.random() * 3)],
        failures: {
          create: {
            reason,
          }
        }
      },
    });

    // Create a recovery case for this failure
    await prisma.recoveryCase.create({
      data: {
        paymentId: payment.id,
        status: 'PENDING',
        revenueAtRisk: amount,
      }
    });
    failedCount++;
  }

  console.log(`Created ${failedCount} failed payments with recovery cases`);
  
  // Create an explicit case for testing Escalation (Exceeds Amount Limit)
  const highValueCustomer = customers[0];
  const highValuePayment = await prisma.payment.create({
      data: {
        customerId: highValueCustomer.id,
        amount: 55000, // Above typical threshold
        status: 'FAILED',
        paymentMethod: 'CARD',
        failures: {
          create: {
            reason: 'bank_decline',
          }
        }
      },
    });
    await prisma.recoveryCase.create({
      data: {
        paymentId: highValuePayment.id,
        status: 'PENDING',
        revenueAtRisk: 55000,
      }
    });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
