import { LoginPayload, RegisterPayload } from "@/validators/auth";

export interface UserResponse {
  id: string;
  role: string;
  name: string;
  email: string;
}

export interface ServiceAuth {
  register: (payload: RegisterPayload) => Promise<UserResponse>;
  login: (payload: LoginPayload) => Promise<{ token: string; user: UserResponse }>;
}
