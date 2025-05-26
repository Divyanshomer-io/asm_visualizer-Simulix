
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ImportanceSamplingEducation: React.FC = () => {
  const [openSections, setOpenSections] = React.useState<{ [key: string]: boolean }>({});

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Understanding Importance Sampling */}
      <Card className="glass-panel border-white/10">
        <Collapsible open={openSections.basics} onOpenChange={() => toggleSection('basics')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-4 cursor-pointer hover:bg-white/5 transition-colors">
              <CardTitle className="flex items-center justify-between text-lg">
                Understanding Importance Sampling
                {openSections.basics ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4 text-sm">
              <p>
                <strong>Importance Sampling</strong> is a Monte Carlo technique used to estimate properties of a target distribution using samples from a different proposal distribution.
              </p>
              <p>
                Instead of sampling directly from the target distribution f(x), we sample from a proposal distribution g(x) and weight each sample by the likelihood ratio w(x) = f(x)/g(x).
              </p>
              <div className="bg-black/20 p-3 rounded-lg">
                <strong>Standard IS Estimator:</strong><br />
                Ê = (1/n) Σ h(Xi) × w(Xi)<br />
                where Xi ~ g(x)
              </div>
              <div className="bg-black/20 p-3 rounded-lg">
                <strong>Normalized IS Estimator:</strong><br />
                Ê = Σ h(Xi) × [w(Xi) / Σw(Xi)]<br />
                where weights are normalized
              </div>
              <p>
                This technique is particularly useful when the target distribution is difficult to sample from directly, or when we want to focus sampling in regions of interest.
              </p>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Parameter Guide */}
      <Card className="glass-panel border-white/10">
        <Collapsible open={openSections.parameters} onOpenChange={() => toggleSection('parameters')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-4 cursor-pointer hover:bg-white/5 transition-colors">
              <CardTitle className="flex items-center justify-between text-lg">
                Parameter Guide
                {openSections.parameters ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4 text-sm">
              <div className="space-y-3">
                <div>
                  <strong className="text-primary">Proposal Shift (t):</strong>
                  <p>Adjusts the mean of the proposal distribution g(x) = N(t, 1). Values far from 0 increase mismatch with target f(x) = N(0, 1), affecting estimator variance.</p>
                </div>
                
                <div>
                  <strong className="text-primary">h(x) Scale:</strong>
                  <p>Controls function steepness in h(x) = exp(scale × x). Higher values make integration more challenging and increase variance.</p>
                </div>
                
                <div>
                  <strong className="text-primary">Demo Samples:</strong>
                  <p>Number of samples shown in histograms/scatter plots. Higher values provide smoother visualizations but slower updates.</p>
                </div>
                
                <div>
                  <strong className="text-primary">Trials:</strong>
                  <p>Number of experiments for error statistics. Higher values produce smoother convergence curves and more accurate variance estimates.</p>
                </div>
              </div>
              
              <div className="bg-amber-500/20 p-3 rounded-lg border border-amber-500/30">
                <strong>💡 Tip:</strong> For optimal performance, choose proposal distributions that match the shape of f(x) × h(x).
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Understanding the Visualizations */}
      <Card className="glass-panel border-white/10">
        <Collapsible open={openSections.visualizations} onOpenChange={() => toggleSection('visualizations')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-4 cursor-pointer hover:bg-white/5 transition-colors">
              <CardTitle className="flex items-center justify-between text-lg">
                Understanding the Visualizations
                {openSections.visualizations ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4 text-sm">
              <div className="space-y-3">
                <div>
                  <strong className="text-blue-400">Distribution Plot:</strong>
                  <p>Compare target f(x), proposal g(x), and scaled h(x) shapes. The shaded area shows h(x)f(x), which determines the integral we're estimating.</p>
                </div>
                
                <div>
                  <strong className="text-red-400">Sample/Weight Plot:</strong>
                  <p><em>Standard mode:</em> Histograms show sample distributions from f(x) and g(x) with estimates marked.<br />
                  <em>Normalized mode:</em> Scatter plot shows how weights vary with sample values.</p>
                </div>
                
                <div>
                  <strong className="text-green-400">Convergence Plot:</strong>
                  <p><em>Standard mode:</em> Error bars show estimate uncertainty vs. sample size.<br />
                  <em>Normalized mode:</em> Log-log plot shows mean absolute error convergence rates.</p>
                </div>
                
                <div>
                  <strong className="text-purple-400">Variance/Ratio Plot:</strong>
                  <p><em>Standard mode:</em> Shows how proposal mismatch affects estimator variance.<br />
                  <em>Normalized mode:</em> Efficiency ratio comparing standard vs. normalized IS.</p>
                </div>
              </div>
              
              <div className="bg-green-500/20 p-3 rounded-lg border border-green-500/30">
                <strong>🎯 Goal:</strong> Find proposal parameters that minimize variance while maintaining unbiased estimates.
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Methods Comparison */}
      <Card className="glass-panel border-white/10">
        <Collapsible open={openSections.methods} onOpenChange={() => toggleSection('methods')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-4 cursor-pointer hover:bg-white/5 transition-colors">
              <CardTitle className="flex items-center justify-between text-lg">
                Standard vs Normalized IS
                {openSections.methods ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4 text-sm">
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-blue-500/20 p-3 rounded-lg border border-blue-500/30">
                  <strong>Standard Importance Sampling:</strong>
                  <ul className="mt-2 space-y-1 text-xs">
                    <li>• Uses raw importance weights</li>
                    <li>• Estimator can be biased if weights don't normalize properly</li>
                    <li>• More sensitive to proposal mismatch</li>
                    <li>• Theoretical convergence guarantees</li>
                  </ul>
                </div>
                
                <div className="bg-red-500/20 p-3 rounded-lg border border-red-500/30">
                  <strong>Normalized Importance Sampling:</strong>
                  <ul className="mt-2 space-y-1 text-xs">
                    <li>• Weights sum to 1 (self-normalizing)</li>
                    <li>• More robust to proposal mismatch</li>
                    <li>• Lower variance in practice</li>
                    <li>• Slight bias that vanishes asymptotically</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-yellow-500/20 p-3 rounded-lg border border-yellow-500/30">
                <strong>When to use each:</strong>
                <p className="text-xs mt-1">
                  Use <em>Standard IS</em> when you need theoretical guarantees. Use <em>Normalized IS</em> for better practical performance and robustness.
                </p>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Mathematical Background */}
      <Card className="glass-panel border-white/10">
        <Collapsible open={openSections.math} onOpenChange={() => toggleSection('math')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-4 cursor-pointer hover:bg-white/5 transition-colors">
              <CardTitle className="flex items-center justify-between text-lg">
                Mathematical Background
                {openSections.math ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4 text-sm">
              <div className="space-y-3">
                <div>
                  <strong>Target Integral:</strong>
                  <div className="bg-black/20 p-2 rounded mt-1 font-mono text-xs">
                    I = ∫ h(x) f(x) dx
                  </div>
                </div>
                
                <div>
                  <strong>IS Transformation:</strong>
                  <div className="bg-black/20 p-2 rounded mt-1 font-mono text-xs">
                    I = ∫ h(x) [f(x)/g(x)] g(x) dx<br />
                    = E_g[h(X) w(X)]
                  </div>
                </div>
                
                <div>
                  <strong>Variance Reduction:</strong>
                  <p>Optimal proposal: g*(x) ∝ |h(x)| f(x)</p>
                  <p className="text-xs text-muted-foreground">This minimizes estimator variance but is often impractical.</p>
                </div>
                
                <div>
                  <strong>Effective Sample Size:</strong>
                  <div className="bg-black/20 p-2 rounded mt-1 font-mono text-xs">
                    ESS = (Σ w_i)² / Σ w_i²
                  </div>
                  <p className="text-xs text-muted-foreground">Measures efficiency; lower values indicate poor proposal choice.</p>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Practical Tips */}
      <Card className="glass-panel border-white/10">
        <Collapsible open={openSections.tips} onOpenChange={() => toggleSection('tips')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-4 cursor-pointer hover:bg-white/5 transition-colors">
              <CardTitle className="flex items-center justify-between text-lg">
                Practical Tips
                {openSections.tips ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4 text-sm">
              <div className="space-y-3">
                <div className="bg-green-500/20 p-3 rounded-lg border border-green-500/30">
                  <strong>✅ Good Practices:</strong>
                  <ul className="mt-1 space-y-1 text-xs">
                    <li>• Choose g(x) with heavier tails than f(x)</li>
                    <li>• Monitor effective sample size</li>
                    <li>• Use multiple proposal distributions</li>
                    <li>• Check weight distribution for outliers</li>
                  </ul>
                </div>
                
                <div className="bg-red-500/20 p-3 rounded-lg border border-red-500/30">
                  <strong>❌ Common Pitfalls:</strong>
                  <ul className="mt-1 space-y-1 text-xs">
                    <li>• Proposal with lighter tails than target</li>
                    <li>• Ignoring weight degeneracy</li>
                    <li>• Not checking for infinite variance</li>
                    <li>• Over-relying on single proposal</li>
                  </ul>
                </div>
                
                <div className="bg-blue-500/20 p-3 rounded-lg border border-blue-500/30">
                  <strong>🔧 Troubleshooting:</strong>
                  <ul className="mt-1 space-y-1 text-xs">
                    <li>• High variance → Adjust proposal parameters</li>
                    <li>• Biased estimates → Check weight normalization</li>
                    <li>• Slow convergence → Increase sample size</li>
                    <li>• Erratic behavior → Check for numerical issues</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
};

export default ImportanceSamplingEducation;
