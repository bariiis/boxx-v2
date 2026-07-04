"use client";

import { motion } from "motion/react";
import { TrendingUp, MessageSquare, Zap, Shield, Star, BarChart2, Globe, Lock, Users, Cpu } from "lucide-react";

function XIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function GrokIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="M5 19l1 3 1-3 3-1-3-1-1-3-1 3-3 1 3 1z" />
    </svg>
  );
}

function ProfileShieldIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <circle cx="12" cy="10" r="3" />
      <path d="M12 13c-2.5 0-4.5 1.5-4.5 3.5V18h9v-1.5c0-2-2-3.5-4.5-3.5z" />
    </svg>
  );
}

export const ICON_MAP: Record<string, React.ReactNode> = {
  "trending-up":     <TrendingUp className="w-6 h-6" strokeWidth={1.5} />,
  "x-grok":          <div className="flex items-center gap-2"><XIcon className="w-6 h-6" /><span className="text-white/60">+</span><GrokIcon className="w-5 h-5" /></div>,
  "profile-shield":  <ProfileShieldIcon className="w-6 h-6" />,
  "zap":             <Zap className="w-6 h-6" strokeWidth={1.5} />,
  "shield":          <Shield className="w-6 h-6" strokeWidth={1.5} />,
  "star":            <Star className="w-6 h-6" strokeWidth={1.5} />,
  "bar-chart":       <BarChart2 className="w-6 h-6" strokeWidth={1.5} />,
  "globe":           <Globe className="w-6 h-6" strokeWidth={1.5} />,
  "lock":            <Lock className="w-6 h-6" strokeWidth={1.5} />,
  "users":           <Users className="w-6 h-6" strokeWidth={1.5} />,
  "cpu":             <Cpu className="w-6 h-6" strokeWidth={1.5} />,
};

export interface AdvantageItem {
  icon: string;
  title: string;
  description: string;
}

function AdvantageCard({ icon, title, description, delay = 0 }: AdvantageItem & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col items-center text-center px-4"
    >
      <div className="mb-6 text-white/80">
        {ICON_MAP[icon] ?? <Star className="w-6 h-6" strokeWidth={1.5} />}
      </div>
      <h3 className="text-white font-semibold text-base mb-3">{title}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed max-w-[280px]">{description}</p>
    </motion.div>
  );
}

const DEFAULT_ADVANTAGES: AdvantageItem[] = [
  {
    icon: "trending-up",
    title: "Hızlı VIP Destek",
    description: "Öncelikli destek ekibimizle sorunlarınızı hızla çözün.",
  },
  {
    icon: "x-grok",
    title: "Premium+ ve Grok",
    description: "Tüm premium özellikler ve gelişmiş AI yeteneklerine erişin.",
  },
  {
    icon: "profile-shield",
    title: "Özel Profil",
    description: "İşletmenizi öne çıkarın, tüm bağlı hesapları tek yerden yönetin.",
  },
];

export interface AdvantagesXPremiumConfig {
  heading?: string;
  advantages?: AdvantageItem[];
  ctaText?: string;
  ctaHref?: string;
}

export default function AdvantagesXPremium({
  heading = "Temel Özellikler",
  advantages = DEFAULT_ADVANTAGES,
  ctaText = "Sorularınız için destek ekibimize ulaşın",
  ctaHref = "#",
}: AdvantagesXPremiumConfig) {
  return (
    <section className="w-full bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-16 lg:mb-20"
        >
          {heading}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 mb-16 lg:mb-20">
          {advantages.map((adv, i) => (
            <AdvantageCard key={i} {...adv} delay={i * 0.1} />
          ))}
        </div>

        {ctaText && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center"
          >
            <a
              href={ctaHref || "#"}
              className="flex items-center gap-2.5 px-6 py-3 rounded-full border border-zinc-700 bg-transparent text-white text-sm font-medium hover:border-zinc-500 hover:bg-zinc-900/50 transition-all duration-200"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{ctaText}</span>
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
