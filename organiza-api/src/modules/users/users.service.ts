import { prisma } from "../../lib/prisma";
import { UserUpdateSchema } from "./users.schema";

class UserService {
  static async getInfoMe(userId: string) {
    const selectedUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    return selectedUser;
  }

  static async updateInfoMe(
    userId: string,
    { name, email, avatar_url }: UserUpdateSchema,
  ) {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email, avatarUrl: avatar_url },
    });

    return updatedUser;
  }
}

export { UserService };
