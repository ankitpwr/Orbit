-- 1. Add the column as nullable
ALTER TABLE "Monitor" ADD COLUMN "lastlatency" INTEGER;

-- 2. Update existing rows
UPDATE "Monitor" SET "lastlatency" = 50;

-- 3. Set the column to NOT NULL
ALTER TABLE "Monitor" ALTER COLUMN "lastlatency" SET NOT NULL;
