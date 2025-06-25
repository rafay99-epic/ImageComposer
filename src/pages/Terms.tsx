import React from "react";
import {
  FileText,
  Scale,
  Users,
  Zap,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";

const Terms: React.FC = () => {
  const sections = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Service Description",
      content: [
        "Image Composer provides client-side image optimization and compression services:",
        "• Professional image compression with quality preservation",
        "• Format conversion between JPEG, PNG, and WebP",
        "• Image enhancement features including rounded corners",
        "• All processing occurs locally in your browser",
        "• No account registration or personal information required",
      ],
    },
    {
      icon: <Scale className="w-6 h-6" />,
      title: "Acceptable Use",
      content: [
        "You agree to use Image Composer responsibly and legally:",
        "• Only process images you own or have permission to modify",
        "• Do not attempt to reverse engineer or circumvent our service",
        "• Respect intellectual property rights of image content",
        "• Use the service for legitimate image optimization purposes",
        "• Do not upload inappropriate, illegal, or harmful content",
      ],
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Service Availability",
      content: [
        "We strive to provide reliable service but cannot guarantee:",
        "• 100% uptime or continuous availability",
        "• Compatibility with all browsers or devices",
        "• Processing of all image formats or file sizes",
        "• Performance consistency across all environments",
        "• We reserve the right to modify features with notice",
      ],
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: "Limitation of Liability",
      content: [
        "Image Composer is provided 'as is' without warranties:",
        "• We are not liable for any data loss or corruption",
        "• Users are responsible for backing up original images",
        "• No warranty on processing quality or results",
        "• Maximum liability limited to the cost of service (free)",
        "• We disclaim all implied warranties of merchantability",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-2xl animate-float"></div>
        <div
          className="absolute bottom-40 left-20 w-24 h-24 bg-primary/10 rounded-full blur-xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/4 w-40 h-40 bg-accent/10 rounded-full blur-2xl animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(192,166,217,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(192,166,217,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="container-custom relative z-10 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-secondary/30 mb-6">
            <FileText className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-text/80">
              Terms & Conditions
            </span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-text via-secondary to-accent bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-xl text-text/70 leading-relaxed max-w-3xl mx-auto">
            Simple, fair terms for using Image Composer. We believe in
            <span className="text-secondary font-semibold">
              {" "}
              transparency
            </span>{" "}
            and keeping things straightforward.
          </p>
        </div>

        {/* Last Updated */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full border border-text/10">
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
            <span className="text-sm text-text/60">
              Last updated: {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="glass rounded-2xl p-8 mb-12 border border-secondary/20">
            <h2 className="text-2xl font-bold text-text mb-6">
              Agreement Overview
            </h2>
            <p className="text-text/70 leading-relaxed mb-4">
              By using Image Composer, you agree to these terms. Our service is
              free, client-side, and designed to respect your privacy while
              providing professional image optimization tools.
            </p>
            <p className="text-text/70 leading-relaxed">
              These terms are effective immediately and apply to all users of
              our service.
            </p>
          </div>

          {/* Terms Sections */}
          <div className="grid gap-8 mb-12">
            {sections.map((section, index) => (
              <div
                key={index}
                className="glass rounded-2xl p-8 border border-primary/10 hover:border-primary/20 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-secondary/20 rounded-xl border border-secondary/30 text-secondary">
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

          {/* Additional Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="glass rounded-2xl p-6 border border-accent/20">
              <h3 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
                <div className="p-2 bg-accent/20 rounded-lg">
                  <FileText className="w-5 h-5 text-accent" />
                </div>
                Modifications
              </h3>
              <p className="text-text/70 leading-relaxed">
                We may update these terms occasionally. Continued use of the
                service constitutes acceptance of any changes. Major changes
                will be clearly communicated.
              </p>
            </div>

            <div className="glass rounded-2xl p-6 border border-primary/20">
              <h3 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Scale className="w-5 h-5 text-primary" />
                </div>
                Governing Law
              </h3>
              <p className="text-text/70 leading-relaxed">
                These terms are governed by applicable laws. Any disputes will
                be resolved through good faith discussion or appropriate legal
                channels.
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="glass rounded-2xl p-8 border border-primary/20 text-center">
            <h3 className="text-xl font-bold text-text mb-4">
              Questions About These Terms?
            </h3>
            <p className="text-text/70 mb-6">
              If you have questions about these terms of service or need
              clarification on any point, we're here to help explain everything
              clearly.
            </p>
            <a
              href="mailto:legal@imagecomposer.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-text rounded-lg hover:bg-secondary/80 transition-colors font-medium"
            >
              Contact Legal Team
            </a>
          </div>

          {/* Key Points */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass rounded-xl p-6 border border-primary/10 text-center">
              <div className="p-3 bg-primary/20 rounded-full w-fit mx-auto mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-text mb-2">Free Service</h4>
              <p className="text-sm text-text/60">
                No charges, subscriptions, or hidden fees
              </p>
            </div>
            <div className="glass rounded-xl p-6 border border-accent/10 text-center">
              <div className="p-3 bg-accent/20 rounded-full w-fit mx-auto mb-4">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h4 className="font-semibold text-text mb-2">Client-Side Only</h4>
              <p className="text-sm text-text/60">
                All processing happens in your browser
              </p>
            </div>
            <div className="glass rounded-xl p-6 border border-secondary/10 text-center">
              <div className="p-3 bg-secondary/20 rounded-full w-fit mx-auto mb-4">
                <Scale className="w-6 h-6 text-secondary" />
              </div>
              <h4 className="font-semibold text-text mb-2">Fair Use</h4>
              <p className="text-sm text-text/60">
                Simple, reasonable usage guidelines
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
