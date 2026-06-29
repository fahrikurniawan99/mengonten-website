"use client";

import AuthGuard from "@/components/AuthGuard";
import Logo from "@/components/Logo";
import { useAuthStore } from "@/store/auth";
import { useCurrentSubscription } from "@/hooks/useSubscription";
import { Icon } from "@iconify/react";
import {
  Button,
  Input,
  Label,
  Modal,
  TextField,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ClipStatus = "pending" | "in_progress" | "success" | "error";

type Clip = {
  id: number;
  title: string;
  status: ClipStatus;
  duration?: string;
  created_at: string;
};

type Video = {
  id: number;
  name: string;
  youtube_url: string;
  status: ClipStatus;
  created_at: string;
  clips: Clip[];
};

const dummyVideos: Video[] = [
  {
    id: 1,
    name: "Review Produk X",
    youtube_url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
    status: "success",
    created_at: "2 jam lalu",
    clips: [
      { id: 11, title: "Intro - Opening Hook", status: "success", duration: "0:15", created_at: "2 jam lalu" },
      { id: 12, title: "Unboxing Produk", status: "success", duration: "0:45", created_at: "2 jam lalu" },
      { id: 13, title: "Review Spesifikasi", status: "success", duration: "1:20", created_at: "2 jam lalu" },
      { id: 14, title: "Test & Review", status: "in_progress", duration: "2:00", created_at: "30 menit lalu" },
      { id: 15, title: "Kesimpulan & CTA", status: "pending", duration: "0:30", created_at: "Baru saja" },
    ],
  },
  {
    id: 2,
    name: "Tutorial React JS",
    youtube_url: "https://youtube.com/watch?v=abc123def45",
    status: "in_progress",
    created_at: "30 menit lalu",
    clips: [
      { id: 21, title: "Pendahuluan", status: "success", duration: "0:30", created_at: "30 menit lalu" },
      { id: 22, title: "Setup Project", status: "in_progress", duration: "0:50", created_at: "15 menit lalu" },
      { id: 23, title: "Coding Session", status: "pending", duration: "0:45", created_at: "Baru saja" },
    ],
  },
  {
    id: 3,
    name: "Tips SEO YouTube",
    youtube_url: "https://youtube.com/watch?v=xyz789ghi12",
    status: "error",
    created_at: "1 jam lalu",
    clips: [
      { id: 31, title: "Riset Keyword", status: "error", duration: "1:30", created_at: "1 jam lalu" },
      { id: 32, title: "Optimasi Thumbnail", status: "error", duration: "0:45", created_at: "1 jam lalu" },
    ],
  },
  {
    id: 4,
    name: "Vlog Harian",
    youtube_url: "https://youtu.be/jkl345mno67",
    status: "pending",
    created_at: "Baru saja",
    clips: [
      { id: 41, title: "Morning Routine", status: "pending", duration: "0:20", created_at: "Baru saja" },
      { id: 42, title: "Work Session", status: "pending", duration: "0:35", created_at: "Baru saja" },
      { id: 43, title: "Evening Wrap", status: "pending", duration: "0:25", created_at: "Baru saja" },
    ],
  },
];

const statusConfig: Record<ClipStatus, { label: string; icon: string; containerClass: string; badgeClass: string }> = {
  pending: {
    label: "Pending",
    icon: "lucide:clock",
    containerClass: "border-zinc-800 bg-zinc-900/60",
    badgeClass: "bg-zinc-700 text-zinc-300",
  },
  in_progress: {
    label: "Processing",
    icon: "lucide:loader",
    containerClass: "border-yellow-800/40 bg-yellow-900/10",
    badgeClass: "bg-yellow-700 text-yellow-200",
  },
  success: {
    label: "Sukses",
    icon: "lucide:check-circle",
    containerClass: "border-green-800/40 bg-green-900/10",
    badgeClass: "bg-green-700 text-green-200",
  },
  error: {
    label: "Error",
    icon: "lucide:alert-circle",
    containerClass: "border-red-800/40 bg-red-900/10",
    badgeClass: "bg-red-700 text-red-200",
  },
};

export default function WorkspacePage() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  const { data: subscription } = useCurrentSubscription();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<number>(1);
  const [activeUploadClipId, setActiveUploadClipId] = useState<number | null>(null);
  const [uploadStyle, setUploadStyle] = useState<React.CSSProperties | null>(null);
  const [nama, setNama] = useState("");
  const [urlYoutube, setUrlYoutube] = useState("");
  const [urlError, setUrlError] = useState("");

  const isValidYoutubeUrl = (url: string) => {
    const pattern =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)[\w-]{11}/;
    return pattern.test(url.trim());
  };

  const handleSubmit = () => {
    if (!isValidYoutubeUrl(urlYoutube)) {
      setUrlError("URL YouTube tidak valid");
      return;
    }
    setUrlError("");
    console.log("Submit:", { nama, urlYoutube });
    setModalOpen(false);
    setNama("");
    setUrlYoutube("");
  };
  return (
    <AuthGuard>
      <div className="flex h-screen bg-zinc-950">
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-30 bg-black/60 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-zinc-800 bg-zinc-900 transition-transform md:static md:z-auto md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
          <div className="flex items-center border-b border-zinc-800 px-4 py-3">
            <div className="flex cursor-pointer items-center flex-1" onClick={() => router.push("/")}>
              <Logo imgSize="h-7" textSize="text-sm" />
            </div>
            <button className="text-zinc-500 md:hidden" onClick={() => setSidebarOpen(false)}>
              <Icon className="size-5" icon="lucide:x" />
            </button>
          </div>

        <div className="p-3">
          <Modal>
            <button
              className="flex w-full items-center gap-2 rounded-lg border border-zinc-700 px-3 py-2.5 text-sm text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-200"
              onClick={() => setModalOpen(true)}
            >
              <Icon className="size-4" icon="lucide:plus" />
              Video baru
            </button>
            <Modal.Backdrop className="bg-black/70" isOpen={modalOpen} onOpenChange={(open) => { setModalOpen(open); if (!open) { setNama(""); setUrlYoutube(""); setUrlError(""); } }}>
              <Modal.Container>
                <Modal.Dialog className="border border-zinc-800 bg-zinc-900 sm:max-w-md">
                  <Modal.CloseTrigger className="text-zinc-500" />
                  <Modal.Header>
                    <Modal.Heading className="text-white">Video Baru</Modal.Heading>
                    <p className="text-sm text-zinc-400">
                      Masukkan detail video YouTube yang akan diproses.
                    </p>
                  </Modal.Header>
                  <Modal.Body className="text-zinc-300">
                    <div className="flex flex-col gap-4">
                      <TextField className="w-full" isRequired name="nama" type="text" value={nama} onChange={setNama}>
                        <Label className="text-zinc-300">Nama</Label>
                        <Input className="bg-zinc-800 text-zinc-200 placeholder:text-zinc-600" placeholder="Contoh: Review Produk X" variant="secondary" />
                      </TextField>
                      <TextField className="w-full" isRequired name="url" type="url" value={urlYoutube} onChange={(v) => { setUrlYoutube(v); setUrlError(""); }}>
                        <Label className="text-zinc-300">URL YouTube</Label>
                        <Input className="bg-zinc-800 text-zinc-200 placeholder:text-zinc-600" placeholder="https://youtube.com/watch?v=..." variant="secondary" />
                      </TextField>
                      {urlError && (
                        <p className="text-sm text-red-400">{urlError}</p>
                      )}
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button className="w-full border border-zinc-700 bg-zinc-800 font-medium text-zinc-200 shadow-sm hover:bg-zinc-700" slot="close" onPress={handleSubmit}>
                      Proses
                    </Button>
                  </Modal.Footer>
                </Modal.Dialog>
              </Modal.Container>
            </Modal.Backdrop>
          </Modal>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 pb-2">
          {dummyVideos.map((video) => (
            <button
              key={video.id}
              onClick={() => setSelectedVideoId(video.id)}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                video.id === selectedVideoId
                  ? "bg-zinc-800 text-zinc-200"
                  : "text-zinc-500 hover:bg-zinc-800/60 hover:text-zinc-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`size-2 shrink-0 rounded-full ${
                  video.status === "success" ? "bg-green-500" :
                  video.status === "in_progress" ? "bg-yellow-500 animate-pulse" :
                  video.status === "error" ? "bg-red-500" :
                  "bg-zinc-600"
                }`} />
                <Icon className="size-3.5 shrink-0" icon="lucide:video" />
                <span className="truncate">{video.name}</span>
                <span className="ml-auto text-[10px] text-zinc-600">{video.clips.length}</span>
              </div>
            </button>
          ))}
        </nav>

        <div className="border-t border-zinc-800">
          {/* Langganan info - visible in sidebar */}
          <div className="flex items-center gap-2 px-4 py-2.5">
            <div className="flex size-6 items-center justify-center rounded-md bg-red-700 text-white">
              <Icon className="size-3.5" icon="lucide:crown" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-medium text-zinc-400">
                {subscription?.subscription?.product_name || (subscription?.has_active ? "Aktif" : "Tidak Ada")}
              </p>
              <p className="text-[10px] text-zinc-600">
                {subscription?.subscription?.expired_at
                  ? `${Math.ceil((new Date(subscription.subscription.expired_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} hari lagi`
                  : "-"}
              </p>
            </div>
          </div>

          <div className="h-px bg-zinc-800" />

          <div className="relative px-3 pb-3 pt-2">
            <button
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-800/60 hover:text-zinc-300"
              onClick={() => setMenuOpen(!menuOpen)}
              onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
            >
              <div className="flex size-6 items-center justify-center rounded-full bg-red-700 text-xs font-medium text-white">
                F
              </div>
              <span className="truncate">{user?.email || "user@email.com"}</span>
              <Icon className="ml-auto size-4" icon="lucide:settings" />
            </button>

            {menuOpen && (
              <div className="absolute bottom-full left-3 right-3 mb-1 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow-xl">
                <button
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
                  onClick={() => router.push("/workspace/pembelian")}
                >
                  <Icon className="size-4" icon="lucide:shopping-cart" />
                  Pembelian
                </button>
                <button
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
                  onClick={() => router.push("/workspace/penggunaan")}
                >
                  <Icon className="size-4" icon="lucide:bar-chart-3" />
                  Penggunaan
                </button>
                <div className="h-px bg-zinc-800" />
                <button
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-red-400 transition-colors hover:bg-zinc-800"
                  onClick={() => {
                    logout();
                    router.replace("/login");
                  }}
                >
                  <Icon className="size-4" icon="lucide:log-out" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      <main className="flex flex-1 flex-col">
        {(() => {
          const video = dummyVideos.find((v) => v.id === selectedVideoId);
          if (!video) return null;
          return (
            <>
              <header className="flex items-center justify-between border-b border-zinc-800 px-4 py-3 lg:px-6">
                <div className="flex items-center gap-3 min-w-0">
                  <button className="shrink-0 text-zinc-500 md:hidden" onClick={() => setSidebarOpen(true)}>
                    <Icon className="size-5" icon="lucide:menu" />
                  </button>
                  <div className="min-w-0">
                    <h1
                    className="truncate text-sm font-semibold text-white"
                    style={{ fontFamily: "var(--font-bricolage)" }}
                  >
                    {video.name}
                  </h1>
                  <p className="truncate text-xs text-zinc-500">{video.youtube_url}</p>
                </div>
              </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${statusConfig[video.status].badgeClass}`}
                  >
                    <Icon className="size-3" icon={statusConfig[video.status].icon} />
                    {statusConfig[video.status].label}
                  </span>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto px-4 py-6 lg:px-8">
                <div className="mx-auto max-w-4xl">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-sm font-medium text-zinc-400">
                      Cuplikan Video
                    </h2>
                    <span className="text-xs text-zinc-600">
                      {video.clips.filter((c) => c.status === "success").length}/{video.clips.length} selesai
                    </span>
                  </div>

                  <div className="space-y-3">
                    {video.clips.map((clip) => {
                      const cfg = statusConfig[clip.status];
                      return (
                        <div
                          key={clip.id}
                          className={`flex items-center gap-4 rounded-xl border p-4 transition-colors ${cfg.containerClass}`}
                        >
                          <div
                            className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                              clip.status === "success" ? "bg-green-900/30" :
                              clip.status === "error" ? "bg-red-900/30" :
                              clip.status === "in_progress" ? "bg-yellow-900/30" :
                              "bg-zinc-800"
                            }`}
                          >
                            <Icon
                              className={`size-5 ${
                                clip.status === "success" ? "text-green-400" :
                                clip.status === "error" ? "text-red-400" :
                                clip.status === "in_progress" ? "text-yellow-400" :
                                "text-zinc-500"
                              }`}
                              icon={cfg.icon}
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-zinc-200">
                              {clip.title}
                            </p>
                            <p className="mt-0.5 text-xs text-zinc-500">
                              {clip.duration && `${clip.duration} • `}
                              {clip.created_at}
                            </p>
                          </div>

                          <span
                            className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${cfg.badgeClass}`}
                          >
                            {clip.status === "in_progress" && (
                              <span className="inline-block size-1.5 animate-pulse rounded-full bg-yellow-400" />
                            )}
                            {cfg.label}
                          </span>

                          {clip.status === "success" && (
                            <div className="flex items-center gap-1">
                              <button className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-200" title="Play">
                                <Icon className="size-4" icon="lucide:play" />
                              </button>
                              <button className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-200" title="Download">
                                <Icon className="size-4" icon="lucide:download" />
                              </button>
                              <button
                                className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
                                onClick={(e) => {
                                  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                  setUploadStyle({
                                    bottom: window.innerHeight - rect.top + 4,
                                    right: document.documentElement.clientWidth - rect.right,
                                  });
                                  setActiveUploadClipId(activeUploadClipId === clip.id ? null : clip.id);
                                }}
                              >
                                Unggah
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          );
        })()}
      </main>

      {activeUploadClipId !== null && uploadStyle && (
        <>
          <div className="fixed inset-0 z-[9998]" onClick={() => { setActiveUploadClipId(null); setUploadStyle(null); }} />
          <div
            className="fixed z-[9999] overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow-xl"
            style={uploadStyle}
          >
            <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200">
              <Icon className="size-4" icon="lucide:music" />
              TikTok
            </button>
            <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200">
              <Icon className="size-4" icon="lucide:camera" />
              Instagram
            </button>
            <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200">
              <Icon className="size-4" icon="lucide:youtube" />
              YouTube
            </button>
          </div>
        </>
      )}
      </div>
    </AuthGuard>
  );
}
