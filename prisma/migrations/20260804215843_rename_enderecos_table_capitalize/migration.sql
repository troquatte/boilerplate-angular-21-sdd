/*
  Warnings:

  - You are about to drop the `enderecos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "enderecos" DROP CONSTRAINT "enderecos_clienteId_fkey";

-- DropTable
DROP TABLE "enderecos";

-- CreateTable
CREATE TABLE "Enderecos" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cep" TEXT NOT NULL,
    "logradouro" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "principal" BOOLEAN NOT NULL DEFAULT false,
    "clienteId" TEXT NOT NULL,

    CONSTRAINT "Enderecos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Enderecos_clienteId_idx" ON "Enderecos"("clienteId");

-- AddForeignKey
ALTER TABLE "Enderecos" ADD CONSTRAINT "Enderecos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE CASCADE ON UPDATE CASCADE;
