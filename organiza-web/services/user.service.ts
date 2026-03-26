import { api } from "@/lib/axios";
import { UpdateUserData } from "@/types/user.types";

export const userService = {
  getMe: async () => {
    const { data } = await api.get("/api/users/me");

    return data;
  },

  updateMe: async (dataUser: UpdateUserData) => {
    const { data } = await api.patch("/api/users/", dataUser);

    return data;
  },
};
