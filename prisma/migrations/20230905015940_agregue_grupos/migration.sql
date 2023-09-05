/*
  Warnings:

  - Added the required column `grupo` to the `publicadores` table without a default value. This is not possible if the table is not empty.
  - Made the column `fecha_bautismo` on table `publicadores` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `publicadores` ADD COLUMN `grupo` ENUM('G1', 'G2', 'G3', 'G4') NOT NULL,
    MODIFY `fecha_bautismo` VARCHAR(191) NOT NULL;
