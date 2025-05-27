import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, Settings, Eye, GitCompare, Calculator, Lightbulb } from "lucide-react";

const ImportanceSamplingEducation: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-8">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="parameters" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Parameters
          </TabsTrigger>
          <TabsTrigger value="visualizations" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Visualizations
          </TabsTrigger>
          <TabsTrigger value="methods" className="flex items-center gap-2">
            <GitCompare className="h-4 w-4" />
            Methods
          </TabsTrigger>
          <TabsTrigger value="math" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Math
          </TabsTrigger>
          <TabsTrigger value="tips" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Tips
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="glass-panel border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Target className="h-5 w-5 text-blue-400" />
                Understanding Importance Sampling
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-blue-300">🎯 The Big Picture:</h3>
                <p>
                  Importance sampling is like being a smart detective. Instead of randomly searching everywhere for clues, you focus on the "important" areas where evidence is most likely to be found. In mathematical terms, you're estimating an integral ∫h(x)f(x)dx by sampling from a different distribution g(x) and reweighting the results.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-green-300">🌟 Why It's Revolutionary:</h3>
                <ul className="space-y-2 ml-4">
                  <li><strong>Efficiency:</strong> Get better estimates with fewer samples</li>
                  <li><strong>Rare Event Simulation:</strong> Capture events that happen once in a million tries</li>
                  <li><strong>Bayesian Inference:</strong> Make intractable posteriors tractable</li>
                  <li><strong>Financial Modeling:</strong> Estimate tail risks without waiting for market crashes</li>
                </ul>
              </div>

              <div className="bg-purple-500/20 p-4 rounded-lg border border-purple-500/30">
                <h3 className="text-lg font-semibold mb-2 text-purple-300">🔥 Real-World Magic:</h3>
                <p>Used in particle physics simulations, climate modeling, option pricing, and even Netflix recommendations!</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parameters" className="space-y-6">
          <Card className="glass-panel border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Settings className="h-5 w-5 text-green-400" />
                Parameter Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-sm">
              <h3 className="text-lg font-semibold mb-4 text-green-300">📊 The Key Players:</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-500/20 p-4 rounded-lg border border-blue-500/30">
                  <h4 className="font-semibold text-blue-300 mb-2">Target Distribution f(x):</h4>
                  <ul className="space-y-1 text-xs">
                    <li><strong>What it is:</strong> The distribution you actually care about</li>
                    <li><strong>Think of it as:</strong> The "true landscape" you're exploring</li>
                    <li><strong>Visualization tip:</strong> Blue curve in your plots</li>
                  </ul>
                </div>

                <div className="bg-red-500/20 p-4 rounded-lg border border-red-500/30">
                  <h4 className="font-semibold text-red-300 mb-2">Proposal Distribution g(x):</h4>
                  <ul className="space-y-1 text-xs">
                    <li><strong>What it is:</strong> The distribution you actually sample from</li>
                    <li><strong>Think of it as:</strong> Your "search strategy" or "flashlight beam"</li>
                    <li><strong>Golden rule:</strong> Must have support wherever f(x)h(x) ≠ 0</li>
                    <li><strong>Visualization tip:</strong> Red curve in your plots</li>
                  </ul>
                </div>

                <div className="bg-yellow-500/20 p-4 rounded-lg border border-yellow-500/30">
                  <h4 className="font-semibold text-yellow-300 mb-2">Importance Weights w(x) = f(x)/g(x):</h4>
                  <ul className="space-y-1 text-xs">
                    <li><strong>What they do:</strong> Correct for the "bias" in your sampling</li>
                    <li><strong>Good weights:</strong> Stable, not too variable (coefficient of variation &lt; 2)</li>
                    <li><strong>Bad weights:</strong> A few huge ones, many tiny ones (variance explosion!)</li>
                    <li><strong>Visualization tip:</strong> Line thickness and color in connection plots</li>
                  </ul>
                </div>

                <div className="bg-purple-500/20 p-4 rounded-lg border border-purple-500/30">
                  <h4 className="font-semibold text-purple-300 mb-2">Function h(x):</h4>
                  <ul className="space-y-1 text-xs">
                    <li><strong>What it is:</strong> The quantity you're actually trying to estimate</li>
                    <li><strong>Examples:</strong> Probability, expected value, tail probability</li>
                    <li><strong>Impact:</strong> Determines which regions are "important"</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visualizations" className="space-y-6">
          <Card className="glass-panel border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Eye className="h-5 w-5 text-purple-400" />
                Understanding the Visualizations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-sm">
              <h3 className="text-lg font-semibold mb-4 text-purple-300">🎨 Your Visual Toolkit:</h3>
              
              <div className="space-y-4">
                <div className="bg-blue-500/20 p-4 rounded-lg border border-blue-500/30">
                  <h4 className="font-semibold text-blue-300 mb-2">1. Distribution Comparison Plot:</h4>
                  <ul className="space-y-1 text-xs">
                    <li><strong>Red Alert:</strong> If f(x) and g(x) barely overlap, you're in trouble</li>
                    <li><strong>Sweet Spot:</strong> Look for where h(x)f(x) is large—that's where the action is</li>
                    <li><strong>Pro Tip:</strong> The shaded area shows your "target treasure map"</li>
                  </ul>
                </div>

                <div className="bg-red-500/20 p-4 rounded-lg border border-red-500/30">
                  <h4 className="font-semibold text-red-300 mb-2">2. Weight vs. Sample Value Plot:</h4>
                  <ul className="space-y-1 text-xs">
                    <li><strong>Scatter Pattern:</strong> Reveals the health of your importance sampling</li>
                    <li><strong>Danger Signs:</strong> Extreme outliers, exponential-looking patterns</li>
                    <li><strong>Good Pattern:</strong> Weights clustered around 1, no massive spikes</li>
                    <li><strong>Jitter Effect:</strong> Points are slightly offset so you can see overlapping values</li>
                  </ul>
                </div>

                <div className="bg-green-500/20 p-4 rounded-lg border border-green-500/30">
                  <h4 className="font-semibold text-green-300 mb-2">3. Convergence Analysis:</h4>
                  <ul className="space-y-1 text-xs">
                    <li><strong>Standard IS:</strong> Watch estimates converge with error bars shrinking</li>
                    <li><strong>Normalized IS:</strong> Log-log plot shows Mean Absolute Error decay</li>
                    <li><strong>The 1/√n Line:</strong> Your theoretical benchmark—good methods should track this</li>
                    <li><strong>Plateau Effect:</strong> If convergence stalls, your proposal needs work</li>
                  </ul>
                </div>

                <div className="bg-yellow-500/20 p-4 rounded-lg border border-yellow-500/30">
                  <h4 className="font-semibold text-yellow-300 mb-2">4. Variance/Efficiency Plots:</h4>
                  <ul className="space-y-1 text-xs">
                    <li><strong>Variance vs. Proposal Shift:</strong> Find the sweet spot for minimum variance</li>
                    <li><strong>Error Ratio:</strong> Shows how much normalized IS outperforms standard IS</li>
                    <li><strong>Rule of Thumb:</strong> Error ratio &gt; 1 means normalized IS wins</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methods" className="space-y-6">
          <Card className="glass-panel border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <GitCompare className="h-5 w-5 text-orange-400" />
                Standard vs Normalized IS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-sm">
              <h3 className="text-lg font-semibold mb-4 text-orange-300">⚔️ The Ultimate Showdown:</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-blue-500/20 p-4 rounded-lg border border-blue-500/30">
                    <h4 className="font-semibold text-blue-300 mb-2">Standard Importance Sampling:</h4>
                    <div className="space-y-2">
                      <div className="bg-black/20 p-2 rounded text-xs font-mono">
                        θ̂ = (1/n) Σ h(xi) × w(xi)
                      </div>
                      <p className="text-xs"><strong>Personality:</strong> Unbiased but sometimes unstable</p>
                      
                      <div className="mt-3">
                        <p className="text-green-400 font-semibold text-xs mb-1">Strengths:</p>
                        <ul className="text-xs space-y-1">
                          <li>• Mathematically pure (unbiased estimator)</li>
                          <li>• Works great when proposal is well-matched</li>
                          <li>• Simpler to analyze theoretically</li>
                        </ul>
                      </div>

                      <div className="mt-3">
                        <p className="text-red-400 font-semibold text-xs mb-1">Weaknesses:</p>
                        <ul className="text-xs space-y-1">
                          <li>• Can explode with poor proposals</li>
                          <li>• Sensitive to tail behavior</li>
                          <li>• Requires knowing normalizing constants</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-red-500/20 p-4 rounded-lg border border-red-500/30">
                    <h4 className="font-semibold text-red-300 mb-2">Normalized Importance Sampling:</h4>
                    <div className="space-y-2">
                      <div className="bg-black/20 p-2 rounded text-xs font-mono">
                        θ̂ = Σ h(xi) × w(xi) / Σ w(xi)
                      </div>
                      <p className="text-xs"><strong>Personality:</strong> Slightly biased but much more stable</p>
                      
                      <div className="mt-3">
                        <p className="text-green-400 font-semibold text-xs mb-1">Strengths:</p>
                        <ul className="text-xs space-y-1">
                          <li>• Robust to proposal misspecification</li>
                          <li>• Self-normalizing (don't need constants)</li>
                          <li>• Consistent estimator (bias → 0 as n → ∞)</li>
                        </ul>
                      </div>

                      <div className="mt-3">
                        <p className="text-red-400 font-semibold text-xs mb-1">Weaknesses:</p>
                        <ul className="text-xs space-y-1">
                          <li>• Small bias in finite samples</li>
                          <li>• Slightly more complex to analyze</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-500/20 p-4 rounded-lg border border-yellow-500/30">
                <h4 className="font-semibold text-yellow-300 mb-2">🏆 When to Use What:</h4>
                <ul className="text-xs space-y-1">
                  <li><strong>Standard IS:</strong> When you have a great proposal and know all constants</li>
                  <li><strong>Normalized IS:</strong> When proposal is imperfect or constants unknown (most real cases!)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="math" className="space-y-6">
          <Card className="glass-panel border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Calculator className="h-5 w-5 text-cyan-400" />
                Mathematical Background
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-sm">
              <h3 className="text-lg font-semibold mb-4 text-cyan-300">🧮 The Beautiful Theory:</h3>
              
              <div className="space-y-4">
                <div className="bg-cyan-500/20 p-4 rounded-lg border border-cyan-500/30">
                  <h4 className="font-semibold text-cyan-300 mb-2">Core Identity:</h4>
                  <div className="bg-black/20 p-3 rounded font-mono text-xs">
                    E_f[h(X)] = ∫ h(x)f(x)dx = ∫ h(x) × [f(x)/g(x)] × g(x)dx = E_g[h(X) × w(X)]
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-500/20 p-4 rounded-lg border border-blue-500/30">
                    <h4 className="font-semibold text-blue-300 mb-2">Standard IS Estimator:</h4>
                    <div className="bg-black/20 p-2 rounded font-mono text-xs">
                      θ̂_standard = (1/n) Σ h(xi) × [f(xi)/g(xi)]<br />
                      where xi ~ g(x)
                    </div>
                  </div>

                  <div className="bg-red-500/20 p-4 rounded-lg border border-red-500/30">
                    <h4 className="font-semibold text-red-300 mb-2">Normalized IS Estimator:</h4>
                    <div className="bg-black/20 p-2 rounded font-mono text-xs">
                      θ̂_normalized = [Σ h(xi) × w(xi)] / [Σ w(xi)]
                    </div>
                  </div>
                </div>

                <div className="bg-green-500/20 p-4 rounded-lg border border-green-500/30">
                  <h4 className="font-semibold text-green-300 mb-2">Variance Formula (the Holy Grail):</h4>
                  <div className="bg-black/20 p-2 rounded font-mono text-xs">
                    Var[θ̂] ≈ (1/n) × Var_g[h(X) × w(X)]
                  </div>
                </div>

                <div className="bg-purple-500/20 p-4 rounded-lg border border-purple-500/30">
                  <h4 className="font-semibold text-purple-300 mb-2">Optimal Proposal (theoretical perfection):</h4>
                  <div className="bg-black/20 p-2 rounded font-mono text-xs mb-2">
                    g*(x) = |h(x)|f(x) / ∫|h(t)|f(t)dt
                  </div>
                  <p className="text-xs">This makes variance = 0, but requires knowing the answer already!</p>
                </div>

                <div className="bg-yellow-500/20 p-4 rounded-lg border border-yellow-500/30">
                  <h4 className="font-semibold text-yellow-300 mb-2">Effective Sample Size:</h4>
                  <div className="bg-black/20 p-2 rounded font-mono text-xs mb-2">
                    ESS = (Σ wi)² / Σ wi²
                  </div>
                  <p className="text-xs">Measures how many "effective" samples you really have</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tips" className="space-y-6">
          <Card className="glass-panel border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Lightbulb className="h-5 w-5 text-yellow-400" />
                Practical Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-sm">
              <h3 className="text-lg font-semibold mb-4 text-yellow-300">🛠️ Battle-Tested Strategies:</h3>
              
              <div className="space-y-6">
                <div className="bg-blue-500/20 p-4 rounded-lg border border-blue-500/30">
                  <h4 className="font-semibold text-blue-300 mb-3">Proposal Design:</h4>
                  <ul className="text-xs space-y-1">
                    <li><strong>Heavy Tails Rule:</strong> When in doubt, use heavier tails than f(x)</li>
                    <li><strong>Mixture Proposals:</strong> Combine multiple simple distributions</li>
                    <li><strong>Adaptive Methods:</strong> Start simple, then improve based on pilot runs</li>
                    <li><strong>Location-Scale Families:</strong> Easy to tune, often work well</li>
                  </ul>
                </div>

                <div className="bg-green-500/20 p-4 rounded-lg border border-green-500/30">
                  <h4 className="font-semibold text-green-300 mb-3">Diagnostics (Your Early Warning System):</h4>
                  <ul className="text-xs space-y-1">
                    <li><strong>Weight Statistics:</strong> Check max/min ratio, coefficient of variation</li>
                    <li><strong>Effective Sample Size:</strong> Should be &gt; 10% of actual sample size</li>
                    <li><strong>Autocorrelation:</strong> In sequential IS, check for dependencies</li>
                    <li><strong>Convergence Plots:</strong> Look for smooth, monotonic convergence</li>
                  </ul>
                </div>

                <div className="bg-red-500/20 p-4 rounded-lg border border-red-500/30">
                  <h4 className="font-semibold text-red-300 mb-3">Red Flags (When to Panic):</h4>
                  <ul className="text-xs space-y-1">
                    <li>• Weights spanning 10+ orders of magnitude</li>
                    <li>• ESS &lt; 1% of sample size</li>
                    <li>• Convergence plots that oscillate wildly</li>
                    <li>• A few samples dominating the estimate</li>
                  </ul>
                </div>

                <div className="bg-purple-500/20 p-4 rounded-lg border border-purple-500/30">
                  <h4 className="font-semibold text-purple-300 mb-3">Pro Tips:</h4>
                  <ul className="text-xs space-y-1">
                    <li><strong>Start Simple:</strong> Normal proposals often work better than you think</li>
                    <li><strong>Monitor Continuously:</strong> Don't wait until the end to check diagnostics</li>
                    <li><strong>Multiple Chains:</strong> Run several IS chains with different proposals</li>
                    <li><strong>Log-Space:</strong> When dealing with tiny probabilities, work in log-space</li>
                    <li><strong>Defensive Programming:</strong> Always check for numerical overflow/underflow</li>
                  </ul>
                </div>

                <div className="bg-orange-500/20 p-4 rounded-lg border border-orange-500/30">
                  <h4 className="font-semibold text-orange-300 mb-3">Emergency Fixes:</h4>
                  <ul className="text-xs space-y-1">
                    <li><strong>Variance Too High:</strong> Try mixture proposals, adaptive schemes</li>
                    <li><strong>Bias Concerns:</strong> Use control variates, antithetic variables</li>
                    <li><strong>Computational Limits:</strong> Consider sequential IS, recycling schemes</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 rounded-lg border border-purple-500/30">
                  <h4 className="font-semibold text-pink-300 mb-3">🎓 Advanced Concepts (For the Curious):</h4>
                  <ul className="text-xs space-y-1">
                    <li><strong>Sequential Importance Sampling:</strong> Update proposals on-the-fly</li>
                    <li><strong>Population Monte Carlo:</strong> Use multiple interacting proposals</li>
                    <li><strong>Defensive Importance Sampling:</strong> Protect against proposal failures</li>
                    <li><strong>Tempered Distributions:</strong> Bridge between simple and complex targets</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 p-4 rounded-lg border border-green-500/30 text-center">
                <p className="text-lg font-semibold text-white">
                  This comprehensive content transforms your importance sampling visualization into a complete learning experience! 🚀
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImportanceSamplingEducation;
