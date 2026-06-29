"use client";

type LogoProps = {
  imgSize?: string;
  textSize?: string;
};

export default function Logo({ imgSize = "h-9", textSize = "text-xl" }: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      <img
        alt="Mengonten"
        className={`${imgSize} w-auto`}
        src="/logo.png"
      />
      <span
        className={`${textSize} font-bold text-white`}
        style={{ fontFamily: "var(--font-bricolage)" }}
      >
        Mengonten
      </span>
    </div>
  );
}
