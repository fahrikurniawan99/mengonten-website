"use client";

import { Icon } from "@iconify/react";
import { Button, Card, Input, Label, TextField, toast } from "@heroui/react";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useVerifyEmail, useResendVerification } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/auth";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "@/components/Logo";

function VerifyEmailContent() {
  const token = useAuthStore((s) => s.token);
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlToken = searchParams.get("token");
  const urlEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(urlEmail);
  const [status, setStatus] = useState<"loading" | "success" | "error" | "idle">(
    urlToken ? "loading" : "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const verifyEmail = useVerifyEmail();
  const resend = useResendVerification();

  useEffect(() => {
    if (token) router.replace("/workspace");
  }, [token, router]);

  useEffect(() => {
    if (!urlToken) return;
    verifyEmail.mutate(urlToken, {
      onSuccess: () => {
        setStatus("success");
        window.location.href = "/workspace";
      },
      onError: (err) => {
        setStatus("error");
        setErrorMessage(err instanceof Error ? err.message : "Terjadi kesalahan");
      },
    });
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = () => {
    if (!email || cooldown > 0) return;
    resend.mutate(email, {
      onSuccess: () => {
        toast.success("Email verifikasi telah dikirim ulang");
        setCooldown(60);
      },
      onError: (err) => {
        toast.danger(err instanceof Error ? err.message : "Terjadi kesalahan");
      },
    });
  };

  return (
    <div className="flex min-h-screen bg-black">
      <div className="relative hidden w-[55%] flex-col justify-between overflow-hidden bg-gradient-to-br from-zinc-950 via-black to-red-950 p-12 lg:flex">
        <div className="absolute -right-40 -top-40 size-96 rounded-full bg-red-600/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 size-96 rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-500/5 via-transparent to-transparent" />
        <div className="relative z-10">
          <Logo />
        </div>
        <div className="relative z-10 max-w-lg">
          <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-white" style={{ fontFamily: "var(--font-bricolage)" }}>
            <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              Clip otomatis
            </span>
            , upload langsung.
          </h1>
          <p className="mb-8 text-lg leading-relaxed text-zinc-400">
            Dari video YouTube panjang jadi konten pendek siap pakai, tanpa edit manual.
          </p>
        </div>
        <p className="relative z-10 text-sm text-zinc-600">
          &copy; 2026 Mengonten. All rights reserved.
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-md">
          <div className="mb-10 flex justify-center lg:hidden">
            <Logo imgSize="h-7" textSize="text-lg" />
          </div>

          <Card className="border border-zinc-800 bg-zinc-900/60 px-6">
            {status === "loading" && (
              <Card.Content className="flex flex-col items-center gap-4 px-0 py-12">
                <span className="inline-block size-8 animate-spin rounded-full border-2 border-red-500/30 border-t-red-500" />
                <p className="text-sm text-zinc-400">Memverifikasi email...</p>
              </Card.Content>
            )}

            {status === "error" && (
              <>
                <Card.Header className="flex-col items-start gap-1 px-0 pt-8">
                  <Card.Title className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-bricolage)" }}>
                    Verifikasi Gagal
                  </Card.Title>
                  <Card.Description className="text-zinc-400">{errorMessage}</Card.Description>
                </Card.Header>
                <Card.Content className="flex flex-col gap-4 px-0 pb-8">
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                    <TextField className="w-full" isRequired name="email" type="email" value={email} onChange={setEmail}>
                      <Label className="text-sm font-medium text-zinc-300">Email</Label>
                      <div className="relative w-full">
                        <Icon className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-red-400" icon="lucide:mail" />
                        <Input className="w-full pl-10" placeholder="nama@email.com" variant="secondary" />
                      </div>
                    </TextField>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      className="w-full bg-gradient-to-r from-red-600 to-red-800 font-semibold text-white shadow-lg shadow-red-500/25"
                      size="lg"
                      isDisabled={!email || cooldown > 0}
                      isPending={resend.isPending}
                      onPress={handleResend}
                    >
                      {cooldown > 0 ? `Kirim ulang (${cooldown}s)` : "Kirim ulang verifikasi"}
                    </Button>
                    <Button
                      className="w-full border border-zinc-700 bg-zinc-800 font-medium text-zinc-300"
                      size="lg"
                      onPress={() => router.push("/register")}
                    >
                      Daftar ulang
                    </Button>
                  </div>
                </Card.Content>
              </>
            )}

            {status === "idle" && (
              <>
                <Card.Header className="flex-col items-start gap-1 px-0 pt-8">
                  <Card.Title className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-bricolage)" }}>
                    Verifikasi Email
                  </Card.Title>
                  <Card.Description className="text-zinc-400">
                    {urlEmail
                      ? "Cek email kamu untuk link verifikasi."
                      : "Masukkan email untuk mengirim ulang verifikasi."}
                  </Card.Description>
                </Card.Header>
                <Card.Content className="flex flex-col gap-4 px-0 pb-8">
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                    <TextField className="w-full" isRequired name="email" type="email" value={email} onChange={setEmail}>
                      <Label className="text-sm font-medium text-zinc-300">Email</Label>
                      <div className="relative w-full">
                        <Icon className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-red-400" icon="lucide:mail" />
                        <Input className="w-full pl-10" placeholder="nama@email.com" variant="secondary" />
                      </div>
                    </TextField>
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-red-600 to-red-800 font-semibold text-white shadow-lg shadow-red-500/25"
                    size="lg"
                    isDisabled={!email || cooldown > 0}
                    isPending={resend.isPending}
                    onPress={handleResend}
                  >
                    {cooldown > 0 ? `Kirim ulang (${cooldown}s)` : "Kirim ulang verifikasi"}
                  </Button>
                  <Link className="text-center text-sm text-zinc-500 hover:text-zinc-300" href="/register">
                    <span className="flex items-center justify-center gap-1">
                      <Icon className="size-3.5" icon="lucide:arrow-left" />
                      Ganti email
                    </span>
                  </Link>
                </Card.Content>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
