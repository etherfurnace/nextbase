import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      
    } & DefaultSession["user"];
    supabase: {
      access_token: string;
      refresh_token: string;
    };
  }

  interface User {
    id: string;
    email: string;
    access_token: string;
    refresh_token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
  }
}