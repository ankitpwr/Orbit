// components/footer.tsx
import { Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-black border-t border-gray-900 font-montserrat pt-12 pb-8 px-8 md:px-32 mt-20">
      <div className=" max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="  flex flex-col gap-4 col-span-1 md:col-span-1">
          <h1 className="text-2xl font-semibold text-white">Orbit</h1>
          <p className="text-[#a0a3a4] text-sm leading-relaxed">
            Precision uptime monitoring for modern engineering teams. Never miss a moment of downtime.
          </p>
        </div>
        <div className="flex flex-col gap-3 md:items-end">
          <h2 className="text-white font-semibold mb-2">Connect</h2>
          <div className="flex gap-4">
            <a href="#" className="text-[#a0a3a4] hover:text-[#b7c4ff] transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-[#a0a3a4] hover:text-[#b7c4ff] transition-colors">
              <Github size={20} />
            </a>
            <a href="#" className="text-[#a0a3a4] hover:text-[#b7c4ff] transition-colors">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full h-[1px] bg-gray-900 mb-8"></div>
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[#a0a3a4] text-sm">
          © {new Date().getFullYear()} Orbit Monitoring. All rights reserved.
        </p>
        <p className="text-[#a0a3a4] text-sm flex items-center gap-1">
          Built with <span className="text-[#b7c4ff]">precision</span>.
        </p>
      </div>
    </footer>
  );
}