import Image from "next/image";

export default function OnderhoudPage() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center px-6 text-center">
      <Image
        src="/som-project-logo-white.svg"
        alt="SOM Vastgoed"
        width={160}
        height={48}
        className="mb-10 opacity-90"
      />
      <h1 className="text-white text-3xl font-semibold mb-4">
        Tijdelijk in onderhoud
      </h1>
      <p className="text-white/60 text-lg max-w-md">
        Onze website is momenteel even offline voor onderhoud. We zijn snel
        terug. Bedankt voor uw geduld.
      </p>
      <div className="mt-10 text-white/30 text-sm">
        © {new Date().getFullYear()} SOM Vastgoed
      </div>
    </div>
  );
}
