import { compare } from 'bcryptjs';
import { prismaClient } from "../../prisma/prismaClient";
import { GenerateRefreshToken } from '../../provider/generateRefreshToken';
import { GenerateTokenProvider } from '../../provider/generateTokenProvider';

interface IRequest {
  username: string;
  password: string;
}

class AuthenticateUserUseCase {
  async execute({username, password}: IRequest) {
    const userExists = await prismaClient.user.findFirst({
      where: {
        username
      }
    });

    if (!userExists) throw new Error("User or password incorrent!");

    const passwordMatch = compare(password, userExists.password);
    
    if (!passwordMatch) throw new Error("User or password incorrent!");

    const generateTokenProvider = new GenerateTokenProvider();
    const token = await generateTokenProvider.execute(userExists.id);

    await prismaClient.refreshToken.deleteMany({
      where: {
        userId: userExists.id
      }
    });

    const generateRefreshToken = new GenerateRefreshToken();
    const refreshToken = await generateRefreshToken.execute(userExists.id);

    return { token, refreshToken };
  }
}

export { AuthenticateUserUseCase }
