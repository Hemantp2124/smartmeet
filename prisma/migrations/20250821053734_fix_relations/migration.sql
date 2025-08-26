/*
  Warnings:

  - You are about to drop the column `created_at` on the `meeting_participants` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `meeting_participants` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `meetings` table. All the data in the column will be lost.
  - You are about to drop the column `end_time` on the `meetings` table. All the data in the column will be lost.
  - You are about to drop the column `is_online` on the `meetings` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `meetings` table. All the data in the column will be lost.
  - You are about to drop the column `meeting_url` on the `meetings` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `meetings` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."meeting_participants_meeting_id_user_id_key";

-- AlterTable
ALTER TABLE "public"."meeting_participants" DROP COLUMN "created_at",
DROP COLUMN "status",
ADD COLUMN     "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "left_at" TIMESTAMP(3),
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'PARTICIPANT';

-- AlterTable
ALTER TABLE "public"."meetings" DROP COLUMN "description",
DROP COLUMN "end_time",
DROP COLUMN "is_online",
DROP COLUMN "location",
DROP COLUMN "meeting_url",
DROP COLUMN "start_time",
ADD COLUMN     "actionItems" JSONB,
ADD COLUMN     "audio_url" TEXT,
ADD COLUMN     "link" TEXT,
ADD COLUMN     "summary" TEXT,
ADD COLUMN     "transcript" TEXT;

-- CreateTable
CREATE TABLE "public"."audio_recordings" (
    "id" TEXT NOT NULL,
    "meeting_id" TEXT NOT NULL,
    "storage_path" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'UPLOADING',
    "duration" INTEGER,
    "size" INTEGER,
    "mime_type" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "audio_recordings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."transcripts" (
    "id" TEXT NOT NULL,
    "audio_recording_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "status" TEXT NOT NULL DEFAULT 'PROCESSING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transcripts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."meeting_summaries" (
    "id" TEXT NOT NULL,
    "transcript_id" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "keyPoints" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "meeting_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."code_gen" (
    "id" TEXT NOT NULL,
    "meeting_id" TEXT NOT NULL,
    "requirement" TEXT NOT NULL,
    "code_snippet" TEXT,
    "test_cases" TEXT,
    "docs" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "code_gen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."action_items" (
    "id" TEXT NOT NULL,
    "transcript_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "due_date" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'TODO',
    "priority" TEXT DEFAULT 'MEDIUM',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "assignee_id" TEXT,

    CONSTRAINT "action_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."code_generations" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'GENERATING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "transcript_id" TEXT NOT NULL,

    CONSTRAINT "code_generations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "audio_recordings_meeting_id_key" ON "public"."audio_recordings"("meeting_id");

-- CreateIndex
CREATE UNIQUE INDEX "transcripts_audio_recording_id_key" ON "public"."transcripts"("audio_recording_id");

-- CreateIndex
CREATE UNIQUE INDEX "meeting_summaries_transcript_id_key" ON "public"."meeting_summaries"("transcript_id");

-- AddForeignKey
ALTER TABLE "public"."audio_recordings" ADD CONSTRAINT "audio_recordings_meeting_id_fkey" FOREIGN KEY ("meeting_id") REFERENCES "public"."meetings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transcripts" ADD CONSTRAINT "transcripts_audio_recording_id_fkey" FOREIGN KEY ("audio_recording_id") REFERENCES "public"."audio_recordings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."meeting_summaries" ADD CONSTRAINT "meeting_summaries_transcript_id_fkey" FOREIGN KEY ("transcript_id") REFERENCES "public"."transcripts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."code_gen" ADD CONSTRAINT "code_gen_meeting_id_fkey" FOREIGN KEY ("meeting_id") REFERENCES "public"."meetings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."action_items" ADD CONSTRAINT "action_items_transcript_id_fkey" FOREIGN KEY ("transcript_id") REFERENCES "public"."transcripts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."action_items" ADD CONSTRAINT "action_items_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."code_generations" ADD CONSTRAINT "code_generations_transcript_id_fkey" FOREIGN KEY ("transcript_id") REFERENCES "public"."transcripts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
