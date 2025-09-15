import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { ShoppingCart, Gamepad2, Building2, ExternalLink } from "lucide-react";

const demos = [
  {
    icon: ShoppingCart,
    title: "E-Commerce Platform",
    name: "ShopZilla",
    description: "Online marketplace with price manipulation, SQL injection, and payment vulnerabilities.",
    vulnerabilities: ["Client-side validation", "Hardcoded API keys", "XSS vulnerabilities"],
    color: "from-purple-500 to-pink-500",
    link: "#"
  },
  {
    icon: Gamepad2,
    title: "Chess Game",
    name: "KnightMove.io",
    description: "Multiplayer chess with eval() RCE, MongoDB injection, and exposed JWT secrets.",
    vulnerabilities: ["Remote code execution", "Database injection", "Weak crypto"],
    color: "from-blue-500 to-cyan-500",
    link: "#"
  },
  {
    icon: Building2,
    title: "Banking Dashboard",
    name: "SecureBank",
    description: "Financial app with authentication bypass, IDOR, and path traversal vulnerabilities.",
    vulnerabilities: ["Auth bypass", "Path traversal", "IDOR vulnerabilities"],
    color: "from-green-500 to-emerald-500",
    link: "#"
  }
];

export function DemoShowcase() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-20 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl mb-4">
            Try Our Demo Applications
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Three intentionally vulnerable applications to showcase LocalSentinel's
            detection capabilities. Perfect for testing and demonstrations.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid lg:grid-cols-3 gap-8"
        >
          {demos.map((demo, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="h-full overflow-hidden hover:shadow-xl transition-shadow">
                <div className={`h-2 bg-gradient-to-r ${demo.color}`} />
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${demo.color} text-white`}>
                      <demo.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{demo.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{demo.name}</p>
                    </div>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    {demo.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Intentional Vulnerabilities:
                    </p>
                    <ul className="space-y-1">
                      {demo.vulnerabilities.map((vuln, vIndex) => (
                        <li key={vIndex} className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                          <span className="text-red-500">•</span>
                          {vuln}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-2 px-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                    onClick={() => window.open(demo.link, '_blank')}
                  >
                    View Demo
                    <ExternalLink className="w-4 h-4" />
                  </motion.button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 p-6 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
        >
          <p className="text-center text-yellow-800 dark:text-yellow-200">
            ⚠️ <strong>Warning:</strong> These applications contain intentional security vulnerabilities
            for demonstration purposes only. Do not deploy to production.
          </p>
        </motion.div>
      </div>
    </section>
  );
}