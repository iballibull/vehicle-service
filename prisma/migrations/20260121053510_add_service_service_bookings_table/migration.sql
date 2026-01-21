-- CreateTable
CREATE TABLE `service_bookings` (
    `id` VARCHAR(191) NOT NULL,
    `service_schedule_id` VARCHAR(191) NOT NULL,
    `customer_name` VARCHAR(100) NOT NULL,
    `phone_no` VARCHAR(20) NOT NULL,
    `vehicle_type` VARCHAR(50) NOT NULL,
    `license_plate` VARCHAR(20) NOT NULL,
    `vehicle_problem` TEXT NOT NULL,
    `status` ENUM('menunggu_konfirmasi', 'konfirmasi_batal', 'konfirmasi_datang', 'tidak_datang', 'datang') NOT NULL DEFAULT 'menunggu_konfirmasi',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_schedule`(`service_schedule_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `service_bookings` ADD CONSTRAINT `service_bookings_service_schedule_id_fkey` FOREIGN KEY (`service_schedule_id`) REFERENCES `service_schedules`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
