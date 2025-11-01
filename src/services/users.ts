import { User } from "@/models/User";
import { BadRequestError, ForbiddenError, NotFoundError } from "@/utils/errors";
import { UserResponse, IUserService } from "@/interfaces/users";

export class UserService implements IUserService {
  async getUsers(): Promise<UserResponse[]> {
    const users = await User.find().select("-password -__v");

    return users.map((user) => ({
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
      totalVisits: user.totalVisits,
      phone: user.phone,
      photoUrl: user.photoUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));
  }

  async getUser(id: string): Promise<UserResponse> {
    const user = await User.findById(id).select("-password -__v");
    if (!user) {
      throw new NotFoundError("User not found");
    }

    return {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
      totalVisits: user.totalVisits,
      phone: user.phone,
      photoUrl: user.photoUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  async updateUser(id: string, userId: string, data: Partial<UserResponse>) {
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

  async deleteUser(id: string) {
    const user = await User.findByIdAndDelete(id).select("_id");
    if (!user) {
      throw new NotFoundError("User not found");
    }
  }
}
