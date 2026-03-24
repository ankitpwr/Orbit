import { Bell, BracesIcon, Clock } from "lucide-react";

export default function Feature() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-6 md:gap-8 bg-black font-montserrat">
      {/* Feature Card 1 */}
      <div className="group flex flex-col items-start border border-gray-900 bg-gradient-to-b from-[#0a0a0a] to-black p-8 rounded-2xl gap-4 hover:border-gray-800 transition-all duration-300">
        <div className="p-3 bg-gray-900/60 border border-gray-800 rounded-lg text-[#b7c4ff] group-hover:scale-110 transition-transform duration-300">
          <Clock size={24} />
        </div>
        <h1 className="font-montserrat font-semibold text-xl md:text-2xl mt-2 text-white">
          Reliable Intervals
        </h1>
        <p className="text-[#a0a3a4] text-sm md:text-base leading-relaxed">
          Keep a constant pulse on your infrastructure. We reliably ping your
          endpoints at precise 5-minute intervals to ensure maximum
          availability.
        </p>
      </div>

      {/* Feature Card 2 */}
      <div className="group flex flex-col items-start border border-gray-900 bg-gradient-to-b from-[#0a0a0a] to-black p-8 rounded-2xl gap-4 hover:border-gray-800 transition-all duration-300">
        <div className="p-3 bg-gray-900/60 border border-gray-800 rounded-lg text-[#b7c4ff] group-hover:scale-110 transition-transform duration-300">
          <Bell size={24} />
        </div>
        <h1 className="font-montserrat font-semibold text-xl md:text-2xl mt-2 text-white">
          Instant Alerts
        </h1>
        <p className="text-[#a0a3a4] text-sm md:text-base leading-relaxed">
          Be the first to know when things go sideways. Receive immediate,
          notifications via Email, the second downtime is detected.
        </p>
      </div>

      {/* Feature Card 3 */}
      <div className="group flex flex-col items-start border border-gray-900 bg-gradient-to-b from-[#0a0a0a] to-black p-8 rounded-2xl gap-4 hover:border-gray-800 transition-all duration-300">
        <div className="p-3 bg-gray-900/60 border border-gray-800 rounded-lg text-[#b7c4ff] group-hover:scale-110 transition-transform duration-300">
          <BracesIcon size={24} />
        </div>
        <h1 className="font-montserrat font-semibold text-xl md:text-2xl mt-2 text-white">
          API Testing
        </h1>
        <p className="text-[#a0a3a4] text-sm md:text-base leading-relaxed">
          Go beyond simple status codes. Assert JSON payloads, track response
          times, and verify specific headers to ensure your services are truly
          functional.
        </p>
      </div>
    </div>
  );
}
