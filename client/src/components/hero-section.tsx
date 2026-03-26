import GoogleAuthWrapper from "./google-auth-wrapper";
import { Button } from "./ui/button";

export default function HeroSection() {
  return (
    <div className="flex flex-col w-full gap-8 items-center text-center mt-4">
      <div className="flex flex-col gap-2 md:gap-4 items-center max-w-3xl">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-domine font-semibold tracking-tight">
          Precision Uptime
        </h1>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-domine font-semibold text-[#b7c4ff] tracking-tight">
          Monitoring.
        </h1>
        <p className="pt-4 w-full text-sm md:text-base font-montserrat text-[#a0a3a4] leading-relaxed max-w-2xl">
          The digital observatory for modern engineering teams. Monitor
          performance, track latency, and receive instant notifications with
          surgical precision.
        </p>
      </div>

      <div className="flex justify-center gap-4 md:gap-6 font-montserrat mt-4">
        <GoogleAuthWrapper />
      </div>
    </div>
  );
}
