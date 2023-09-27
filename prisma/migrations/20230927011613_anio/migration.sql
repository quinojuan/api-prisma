-- AlterTable
ALTER TABLE `informe` ADD COLUMN `anio` INTEGER NOT NULL DEFAULT 2023;

-- AlterTable
ALTER TABLE `publicadores` MODIFY `fecha_nacimiento` VARCHAR(191) NULL,
    MODIFY `fecha_bautismo` VARCHAR(191) NULL,
    MODIFY `anciano` INTEGER NOT NULL DEFAULT 0,
    MODIFY `siervo_ministerial` INTEGER NOT NULL DEFAULT 0,
    MODIFY `precursor_regular` INTEGER NOT NULL DEFAULT 0,
    MODIFY `precursor_especial` INTEGER NOT NULL DEFAULT 0;
