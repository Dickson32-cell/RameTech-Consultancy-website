-- CreateTable
CREATE TABLE "AcademicWritingDocument" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER,
    "uploadedBy" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AcademicWritingDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AcademicWritingDocument_isActive_idx" ON "AcademicWritingDocument"("isActive");

-- CreateIndex
CREATE INDEX "AcademicWritingDocument_createdAt_idx" ON "AcademicWritingDocument"("createdAt");
