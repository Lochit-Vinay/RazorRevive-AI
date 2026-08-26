-- CreateTable
CREATE TABLE "Merchant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "merchantId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lifetimeValue" REAL NOT NULL DEFAULT 0,
    "successCount" INTEGER NOT NULL DEFAULT 0,
    "failureCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Customer_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Payment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PaymentFailure" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "paymentId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "code" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PaymentFailure_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RecoveryCase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "paymentId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "revenueAtRisk" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RecoveryCase_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AiDecision" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recoveryCaseId" TEXT NOT NULL,
    "rootCause" TEXT NOT NULL,
    "recoverability" TEXT NOT NULL,
    "confidence" REAL NOT NULL,
    "recommendedAction" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AiDecision_recoveryCaseId_fkey" FOREIGN KEY ("recoveryCaseId") REFERENCES "RecoveryCase" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GuardrailEvaluation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recoveryCaseId" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "reason" TEXT,
    "rulesChecked" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GuardrailEvaluation_recoveryCaseId_fkey" FOREIGN KEY ("recoveryCaseId") REFERENCES "RecoveryCase" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RecoveryAction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recoveryCaseId" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "executedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RecoveryAction_recoveryCaseId_fkey" FOREIGN KEY ("recoveryCaseId") REFERENCES "RecoveryCase" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recoveryCaseId" TEXT,
    "eventType" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_recoveryCaseId_fkey" FOREIGN KEY ("recoveryCaseId") REFERENCES "RecoveryCase" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Merchant_email_key" ON "Merchant"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_merchantId_email_key" ON "Customer"("merchantId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "RecoveryAction_idempotencyKey_key" ON "RecoveryAction"("idempotencyKey");
