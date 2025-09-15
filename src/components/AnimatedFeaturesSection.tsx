import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Shield, Cpu, FileCode, Download, Zap, Lock, Bot } from "lucide-react";

const features = [
  {
    icon: Lock,
    title: "Runs fully offline",
    description: "No network calls. No telemetry. Your code stays on your machine.",
    highlight: "LOCAL-ONLY",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Bot,
    title: "AI Pair-Programming Ready",
    description: "Copy fix prompts directly to Claude Code or Cursor for instant remediation.",
    highlight: "AI-READY",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Cpu,
    title: "Snapdragon NPU",
    description: "Leverages Qualcomm QNN for 10x faster inference than CPU.",
    highlight: "OPTIMIZED",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: FileCode,
    title: "DeepSeek Coder v2",
    description: "Advanced code LLM for contextual vulnerability analysis.",
    highlight: "DEEPSEEK",
    color: "from-orange-500 to-amber-500"
  },
  {
    icon: Shield,
    title: "OWASP + CWE",
    description: "Detects OWASP Top 10 and 200+ CWE vulnerability patterns.",
    highlight: "COVERAGE",
    color: "from-red-500 to-rose-500"
  },
  {
    icon: Download,
    title: "MIT licensed",
    description: "Free forever. No vendor lock-in. Fork and modify as needed.",
    highlight: "OPEN SOURCE",
    color: "from-indigo-500 to-violet-500"
  }
];

export function AnimatedFeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="features" className="py-20 bg-slate-50 dark:bg-slate-900" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl mb-4">
            Built for air-gapped teams
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Security-first architecture. Zero external dependencies.
            Your proprietary code never touches the internet.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="relative overflow-hidden group h-full hover:shadow-xl transition-all duration-300 flex flex-col">
                {/* Gradient background on hover */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />

                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-3">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50"
                    >
                      <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </motion.div>
                    <motion.span
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      className="text-xs text-blue-600 dark:text-blue-400 px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-full font-mono"
                    >
                      {feature.highlight}
                    </motion.span>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 pb-6">
                  <p className="text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                </CardContent>

                {/* Progress bar animation */}
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional animation element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="inline-block text-lg font-semibold text-slate-700 dark:text-slate-300"
          >
            Enterprise-grade security, zero compromise on privacy
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}