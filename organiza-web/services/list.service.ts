import { api } from "@/lib/axios";
import { List, ListOverview } from "@/types/list.type";

type CreateListData = Omit<List, "id" | "userId" | "createdAt" | "updatedAt">;

export const listService = {
  getLists: async () => {
    const { data } = await api.get<ListOverview[]>("/api/lists");
    return data;
  },

  createList: async (data: CreateListData) => {
    const createdList = await api.post<List>("/api/lists", data);

    return createdList;
  },
  updateList: async (id: string, data: CreateListData) => {
    await api.put(`/api/lists/${id}`, data);
  },
  deleteList: async (id: string) => {
    await api.delete(`/api/lists/${id}`);
  },
};
