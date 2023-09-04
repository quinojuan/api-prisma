-- CreateTable
CREATE TABLE `post` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `content` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `producto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(191) NOT NULL,
    `precio_venta` INTEGER NOT NULL,
    `codigo` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `informe` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mes` ENUM('ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE') NOT NULL,
    `publicaciones` INTEGER NOT NULL,
    `videos` INTEGER NOT NULL,
    `horas` INTEGER NOT NULL,
    `revisitas` INTEGER NOT NULL,
    `estudios` INTEGER NOT NULL,
    `notas` VARCHAR(191) NOT NULL,
    `publicadorId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `publicadores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `apellido` VARCHAR(191) NOT NULL,
    `fecha_nacimiento` DATETIME(3) NOT NULL,
    `fecha_bautismo` DATETIME(3) NULL,
    `esperanza` ENUM('OTRAS_OVEJAS', 'UNGIDO') NOT NULL,
    `anciano` BOOLEAN NOT NULL DEFAULT false,
    `siervo_ministerial` BOOLEAN NOT NULL DEFAULT false,
    `precursor_regular` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `informe` ADD CONSTRAINT `informe_publicadorId_fkey` FOREIGN KEY (`publicadorId`) REFERENCES `publicadores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
