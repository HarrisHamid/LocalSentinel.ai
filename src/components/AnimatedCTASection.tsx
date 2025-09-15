import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Github, Download, Star, GitFork } from "lucide-react";
import { useGitHubStats, FALLBACK_STATS } from "../hooks/useGitHubStats";
import { formatGitHubStat, createLoadingPlaceholder } from "../utils/formatters";
import { useCountUp } from "../hooks/useCountUp";

export function AnimatedCTASection() {
  const { stats, isLoading, error } = useGitHubStats();
  const displayStats = stats || FALLBACK_STATS;

  const { count: starsCount, ref: starsRef } = useCountUp(displayStats.stars, 2000);
  const { count: forksCount, ref: forksRef } = useCountUp(displayStats.forks, 2000);
  const { count: downloadsCount, ref: downloadsRef } = useCountUp(displayStats.downloads, 2500);

  return (
    <section id="download" className="relative py-20 overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900"
        style={{
          backgroundSize: "400% 400%",
        }}
      />

      {/* Animated particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl lg:text-4xl mb-6"
        >
          Start scanning in 60 seconds
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto"
        >
          Download. Extract. Run. No installation, no configuration, no cloud account.
        </motion.p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-colors">
              <CardContent className="p-8">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4"
                >
                  <Download className="w-8 h-8" />
                </motion.div>
                <h3 className="text-xl mb-3 text-[rgba(255,255,255,1)]">VS Code Extension</h3>
                <p className="text-blue-100 mb-6">
                  Install directly from VS Code marketplace. One-click setup.
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-600/80 shadow-lg hover:shadow-xl transition-all"
                    onClick={() => {
                      // Link to GitHub releases
                      window.open('https://github.com/HarrisHamid/LocalSentinel.ai/releases/tag/v0.0.1', '_blank');
                    }}
                  >
                    <motion.span
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Download Extension
                    </motion.span>
                    <Download className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
                <p className="text-xs text-blue-200 mt-2">
                  VS Code 1.85+ • Runs locally
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-colors">
              <CardContent className="p-8">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mx-auto mb-4"
                >
                  <Github className="w-8 h-8" />
                </motion.div>
                <h3 className="text-xl mb-3 text-[rgba(255,255,255,1)]">Build from source</h3>
                <p className="text-blue-100 mb-6">
                  Clone, build, audit. Full transparency. MIT licensed.
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    className="w-full border-white/30 bg-white text-slate-900 hover:bg-white/90 transition-all"
                    onClick={() => window.open('https://github.com/HarrisHamid/LocalSentinel.ai', '_blank')}
                  >
                    github.com/LocalSentinel
                    <Github className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
                <p className="text-xs text-blue-200 mt-2">
                  Python 3.12+ • Rust • Node.js 16+
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Animated GitHub stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex justify-center gap-8 text-sm"
        >
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.1 }}
            ref={starsRef}
          >
            <Star className="w-4 h-4" />
            <span className={isLoading ? "opacity-70" : ""}>
              {isLoading && !stats
                ? createLoadingPlaceholder("stars")
                : starsCount
              }
            </span>
          </motion.div>
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.1 }}
            ref={forksRef}
          >
            <GitFork className="w-4 h-4" />
            <span className={isLoading ? "opacity-70" : ""}>
              {isLoading && !stats
                ? createLoadingPlaceholder("forks")
                : forksCount
              }
            </span>
          </motion.div>
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.1 }}
            ref={downloadsRef}
          >
            <Download className="w-4 h-4" />
            <span className={isLoading ? "opacity-70" : ""}>
              {isLoading && !stats
                ? createLoadingPlaceholder("downloads")
                : downloadsCount
              }
            </span>
          </motion.div>
        </motion.div>

        {/* Status indicator */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-xs text-yellow-300/80"
          >
            ⚠️ Using cached stats (API temporarily unavailable)
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 p-6 bg-yellow-900/30 border border-yellow-500/30 rounded-lg backdrop-blur-sm"
          whileHover={{ scale: 1.02 }}
        >
          <p className="text-yellow-100">
            <strong>Built for:</strong> Qualcomm NYU Hackathon 2025.
            Works on Windows, macOS, and Linux with VS Code 1.74+.
          </p>
        </motion.div>
      </div>
    </section>
  );
}