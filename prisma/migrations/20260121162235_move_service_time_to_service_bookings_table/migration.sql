/*
  Warnings:

  - You are about to drop the column `service_time` on the `service_schedules` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[service_date]` on the table `service_schedules` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `service_time` to the `service_bookings` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `service_schedules_service_date_service_time_key` ON `service_schedules`;

-- AlterTable
ALTER TABLE `service_bookings` ADD COLUMN `service_time` CHAR(8) NOT NULL;

-- AlterTable
ALTER TABLE `service_schedules` DROP COLUMN `service_time`;

-- CreateIndex
CREATE UNIQUE INDEX `service_schedules_service_date_key` ON `service_schedules`(`service_date`);
