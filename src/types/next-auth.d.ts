import { Role } from "@prisma/client";
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

// This file extends the default types of Auth.js to include our custom properties.

declare module "next-auth" {
  /**
   * The `session` object is what you will receive on the client-side.
   * We are adding 'id' and 'role' to the default user object.
   */
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }

  /**
   * The `user` object is the shape of the user object returned from the database adapter.
   * We need to tell TypeScript that it also has a 'role' property.
   */
  interface User extends DefaultUser {
    role: Role;
  }
}
