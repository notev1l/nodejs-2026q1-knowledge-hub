/*
  Warnings:

  - The `role` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'editor', 'viewer');

-- CreateEnum
CREATE TYPE "ArticleStatus" AS ENUM ('draft', 'published', 'archived');

-- AlterTable
ALTER TABLE "user" DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'viewer';

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "article" (
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" VARCHAR(10000) NOT NULL,
    "status" "ArticleStatus" NOT NULL DEFAULT 'draft',
    "author_id" UUID,
    "category_id" UUID,
    "created_at" TIMESTAMPTZ,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "article_pkey" PRIMARY KEY ("id")
);
