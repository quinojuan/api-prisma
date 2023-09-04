/*
  Warnings:

  - Added the required column `genero` to the `publicadores` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `informe` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `publicadores` ADD COLUMN `genero` ENUM('HOMBRE', 'MUJER') NOT NULL;
