import dayjs from "dayjs";
import { prismaClient } from "../../prisma/prismaClient"
import { GenerateRefreshToken } from "../../provider/generateRefreshToken";
import { GenerateTokenProvider } from "../../provider/generateTokenProvider";

class RefreshTokenUserUseCase {
  async execute(refresh_token: string) {
    const refreshToken = await prismaClient.refreshToken.findFirst({
      where: {
        id: refresh_token
      }
    });

    if (!refreshToken) throw new Error("Refresh Token invalid!");

    const { userId } = refreshToken;
    const generateTokenProvider = new GenerateTokenProvider();
    const token = await generateTokenProvider.execute(userId);
    
    const refreshTokenExpired = dayjs().isAfter(dayjs.unix(refreshToken.expiresIn));
    if (refreshTokenExpired) {
      await prismaClient.refreshToken.deleteMany({
        where: {
          userId: refreshToken.userId
        }
      });
      const generateRefreshToken = new GenerateRefreshToken();
      const newRefreshToken = await generateRefreshToken.execute(refreshToken.userId);
      
      return {
        token,
        refreshToken: newRefreshToken
      };
    }

    return { token };
  }
}

export { RefreshTokenUserUseCase }
