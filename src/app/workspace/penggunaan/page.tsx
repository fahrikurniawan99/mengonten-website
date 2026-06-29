"use client";

import AuthGuard from "@/components/AuthGuard";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useCurrentSubscription } from "@/hooks/useSubscription";

export default function PenggunaanPage() {
  const router = useRouter();
  const { data: subscription, isLoading } = useCurrentSubscription();

  const sub = subscription?.subscription;
  const usage = subscription?.usage;
  const rules = subscription?.rules;

  const storageLimitMb = usage?.storage_limit_mb || 500;
  const storageUsedMb = usage ? Number(usage.storage_used_mb) : 0;
  const daysLeft = sub?.expired_at
    ? Math.ceil((new Date(sub.expired_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;
  const storagePercent = Math.min(Math.round((storageUsedMb / storageLimitMb) * 100), 100);
  const renewDate = sub?.expired_at
    ? new Date(sub.expired_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    : "-";

  return (
    <AuthGuard>
      <div className="relative flex min-h-screen flex-col bg-zinc-950">
        {/* Background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-red-950/5 via-transparent to-transparent" />

        {/* Header */}
        <header className="relative z-10 flex items-center gap-3 border-b border-zinc-800 bg-zinc-900 px-6 py-4">
          <button
            className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
            onClick={() => router.back()}
          >
            <Icon className="size-5" icon="lucide:arrow-left" />
          </button>
          <h1
            className="text-lg font-bold text-white"
            style={{ fontFamily: "var(--font-bricolage)" }}
          >
            Penggunaan
          </h1>
        </header>

        <div className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-6 py-8">
          {isLoading ? (
            <div className="mb-8 grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-2xl bg-zinc-900" />
              ))}
            </div>
          ) : null}

          {/* Current Plan */}
          <div className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-red-700 text-white">
                  <Icon className="size-5" icon="lucide:crown" />
                </div>
                <div>
                  <p
                    className="text-sm font-bold text-white"
                    style={{ fontFamily: "var(--font-bricolage)" }}
                  >
                    {sub?.product_name || "-"}
                  </p>
                  <p className="text-xs text-zinc-500" suppressHydrationWarning>
                    {sub?.status === "active"
                      ? `Aktif · ${daysLeft} hari lagi (${renewDate})`
                      : "Tidak aktif"}
                  </p>
                </div>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  sub?.status === "active"
                    ? "bg-green-700/30 text-green-400"
                    : "bg-zinc-700/30 text-zinc-400"
                }`}
              >
                {sub?.status === "active" ? "Aktif" : "Nonaktif"}
              </span>
            </div>

            {rules && (
              <div className="mb-4">
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Video</span>
                  <span className="text-zinc-500">-/{rules.max_videos}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                  <div className="h-full w-0 rounded-full bg-red-600" />
                </div>
              </div>
            )}

            {usage && (
              <div>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Storage</span>
                  <span className="text-zinc-500" suppressHydrationWarning>
                    {storageUsedMb.toFixed(1)}MB/{storageLimitMb}MB
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-red-600 transition-all"
                    style={{ width: `${storagePercent}%` }}
                  />
                </div>
              </div>
            )}

            {!sub && !isLoading && (
              <p className="text-sm text-zinc-500">Tidak ada langganan aktif</p>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
