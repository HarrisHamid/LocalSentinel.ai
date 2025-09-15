import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Github, Menu, X } from "lucide-react";
import logo from '../assets/logo_white.svg';

export function AnimatedHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#tech-specs", label: "Tech Specs" },
    { href: "#download", label: "Download" }
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 w-full z-50 bg-slate-900/95 backdrop-blur-xs border-b border-slate-700"
        style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <img src={logo} alt="LocalSentinel.ai" className="w-10 h-10" />
              <span className="text-white text-xl font-semibold">LocalSentinel.ai</span>
            </motion.div>

            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative text-slate-300 hover:text-white transition-colors group"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.querySelector(item.href);
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {item.label}
                  <motion.span
                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"
                  />
                </motion.a>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-300 hover:text-white"
                  onClick={() => window.open('https://github.com/HarrisHamid/LocalSentinel.ai', '_blank')}
                >
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden md:block"
              >
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-600/80 shadow-lg hover:shadow-xl transition-all"
                  onClick={() => {
                    window.open('https://github.com/HarrisHamid/LocalSentinel.ai/releases/tag/v0.0.1', '_blank');
                  }}
                >
                  Install Extension
                </Button>
              </motion.div>

              <Button
                variant="ghost"
                size="sm"
                className="md:hidden text-slate-300"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed top-[73px] right-0 w-full sm:w-80 h-screen bg-slate-900/95 backdrop-blur-md z-40 md:hidden"
          >
            <nav className="flex flex-col p-6 gap-4">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-slate-300 hover:text-white transition-colors py-3 px-4 rounded-lg hover:bg-slate-800"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    const element = document.querySelector(item.href);
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {item.label}
                </motion.a>
              ))}
              <div className="mt-4 space-y-3">
                <Button
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300"
                  onClick={() => window.open('https://github.com/HarrisHamid/LocalSentinel.ai', '_blank')}
                >
                  <Github className="w-4 h-4 mr-2" />
                  View on GitHub
                </Button>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-600/80 transition-all"
                  onClick={() => window.open('https://github.com/HarrisHamid/LocalSentinel.ai/releases/tag/v0.0.1', '_blank')}
                >
                  Install Extension
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}