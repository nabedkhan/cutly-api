import { User, UserDocument } from "@/models/User";
import { BadRequestError, ForbiddenError, NotFoundError } from "@/utils/errors";

type UserResponse = Omit<UserDocument, "password" | "comparePassword">;

export class UserService {
  static async getUsers(): Promise<UserResponse[]> {
    const users = await User.find().select("-password -__v");
    return users;
  }

  static async getUser(id: string): Promise<UserResponse> {
    const user = await User.findById(id).select("-password -__v");
    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }

  static async updateUser(id: string, userId: string, data: Partial<UserDocument>): Promise<void> {
    const { name, phone, photoUrl } = data;

    if (phone) {
      const phoneAlreadyExists = await User.findOne({ phone }).select("_id");
      if (phoneAlreadyExists) {
        throw new BadRequestError("Phone number already taken");
      }
    }

    const userExists = await User.findById(id).select("_id");
    if (!userExists) {
      throw new NotFoundError("Invalid request");
    }

    if (userId !== userExists.id) {
      throw new ForbiddenError("Forbidden access! You are not authorized to access this resource");
    }

    await User.updateOne({ _id: id }, { name, phone, photoUrl });
  }

  static async deleteUser(id: string): Promise<{ _id: string }> {
    const user = await User.findByIdAndDelete(id).select("_id");
    if (!user) {
      throw new NotFoundError("User not found");
    }

    return { _id: user.id };
  }
}
