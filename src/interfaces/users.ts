export interface UserResponse {
  id: string;
  role: string;
  name: string;
  email: string;
  totalVisits: number;
  phone: string | undefined;
  photoUrl: string | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserService {
  getUsers: () => Promise<UserResponse[]>;
  getUser: (id: string) => Promise<UserResponse>;
  updateUser: (id: string, userId: string, data: Partial<UserResponse>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}
