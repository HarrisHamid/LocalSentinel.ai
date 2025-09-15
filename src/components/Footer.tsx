import { Github, Twitter, Mail } from "lucide-react";
import logo from "../assets/logo_white.svg";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={logo}
                alt="LocalSentinel.ai"
                className="w-8 h-8"
              />
              <span className="text-white text-lg">
                LocalSentinel.ai
              </span>
            </div>
            <p className="text-sm">
              AI-powered code auditing that respects your
              privacy. Built for Snapdragon X Elite processors.
            </p>
          </div>

          <div>
            <h4 className="text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors"
                >
                  Download
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors"
                >
                  Changelog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/HarrisHamid/LocalSentinel.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors"
                >
                  Issues
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors"
                >
                  Contributing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors"
                >
                  License
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white mb-4">Connect</h4>
            <div className="flex gap-4">
              <a
                href="https://github.com/HarrisHamid/LocalSentinel.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">
            © 2025 LocalSentinel.ai. Open source under MIT
            License.
          </p>
          <div className="flex gap-6 text-sm mt-4 md:mt-0">
            <a
              href="#"
              className="hover:text-white transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors"
            >
              Security
            </a>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            Built for Qualcomm NYU Hackathon 2025
          </p>
        </div>
      </div>
    </footer>
  );
}