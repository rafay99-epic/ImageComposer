import React from "react";
import {
  Heart,
  Github,
  Twitter,
  Mail,
  Sparkles,
  ArrowUp,
  Globe,
} from "lucide-react";

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-background border-t border-primary/10 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Floating orbs */}
        <div className="absolute top-10 left-20 w-32 h-32 bg-primary/5 rounded-full blur-2xl animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-24 h-24 bg-accent/5 rounded-full blur-xl animate-float"
          style={{ animationDelay: "3s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-20 h-20 bg-secondary/5 rounded-full blur-lg animate-float"
          style={{ animationDelay: "1.5s" }}
        ></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(192,166,217,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(192,166,217,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="container-custom relative z-10 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/20 rounded-xl border border-primary/30">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-text via-primary to-accent bg-clip-text text-transparent">
                Image Composer
              </h3>
            </div>
            <p className="text-text/70 leading-relaxed mb-6 max-w-md">
              Professional-grade image optimization and compression tools
              designed for
              <span className="text-primary font-semibold">
                {" "}
                modern businesses
              </span>{" "}
              and enterprises who demand exceptional quality.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 glass rounded-lg border border-primary/20">
                <div className="text-lg font-bold text-primary">90%</div>
                <div className="text-xs text-text/60">Size Reduction</div>
              </div>
              <div className="text-center p-3 glass rounded-lg border border-accent/20">
                <div className="text-lg font-bold text-accent">100%</div>
                <div className="text-xs text-text/60">Client-side</div>
              </div>
              <div className="text-center p-3 glass rounded-lg border border-secondary/20">
                <div className="text-lg font-bold text-secondary">∞</div>
                <div className="text-xs text-text/60">Free Usage</div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-sm font-semibold text-text mb-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              Navigation
            </h4>
            <ul className="space-y-3">
              {[
                { name: "Features", href: "#features" },
                { name: "Image Optimizer", href: "#composer" },
                { name: "Contact Me", href: "/contact" },
                { name: "Documentation", href: "#" },
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    className="text-text/60 hover:text-primary transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <div className="w-1 h-1 bg-text/30 rounded-full group-hover:bg-primary transition-colors"></div>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-sm font-semibold text-text mb-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              Legal
            </h4>
            <ul className="space-y-3">
              {[
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms of Service", href: "/terms" },
                { name: "Security", href: "/security" },
                { name: "Cookie Policy", href: "/cookies" },
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    className="text-text/60 hover:text-accent transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <div className="w-1 h-1 bg-text/30 rounded-full group-hover:bg-accent transition-colors"></div>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider with gradient */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="px-4 bg-background">
              <div className="w-8 h-0.5 bg-gradient-to-r from-primary via-accent to-secondary rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright */}
          <div className="flex items-center gap-2 text-sm text-text/60">
            <span>© {new Date().getFullYear()} Image Composer.</span>
            <span>Made with</span>
            <Heart className="w-4 h-4 text-accent animate-pulse" />
            <span>by</span>
            <a
              href="https://rafay99.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-accent transition-colors font-medium"
            >
              Abdul Rafay
            </a>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {[
              {
                icon: Github,
                href: "https://github.com/rafay99-epic",
                color: "text-text/60 hover:text-primary",
              },
              {
                icon: Twitter,
                href: "https://x.com/abdul_rafay99",
                color: "text-text/60 hover:text-accent",
              },
              {
                icon: Globe,
                href: "https://rafay99.com",
                color: "text-text/60 hover:text-primary",
              },
              {
                icon: Mail,
                href: "mailto:99marafay@gmail.com",
                color: "text-text/60 hover:text-primary",
              },
            ].map((social, index) => (
              <a
                key={index}
                href={social.href}
                className={`p-2 rounded-lg glass border border-primary/20 ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-lg group`}
                target={social.href.startsWith("http") ? "_blank" : "_self"}
                rel={
                  social.href.startsWith("http") ? "noopener noreferrer" : ""
                }
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}

            {/* Back to Top Button */}
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg glass border border-accent/20 text-text/60 hover:text-accent transition-all duration-300 hover:scale-110 hover:shadow-lg group ml-2"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4 group-hover:animate-bounce" />
            </button>
          </div>
        </div>

        {/* Bottom Accent */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full border border-primary/20">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-xs text-text/50 font-medium">
              Professional Image Processing
            </span>
            <div
              className="w-2 h-2 bg-accent rounded-full animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
