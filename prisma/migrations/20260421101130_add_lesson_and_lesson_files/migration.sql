-- CreateTable
CREATE TABLE `lessons` (
    `lesson_id` VARCHAR(191) NOT NULL,
    `course_id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `order_index` INTEGER NOT NULL DEFAULT 0,
    `is_free_preview` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `lessons_course_id_idx`(`course_id`),
    INDEX `lessons_order_index_idx`(`order_index`),
    PRIMARY KEY (`lesson_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lesson_files` (
    `file_id` VARCHAR(191) NOT NULL,
    `lesson_id` VARCHAR(191) NOT NULL,
    `file_type` ENUM('video', 'document', 'image') NOT NULL,
    `file_url` VARCHAR(191) NOT NULL,
    `original_name` VARCHAR(191) NOT NULL,
    `duration_seconds` INTEGER NULL,
    `size_bytes` INTEGER NULL,
    `order_index` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `lesson_files_lesson_id_idx`(`lesson_id`),
    PRIMARY KEY (`file_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `lessons` ADD CONSTRAINT `lessons_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `courses`(`course_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lesson_files` ADD CONSTRAINT `lesson_files_lesson_id_fkey` FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`lesson_id`) ON DELETE CASCADE ON UPDATE CASCADE;
