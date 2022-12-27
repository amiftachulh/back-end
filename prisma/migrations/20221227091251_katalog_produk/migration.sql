/*
  Warnings:

  - You are about to drop the `transactioninventories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `transactioninventories` DROP FOREIGN KEY `TransactionInventories_productId_fkey`;

-- DropForeignKey
ALTER TABLE `transactioninventories` DROP FOREIGN KEY `TransactionInventories_transactionId_fkey`;

-- AlterTable
ALTER TABLE `transaction` ADD COLUMN `createdAt` DATETIME(3) NULL,
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'unpaid';

-- DropTable
DROP TABLE `transactioninventories`;

-- CreateTable
CREATE TABLE `TransactionItems` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `transactionId` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `totalPrice` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TransactionItems` ADD CONSTRAINT `TransactionItems_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TransactionItems` ADD CONSTRAINT `TransactionItems_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `Transaction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
