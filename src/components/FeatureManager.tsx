import React from "react";
import { Settings, Check, X, Key, Info, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import {
  getFeatureFlags,
  updateFeatureFlags,
  resetFeatureFlags,
  getFeatureDescription,
  getFeatureCategories,
  doesFeatureRequireApiKey,
  type FeatureFlags,
} from "../lib/featureFlags";

interface FeatureManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeatureManager: React.FC<FeatureManagerProps> = ({ isOpen, onClose }) => {
  const [flags, setFlags] = React.useState<FeatureFlags>(getFeatureFlags());
  const categories = getFeatureCategories();

  const handleToggle = (feature: keyof FeatureFlags) => {
    const newFlags = updateFeatureFlags({ [feature]: !flags[feature] });
    setFlags(newFlags);
  };

  const handleReset = () => {
    const defaultFlags = resetFeatureFlags();
    setFlags(defaultFlags);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative glass rounded-3xl max-w-4xl w-full backdrop-blur-xl border border-primary/20 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Settings className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-text">
                Feature Manager
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-text/60 hover:text-text hover:bg-primary/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-8">
            {Object.entries(categories).map(([category, features]) => (
              <div key={category}>
                <h3 className="text-lg font-medium text-text mb-4">
                  {category}
                </h3>
                <div className="space-y-3">
                  {(features as Array<keyof FeatureFlags>).map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center justify-between p-3 glass rounded-xl border border-primary/20"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-text">
                              {feature.replace(/([A-Z])/g, " $1").trim()}
                            </span>
                            {doesFeatureRequireApiKey(feature) && (
                              <div
                                className="p-1 rounded bg-primary/10"
                                title="Requires API Key"
                              >
                                <Key className="w-3 h-3 text-primary" />
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-text/60 mt-1">
                            {getFeatureDescription(feature)}
                          </p>
                        </div>
                      </div>
                      <div className="ml-4">
                        <button
                          onClick={() => handleToggle(feature)}
                          className={`p-2 rounded-lg transition-colors ${
                            flags[feature]
                              ? "bg-primary/20 text-primary"
                              : "bg-background/50 text-text/60"
                          }`}
                        >
                          {flags[feature] ? (
                            <Check className="w-5 h-5" />
                          ) : (
                            <X className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-primary/20 bg-background/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-text/60">
              <Info className="w-4 h-4" />
              <span className="text-sm">Changes are saved automatically</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Default
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureManager;
