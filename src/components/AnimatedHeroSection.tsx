import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Shield, Lock, Github } from "lucide-react";

export function AnimatedHeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  const [typedText, setTypedText] = useState("");
  const fullText = "$ localsentinel scan ./src";

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const terminalLines = [
    { text: "✓ Scanned 142 files in 2.3s", delay: 1.5, color: "text-slate-300" },
    { text: "⚠ 3 vulnerabilities found", delay: 2, color: "text-yellow-400" },
    { text: "→ SQL injection risk at db.js:47", delay: 2.3, color: "text-slate-400" },
    { text: "→ Hardcoded API key at config.js:12", delay: 2.6, color: "text-slate-400" },
    { text: "→ Missing input validation at api.js:89", delay: 2.9, color: "text-slate-400" }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background pattern */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"
      />

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Hero content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 max-w-7xl mx-auto px-6 py-20"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="space-y-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Badge variant="secondary" className="bg-blue-900/50 text-blue-100 border-blue-800">
                  <Shield className="w-4 h-4 mr-2" />
                  LOCAL-ONLY
                </Badge>
              </motion.div>

              <h1 className="text-4xl lg:text-6xl text-white leading-tight">
                <motion.span
                  className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent inline-block"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    backgroundSize: "200% 200%",
                  }}
                >
                  Audit locally.
                </motion.span>
                <br />
                Ship with confidence.
              </h1>

              <motion.p
                variants={itemVariants}
                className="text-xl text-slate-300 max-w-lg"
              >
                AI-powered security scanner that runs 100% offline.
                Built for Snapdragon X Elite.
              </motion.p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4 text-sm text-slate-400"
            >
              {[
                { icon: Lock, text: "Zero Cloud Dependencies", color: "text-green-400" },
                { icon: Shield, text: "Complete Data Privacy", color: "text-blue-400" },
                { icon: Github, text: "Fully Auditable Code", color: "text-purple-400" }
              ].map((item, index) => (
                <motion.div
                  key={item.text}
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                  {item.text}
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-600/80 text-white shadow-lg hover:shadow-xl transition-all"
                  onClick={() => {
                    // Link to GitHub releases
                    window.open('https://github.com/HarrisHamid/LocalSentinel.ai/releases/tag/v0.0.1', '_blank');
                  }}
                >
                  <motion.span
                    animate={{ opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Download VS Code Extension
                  </motion.span>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-600 text-slate-900 bg-white hover:bg-slate-100"
                  onClick={() => window.open('https://github.com/HarrisHamid/LocalSentinel.ai', '_blank')}
                >
                  Source code →
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative"
          >
            <div className="relative bg-slate-900/80 backdrop-blur-sm rounded-lg border border-slate-700 p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-3 h-3 bg-red-500 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, delay: 0.2, repeat: Infinity }}
                  className="w-3 h-3 bg-yellow-500 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, delay: 0.4, repeat: Infinity }}
                  className="w-3 h-3 bg-green-500 rounded-full"
                />
                <span className="text-slate-400 ml-4 text-sm">LocalSentinel Terminal</span>
              </div>

              <div className="space-y-4">
                <div className="text-green-400 text-sm font-mono">
                  {typedText}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    |
                  </motion.span>
                </div>

                <div className="space-y-2">
                  {terminalLines.map((line, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: line.delay }}
                      className={`text-sm ${line.color}`}
                    >
                      {line.text}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative rotating color wheel */}
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -inset-6 -z-10"
            >
              <div
                className="absolute inset-0 rounded-lg"
                style={{
                  background: `conic-gradient(from 0deg at 50% 50%,
                    #3b82f6 0deg,
                    #8b5cf6 90deg,
                    #a855f7 180deg,
                    #3b82f6 270deg,
                    #8b5cf6 360deg)`,
                  filter: 'blur(40px)',
                  opacity: 0.5
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}