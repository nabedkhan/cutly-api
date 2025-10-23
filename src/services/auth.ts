import { User } from "@/models/User";
import { generateToken } from "@/lib/jsonwebtoken";
import { BadRequestError } from "@/utils/errors";
import { LoginPayload, RegisterPayload } from "@/validators/auth";

export class AuthService {
  static async register({ email, name, password }: RegisterPayload) {
    const userExists = await User.findOne({ email });

    if (userExists) {
      throw new BadRequestError("Invalid email or password");
    }

    const createdUser = await User.create({ name, password, email });

    await createdUser.save();

    return {
      id: createdUser._id,
      role: createdUser.role,
      name: createdUser.name,
      email: createdUser.email
    };
  }

  static async login({ email, password }: LoginPayload) {
    const user = await User.findOne({ email }).select("password role name email");
    if (!user) {
      throw new BadRequestError("Invalid email or password");
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new BadRequestError("Invalid email or password");
    }

    const payload = {
      id: user._id,
      role: user.role,
      name: user.name,
      email: user.email
    };

    const token = generateToken(payload);

    return { token, user: payload };
  }
}
