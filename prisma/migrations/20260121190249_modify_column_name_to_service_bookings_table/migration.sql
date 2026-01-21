/*
  Warnings:

  - You are about to drop the column `service_time` on the `service_bookings` table. All the data in the column will be lost.
  - Added the required column `schedule_time` to the `service_bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `service_bookings` DROP COLUMN `service_time`,
    ADD COLUMN `schedule_time` CHAR(8) NOT NULL;
