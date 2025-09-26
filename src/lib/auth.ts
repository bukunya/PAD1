import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma"; // Using your shared prisma instance
import { Role } from "@/generated/prisma"; // Importing the Role enum for type safety

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login", 
  },
  events: {
    async createUser({ user }) {
      const role: Role = user.email?.endsWith("@ugm.ac.id")
        ? Role.DOSEN
        : Role.MAHASISWA;

      await prisma.user.update({
        where: { id: user.id },
        data: { role },
      });
    },
  },
  callbacks: {
    async signIn({ profile }) {
      if (!profile?.email) return false;
      const allowedDomains = ["ugm.ac.id", "mail.ugm.ac.id"];
      const userDomain = profile.email.split("@")[1];
      return allowedDomains.includes(userDomain);
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
});