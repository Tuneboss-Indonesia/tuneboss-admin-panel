import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-zinc-950 text-zinc-50 font-sans">
      <div className="flex flex-col items-center gap-8">
        <Image
          src="/tuneboss-logo.png"
          alt="TuneBoss Logo"
          width={280}
          height={70}
          priority
          className="object-contain"
        />
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-4xl tracking-widest text-[#d75a00] uppercase font-display">
            Admin Panel
          </h1>
          <p className="text-lg text-zinc-400">
            Marketplace is ready for development.
          </p>
        </div>
      </div>
    </div>
  );
}
