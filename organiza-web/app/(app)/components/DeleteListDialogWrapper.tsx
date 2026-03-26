"use client";

import DeleteListDialog from "./DeleteListDialog";
import { useAppStore } from "@/store/useAppStore";

export default function DeleteListDialogWrapper() {
  const { listIdSelectedToDelete, listTitleSelectedToDelete } = useAppStore();

  return (
    <DeleteListDialog
      list={listIdSelectedToDelete}
      title={listTitleSelectedToDelete}
    />
  );
}
