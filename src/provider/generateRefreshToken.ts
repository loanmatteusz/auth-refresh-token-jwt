import dayjs from 'dayjs';
import { prismaClient } from "../prisma/prismaClient";

class GenerateRefreshToken {
  async execute(userId: string) {
    const expiresIn = dayjs().add(15, "seconds").unix();
    const generateRefreshToken = await prismaClient.refreshToken.create({
      data: {
        userId,
        expiresIn,
      },
    });
    return generateRefreshToken;
  }
}

export { GenerateRefreshToken }
