-- CreateEnum
CREATE TYPE "StatusOrder" AS ENUM ('WAITING', 'WITHDRAWN', 'DELIVERED', 'RETURNED');

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "image" TEXT,
    "status" "StatusOrder" NOT NULL DEFAULT 'WAITING',
    "withdrawn_date" TIMESTAMP(3),
    "delivery_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "recipient_id" TEXT NOT NULL,
    "deliveryman_id" TEXT NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "recipients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_deliveryman_id_fkey" FOREIGN KEY ("deliveryman_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
