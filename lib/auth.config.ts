import type { NextAuthConfig } from "next-auth";

/**
 * Konfigurasi NextAuth untuk middleware (edge-safe: tanpa Prisma/adapter).
 * Provider credentials yang butuh database ada di lib/auth.ts.
 */
export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.email) {
        session.user.email = token.email;
        session.user.id = String(token.sub ?? token.id ?? "");
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
