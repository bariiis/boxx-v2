import type { UserRole } from "@/generated/prisma"

declare module "next-auth" {
  interface User {
    role?: UserRole
    organizationId?: string
  }
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role: UserRole
      organizationId?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole
    id?: string
    organizationId?: string
  }
}
