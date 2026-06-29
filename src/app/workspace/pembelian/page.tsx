"use client";

import AuthGuard from "@/components/AuthGuard";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransactionList, type TransactionResponse } from "@/hooks/useSubscription";

const statusConfig: Record<string, { label: string; icon: string; class: string }> = {
  pending: {
    label: "Menunggu",
    icon: "lucide:clock",
    class: "bg-yellow-700/30 text-yellow-400",
  },
  success: {
    label: "Lunas",
    icon: "lucide:check-circle",
    class: "bg-green-700/30 text-green-400",
  },
  failed: {
    label: "Gagal",
    icon: "lucide:x-circle",
    class: "bg-red-700/30 text-red-400",
  },
  cancel: {
    label: "Dibatalkan",
    icon: "lucide:ban",
    class: "bg-zinc-700/30 text-zinc-400",
  },
  unknown: {
    label: "Unknown",
    icon: "lucide:help-circle",
    class: "bg-zinc-700/30 text-zinc-400",
  },
};

const methodLabel = (method: string) => {
  if (!method) return "-";
  return method === "qris" ? "QRIS" : method.replace(/_/g, " ").toUpperCase();
};

const formatPrice = (price: number) => {
  if (price >= 1000000) return `${(price / 1000000).toFixed(1)}jt`;
  if (price >= 1000) return `${(price / 1000).toFixed(0)}rb`;
  return price.toString();
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  const day = d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const time = d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  return { day, time };
};

type GroupedTx = {
  dateLabel: string;
  transactions: TransactionResponse[];
};

function groupByDate(txs: TransactionResponse[]): GroupedTx[] {
  const map = new Map<string, TransactionResponse[]>();
  for (const tx of txs) {
    const label = new Date(tx.created_at).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const list = map.get(label) || [];
    list.push(tx);
    map.set(label, list);
  }
  return Array.from(map.entries())
    .map(([dateLabel, transactions]) => ({ dateLabel, transactions }))
    .sort((a, b) => {
      const da = new Date(a.transactions[0].created_at).getTime();
      const db = new Date(b.transactions[0].created_at).getTime();
      return db - da;
    });
}

export default function PembelianPage() {
  const router = useRouter();
  const { data: txs, isLoading } = useTransactionList();

  const grouped = txs ? groupByDate(txs) : [];

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
            Pembelian
          </h1>
        </header>

        <div className="relative z-10 mx-auto w-full max-w-2xl flex-1 px-6 py-8">
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="mb-3 h-4 w-32 rounded bg-zinc-800" />
                  <div className="space-y-2">
                    <div className="h-20 rounded-xl bg-zinc-900" />
                    <div className="h-20 rounded-xl bg-zinc-900" />
                  </div>
                </div>
              ))}
            </div>
          ) : grouped.length === 0 ? (
            <div className="py-20 text-center">
              <Icon className="mx-auto mb-4 size-12 text-zinc-600" icon="lucide:shopping-bag" />
              <p className="text-zinc-500">Belum ada transaksi</p>
            </div>
          ) : (
            <div className="space-y-8">
              {grouped.map((group) => (
                <div key={group.dateLabel}>
                  <h2
                    className="mb-3 text-sm font-semibold text-zinc-400"
                    suppressHydrationWarning
                  >
                    {group.dateLabel}
                  </h2>
                  <div className="space-y-2">
                    {group.transactions.map((tx) => {
                      const cfg = statusConfig[tx.status] || statusConfig.unknown;
                      const { time } = formatDate(tx.created_at);
                      return (
                        <div
                          key={tx.id}
                          className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3.5"
                        >
                          <div
                            className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                              tx.status === "success"
                                ? "bg-green-900/30 text-green-500"
                                : tx.status === "pending"
                                  ? "bg-yellow-900/30 text-yellow-500"
                                  : "bg-zinc-800 text-zinc-500"
                            }`}
                          >
                            <Icon className="size-5" icon={cfg.icon} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-white">
                              {tx.product_name || "Transaksi"}
                            </p>
                            <p className="flex items-center gap-1.5 text-xs text-zinc-500">
                              {tx.payment_method && (
                                <span className="flex size-4 items-center justify-center rounded bg-white p-0.5">
                                  <img
                                    alt=""
                                    className="h-3 w-auto"
                                    src={`/banks/${tx.payment_method === "qris" ? "qris" : tx.payment_method}.svg`}
                                  />
                                </span>
                              )}
                              <span suppressHydrationWarning>{methodLabel(tx.payment_method)}</span>
                              <span className="text-zinc-700">&bull;</span>
                              <span suppressHydrationWarning>{time}</span>
                            </p>
                          </div>
                          <div className="text-right">
                            <p
                              className="text-sm font-bold text-white"
                              style={{ fontFamily: "var(--font-bricolage)" }}
                            >
                              Rp{formatPrice(tx.payment_total)}
                            </p>
                            <span
                              className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${cfg.class}`}
                            >
                              {cfg.label}
                            </span>
                          </div>
                          <Link
                            className={`shrink-0 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                              tx.status === "pending"
                                ? "bg-red-700 text-white hover:bg-red-600"
                                : "border border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                            }`}
                            href={`/workspace/transaction/${tx.id}`}
                          >
                            {tx.status === "pending" ? "Bayar Sekarang" : "Detail Transaksi"}
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
