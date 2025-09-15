import { Card, CardContent } from "./ui/card";
import { Download, Cpu, Search, Shield } from "lucide-react";

const steps = [
  {
    icon: Download,
    title: "Install Extension",
    description: "Download the VS Code extension from our GitHub releases. Simple .vsix file installation, no complex setup.",
    step: "01"
  },
  {
    icon: Cpu,
    title: "Start Local AI",
    description: "Launch LM Studio with a security-focused model. Everything runs on your machine, no cloud required.",
    step: "02"
  },
  {
    icon: Search,
    title: "Scan Your Code",
    description: "Click scan in VS Code. LocalSentinel analyzes your entire codebase for vulnerabilities in seconds.",
    step: "03"
  },
  {
    icon: Shield,
    title: "Review & Fix",
    description: "Get a detailed report with RED/YELLOW/GREEN severity levels and copy-paste fixes for each issue.",
    step: "04"
  }
];

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl mb-4">
            How It Works
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            LocalSentinel makes code auditing simple with a streamlined three-step process 
            that respects your privacy and keeps everything local.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="h-full border-2 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                        <step.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
                        {step.step}
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl mb-3">{step.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {step.description}
                  </p>
                </CardContent>
              </Card>

              {/* Connection line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-slate-300 dark:bg-slate-700 z-10">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Terminal preview */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-slate-400 ml-4 text-sm">LocalSentinel Output</span>
            </div>
            
            <div className="space-y-2 text-sm font-mono">
              <div className="text-green-400">✓ Scanning completed in 2.3s</div>
              <div className="text-blue-400">📊 Found 3 security issues, 2 compliance warnings</div>
              <div className="text-yellow-400">⚠️  SQL injection vulnerability detected in auth.js:42</div>
              <div className="text-slate-300">   Recommendation: Use parameterized queries</div>
              <div className="text-yellow-400">⚠️  Hardcoded API key found in config.js:15</div>
              <div className="text-slate-300">   Recommendation: Move to environment variables</div>
              <div className="text-green-400">💾 Results copied to clipboard</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}