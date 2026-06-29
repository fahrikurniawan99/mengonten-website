"use client";

import AuthGuard from "@/components/AuthGuard";
import CountdownTimer from "@/components/CountdownTimer";
import { Icon } from "@iconify/react";
import { toast } from "@heroui/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import {
  useSubscriptionPlanDetail,
  useCreateTransaction,
  type TransactionResponse,
} from "@/hooks/useSubscription";

type PaymentChannel =
  | "cimb_niaga_va"
  | "bni_va"
  | "qris"
  | "sampoerna_va"
  | "bnc_va"
  | "maybank_va"
  | "permata_va"
  | "atm_bersama_va"
  | "artha_graha_va"
  | "bri_va";

const vaList: { id: PaymentChannel; label: string }[] = [
  { id: "bri_va", label: "BRI" },
  { id: "bni_va", label: "BNI" },
  { id: "cimb_niaga_va", label: "CIMB Niaga" },
  { id: "maybank_va", label: "Maybank" },
  { id: "permata_va", label: "Permata" },
  { id: "atm_bersama_va", label: "ATM Bersama" },
  { id: "artha_graha_va", label: "Artha Graha" },
  { id: "sampoerna_va", label: "Bank Sampoerna" },
  { id: "bnc_va", label: "BNC" },
];

type Step = "form" | "success";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selected, setSelected] = useState<PaymentChannel>("qris");
  const [agreed, setAgreed] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [transaction, setTransaction] = useState<TransactionResponse | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const planId = searchParams.get("plan_id");
  const planName = searchParams.get("plan") || "Pro";
  const planPrice = searchParams.get("price") || "100000";

  const { data: planDetail, isLoading: planLoading } = useSubscriptionPlanDetail(planId);
  const createTransaction = useCreateTransaction();

  const displayName = planDetail?.name || planName;
  const displayPrice = planDetail ? planDetail.final_price : Number.parseInt(planPrice, 10);

  const formatPrice = (price: number) => {
    if (price >= 1000000) return `${(price / 1000000).toFixed(1)}jt`;
    if (price >= 1000) return `${(price / 1000).toFixed(0)}rb`;
    return price.toString();
  };

  const displayPriceFormatted = formatPrice(displayPrice);

  const handleSubmit = () => {
    if (!planId) {
      toast.danger("Plan tidak ditemukan");
      return;
    }
    createTransaction.mutate(
      { subscription_plan_id: planId, payment_method: selected },
      {
        onSuccess: (res) => {
          setTransaction(res.data);
          setStep("success");
        },
        onError: (err) => {
          const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
          if (msg.toLowerCase().includes("langganan aktif")) {
            setErrorMsg(msg);
          } else {
            toast.danger(msg);
          }
        },
      },
    );
  };

  useEffect(() => {
    if (transaction?.payment_method === "qris" && transaction?.payment_number) {
      QRCode.toDataURL(transaction.payment_number, { width: 240, margin: 2 })
        .then(setQrDataUrl)
        .catch(() => {});
    }
  }, [transaction]);

  const isSubmitting = createTransaction.isPending;

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
            {step === "form" ? "Checkout" : "Pembayaran Dibuat"}
          </h1>
        </header>

        <div className="relative z-10 mx-auto w-full max-w-lg flex-1 px-6 py-8">
          {step === "form" && (
            <>
              {/* Plan Summary */}
              <div className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                {planLoading ? (
                  <div className="flex animate-pulse items-center gap-3">
                    <div className="size-10 rounded-xl bg-zinc-800" />
                    <div className="flex-1">
                      <div className="mb-1 h-4 w-24 rounded bg-zinc-800" />
                      <div className="h-3 w-32 rounded bg-zinc-800" />
                    </div>
                    <div className="h-6 w-20 rounded bg-zinc-800" />
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-red-700 text-white">
                        <Icon className="size-5" icon="lucide:crown" />
                      </div>
                      <div>
                        <p
                          className="text-sm font-bold text-white"
                          style={{ fontFamily: "var(--font-bricolage)" }}
                        >
                          {displayName}
                        </p>
                        <p className="text-xs text-zinc-500">Langganan bulanan</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className="text-xl font-extrabold text-white"
                        style={{ fontFamily: "var(--font-bricolage)" }}
                      >
                        Rp{displayPriceFormatted}
                      </p>
                      <p className="text-xs text-zinc-600">/bulan</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="mb-8">
                <p className="mb-4 text-sm font-semibold text-zinc-400">
                  Metode Pembayaran
                </p>

                {/* QRIS */}
                <button
                  className={`mb-3 flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-all ${
                    selected === "qris"
                      ? "border-red-700 bg-red-950/30"
                      : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                  }`}
                  onClick={() => setSelected("qris")}
                >
                  <div
                    className={`flex size-14 items-center justify-center rounded-xl bg-white p-2.5 ${
                      selected === "qris" ? "ring-2 ring-red-700" : "ring-1 ring-zinc-700"
                    }`}
                  >
                    <img alt="QRIS" className="h-7 w-auto" src="/banks/qris.svg" />
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-base font-semibold ${
                        selected === "qris" ? "text-white" : "text-zinc-200"
                      }`}
                    >
                      QRIS
                    </p>
                    <p
                      className={`text-sm ${
                        selected === "qris" ? "text-red-400" : "text-zinc-600"
                      }`}
                    >
                      Bayar instan via e-wallet
                    </p>
                  </div>
                  {selected === "qris" && (
                    <Icon className="size-6 text-red-500" icon="lucide:check-circle" />
                  )}
                </button>

                {/* VA */}
                <div className="mb-3 flex items-center gap-2">
                  <div className="h-px flex-1 bg-zinc-800" />
                  <span className="text-xs text-zinc-600">Virtual Account</span>
                  <div className="h-px flex-1 bg-zinc-800" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {vaList.map((va) => (
                    <button
                      key={va.id}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center transition-all ${
                        selected === va.id
                          ? "border-red-700 bg-red-950/30"
                          : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                      }`}
                      onClick={() => setSelected(va.id)}
                    >
                      <div
                        className={`flex size-10 items-center justify-center rounded-lg bg-white p-1.5 ${
                          selected === va.id ? "ring-2 ring-red-700" : "ring-1 ring-zinc-700"
                        }`}
                      >
                        <img
                          alt={va.label}
                          className="h-6 w-auto"
                          src={`/banks/${va.id}.svg`}
                        />
                      </div>
                      <span
                        className={`text-[11px] font-medium leading-tight ${
                          selected === va.id ? "text-white" : "text-zinc-400"
                        }`}
                      >
                        {va.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Agreement */}
              <label className="mb-6 flex cursor-pointer items-start gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3.5 transition-colors hover:bg-zinc-800">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="peer size-4 appearance-none rounded border border-zinc-700 bg-zinc-800 checked:border-red-700 checked:bg-red-700"
                  />
                  <Icon
                    className="pointer-events-none absolute left-0 top-0 size-4 text-white opacity-0 peer-checked:opacity-100"
                    icon="lucide:check"
                  />
                </div>
                <span className="text-sm leading-relaxed text-zinc-500">
                  Saya setuju dengan syarat & ketentuan dan kebijakan privasi
                  Mengonten.
                </span>
              </label>

              {/* Submit */}
              <button
                disabled={!agreed || isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-700 py-3.5 text-base font-bold text-white transition-all hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                onClick={handleSubmit}
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Memproses...
                  </>
                ) : (
                  `Bayar Rp${displayPriceFormatted}`
                )}
              </button>

              <p className="mt-4 text-center text-xs text-zinc-600">
                Pembayaran diproses secara aman oleh Mengonten
              </p>
            </>
          )}

          {errorMsg && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="mx-4 w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center">
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-red-900/30">
                  <Icon className="size-7 text-red-500" icon="lucide:alert-circle" />
                </div>
                <p className="mb-6 text-sm leading-relaxed text-zinc-300">
                  {errorMsg}
                </p>
                <div className="flex flex-col gap-2">
                  <Link
                    className="rounded-xl bg-red-700 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600"
                    href="/workspace/penggunaan"
                    onClick={() => setErrorMsg(null)}
                  >
                    Lihat Langganan
                  </Link>
                  <button
                    className="rounded-xl bg-zinc-800 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700"
                    onClick={() => setErrorMsg(null)}
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === "success" && transaction && (
            <div className="text-center">
              <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-green-600/20">
                <Icon className="size-8 text-green-500" icon="lucide:check-circle" />
              </div>

              <h2
                className="mb-2 text-xl font-bold text-white"
                style={{ fontFamily: "var(--font-bricolage)" }}
              >
                Pembayaran Berhasil Dibuat
              </h2>
              <p className="mb-8 text-sm text-zinc-500">
                ID Transaksi: {transaction.reference_id}
              </p>

              {transaction.payment_method === "qris" ? (
                <div className="mb-8 flex flex-col items-center">
                  <div className="mb-3 rounded-2xl border border-zinc-800 bg-white p-4">
                    {qrDataUrl ? (
                      <img alt="QR Code" className="size-48" src={qrDataUrl} />
                    ) : (
                      <div className="flex size-48 animate-pulse items-center justify-center bg-zinc-100">
                        <span className="text-xs text-zinc-400">Memuat QR...</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500">
                    Scan QR di atas menggunakan e-wallet (GoPay, OVO, DANA, dll)
                  </p>
                </div>
              ) : (
                <div className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                  <p className="mb-1 text-xs font-medium text-zinc-500">
                    Nomor Virtual Account
                  </p>
                  <p
                    className="text-2xl font-extrabold tracking-wider text-white"
                    style={{ fontFamily: "var(--font-bricolage)" }}
                  >
                    {transaction.payment_number}
                  </p>
                  <p className="mt-3 text-sm text-zinc-500">
                    Transfer ke nomor VA di atas melalui {selected.replace(/_/g, " ").toUpperCase()}
                  </p>
                </div>
              )}

              <div className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-500">Total Pembayaran</span>
                  <span
                    className="text-lg font-bold text-white"
                    style={{ fontFamily: "var(--font-bricolage)" }}
                  >
                    Rp{displayPriceFormatted}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-zinc-500">Status</span>
                  <span className="rounded-full bg-yellow-700/30 px-2.5 py-0.5 text-xs font-medium text-yellow-400">
                    Menunggu Pembayaran
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-zinc-500">Sisa Waktu</span>
                  <CountdownTimer createdAt={transaction.created_at} />
                </div>
              </div>

              <Link
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-red-700 py-3.5 text-base font-bold text-white transition-all hover:bg-red-600"
                href={`/workspace/transaction/${transaction.id}`}
              >
                <Icon className="size-4" icon="lucide:refresh-cw" />
                Check Status Pembayaran
              </Link>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
