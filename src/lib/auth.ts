import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { authConfig } from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const prisma = (await import("@/lib/prisma")).default
        const user = await prisma.user.findUnique({
          where: { email: String(credentials.email) },
        })
        if (!user?.password) return null
        const ok = await bcrypt.compare(
          String(credentials.password),
          user.password
        )
        return ok ? { id: user.id, email: user.email, name: user.name } : null
      },
    }),
  ],
})
