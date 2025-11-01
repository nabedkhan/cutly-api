import { User } from "@/models/User";
import { generateToken } from "@/lib/jsonwebtoken";
import { BadRequestError } from "@/utils/errors";
import { LoginPayload, RegisterPayload } from "@/validators/auth";
import { IAuthService, UserResponse } from "@/interfaces/auth";

export class AuthService implements IAuthService {
  async register({ email, name, password }: RegisterPayload): Promise<UserResponse> {
    const userExists = await User.findOne({ email });

    if (userExists) {
      throw new BadRequestError("Invalid email or password");
    }

    const createdUser = await User.create({ name, password, email });
    await createdUser.save();

    return {
      id: createdUser.id,
      role: createdUser.role,
      name: createdUser.name,
      email: createdUser.email
    };
  }

  async login({ email, password }: LoginPayload): Promise<{ token: string; user: UserResponse }> {
    const user = await User.findOne({ email }).select("password role name email");
    if (!user) {
      throw new BadRequestError("Invalid email or password");
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new BadRequestError("Invalid email or password");
    }

    const payload = {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email
    };

    const token = generateToken(payload);

    return { token, user: payload };
  }
}
