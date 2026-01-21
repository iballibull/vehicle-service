-- CreateTable
CREATE TABLE `service_schedules` (
    `id` VARCHAR(191) NOT NULL,
    `service_date` DATE NOT NULL,
    `service_time` TIME(0) NOT NULL,
    `quota` INTEGER UNSIGNED NOT NULL,
    `remaining_quota` INTEGER UNSIGNED NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `service_schedules_service_date_service_time_key`(`service_date`, `service_time`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
