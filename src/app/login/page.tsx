"use client";

import { Icon } from "@iconify/react";
import {
  Button,
  Card,
  Form,
  Input,
  Label,
  TextField,
  toast,
} from "@heroui/react";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { useSendOtp, useVerifyOtp } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

export default function LoginPage() {
  const token = useAuthStore((s) => s.token);
  const router = useRouter();

  useEffect(() => {
    if (token) router.replace("/workspace");
  }, [token, router]);

  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [cooldown, setCooldown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step !== "otp") return;
    setCooldown(60);

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
  }, [step]);

  const sendOtp = useSendOtp();
  const verifyOtp = useVerifyOtp();

  const handleSendOtp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendOtp.mutate(email, {
      onSuccess: () => setStep("otp"),
      onError: (err) => {
        toast.danger(err instanceof Error ? err.message : "Terjadi kesalahan");
      },
    });
  };

  const handleVerifyOtp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    verifyOtp.mutate(
      { email, otp: otp.join("") },
      {
        onSuccess: () => (window.location.href = "/workspace"),
        onError: (err) => {
          toast.danger(err instanceof Error ? err.message : "Terjadi kesalahan");
        },
      }
    );
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const digit = value.slice(-1);

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    pasted.split("").forEach((digit, i) => {
      newOtp[i] = digit;
    });
    setOtp(newOtp);
    const nextIndex = Math.min(pasted.length, 5);
    otpRefs.current[nextIndex]?.focus();
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

          <div className="mb-10 flex items-center gap-6">
            <div className="flex -space-x-3">
              {[
                "https://api.dicebear.com/9.x/avataaars/svg?seed=Felix",
                "https://api.dicebear.com/9.x/avataaars/svg?seed=Aneka",
                "https://api.dicebear.com/9.x/avataaars/svg?seed=Budiman",
                "https://api.dicebear.com/9.x/avataaars/svg?seed=Dewi",
              ].map((src, i) => (
                <div
                  key={i}
                  className="size-10 overflow-hidden rounded-full border-2 border-zinc-800 bg-zinc-800"
                >
                  <img
                    alt="User"
                    className="size-full object-cover"
                    src={src}
                  />
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 text-sm text-red-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon key={i} className="size-3.5" icon="lucide:star" />
                ))}
              </div>
              <p className="text-sm text-zinc-500">
                Rated 4.9 oleh 2.400+ kreator
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-sm">
            <p className="mb-4 text-sm italic leading-relaxed text-zinc-400">
              &ldquo;Sejak pake Mengonten, tim konten kami bisa produce 3x lebih
              banyak dalam waktu setengahnya. Game changer banget!&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="size-10 overflow-hidden rounded-full bg-gradient-to-br from-red-500 to-red-800 p-[2px]">
                <div className="size-full rounded-full bg-black">
                  <img
                    alt="Ahmad Fauzi"
                    className="size-full rounded-full object-cover"
                    src="https://api.dicebear.com/9.x/avataaars/svg?seed=Ahmad"
                  />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Ahmad Fauzi</p>
                <p className="text-xs text-zinc-500">
                  Content Lead @ StartupIndonesia
                </p>
              </div>
            </div>
          </div>
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
            {step === "email" ? (
              <>
                <Card.Header className="flex-col items-start gap-1 px-0 pt-8">
                  <Card.Title className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-bricolage)" }}>
                    Masuk
                  </Card.Title>
                  <Card.Description className="text-zinc-400">
                    Belum punya akun?{" "}
                    <Link
                      className="font-medium text-red-400 hover:text-red-300"
                      href="/register"
                    >
                      Daftar gratis
                    </Link>
                  </Card.Description>
                </Card.Header>

                <Card.Content className="px-0 pb-8">
                  <Form className="flex flex-col gap-4" onSubmit={handleSendOtp} validationBehavior="aria">
                    <TextField className="w-full" isRequired name="email" type="email" value={email} onChange={setEmail}>
                      <Label className="text-sm font-medium text-zinc-300">Email</Label>
                      <div className="relative w-full">
                        <Icon
                          className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-red-400"
                          icon="lucide:mail"
                        />
                        <Input
                          className="w-full pl-10"
                          placeholder="nama@email.com"
                          variant="secondary"
                        />
                      </div>
                    </TextField>

                    <Button
                      className="w-full bg-gradient-to-r from-red-600 to-red-800 font-semibold text-white shadow-lg shadow-red-500/25"
                      size="lg"
                      type="submit"
                      isDisabled={!email}
                      isPending={sendOtp.isPending}
                    >
                      {sendOtp.isPending ? "Mengirim..." : "Masuk"}
                    </Button>
                  </Form>
                </Card.Content>
              </>
            ) : (
              <>
                <Card.Header className="flex-col items-start gap-1 px-0 pt-8">
                  <Card.Title className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-bricolage)" }}>
                    Verifikasi
                  </Card.Title>
                  <Card.Description className="text-zinc-400">
                    Masukkan kode OTP yang dikirim ke{" "}
                    <span className="font-medium text-white">{email}</span>
                  </Card.Description>
                </Card.Header>

                <Card.Content className="px-0 pb-8">
                  <Form className="flex flex-col gap-6" onSubmit={handleVerifyOtp}>
                    <div className="flex justify-between gap-2">
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          ref={(el) => {
                            otpRefs.current[i] = el;
                          }}
                          className="flex h-14 w-full max-w-[56px] items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800/60 text-center text-xl font-bold text-white outline-none transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                          inputMode="numeric"
                          maxLength={1}
                          placeholder="•"
                          type="text"
                          value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(i, e)}
                          onPaste={handleOtpPaste}
                        />
                      ))}
                    </div>

                    <Button
                      className="w-full bg-gradient-to-r from-red-600 to-red-800 font-semibold text-white shadow-lg shadow-red-500/25"
                      size="lg"
                      type="submit"
                      isDisabled={otp.join("").length !== 6}
                      isPending={verifyOtp.isPending}
                    >
                      {verifyOtp.isPending ? "Memverifikasi..." : "Verifikasi"}
                    </Button>

                    <div className="flex items-center justify-between text-sm">
                      <button
                        className="text-zinc-500 hover:text-zinc-300"
                        type="button"
                        onClick={() => {
                          setStep("email");
                          setOtp(["", "", "", "", "", ""]);
                        }}
                      >
                        <span className="flex items-center gap-1">
                          <Icon className="size-3.5" icon="lucide:arrow-left" />
                          Ganti email
                        </span>
                      </button>
                      <button
                        className={`text-sm ${cooldown > 0 ? "text-zinc-600" : "text-red-400 hover:text-red-300"}`}
                        disabled={cooldown > 0}
                        type="button"
                        onClick={() => {
                          sendOtp.mutate(email);
                          setCooldown(60);
                        }}
                      >
                        {cooldown > 0 ? `Kirim ulang (${cooldown}s)` : "Kirim ulang"}
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
