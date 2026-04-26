import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { navigation } from "../data/siteContent";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/72 backdrop-blur-xl">
      <nav className="section-shell flex min-h-20 items-center justify-between gap-6" aria-label="Primary navigation">
        <a href="#home" className="focus-ring flex items-center gap-3 rounded-full">
          <span className="brand-mark">GP</span>
          <span className="font-display text-lg font-semibold tracking-tight text-white">GrowthPulse Digital</span>
        </a>

        <div className="hidden items-center gap-7 lg:flex">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="focus-ring rounded-full px-1 py-2 text-sm font-medium text-slate-300 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="#audit"
            className="focus-ring action-primary rounded-full px-5 py-3 text-sm font-semibold text-slate-950"
          >
            Get free audit
          </a>
        </div>

        <button
          type="button"
          className="focus-ring inline-flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-100 lg:hidden"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.2 }}
            className="border-t border-white/10 bg-slate-950/96 lg:hidden"
          >
            <div className="section-shell flex flex-col gap-3 py-5">
              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="focus-ring rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-200 hover:bg-white/[0.05]"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#audit"
                className="focus-ring action-primary mt-2 rounded-2xl px-4 py-3 text-center text-sm font-semibold text-slate-950"
                onClick={() => setIsOpen(false)}
              >
                Get free audit
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
