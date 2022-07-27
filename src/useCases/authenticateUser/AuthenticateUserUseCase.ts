import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { prismaClient } from "../../prisma/prismaClient";
import { GenerateRefreshToken } from '../../provider/generateRefreshToken';

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

    const token = sign({}, process.env.TOKEN_SECRET, {
      subject: userExists.id,
      expiresIn: "20s"
    });

    const generateRefreshToken = new GenerateRefreshToken();
    const refreshToken = await generateRefreshToken.execute(userExists.id);

    return { token, refreshToken };
  }
}

export { AuthenticateUserUseCase }
