import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, BarChart3, TrendingUp, Lightbulb, Settings, BookOpen } from "lucide-react";

const BootstrapEducationalPanels: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-4">
          Learn About Bootstrap Methods
        </h1>
        <p className="text-lg text-gray-400">
          Understand statistical resampling, confidence intervals, and bias estimation
        </p>
      </div>

      {/* Tabbed Interface */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-8">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="theory" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Theory
          </TabsTrigger>
          <TabsTrigger value="methodology" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Methodology
          </TabsTrigger>
          <TabsTrigger value="charts" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Charts
          </TabsTrigger>
          <TabsTrigger value="variance" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Variance
          </TabsTrigger>
          <TabsTrigger value="tips" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Tips
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Bootstrap Fundamentals
              </CardTitle>
              <CardDescription>
                Understanding the basics of bootstrap resampling methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">What is Bootstrap?</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Bootstrap is a powerful statistical resampling technique that estimates the sampling distribution 
                    of a statistic by repeatedly sampling <em>with replacement</em> from the original dataset. 
                    It treats your sample as a proxy for the entire population.
                  </p>
                  <div className="bg-accent/10 p-3 rounded-lg">
                    <p className="text-sm">
                      <strong>Key Components:</strong> Bootstrap sampling, random selection with replacement, 
                      statistical inference, and confidence interval estimation.
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">How It Works</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    From your original sample, bootstrap creates thousands of new samples by randomly selecting 
                    observations with replacement. Each bootstrap sample has the same size as your original data, 
                    and statistics computed from these samples approximate the true sampling distribution.
                  </p>
                  <div className="bg-secondary/30 p-3 rounded-lg font-mono text-xs">
                    Bootstrap Sample: X*₁, X*₂, ..., X*ₙ ~ F̂ₙ
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bootstrap Process</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                The bootstrap method combines resampling with statistical inference to provide robust estimates 
                without making distributional assumptions about the underlying population.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                  <h5 className="font-semibold text-blue-400 mb-2">Resampling</h5>
                  <p className="text-xs text-muted-foreground">
                    Creates diverse training sets by sampling with replacement from original data
                  </p>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-lg">
                  <h5 className="font-semibold text-orange-400 mb-2">Statistical Computation</h5>
                  <p className="text-xs text-muted-foreground">
                    Computes statistics (mean, median, etc.) for each bootstrap sample
                  </p>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                  <h5 className="font-semibold text-green-400 mb-2">Inference</h5>
                  <p className="text-xs text-muted-foreground">
                    Uses distribution of bootstrap statistics for confidence intervals and bias estimation
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Theory Tab */}
        <TabsContent value="theory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bootstrap Theory</CardTitle>
              <CardDescription>
                Mathematical foundations and theoretical principles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Theoretical Foundation</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Bootstrap theory is grounded in the <strong>plug-in principle</strong>: replace the unknown 
                    population distribution F with the empirical distribution F̂ₙ, then use Monte Carlo simulation 
                    to approximate the sampling distribution.
                  </p>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Convergence Properties</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    As the number of bootstrap samples B approaches infinity, the bootstrap distribution converges to the 
                    true sampling distribution under mild regularity conditions. The bootstrap estimate 
                    is consistent and asymptotically correct.
                  </p>
                </div>
              </div>

              <div className="bg-secondary/20 p-4 rounded-lg space-y-3">
                <h4 className="font-semibold">Core Assumptions</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span><strong>Representativeness:</strong> Original sample is representative of the population</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span><strong>Sample Size:</strong> Sufficiently large sample (typically n ≥ 30)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span><strong>Independence:</strong> Observations are independent and identically distributed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    <span><strong>Smoothness:</strong> The statistic of interest has reasonable regularity conditions</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Methodology Tab */}
        <TabsContent value="methodology" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bootstrap Methodology</CardTitle>
              <CardDescription>
                Step-by-step implementation and algorithm details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Algorithm Steps</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">1</span>
                      <span><strong>Initialize:</strong> Given original sample X₁, X₂, ..., Xₙ</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">2</span>
                      <span><strong>Resample:</strong> Draw B bootstrap samples of size n with replacement</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">3</span>
                      <span><strong>Compute:</strong> Calculate statistic θ*ᵦ for each bootstrap sample</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">4</span>
                      <span><strong>Collect:</strong> Store bootstrap statistics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">5</span>
                      <span><strong>Analyze:</strong> Use collection to estimate sampling distribution properties</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Statistical Inference</h4>
                  <div className="bg-secondary/20 p-4 rounded-lg space-y-2 text-sm">
                    <div><strong>Bootstrap mean:</strong> θ̄* = (1/B)Σθ*ᵦ</div>
                    <div><strong>Bootstrap SE:</strong> SE* = √[(1/B)Σ(θ*ᵦ - θ̄*)²]</div>
                    <div><strong>Confidence intervals:</strong> From percentiles</div>
                    <div><strong>Bias estimation:</strong> Bias* = θ̄* - θ̂</div>
                  </div>
                  <div className="bg-accent/10 p-3 rounded-lg">
                    <p className="text-xs">
                      <strong>Resampling Process:</strong> Each bootstrap sample maintains the same size 
                      as the original data but allows for repeated observations.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Charts Tab */}
        <TabsContent value="charts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Chart Interpretation Guide</CardTitle>
              <CardDescription>
                Understanding the visualization components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-400 mb-2">Bootstrap Distribution</h4>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div>• <strong>Shape:</strong> Should approach normality (CLT)</div>
                      <div>• <strong>Center:</strong> Estimates population parameter</div>
                      <div>• <strong>Spread:</strong> Shows estimator variability</div>
                      <div>• <strong>CI bounds:</strong> Red dashed lines</div>
                      <div>• <strong>Normal fit:</strong> Purple curve overlay</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-400 mb-2">Data Comparison</h4>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div>• <strong>Gray bars:</strong> Original data distribution</div>
                      <div>• <strong>Orange bars:</strong> Bootstrap statistics</div>
                      <div>• <strong>Different supports:</strong> Expected behavior</div>
                      <div>• <strong>Concentration:</strong> Statistics more focused</div>
                      <div>• <strong>Mean line:</strong> Bootstrap average</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-400 mb-2">Convergence Analysis</h4>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div>• <strong>Blue line:</strong> Bias convergence</div>
                      <div>• <strong>Red line:</strong> MSE evolution</div>
                      <div>• <strong>Yellow baseline:</strong> Classical MSE</div>
                      <div>• <strong>Stabilization:</strong> Lines should flatten</div>
                      <div>• <strong>Fluctuations:</strong> Normal variability</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-accent/10 p-4 rounded-lg mt-6">
                <h4 className="font-semibold mb-2">Reading the Charts</h4>
                <p className="text-sm text-muted-foreground">
                  Watch for: (1) Normality emergence in bootstrap distribution, (2) Convergence of bootstrap mean to original statistic, 
                  (3) Stabilization of bias and MSE curves, and (4) Reasonable confidence interval coverage.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Variance Tab */}
        <TabsContent value="variance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bootstrap Variance Theory</CardTitle>
              <CardDescription>
                Understanding variance estimation and theoretical properties
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Variance Properties</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Bootstrap variance is computed conditionally on the observed sample X₁, ..., Xₙ. 
                    This conditional variance approximates the true sampling variance of the estimator.
                  </p>
                  <div className="bg-secondary/30 p-3 rounded-lg font-mono text-xs text-center">
                    Var[θ*|X₁,...,Xₙ] ≈ (1 - 1/n) × Var[θ̂]
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Practical Implications</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span>Bootstrap variance slightly underestimates true variance</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Bias factor (1-1/n) approaches 1 for large n</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>Negligible difference when n &gt; 100</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-orange-400 mt-1">•</span>
                      <span>No distributional assumptions required</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-secondary/20 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Comparison with Classical Methods</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong className="text-green-400">Bootstrap Advantages:</strong>
                    <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                      <li>• No normality assumptions</li>
                      <li>• Works with any statistic</li>
                      <li>• Captures skewness and bias</li>
                      <li>• Robust to outliers</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-yellow-400">Classical Methods:</strong>
                    <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                      <li>• Require distributional assumptions</li>
                      <li>• Limited to simple statistics</li>
                      <li>• May not capture all uncertainty</li>
                      <li>• Faster computation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tips Tab */}
        <TabsContent value="tips" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bootstrap Tips & Best Practices</CardTitle>
              <CardDescription>
                Practical guidance for effective bootstrap implementation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-green-400">Best Practices</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>Start with 100-200 bootstrap samples for exploration</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>Use B = 1000-10000 for final confidence intervals</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>Ensure original sample size n ≥ 30 for reliability</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>Monitor bootstrap distribution for normality</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>Use OOB-like validation when possible</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-red-400">Common Pitfalls</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">✗</span>
                      <span>Too few bootstrap samples (B &lt; 100)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">✗</span>
                      <span>Original sample too small (n &lt; 20)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">✗</span>
                      <span>Ignoring dependence in time series data</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">✗</span>
                      <span>Inappropriate for extreme quantiles</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">✗</span>
                      <span>Over-interpreting small sample results</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-secondary/20 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">When to Use Bootstrap</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong className="text-blue-400">Ideal Scenarios:</strong>
                    <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                      <li>• Unknown sampling distributions</li>
                      <li>• Complex, non-linear statistics</li>
                      <li>• Non-parametric confidence intervals</li>
                      <li>• Bias estimation and correction</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-yellow-400">Interpretation Tips:</strong>
                    <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                      <li>• Look for normality emergence</li>
                      <li>• Compare with theoretical CI when available</li>
                      <li>• Monitor convergence in bias/MSE plots</li>
                      <li>• Check confidence interval coverage</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BootstrapEducationalPanels;
