import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import type { UserRole } from "@/generated/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "E-posta", type: "email" },
        password: { label: "Şifre", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const { db } = await import("@/lib/db")
        const bcrypt = await import("bcryptjs")

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.password || !user.isActive) return null

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
          organizationId: user.organizationId ?? undefined,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: UserRole }).role
        token.id = user.id
        token.organizationId = (user as { organizationId?: string }).organizationId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
        session.user.organizationId = token.organizationId as string | undefined
      }
      return session
    },
  },
})
