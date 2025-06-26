import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";
import { BookOpen, FileCode, Layers, Cpu, Search, X } from "lucide-react";
import mermaid from "mermaid";

interface DocViewerProps {
  feature?: string;
}

interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

interface SearchResult {
  title: string;
  content: string;
  feature: string;
}

const DocViewer: React.FC<DocViewerProps> = ({ feature }) => {
  const [markdown, setMarkdown] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const params = useParams();
  const docFeature = feature || params.feature;

  useEffect(() => {
    // Initialize mermaid with custom theme
    mermaid.initialize({
      startOnLoad: true,
      theme: "dark",
      themeVariables: {
        primaryColor: "#c0a6d9",
        primaryTextColor: "#ede6f4",
        primaryBorderColor: "#c0a6d9",
        lineColor: "#bd6567",
        secondaryColor: "#bd6567",
        tertiaryColor: "#0d0915",
        mainBkg: "#1a1625",
        nodeBorder: "#c0a6d9",
        clusterBkg: "#1a1625",
        titleColor: "#ede6f4",
        edgeLabelBackground: "#1a1625",
      },
      flowchart: {
        curve: "basis",
        padding: 20,
      },
      sequence: {
        mirrorActors: false,
        bottomMarginAdj: 10,
        useMaxWidth: true,
        boxMargin: 10,
      },
    });
  }, []);

  useEffect(() => {
    const loadDoc = async () => {
      try {
        const response = await fetch(`/docs/core/${docFeature}.md`);
        if (!response.ok) {
          throw new Error("Documentation not found");
        }
        const text = await response.text();
        setMarkdown(text);
        setSearchResults([]);
        setSearchQuery("");

        setTimeout(() => {
          try {
            mermaid.contentLoaded();
          } catch (err) {
            console.error("Mermaid rendering error:", err);
          }
        }, 200);
      } catch (err) {
        setError("Failed to load documentation");
        console.error(err);
      }
    };

    if (docFeature) {
      loadDoc();
    }
  }, [docFeature]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Get list of all documentation files
      const features = [
        "image-compression",
        "svg-converter",
        "manual-enhancement",
        "ai-enhancement",
      ];
      const results: SearchResult[] = [];

      // Search through each documentation file
      for (const feat of features) {
        try {
          const response = await fetch(`/docs/core/${feat}.md`);
          if (!response.ok) continue;

          const content = await response.text();
          const sections = content.split("\n#");

          for (const section of sections) {
            const lines = section.split("\n");
            const title = lines[0].replace(/^#+\s*/, "").trim();
            const text = lines.join(" ").toLowerCase();

            if (text.includes(query.toLowerCase())) {
              // Find the matching context
              const index = text.indexOf(query.toLowerCase());
              const start = Math.max(0, index - 100);
              const end = Math.min(text.length, index + 100);
              let context = text.slice(start, end);

              // Add ellipsis if needed
              if (start > 0) context = "..." + context;
              if (end < text.length) context += "...";

              results.push({
                title,
                content: context,
                feature: feat,
              });
            }
          }
        } catch (error) {
          console.error(`Error searching ${feat}:`, error);
        }
      }

      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const renderCode = ({
    node,
    inline,
    className,
    children,
    ...props
  }: CodeProps) => {
    const match = /language-(\w+)/.exec(className || "");
    const code = String(children).replace(/\n$/, "");

    if (!inline && match) {
      if (match[1] === "mermaid") {
        return (
          <div className="my-12 w-full">
            <div className="mermaid text-lg bg-[#1a1625] p-8 rounded-xl border border-primary/20">
              {code}
            </div>
          </div>
        );
      }
      return (
        <div className="group relative my-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-secondary rounded-xl blur opacity-25"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-text/60">
                  {match[1]}
                </span>
              </div>
            </div>
            <div className="w-full overflow-x-auto">
              <SyntaxHighlighter
                style={vscDarkPlus as any}
                language={match[1]}
                PreTag="div"
                className="rounded-lg !bg-[#1a1625] !p-6 border border-primary/20 text-lg leading-relaxed"
                showLineNumbers={true}
                customStyle={{
                  fontSize: "1.125rem",
                  lineHeight: "1.75rem",
                }}
                {...props}
              >
                {code}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>
      );
    }
    return (
      <code className="px-2 py-1 rounded bg-primary/10 text-primary" {...props}>
        {children}
      </code>
    );
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center text-text/70">
            <h2 className="text-2xl font-bold mb-4">{error}</h2>
            <p>Please try again later or contact support.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background Elements */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-12">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl animate-float"></div>
          <div
            className="absolute bottom-20 left-20 w-32 h-32 bg-accent/10 rounded-full blur-2xl animate-float"
            style={{ animationDelay: "3s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 w-24 h-24 bg-secondary/10 rounded-full blur-xl animate-float"
            style={{ animationDelay: "1.5s" }}
          ></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(192,166,217,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(192,166,217,0.05)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        </div>

        {/* Header Content */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 mb-4">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-text/80">
                Developer Documentation
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-text sm:text-6xl bg-gradient-to-r from-text via-primary to-accent bg-clip-text text-transparent mb-6">
              {docFeature
                ?.split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </h1>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-text/40" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search documentation..."
                  className="w-full pl-12 pr-4 py-3 bg-background/50 border border-primary/20 rounded-xl text-text placeholder-text/40 focus:outline-none focus:border-primary/40 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => handleSearch("")}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    <X className="w-5 h-5 text-text/40 hover:text-text/60" />
                  </button>
                )}
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="absolute z-50 mt-2 w-full bg-background/95 backdrop-blur-xl rounded-xl border border-primary/20 shadow-lg max-h-96 overflow-y-auto">
                  <div className="p-4">
                    {searchResults.map((result, index) => (
                      <div
                        key={index}
                        className="py-3 first:pt-0 last:pb-0 border-b last:border-0 border-primary/10"
                      >
                        <h4 className="text-sm font-medium text-primary mb-1">
                          {result.title}
                        </h4>
                        <p className="text-sm text-text/70">{result.content}</p>
                        <span className="text-xs text-accent mt-1 block">
                          {result.feature
                            .split("-")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Documentation Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="prose prose-invert prose-headings:text-text prose-headings:font-bold prose-p:text-text/80 prose-a:text-primary hover:prose-a:text-accent prose-pre:p-0 prose-pre:bg-transparent prose-pre:overflow-hidden max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code: renderCode,
              h2: ({ children }) => (
                <h2 className="flex items-center gap-3 text-2xl mt-12 mb-6 pb-4 border-b border-primary/20">
                  <Layers className="w-6 h-6 text-primary" />
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="flex items-center gap-2 text-xl mt-8 mb-4">
                  <Cpu className="w-5 h-5 text-accent" />
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-lg leading-relaxed mb-6">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="my-6 space-y-3">{children}</ul>
              ),
              li: ({ children }) => (
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-2.5"></div>
                  <span>{children}</span>
                </li>
              ),
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default DocViewer;
