
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, BarChart3, TrendingUp, Lightbulb, Settings, BookOpen } from "lucide-react";

const BootstrapEducationalPanels: React.FC = () => {
  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          Learn About Bootstrap Methods
        </h2>
        <p className="text-slate-300">
          Understand statistical resampling, confidence intervals, and bias estimation
        </p>
      </div>

      {/* Tabbed Interface */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-8 bg-gray-800/50 border border-white/10">
          <TabsTrigger value="overview" className="flex items-center gap-2 text-xs">
            <Brain className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="theory" className="flex items-center gap-2 text-xs">
            <BookOpen className="h-4 w-4" />
            Theory
          </TabsTrigger>
          <TabsTrigger value="methodology" className="flex items-center gap-2 text-xs">
            <Settings className="h-4 w-4" />
            Methodology
          </TabsTrigger>
          <TabsTrigger value="charts" className="flex items-center gap-2 text-xs">
            <BarChart3 className="h-4 w-4" />
            Charts
          </TabsTrigger>
          <TabsTrigger value="variance" className="flex items-center gap-2 text-xs">
            <TrendingUp className="h-4 w-4" />
            Variance
          </TabsTrigger>
          <TabsTrigger value="tips" className="flex items-center gap-2 text-xs">
            <Lightbulb className="h-4 w-4" />
            Tips
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <Card className="glass-panel border-white/10">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                <Brain className="h-6 w-6 text-blue-400" />
                Bootstrap Fundamentals
              </CardTitle>
              <p className="text-slate-300">Understanding the basics of bootstrap resampling methods</p>
            </CardHeader>
            <CardContent className="text-white space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-300 mb-3">What is Bootstrap?</h4>
                  <p className="text-sm leading-relaxed">
                    Bootstrap is a powerful statistical resampling technique that estimates the sampling distribution 
                    of a statistic by repeatedly sampling <em>with replacement</em> from the original dataset. 
                    It treats your sample as a proxy for the entire population.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-300 mb-3">How It Works</h4>
                  <p className="text-sm leading-relaxed">
                    From your original sample, bootstrap creates thousands of new samples by randomly selecting 
                    observations with replacement. Each bootstrap sample has the same size as your original data, 
                    and statistics computed from these samples approximate the true sampling distribution.
                  </p>
                </div>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg border border-white/10">
                <h4 className="font-semibold text-green-300 mb-2">Key Formula</h4>
                <div className="font-mono text-sm text-center bg-gray-900 p-3 rounded border">
                  Bootstrap Sample: X*₁, X*₂, ..., X*ₙ ~ F̂ₙ
                </div>
                <p className="text-xs mt-2 text-slate-400">
                  where F̂ₙ is the empirical distribution function of your original sample
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-purple-300 mb-2">Key Applications</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Confidence interval estimation</li>
                    <li>Bias correction for estimators</li>
                    <li>Standard error approximation</li>
                  </ul>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Hypothesis testing</li>
                    <li>Model validation</li>
                    <li>Non-parametric inference</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Theory Tab */}
        <TabsContent value="theory">
          <Card className="glass-panel border-white/10">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-green-400" />
                Bootstrap Theory
              </CardTitle>
              <p className="text-slate-300">Mathematical foundations and theoretical principles</p>
            </CardHeader>
            <CardContent className="text-white space-y-6">
              <div>
                <h4 className="font-semibold text-blue-300 mb-3">Theoretical Foundation</h4>
                <p className="text-sm leading-relaxed mb-4">
                  Bootstrap theory is grounded in the <strong>plug-in principle</strong>: replace the unknown 
                  population distribution F with the empirical distribution F̂ₙ, then use Monte Carlo simulation 
                  to approximate the sampling distribution.
                </p>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg border border-white/10">
                <h4 className="font-semibold text-blue-300 mb-3">Core Assumptions</h4>
                <ul className="list-disc list-inside text-sm space-y-2">
                  <li><strong>Representativeness:</strong> Original sample is representative of the population</li>
                  <li><strong>Sample Size:</strong> Sufficiently large sample (typically n ≥ 30)</li>
                  <li><strong>Independence:</strong> Observations are independent and identically distributed</li>
                  <li><strong>Smoothness:</strong> The statistic of interest has reasonable regularity conditions</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-green-300 mb-3">Convergence Properties</h4>
                <p className="text-sm leading-relaxed">
                  As the number of bootstrap samples B → ∞, the bootstrap distribution converges to the 
                  true sampling distribution under mild regularity conditions. The bootstrap estimate 
                  is consistent and asymptotically correct.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Methodology Tab */}
        <TabsContent value="methodology">
          <Card className="glass-panel border-white/10">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                <Settings className="h-6 w-6 text-purple-400" />
                Bootstrap Methodology
              </CardTitle>
              <p className="text-slate-300">Step-by-step implementation and algorithm details</p>
            </CardHeader>
            <CardContent className="text-white space-y-6">
              <div>
                <h4 className="font-semibold text-blue-300 mb-3">Algorithm Steps</h4>
                <ol className="list-decimal list-inside text-sm space-y-2 bg-gray-800/30 p-4 rounded-lg">
                  <li><strong>Initialize:</strong> Given original sample X₁, X₂, ..., Xₙ</li>
                  <li><strong>Resample:</strong> Draw B bootstrap samples of size n with replacement</li>
                  <li><strong>Compute:</strong> Calculate statistic θ*ᵦ for each bootstrap sample</li>
                  <li><strong>Collect:</strong> Store bootstrap statistics {θ*₁, θ*₂, ..., θ*ᵦ}</li>
                  <li><strong>Analyze:</strong> Use collection to estimate sampling distribution properties</li>
                </ol>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-green-300 mb-3">Resampling Process</h4>
                  <div className="bg-gray-900 p-3 rounded border font-mono text-xs">
                    <div>for b = 1 to B:</div>
                    <div className="ml-4">X*ᵦ = sample(X, size=n, replace=TRUE)</div>
                    <div className="ml-4">θ*ᵦ = statistic(X*ᵦ)</div>
                    <div>end for</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-300 mb-3">Statistical Inference</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Bootstrap mean: θ̄* = (1/B)Σθ*ᵦ</li>
                    <li>Bootstrap SE: SE* = √[(1/B)Σ(θ*ᵦ - θ̄*)²]</li>
                    <li>Confidence intervals from percentiles</li>
                    <li>Bias estimation: Bias* = θ̄* - θ̂</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Charts Tab */}
        <TabsContent value="charts">
          <Card className="glass-panel border-white/10">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-orange-400" />
                Chart Interpretation Guide
              </CardTitle>
              <p className="text-slate-300">Understanding the visualization components</p>
            </CardHeader>
            <CardContent className="text-white space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
                  <h4 className="font-semibold text-blue-300 mb-3">Bootstrap Distribution</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li><strong>Shape:</strong> Should approach normality (CLT)</li>
                    <li><strong>Center:</strong> Estimates population parameter</li>
                    <li><strong>Spread:</strong> Shows estimator variability</li>
                    <li><strong>CI bounds:</strong> Red dashed lines</li>
                    <li><strong>Normal fit:</strong> Purple curve overlay</li>
                  </ul>
                </div>

                <div className="bg-orange-900/20 p-4 rounded-lg border border-orange-500/30">
                  <h4 className="font-semibold text-orange-300 mb-3">Data Comparison</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li><strong>Gray bars:</strong> Original data distribution</li>
                    <li><strong>Orange bars:</strong> Bootstrap statistics</li>
                    <li><strong>Different supports:</strong> Expected behavior</li>
                    <li><strong>Concentration:</strong> Statistics more focused</li>
                    <li><strong>Mean line:</strong> Bootstrap average</li>
                  </ul>
                </div>

                <div className="bg-red-900/20 p-4 rounded-lg border border-red-500/30">
                  <h4 className="font-semibold text-red-300 mb-3">Convergence Analysis</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li><strong>Blue line:</strong> Bias convergence</li>
                    <li><strong>Red line:</strong> MSE evolution</li>
                    <li><strong>Yellow baseline:</strong> Classical MSE</li>
                    <li><strong>Stabilization:</strong> Lines should flatten</li>
                    <li><strong>Fluctuations:</strong> Normal variability</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg border border-white/10">
                <h4 className="font-semibold text-yellow-300 mb-2">Reading the Charts</h4>
                <p className="text-sm">
                  Watch for: (1) Normality emergence in bootstrap distribution, (2) Convergence of bootstrap mean to original statistic, 
                  (3) Stabilization of bias and MSE curves, and (4) Reasonable confidence interval coverage.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Variance Tab */}
        <TabsContent value="variance">
          <Card className="glass-panel border-white/10">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-cyan-400" />
                Bootstrap Variance Theory
              </CardTitle>
              <p className="text-slate-300">Understanding variance estimation and theoretical properties</p>
            </CardHeader>
            <CardContent className="text-white space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-300 mb-3">Variance Properties</h4>
                  <p className="text-sm leading-relaxed mb-4">
                    Bootstrap variance is computed conditionally on the observed sample X₁, ..., Xₙ. 
                    This conditional variance approximates the true sampling variance of the estimator.
                  </p>
                  
                  <div className="bg-gray-900 p-3 rounded border">
                    <div className="font-mono text-sm text-center">
                      Var[θ*|X₁,...,Xₙ] ≈ (1 - 1/n) × Var[θ̂]
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-green-300 mb-3">Practical Implications</h4>
                  <ul className="list-disc list-inside text-sm space-y-2">
                    <li>Bootstrap variance slightly underestimates true variance</li>
                    <li>Bias factor (1-1/n) approaches 1 for large n</li>
                    <li>Negligible difference when n > 100</li>
                    <li>No distributional assumptions required</li>
                    <li>Works for complex, non-linear estimators</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg border border-white/10">
                <h4 className="font-semibold text-cyan-300 mb-3">Comparison with Classical Methods</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong className="text-green-400">Bootstrap Advantages:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>No normality assumptions</li>
                      <li>Works with any statistic</li>
                      <li>Captures skewness and bias</li>
                      <li>Robust to outliers</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-yellow-400">Classical Methods:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Require distributional assumptions</li>
                      <li>Limited to simple statistics</li>
                      <li>May not capture all uncertainty</li>
                      <li>Faster computation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tips Tab */}
        <TabsContent value="tips">
          <Card className="glass-panel border-white/10">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                <Lightbulb className="h-6 w-6 text-yellow-400" />
                Bootstrap Tips & Best Practices
              </CardTitle>
              <p className="text-slate-300">Practical guidance for effective bootstrap implementation</p>
            </CardHeader>
            <CardContent className="text-white space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-900/20 p-4 rounded-lg border border-green-500/30">
                  <h4 className="font-semibold text-green-300 mb-3">Sample Size Guidelines</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li><strong>Original sample:</strong> n ≥ 30 for reliable estimates</li>
                    <li><strong>Bootstrap samples:</strong> B = 1000-10000 for CI</li>
                    <li><strong>Quick exploration:</strong> B = 100-500 for testing</li>
                    <li><strong>Bias correction:</strong> B ≥ 1000 recommended</li>
                  </ul>
                </div>

                <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
                  <h4 className="font-semibold text-blue-300 mb-3">When to Use Bootstrap</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Unknown sampling distributions</li>
                    <li>Complex, non-linear statistics</li>
                    <li>Non-parametric confidence intervals</li>
                    <li>Bias estimation and correction</li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-500/30">
                <h4 className="font-semibold text-yellow-300 mb-3">Common Pitfalls to Avoid</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Too few bootstrap samples (B < 100)</li>
                    <li>Original sample too small (n < 20)</li>
                    <li>Ignoring dependence in time series</li>
                    <li>Inappropriate for extreme quantiles</li>
                  </ul>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Not checking bootstrap distribution shape</li>
                    <li>Over-interpreting small sample results</li>
                    <li>Assuming bootstrap fixes bad sampling</li>
                    <li>Forgetting computational limitations</li>
                  </ul>
                </div>
              </div>

              <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
                <h4 className="font-semibold text-purple-300 mb-3">Interpretation Tips</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Look for normality emergence in bootstrap distribution</li>
                  <li>Compare bootstrap CI with theoretical CI when available</li>
                  <li>Monitor convergence in bias/MSE plots</li>
                  <li>Use integer data for clearer resampling understanding</li>
                  <li>Check that confidence intervals have proper coverage</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BootstrapEducationalPanels;
