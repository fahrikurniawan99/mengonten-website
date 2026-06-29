"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import { Icon } from "@iconify/react";
import { useRef, useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { useSubscriptionPlans, type SubscriptionPlan } from "@/hooks/useSubscription";

const features = [
  {
    icon: "lucide:film",
    title: "AI Video Clipping",
    desc: "Ubah video YouTube panjang jadi puluhan cuplikan pendek secara otomatis dengan AI.",
  },
  {
    icon: "lucide:share-2",
    title: "Upload ke Sosmed",
    desc: "Publikasikan langsung ke TikTok, Instagram, dan YouTube dalam satu klik.",
  },
  {
    icon: "lucide:zap",
    title: "Proses Cepat",
    desc: "Teknologi AI kami memproses video dalam hitungan menit, bukan jam.",
  },
  {
    icon: "lucide:bar-chart-3",
    title: "Analytics",
    desc: "Pantau performa setiap cuplikan dan optimalkan strategi konten Anda.",
  },
];

export default function Home() {
  const featuresRef = useRef<HTMLDivElement>(null);
  const [visibleFeatures, setVisibleFeatures] = useState<Set<number>>(new Set());
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, token } = useAuthStore();
  const { data: plans, isLoading } = useSubscriptionPlans();

  const parseBenefits = (benefits: string): string[] => {
    try {
      const parsed = JSON.parse(benefits);
      return Array.isArray(parsed) ? parsed : [benefits];
    } catch {
      return benefits.split(",").map((s) => s.trim());
    }
  };

  const formatPrice = (price: number): string => {
    if (price >= 1000000) return `${(price / 1000000).toFixed(1)}jt`;
    if (price >= 1000) return `${(price / 1000).toFixed(0)}rb`;
    return "0";
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-idx"));
            setVisibleFeatures((prev) => new Set(prev).add(idx));
          }
        }
      },
      { threshold: 0.2 },
    );
    const items = featuresRef.current?.querySelectorAll("[data-idx]");
    if (items) {
      for (const item of items) {
        observer.observe(item);
      }
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-6 py-3 backdrop-blur-md lg:px-12">
        <Logo imgSize="h-7" textSize="text-sm" />
        <div className="flex items-center gap-4">
          {token ? (
            <div className="relative" ref={userMenuRef}>
              <button
                className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-800/60 hover:text-zinc-200"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="flex size-7 items-center justify-center rounded-full bg-red-700 text-xs font-medium text-white">
                  {(user?.email || "U").charAt(0).toUpperCase()}
                </div>
                <span className="max-w-28 truncate">{user?.email || "User"}</span>
                <Icon className="size-3.5" icon="lucide:chevron-down" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow-xl">
                  <Link
                    className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
                    href="/workspace"
                  >
                    <Icon className="size-4" icon="lucide:layout-dashboard" />
                    Workspace
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                className="text-sm text-zinc-400 transition-colors hover:text-zinc-200"
                href="/login"
              >
                Masuk
              </Link>
              <Link
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-500"
                href="/login"
              >
                Daftar Gratis
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative mt-16 flex flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-20 text-center lg:px-12 lg:pt-32 lg:pb-28">
        {/* Grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-red-950/10 via-transparent to-zinc-950" />
        {/* Decorative orbs */}
        <div className="pointer-events-none absolute -top-40 right-1/4 size-96 rounded-full bg-red-600/10 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 left-1/4 size-80 rounded-full bg-red-700/10 blur-[100px]" />
        {/* Decorative lines */}
        <div className="pointer-events-none absolute left-10 top-20 h-px w-32 bg-gradient-to-r from-transparent via-red-500/20 to-transparent lg:left-20" />
        <div className="pointer-events-none absolute right-10 bottom-20 h-px w-32 bg-gradient-to-r from-transparent via-red-500/20 to-transparent lg:right-20" />
        <div className="pointer-events-none absolute left-1/4 top-10 h-20 w-px bg-gradient-to-b from-transparent via-red-500/10 to-transparent" />
        <div className="pointer-events-none absolute right-1/4 bottom-10 h-20 w-px bg-gradient-to-b from-transparent via-red-500/10 to-transparent" />
        <div className="relative mx-auto max-w-4xl">
          <h1
            className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-bricolage)" }}
          >
            Buat Puluhan{" "}
            <span className="bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">
              Cuplikan Video
            </span>{" "}
            dalam Hitungan Menit
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-zinc-400 lg:text-lg">
            Ubah video YouTube kamu menjadi puluhan cuplikan pendek siap-viral
            dengan AI. Upload ke TikTok, Instagram, dan YouTube dalam satu
            klik. Tingkatkan reach konten kamu sekarang.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              className="w-full rounded-lg bg-red-600 px-8 py-3 text-center text-sm font-bold text-white shadow-lg shadow-red-600/25 transition-all hover:bg-red-500 hover:shadow-red-500/30 sm:w-auto"
              href="/login"
            >
              Mulai Gratis
            </Link>
            <button
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-8 py-3 text-center text-sm font-semibold text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100 sm:w-auto"
              onClick={scrollToFeatures}
            >
              Lihat Fitur
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="border-t border-zinc-800 px-6 py-20 lg:px-12 lg:py-28"
      >
        <div className="mx-auto max-w-6xl" ref={featuresRef}>
          <div className="mb-14 text-center">
            <h2
              className="mb-4 text-3xl font-bold text-white lg:text-4xl"
              style={{ fontFamily: "var(--font-bricolage)" }}
            >
              Kenapa{" "}
              <span className="text-red-500">Mengonten</span>?
            </h2>
            <p className="mx-auto max-w-2xl text-zinc-400">
              Platform all-in-one untuk kreator yang ingin mempercepat produksi
              konten tanpa mengorbankan kualitas.
            </p>
          </div>
          <div className="relative mx-auto max-w-4xl">
            {/* Connecting line */}
            <div className="absolute left-[23px] top-4 h-[calc(100%-2rem)] w-px bg-gradient-to-b from-red-600/30 via-red-600/10 to-transparent lg:left-[27px]" />
            <div className="space-y-16">
              {features.map((f, i) => (
                <div
                  key={f.title}
                  data-idx={i}
                  className={`relative flex items-start gap-6 transition-all duration-700 ease-out lg:gap-8 ${
                    visibleFeatures.has(i)
                      ? "translate-y-0 opacity-100"
                      : "translate-y-6 opacity-0"
                  }`}
                  style={{ transitionDelay: `${i * 150}ms` }}
                >
                  <div className="relative flex shrink-0">
                    <div className="relative z-10 flex size-[46px] items-center justify-center rounded-2xl bg-zinc-950 text-red-500 ring-1 ring-red-800/30 lg:size-[54px]">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-950/50 to-red-950/10" />
                      <Icon className="relative size-5 lg:size-6" icon={f.icon} />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5">
                    <h3
                      className="mb-2 text-xl font-bold text-white lg:text-2xl"
                      style={{ fontFamily: "var(--font-bricolage)" }}
                    >
                      {f.title}
                    </h3>
                    <p className="max-w-2xl text-base leading-relaxed text-zinc-400">
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="border-t border-zinc-800 px-6 py-20 lg:px-12 lg:py-28"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <h2
              className="mb-4 text-3xl font-bold text-white lg:text-4xl"
              style={{ fontFamily: "var(--font-bricolage)" }}
            >
              Pilihan Harga{" "}
              <span className="text-red-500">Fleksibel</span>
            </h2>
            <p className="mx-auto max-w-2xl text-zinc-400">
              Pilih paket yang sesuai dengan kebutuhan konten kamu. Bisa
              upgrade kapan saja.
            </p>
          </div>
          {isLoading ? (
            <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex animate-pulse flex-col rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                  <div className="mb-4 h-5 w-20 rounded bg-zinc-800" />
                  <div className="mb-1 h-3 w-32 rounded bg-zinc-800" />
                  <div className="mb-6 mt-4 h-8 w-28 rounded bg-zinc-800" />
                  <div className="mb-8 space-y-2.5">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="h-3.5 w-full rounded bg-zinc-800" />
                    ))}
                  </div>
                  <div className="mt-auto h-10 w-full rounded-lg bg-zinc-800" />
                </div>
              ))}
            </div>
          ) : (
            <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
              {plans
                ?.filter((p) => p.is_active)
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((plan, idx) => {
                  const isPopular = idx === 1;
                  const benefits = parseBenefits(plan.benefits);
                  return (
                    <div
                      key={plan.id}
                      className={`relative flex flex-col rounded-xl border p-6 transition-all ${
                        isPopular
                          ? "border-red-700 bg-red-950/20 shadow-lg shadow-red-950/30"
                          : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
                      }`}
                    >
                      {isPopular && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-red-600 px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                          Populer
                        </span>
                      )}
                      <div className="mb-5">
                        <h3
                          className="text-lg font-bold text-white"
                          style={{ fontFamily: "var(--font-bricolage)" }}
                        >
                          {plan.name}
                        </h3>
                        <p className="mt-1 text-sm text-zinc-500">{plan.description}</p>
                      </div>
                      <div className="mb-6 flex items-baseline gap-0.5">
                        {plan.type === "free" ? (
                          <span
                            className="text-4xl font-extrabold text-white"
                            style={{ fontFamily: "var(--font-bricolage)" }}
                          >
                            Gratis
                          </span>
                        ) : (
                          <>
                            <span className="text-3xl font-bold text-white">Rp</span>
                            <span
                              className="text-4xl font-extrabold text-white"
                              style={{ fontFamily: "var(--font-bricolage)" }}
                            >
                              {formatPrice(plan.final_price)}
                            </span>
                            <span className="text-sm text-zinc-500">/bln</span>
                          </>
                        )}
                      </div>
                      {plan.discount_percent > 0 && (
                        <div className="-mt-4 mb-4 flex items-center gap-2">
                          <span className="text-xs text-zinc-500 line-through">
                            Rp{formatPrice(plan.price)}
                          </span>
                          <span className="rounded bg-red-600/20 px-1.5 py-0.5 text-[10px] font-medium text-red-400">
                            -{plan.discount_percent}%
                          </span>
                        </div>
                      )}
                      <ul className="mb-8 flex-1 space-y-3">
                        {benefits.map((b) => (
                          <li key={b} className="flex items-center gap-2.5 text-sm text-zinc-400">
                            <svg
                              className="size-4 shrink-0 text-red-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.5 12.75l6 6 9-13.5"
                              />
                            </svg>
                            {b}
                          </li>
                        ))}
                      </ul>
                      {plan.final_price > 0 && (
                        <Link
                          className={`w-full rounded-lg py-2.5 text-center text-sm font-bold transition-all ${
                            isPopular
                              ? "bg-red-600 text-white shadow-md shadow-red-600/25 hover:bg-red-500"
                              : "border border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                          }`}
                          href={`/workspace/checkout?plan_id=${plan.id}&plan=${plan.name}&price=${plan.final_price}`}
                        >
                          Langganan
                        </Link>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 px-6 py-8 lg:px-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Logo imgSize="h-6" textSize="text-xs" />
          <p className="text-xs text-zinc-600">
            &copy; 2026 Mengonten. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
