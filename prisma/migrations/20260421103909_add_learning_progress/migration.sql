/*
  Warnings:

  - The primary key for the `enrollments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `enrollment` on the `enrollments` table. All the data in the column will be lost.
  - The required column `enrollment_id` was added to the `enrollments` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE `enrollments` DROP PRIMARY KEY,
    DROP COLUMN `enrollment`,
    ADD COLUMN `enrollment_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`enrollment_id`);

-- CreateTable
CREATE TABLE `learning_progress` (
    `progress_id` VARCHAR(191) NOT NULL,
    `enrollment_id` VARCHAR(191) NOT NULL,
    `lesson_id` VARCHAR(191) NOT NULL,
    `is_completed` BOOLEAN NOT NULL DEFAULT false,
    `watch_duration_seconds` INTEGER NOT NULL DEFAULT 0,
    `last_accessed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `completed_at` DATETIME(3) NULL,

    INDEX `learning_progress_enrollment_id_idx`(`enrollment_id`),
    UNIQUE INDEX `learning_progress_enrollment_id_lesson_id_key`(`enrollment_id`, `lesson_id`),
    PRIMARY KEY (`progress_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `learning_progress` ADD CONSTRAINT `learning_progress_enrollment_id_fkey` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollments`(`enrollment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `learning_progress` ADD CONSTRAINT `learning_progress_lesson_id_fkey` FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`lesson_id`) ON DELETE CASCADE ON UPDATE CASCADE;
