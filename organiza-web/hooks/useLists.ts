import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listService } from "@/services/list.service";
import { List } from "@/types/list.type";

type CreateListData = Omit<List, "id" | "userId" | "createdAt" | "updatedAt">;

export function useGetLists() {
  return useQuery({
    queryKey: ["lists"],
    queryFn: listService.getLists,
  });
}

export function useCreateList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: listService.createList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
  });
}

export function useDeleteList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => listService.deleteList(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useUpdateList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateListData }) =>
      listService.updateList(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
  });
}
