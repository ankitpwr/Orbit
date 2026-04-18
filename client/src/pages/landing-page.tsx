import Navbar from "../components/navbar";
import HeroSection from "../components/hero-section";
import Feature from "../components/feature";
import Footer from "../components/footer";

import dashboard from "../assets/dashboard1.png";

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-black px-8 md:px-32 gap-16 text-white overflow-hidden pb-24">
      <div className="fixed z-50 w-full left-0 flex justify-center md:py-8 py-4 px-8 md:px-0">
        <Navbar />
      </div>

      <div className="pt-32 md:pt-40 flex flex-col items-center w-full gap-20 md:gap-16 max-w-7xl mx-auto">
        <HeroSection />

        <div className="relative w-full max-w-5xl flex justify-center group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#b7c4ff]/20 to-blue-500/10 rounded-[24px] blur-xl opacity-70 group-hover:opacity-100 transition duration-1000"></div>

          <div className="relative rounded-xl border border-gray-800 bg-[#0a0a0a] p-2 md:p-3 shadow-2xl w-full flex flex-col">
            <div className="flex gap-2 mb-3 px-2 pt-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>

            <img
              src={dashboard}
              alt="Orbit Dashboard"
              className="rounded-lg w-full h-auto object-cover border border-gray-900/50"
            />
          </div>
        </div>

        <Feature />
        <Footer />
      </div>
    </div>
  );
}
