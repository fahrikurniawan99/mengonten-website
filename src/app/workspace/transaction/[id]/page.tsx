"use client";

import AuthGuard from "@/components/AuthGuard";
import CountdownTimer from "@/components/CountdownTimer";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { useTransactionDetail } from "@/hooks/useSubscription";

export default function TransactionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : null;
  const { data: tx, isLoading, isRefetching, refetch } = useTransactionDetail(id);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (tx?.payment_method === "qris" && tx?.payment_number) {
      QRCode.toDataURL(tx.payment_number, { width: 240, margin: 2 })
        .then(setQrDataUrl)
        .catch(() => {});
    }
  }, [tx]);

  const formatPrice = (price: number) => {
    if (price >= 1000000) return `${(price / 1000000).toFixed(1)}jt`;
    if (price >= 1000) return `${(price / 1000).toFixed(0)}rb`;
    return price.toString();
  };

  const statusConfig: Record<string, { label: string; icon: string; class: string }> = {
    pending: {
      label: "Menunggu Pembayaran",
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

  const getStatus = (status?: string) =>
    statusConfig[status || "pending"] || statusConfig.unknown;

  const methodLabel = (method?: string) =>
    method === "qris" ? "QRIS" : (method || "").replace(/_/g, " ").toUpperCase();

  const methodIcon = (method?: string) => {
    if (!method) return undefined;
    return method === "qris" ? "/banks/qris.svg" : `/banks/${method}.svg`;
  };

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
            Detail Transaksi
          </h1>
        </header>

        <div className="relative z-10 mx-auto w-full max-w-lg flex-1 px-6 py-8">
          {isLoading ? (
            <div className="animate-pulse space-y-6">
              <div className="h-40 rounded-2xl bg-zinc-900" />
              <div className="h-56 rounded-2xl bg-zinc-900" />
              <div className="h-32 rounded-2xl bg-zinc-900" />
            </div>
          ) : !tx ? (
            <div className="py-20 text-center">
              <Icon className="mx-auto mb-4 size-12 text-zinc-600" icon="lucide:file-x" />
              <p className="text-zinc-500">Transaksi tidak ditemukan</p>
              <Link
                className="mt-4 inline-block rounded-lg bg-zinc-800 px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-700"
                href="/workspace"
              >
                Kembali ke Workspace
              </Link>
            </div>
          ) : (
            <>
              {/* Status Banner */}
              <div className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center">
                <div
                  className={`mx-auto mb-4 flex size-16 items-center justify-center rounded-full ${
                    tx.status === "success"
                      ? "bg-green-600/20"
                      : tx.status === "failed" || tx.status === "cancel"
                        ? "bg-red-600/20"
                        : "bg-yellow-600/20"
                  }`}
                >
                  <Icon
                    className={`size-8 ${
                      tx.status === "success"
                        ? "text-green-500"
                        : tx.status === "failed" || tx.status === "cancel"
                          ? "text-red-500"
                          : "text-yellow-500"
                    }`}
                    icon={getStatus(tx.status).icon}
                  />
                </div>
                <h2
                  className="mb-1 text-xl font-bold text-white"
                  style={{ fontFamily: "var(--font-bricolage)" }}
                >
                  {getStatus(tx.status).label}
                </h2>
                <p className="text-sm text-zinc-500">{tx.reference_id}</p>
              </div>

              {/* Detail Card */}
              <div className="mb-6 space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-500">Plan</span>
                  <span className="text-sm font-semibold text-white">{tx.product_name}</span>
                </div>
                <div className="h-px bg-zinc-800" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-500">Metode Pembayaran</span>
                  <span className="flex items-center gap-2 text-sm font-semibold text-white">
                    {tx.payment_method && (
                      <span className="flex size-5 items-center justify-center rounded bg-white p-0.5">
                        <img alt="" className="h-3.5 w-auto" src={methodIcon(tx.payment_method)} />
                      </span>
                    )}
                    {methodLabel(tx.payment_method)}
                  </span>
                </div>
                <div className="h-px bg-zinc-800" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-500">Total</span>
                  <span
                    className="text-base font-bold text-white"
                    style={{ fontFamily: "var(--font-bricolage)" }}
                  >
                    Rp{formatPrice(tx.payment_total)}
                  </span>
                </div>
                <div className="h-px bg-zinc-800" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-500">Status</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatus(tx.status).class}`}
                  >
                    {getStatus(tx.status).label}
                  </span>
                </div>
                <div className="h-px bg-zinc-800" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-500">Dibuat</span>
                  <span className="text-sm text-zinc-300" suppressHydrationWarning>
                    {new Date(tx.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                {tx.status === "success" && tx.payment_at && (
                  <>
                    <div className="h-px bg-zinc-800" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-500">Waktu Pelunasan</span>
                      <span className="text-sm text-zinc-300" suppressHydrationWarning>
                        {new Date(tx.payment_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </>
                )}
                {tx.status === "pending" && (
                  <>
                    <div className="h-px bg-zinc-800" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-500">Sisa Waktu</span>
                      <CountdownTimer createdAt={tx.created_at} />
                    </div>
                  </>
                )}
              </div>

              {/* Payment Info */}
              {tx.status === "pending" && (
                <div className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                  <p className="mb-3 text-sm font-semibold text-zinc-400">Informasi Pembayaran</p>
                  {tx.payment_method === "qris" ? (
                    <div className="flex flex-col items-center">
                      <div className="mb-3 rounded-xl border border-zinc-700 bg-white p-3">
                        {qrDataUrl ? (
                          <img alt="QR Code" className="size-44" src={qrDataUrl} />
                        ) : (
                          <div className="flex size-44 animate-pulse items-center justify-center bg-zinc-100">
                            <span className="text-xs text-zinc-400">Memuat QR...</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500">
                        Scan QR di atas menggunakan e-wallet (GoPay, OVO, DANA, dll)
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="mb-1 text-xs text-zinc-500">Nomor Virtual Account</p>
                      <p
                        className="text-xl font-extrabold tracking-wider text-white"
                        style={{ fontFamily: "var(--font-bricolage)" }}
                      >
                        {tx.payment_number}
                      </p>
                      <p className="mt-3 text-sm text-zinc-500">
                        Transfer ke nomor VA di atas melalui {methodLabel(tx.payment_method)}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-3">
                {tx.status === "pending" && (
                  <button
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-700 py-3.5 text-base font-bold text-white transition-all hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={isRefetching}
                    onClick={() => refetch()}
                  >
                    {isRefetching ? (
                      <>
                        <span className="inline-block size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Mengecek...
                      </>
                    ) : (
                      <>
                        <Icon className="size-4" icon="lucide:refresh-cw" />
                        Check Status Pembayaran
                      </>
                    )}
                  </button>
                )}
                <Link
                  className="w-full rounded-2xl border border-zinc-700 bg-zinc-800 py-3.5 text-center text-base font-bold text-zinc-200 transition-all hover:bg-zinc-700"
                  href="/workspace"
                >
                  Kembali ke Workspace
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
