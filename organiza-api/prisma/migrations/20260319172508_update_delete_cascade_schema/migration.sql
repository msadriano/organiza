-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_list_id_fkey";

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;
