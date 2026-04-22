-- CreateTable
CREATE TABLE `enrollments` (
    `enrollment` VARCHAR(191) NOT NULL,
    `student_id` VARCHAR(191) NOT NULL,
    `course_id` VARCHAR(191) NOT NULL,
    `status` ENUM('active', 'completed', 'dropped') NOT NULL DEFAULT 'active',
    `is_paid` BOOLEAN NOT NULL DEFAULT false,
    `amount_paid` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `enrolled_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `completed_at` DATETIME(3) NULL,
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `enrollments_student_id_idx`(`student_id`),
    INDEX `enrollments_course_id_idx`(`course_id`),
    UNIQUE INDEX `enrollments_student_id_course_id_key`(`student_id`, `course_id`),
    PRIMARY KEY (`enrollment`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `enrollments` ADD CONSTRAINT `enrollments_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `enrollments` ADD CONSTRAINT `enrollments_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `courses`(`course_id`) ON DELETE CASCADE ON UPDATE CASCADE;
