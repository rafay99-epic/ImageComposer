import React from "react";
import { Shield, Lock, Eye, Database, Globe, ArrowLeft } from "lucide-react";

const Privacy: React.FC = () => {
  const sections = [
    {
      icon: <Database className="w-6 h-6" />,
      title: "Information We Collect",
      content: [
        "Image Composer is designed with privacy as a core principle. We collect minimal information to provide our service:",
        "• Usage analytics (anonymized page views and feature usage)",
        "• Error reports to improve service reliability",
        "• Browser type and version for compatibility",
        "• No personal files or images are ever stored on our servers",
      ],
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Client-Side Processing",
      content: [
        "Your privacy is our priority. All image processing happens locally in your browser:",
        "• Images never leave your device",
        "• No uploads to external servers",
        "• Processing happens entirely client-side",
        "• Zero data transmission during image optimization",
      ],
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Data Usage",
      content: [
        "We use collected data solely to improve our service:",
        "• Analytics help us understand which features are most valuable",
        "• Error reports help us fix bugs and improve stability",
        "• Performance metrics guide optimization efforts",
        "• No data is sold or shared with third parties",
      ],
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Cookies & Storage",
      content: [
        "We use minimal browser storage for functionality:",
        "• Local storage for user preferences (theme, settings)",
        "• Session storage for temporary processing data",
        "• Analytics cookies (can be disabled in browser)",
        "• No tracking or advertising cookies",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-float"></div>
        <div
          className="absolute bottom-40 right-20 w-24 h-24 bg-accent/10 rounded-full blur-xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/4 w-40 h-40 bg-secondary/10 rounded-full blur-2xl animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(192,166,217,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(192,166,217,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="container-custom relative z-10 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 mb-6">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-text/80">
              Privacy Policy
            </span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-text via-primary to-accent bg-clip-text text-transparent">
            Your Privacy Matters
          </h1>
          <p className="text-xl text-text/70 leading-relaxed max-w-3xl mx-auto">
            We believe in transparency and your right to privacy. Learn how we
            protect your data and ensure your images stay{" "}
            <span className="text-primary font-semibold">
              completely private
            </span>
            .
          </p>
        </div>

        {/* Last Updated */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full border border-text/10">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            <span className="text-sm text-text/60">
              Last updated: {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="glass rounded-2xl p-8 mb-12 border border-primary/20">
            <h2 className="text-2xl font-bold text-text mb-6">
              Our Commitment to Privacy
            </h2>
            <p className="text-text/70 leading-relaxed mb-4">
              Image Composer is built with privacy by design. Unlike traditional
              image processing services, we process everything locally in your
              browser, ensuring your images never leave your device.
            </p>
            <p className="text-text/70 leading-relaxed">
              This privacy policy explains what minimal data we collect, how we
              use it, and your rights regarding your information.
            </p>
          </div>

          {/* Privacy Sections */}
          <div className="grid gap-8 mb-12">
            {sections.map((section, index) => (
              <div
                key={index}
                className="glass rounded-2xl p-8 border border-primary/10 hover:border-primary/20 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/20 rounded-xl border border-primary/30 text-primary">
                    {section.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-text mb-4">
                      {section.title}
                    </h3>
                    <div className="space-y-3">
                      {section.content.map((item, itemIndex) => (
                        <p
                          key={itemIndex}
                          className="text-text/70 leading-relaxed"
                        >
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="glass rounded-2xl p-8 border border-accent/20 text-center">
            <h3 className="text-xl font-bold text-text mb-4">
              Questions About Privacy?
            </h3>
            <p className="text-text/70 mb-6">
              We're here to help. If you have any questions about this privacy
              policy or our data practices, please don't hesitate to reach out.
            </p>
            <a
              href="mailto:privacy@imagecomposer.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-text rounded-lg hover:bg-accent/80 transition-colors font-medium"
            >
              Contact Privacy Team
            </a>
          </div>

          {/* Rights Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass rounded-xl p-6 border border-primary/10 text-center">
              <div className="p-3 bg-primary/20 rounded-full w-fit mx-auto mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-text mb-2">Data Protection</h4>
              <p className="text-sm text-text/60">
                GDPR & CCPA compliant privacy practices
              </p>
            </div>
            <div className="glass rounded-xl p-6 border border-accent/10 text-center">
              <div className="p-3 bg-accent/20 rounded-full w-fit mx-auto mb-4">
                <Lock className="w-6 h-6 text-accent" />
              </div>
              <h4 className="font-semibold text-text mb-2">
                Secure Processing
              </h4>
              <p className="text-sm text-text/60">
                All data processing happens locally
              </p>
            </div>
            <div className="glass rounded-xl p-6 border border-secondary/10 text-center">
              <div className="p-3 bg-secondary/20 rounded-full w-fit mx-auto mb-4">
                <Eye className="w-6 h-6 text-secondary" />
              </div>
              <h4 className="font-semibold text-text mb-2">
                Full Transparency
              </h4>
              <p className="text-sm text-text/60">
                Clear, honest privacy practices
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
