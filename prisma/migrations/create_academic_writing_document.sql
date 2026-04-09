-- Create AcademicWritingDocument table manually
CREATE TABLE IF NOT EXISTS "public"."AcademicWritingDocument" (
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

-- Create indexes
CREATE INDEX IF NOT EXISTS "AcademicWritingDocument_isActive_idx" ON "public"."AcademicWritingDocument"("isActive");
CREATE INDEX IF NOT EXISTS "AcademicWritingDocument_createdAt_idx" ON "public"."AcademicWritingDocument"("createdAt");

-- Verify table was created
SELECT 'Table created successfully!' as status;
