import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class AuthService {
  static async checkEmailExists(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    });

    return user ? true : false;
  }
}

export { AuthService };
