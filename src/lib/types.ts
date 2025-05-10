import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    name?: string;
  }
}

export interface SignInFormData {
  email: string;
  password: string;
}

export interface SignUpFormData {
  name?: string;
  email: string;
  password: string;
  confirmPassword: string;
}
