"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Sparkles, MessageSquare } from "lucide-react"

export function StuuxStickyCta() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const vh = window.innerHeight
      // Show after user scrolls past first viewport; hide near page bottom (in footer CTA)
      const nearBottom =
        window.innerHeight + y >= document.documentElement.scrollHeight - vh * 0.6
      setVisible(y > vh * 0.6 && !nearBottom)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  return (
    <div
      aria-hidden={!visible}
      className={[
        "pointer-events-none fixed inset-x-0 bottom-4 z-40 mx-auto flex w-fit items-center gap-2 rounded-full p-1.5 stuux-glass transition-all duration-300 sm:bottom-6 sm:right-6 sm:inset-x-auto sm:mx-0",
        visible
          ? "visible translate-y-0 opacity-100"
          : "invisible pointer-events-none translate-y-4 opacity-0",
      ].join(" ")}
      style={{ pointerEvents: visible ? "auto" : "none" }}
    >
      <Link
        href="/konfigurator"
        className="stuux-btn-primary inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium"
      >
        <Sparkles className="h-4 w-4" />
        Yapılandır
      </Link>
      <Link
        href="/iletisim"
        className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors duration-200 hover:bg-black/5"
        style={{ color: "var(--stuux-primary)" }}
      >
        <MessageSquare className="h-4 w-4" />
        Teklif İste
      </Link>
    </div>
  )
}
