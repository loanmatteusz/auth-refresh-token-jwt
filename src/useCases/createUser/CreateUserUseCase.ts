import { prismaClient } from '../../prisma/prismaClient';
import { hash } from 'bcryptjs';

interface IUserResquest {
  name:     string;
  username: string;
  password: string;
}

class CreateUserUseCase {
  async execute({name, username, password}: IUserResquest) {

    const userAlreadyExists = await prismaClient.user.findFirst({
      where: {
        username
      }
    });

    if (userAlreadyExists) throw new Error("User already exists!");

    const passwordHash = await hash(password, 8);

    const user = await prismaClient.user.create({
      data: {
        name,
        username,
        password: passwordHash
      }
    });

    return user;
  }
}

export { CreateUserUseCase }
