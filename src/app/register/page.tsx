"use client";

import { Icon } from "@iconify/react";
import { Button, Card, Form, Input, Label, TextField, toast } from "@heroui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRegister } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

export default function RegisterPage() {
  const token = useAuthStore((s) => s.token);
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (token) router.replace("/workspace");
  }, [token, router]);

  const register = useRegister();

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    register.mutate(email, {
      onSuccess: () => {
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
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

          <div className="mb-10 flex items-center gap-6">
            <div className="flex -space-x-3">
              {[
                "https://api.dicebear.com/9.x/avataaars/svg?seed=Felix",
                "https://api.dicebear.com/9.x/avataaars/svg?seed=Aneka",
                "https://api.dicebear.com/9.x/avataaars/svg?seed=Budiman",
                "https://api.dicebear.com/9.x/avataaars/svg?seed=Dewi",
              ].map((src, i) => (
                <div key={i} className="size-10 overflow-hidden rounded-full border-2 border-zinc-800 bg-zinc-800">
                  <img alt="User" className="size-full object-cover" src={src} />
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 text-sm text-red-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon key={i} className="size-3.5" icon="lucide:star" />
                ))}
              </div>
              <p className="text-sm text-zinc-500">Rated 4.9 oleh 2.400+ kreator</p>
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
                  <img alt="Ahmad Fauzi" className="size-full rounded-full object-cover" src="https://api.dicebear.com/9.x/avataaars/svg?seed=Ahmad" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Ahmad Fauzi</p>
                <p className="text-xs text-zinc-500">Content Lead @ StartupIndonesia</p>
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
            <Card.Header className="flex-col items-start gap-1 px-0 pt-8">
              <Card.Title className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-bricolage)" }}>
                Daftar
              </Card.Title>
              <Card.Description className="text-zinc-400">
                Sudah punya akun?{" "}
                <Link className="font-medium text-red-400 hover:text-red-300" href="/login">
                  Masuk
                </Link>
              </Card.Description>
            </Card.Header>

            <Card.Content className="px-0 pb-8">
              <Form className="flex flex-col gap-4" onSubmit={handleRegister} validationBehavior="aria">
                <TextField className="w-full" isRequired name="email" type="email" value={email} onChange={setEmail}>
                  <Label className="text-sm font-medium text-zinc-300">Email</Label>
                  <div className="relative w-full">
                    <Icon className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-red-400" icon="lucide:mail" />
                    <Input className="w-full pl-10" placeholder="nama@email.com" variant="secondary" />
                  </div>
                </TextField>

                <Button
                  className="w-full bg-gradient-to-r from-red-600 to-red-800 font-semibold text-white shadow-lg shadow-red-500/25"
                  size="lg"
                  type="submit"
                  isDisabled={!email}
                  isPending={register.isPending}
                >
                  {register.isPending ? "Mendaftarkan..." : "Daftar"}
                </Button>
              </Form>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
}
