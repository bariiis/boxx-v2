import { auth } from "@/lib/auth"
import type { Session } from "next-auth"

const STAFF_ROLES = ["ADMIN", "EMPLOYEE"]

export async function getStaffSession(): Promise<Session | null> {
  const session = await auth()
  if (!session?.user?.role || !STAFF_ROLES.includes(session.user.role)) return null
  return session
}

/** Server actions: throws when the caller is not ADMIN/EMPLOYEE. */
export async function requireStaff(): Promise<Session> {
  const session = await getStaffSession()
  if (!session) throw new Error("Yetkisiz erişim")
  return session
}

/** Server actions: throws when there is no authenticated user at all. */
export async function requireUser(): Promise<Session> {
  const session = await auth()
  if (!session?.user) throw new Error("Yetkisiz erişim")
  return session
}
