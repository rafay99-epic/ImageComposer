import React, { useState } from "react";
import {
  Mail,
  Send,
  Github,
  Globe,
  MessageSquare,
  ArrowLeft,
  Clock,
  Shield,
} from "lucide-react";
import toast from "react-hot-toast";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("❌ Please fill in all required fields", {
        duration: 3000,
        style: {
          background: "#0d0915",
          color: "#ede6f4",
          border: "1px solid #7d3650",
        },
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const subject = formData.subject || "Contact from Image Composer";
      const body = `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`;
      const mailtoLink = `mailto:99marafay@gmail.com?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;

      window.location.href = mailtoLink;

      toast.success("📧 Email client opened! Please send the email.", {
        duration: 4000,
        style: {
          background: "#0d0915",
          color: "#ede6f4",
          border: "1px solid #bd6567",
        },
      });

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast.error("❌ Failed to open email client", {
        duration: 3000,
        style: {
          background: "#0d0915",
          color: "#ede6f4",
          border: "1px solid #7d3650",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 mb-6">
            <Mail className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-text/80">
              Get In Touch
            </span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-text via-primary to-accent bg-clip-text text-transparent">
            Contact Me
          </h1>
          <p className="text-xl text-text/70 leading-relaxed max-w-3xl mx-auto">
            Have questions about Image Composer? Want to collaborate or share
            feedback?
            <span className="text-primary font-semibold">
              {" "}
              I'd love to hear from you!
            </span>
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="glass rounded-2xl p-8 border border-primary/20">
              <h2 className="text-2xl font-bold text-text mb-6 flex items-center gap-2">
                <Send className="w-6 h-6 text-primary" />
                Send Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-text mb-2"
                    >
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 glass rounded-lg border border-primary/20 bg-background/50 text-text placeholder-text/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-text mb-2"
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 glass rounded-lg border border-primary/20 bg-background/50 text-text placeholder-text/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-text mb-2"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 glass rounded-lg border border-primary/20 bg-background/50 text-text placeholder-text/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-text mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 glass rounded-lg border border-primary/20 bg-background/50 text-text placeholder-text/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none"
                    placeholder="Tell me about your thoughts, questions, or ideas..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-8 bg-primary text-background font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin"></div>
                      Opening Email Client...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="glass rounded-2xl p-8 border border-accent/20">
                <h2 className="text-2xl font-bold text-text mb-6">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <a
                    href="mailto:99marafay@gmail.com"
                    className="flex items-center gap-4 p-4 glass rounded-xl border border-primary/10 hover:border-primary/30 transition-all duration-300 group"
                  >
                    <div className="p-3 bg-primary/20 rounded-xl border border-primary/30 text-primary group-hover:scale-110 transition-transform">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text">Email</h3>
                      <p className="text-text/70">99marafay@gmail.com</p>
                    </div>
                  </a>

                  <a
                    href="https://rafay99.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 glass rounded-xl border border-primary/10 hover:border-primary/30 transition-all duration-300 group"
                  >
                    <div className="p-3 bg-accent/20 rounded-xl border border-accent/30 text-accent group-hover:scale-110 transition-transform">
                      <Globe className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text">Website</h3>
                      <p className="text-text/70">rafay99.com</p>
                    </div>
                  </a>

                  <a
                    href="https://github.com/rafay99-epic"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 glass rounded-xl border border-primary/10 hover:border-primary/30 transition-all duration-300 group"
                  >
                    <div className="p-3 bg-secondary/20 rounded-xl border border-secondary/30 text-secondary group-hover:scale-110 transition-transform">
                      <Github className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text">GitHub</h3>
                      <p className="text-text/70">rafay99-epic</p>
                    </div>
                  </a>
                </div>
              </div>

              <div className="glass rounded-2xl p-8 border border-secondary/20">
                <h2 className="text-2xl font-bold text-text mb-6">
                  Why Contact Me?
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-secondary/20 rounded-lg text-secondary">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text mb-1">
                        Quick Response
                      </h3>
                      <p className="text-sm text-text/70">
                        I typically respond within 24 hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-secondary/20 rounded-lg text-secondary">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text mb-1">
                        Privacy First
                      </h3>
                      <p className="text-sm text-text/70">
                        Your information is kept confidential
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-secondary/20 rounded-lg text-secondary">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text mb-1">
                        Open Discussion
                      </h3>
                      <p className="text-sm text-text/70">
                        Feel free to ask anything about the project
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-8 border border-primary/20 text-center">
                <div className="p-4 bg-primary/20 rounded-full w-fit mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-text mb-2">
                  Let's Build Something Amazing
                </h3>
                <p className="text-text/70 mb-4">
                  Whether it's feedback, collaboration ideas, or just saying
                  hello - every message matters!
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-sm text-primary font-medium">
                    Usually responds within 24 hours
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
