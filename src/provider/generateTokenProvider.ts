import { sign } from "jsonwebtoken";

class GenerateTokenProvider {
  async execute(userId: string) {
    const token = sign({}, process.env.TOKEN_SECRET, {
      subject: userId,
      expiresIn: "30s"
    });

    return token;
  }
}

export { GenerateTokenProvider }
