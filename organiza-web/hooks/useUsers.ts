import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { UpdateUserData } from "@/types/user.types";

export function useGetMe() {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => userService.getMe(),
  });
}

export function useUpdateMe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updateData: UpdateUserData) =>
      userService.updateMe(updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}
