
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronRight } from "lucide-react";

const BootstrapEducationalPanels: React.FC = () => {
  const [openPanels, setOpenPanels] = useState<{[key: string]: boolean}>({
    theory: true, // Start with theory panel open
  });

  const togglePanel = (panelId: string) => {
    setOpenPanels(prev => ({
      ...prev,
      [panelId]: !prev[panelId]
    }));
  };

  return (
    <div className="space-y-4">
      {/* Bootstrap Theory and Methodology */}
      <Card className="glass-panel border-white/10">
        <CardHeader 
          className="cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => togglePanel('theory')}
        >
          <CardTitle className="text-lg font-semibold text-white flex items-center justify-between">
            Bootstrap Theory and Methodology
            {openPanels.theory ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </CardTitle>
        </CardHeader>
        {openPanels.theory && (
          <CardContent className="text-white space-y-4">
            <div>
              <h4 className="font-semibold text-blue-300">Core Principle</h4>
              <p className="text-sm">
                Bootstrap is a resampling method that estimates the sampling distribution of a statistic by repeatedly 
                sampling <em>with replacement</em> from the original dataset. It treats the sample as a proxy for the population.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-blue-300">Methodology Steps</h4>
              <ol className="list-decimal list-inside text-sm space-y-1">
                <li>Given original sample: X₁, X₂, ..., Xₙ</li>
                <li>Draw B bootstrap samples of size n with replacement</li>
                <li>Compute statistic θ* for each bootstrap sample</li>
                <li>Use the collection {θ*₁, θ*₂, ..., θ*ᵦ} to estimate sampling distribution</li>
                <li>Calculate confidence intervals, bias, and variance estimates</li>
              </ol>
            </div>
            
            <div>
              <h4 className="font-semibold text-blue-300">Key Assumptions</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Original sample is representative of the population</li>
                <li>Sample size is sufficiently large (typically n ≥ 30)</li>
                <li>Bootstrap samples approximate the true sampling distribution</li>
              </ul>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Bootstrap Variance Theory */}
      <Card className="glass-panel border-white/10">
        <CardHeader 
          className="cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => togglePanel('variance')}
        >
          <CardTitle className="text-lg font-semibold text-white flex items-center justify-between">
            Bootstrap Variance Theory
            {openPanels.variance ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </CardTitle>
        </CardHeader>
        {openPanels.variance && (
          <CardContent className="text-white space-y-4">
            <div>
              <h4 className="font-semibold text-blue-300">Theoretical Foundation</h4>
              <p className="text-sm">
                The variance computed from bootstrap samples is <em>conditional</em> on the observed data X₁, ..., Xₙ.
              </p>
            </div>
            
            <div className="bg-gray-800 p-3 rounded">
              <h4 className="font-semibold text-blue-300">Key Formula</h4>
              <p className="font-mono text-sm">Var[θ*|X₁,...,Xₙ] = (1 - 1/n) × Var[θ̂]</p>
              <p className="text-xs mt-2">
                where θ̂ is the classical estimator and θ* is the bootstrap estimator
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-blue-300">Practical Implications</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Bootstrap variance slightly underestimates true variance by factor (1-1/n)</li>
                <li>For large n, this factor approaches 1, making bootstrap variance nearly unbiased</li>
                <li>The difference is negligible when n &gt; 100</li>
                <li>Bootstrap provides good approximation without distributional assumptions</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-blue-300">Comparison with Classical Methods</h4>
              <p className="text-sm">
                Unlike classical methods requiring normality assumptions, bootstrap variance estimation 
                works for any statistic and distribution, making it particularly valuable for complex estimators.
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Chart Interpretation Guide */}
      <Card className="glass-panel border-white/10">
        <CardHeader 
          className="cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => togglePanel('interpretation')}
        >
          <CardTitle className="text-lg font-semibold text-white flex items-center justify-between">
            Chart Interpretation Guide
            {openPanels.interpretation ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </CardTitle>
        </CardHeader>
        {openPanels.interpretation && (
          <CardContent className="text-white space-y-4">
            <div>
              <h4 className="font-semibold text-green-300">Bootstrap Distribution (Top Chart)</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li><strong>Shape:</strong> Should approach normal distribution as B increases (CLT)</li>
                <li><strong>Center:</strong> Bootstrap mean should be close to original sample statistic</li>
                <li><strong>Spread:</strong> Width indicates variability of the estimator</li>
                <li><strong>Confidence Interval:</strong> Red lines show 95% confidence bounds</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-green-300">Comparison Chart (Bottom Left)</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li><strong>Gray bars:</strong> Original data distribution (your sample)</li>
                <li><strong>Orange bars:</strong> Bootstrap statistics distribution</li>
                <li><strong>Different supports:</strong> Expected - statistics are computed from raw data</li>
                <li><strong>Concentration:</strong> Bootstrap statistics typically more concentrated</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-green-300">Convergence Chart (Bottom Right)</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li><strong>Stabilization:</strong> Lines should flatten as B increases</li>
                <li><strong>Bias (blue):</strong> Should approach zero for unbiased estimators</li>
                <li><strong>MSE (red):</strong> Should stabilize around classical MSE (yellow line)</li>
                <li><strong>Fluctuations:</strong> Normal due to random sampling in bootstrap</li>
              </ul>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Bootstrap Architecture */}
      <Card className="glass-panel border-white/10">
        <CardHeader 
          className="cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => togglePanel('architecture')}
        >
          <CardTitle className="text-lg font-semibold text-white flex items-center justify-between">
            Bootstrap Architecture
            {openPanels.architecture ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </CardTitle>
        </CardHeader>
        {openPanels.architecture && (
          <CardContent className="text-white space-y-4">
            <div>
              <h4 className="font-semibold text-purple-300">Component Structure</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li><strong>Data Generator:</strong> Creates original samples (integer sequences or random)</li>
                <li><strong>Bootstrap Engine:</strong> Performs resampling with replacement</li>
                <li><strong>Statistics Calculator:</strong> Computes mean/median for each bootstrap sample</li>
                <li><strong>Visualization Engine:</strong> Real-time plotting of distributions and convergence</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-purple-300">Algorithm Flow</h4>
              <ol className="list-decimal list-inside text-sm space-y-1">
                <li>Initialize with original sample data</li>
                <li>For each bootstrap iteration:</li>
                <li className="ml-4">→ Sample n values with replacement</li>
                <li className="ml-4">→ Calculate chosen statistic (mean/median)</li>
                <li className="ml-4">→ Store result and update visualizations</li>
                <li>Calculate bias, MSE, and confidence intervals</li>
                <li>Update convergence analysis</li>
              </ol>
            </div>
            
            <div>
              <h4 className="font-semibold text-purple-300">Performance Optimizations</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Incremental updates to avoid recalculating entire distributions</li>
                <li>Efficient histogram binning for real-time visualization</li>
                <li>Debounced parameter updates to prevent excessive re-renders</li>
              </ul>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Tips and Best Practices */}
      <Card className="glass-panel border-white/10">
        <CardHeader 
          className="cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => togglePanel('tips')}
        >
          <CardTitle className="text-lg font-semibold text-white flex items-center justify-between">
            Bootstrap Tips & Best Practices
            {openPanels.tips ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </CardTitle>
        </CardHeader>
        {openPanels.tips && (
          <CardContent className="text-white space-y-4">
            <div>
              <h4 className="font-semibold text-yellow-300">Sample Size Guidelines</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li><strong>Original sample:</strong> Use n ≥ 30 for reliable bootstrap estimates</li>
                <li><strong>Bootstrap samples:</strong> B = 1000-10000 for stable confidence intervals</li>
                <li><strong>Quick exploration:</strong> B = 100-500 for interactive testing</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-yellow-300">When to Use Bootstrap</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Unknown or complex sampling distributions</li>
                <li>Non-parametric confidence intervals</li>
                <li>Bias estimation for any statistic</li>
                <li>When theoretical formulas are unavailable</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-yellow-300">Interpretation Tips</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Watch for normality in bootstrap distribution (validates CLT)</li>
                <li>Compare bootstrap CI with theoretical CI when available</li>
                <li>Look for stabilization in bias/MSE plots</li>
                <li>Use integer data for clearer understanding of resampling</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-yellow-300">Common Pitfalls</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Too few bootstrap samples (B &lt; 100) gives unstable results</li>
                <li>Original sample too small (n &lt; 20) may not represent population</li>
                <li>Bootstrap doesn't fix problems with biased original samples</li>
                <li>Time series data requires specialized bootstrap methods</li>
              </ul>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default BootstrapEducationalPanels;
