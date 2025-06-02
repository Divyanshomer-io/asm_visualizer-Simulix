
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Target, Zap, BookOpen } from 'lucide-react';

const BiasVarianceEducation: React.FC = () => {
  return (
    <Tabs defaultValue="concepts" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="concepts">Core Concepts</TabsTrigger>
        <TabsTrigger value="mathematics">Mathematics</TabsTrigger>
        <TabsTrigger value="practical">Practical Insights</TabsTrigger>
        <TabsTrigger value="examples">Examples</TabsTrigger>
      </TabsList>

      <TabsContent value="concepts" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-green-400" />
                Bias
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm opacity-80">
                <strong>Systematic error</strong> due to overly simplistic assumptions in the learning algorithm.
              </p>
              <ul className="text-sm space-y-1 opacity-70">
                <li>• High bias → Underfitting</li>
                <li>• Model consistently misses relevant relations</li>
                <li>• Linear model for non-linear data</li>
              </ul>
              <div className="bg-green-500/10 p-3 rounded border border-green-500/20">
                <p className="text-xs text-green-300">
                  Bias measures how far off the average prediction is from the true value
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-400" />
                Variance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm opacity-80">
                <strong>Sensitivity</strong> to small fluctuations in the training dataset.
              </p>
              <ul className="text-sm space-y-1 opacity-70">
                <li>• High variance → Overfitting</li>
                <li>• Model learns noise as patterns</li>
                <li>• Changes dramatically with training data</li>
              </ul>
              <div className="bg-blue-500/10 p-3 rounded border border-blue-500/20">
                <p className="text-xs text-blue-300">
                  Variance measures how much predictions vary for different training sets
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                The Tradeoff
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm opacity-80">
                <strong>Balance</strong> between bias and variance for optimal performance.
              </p>
              <ul className="text-sm space-y-1 opacity-70">
                <li>• Increasing complexity ↓ bias ↑ variance</li>
                <li>• Sweet spot minimizes total error</li>
                <li>• Depends on problem and dataset</li>
              </ul>
              <div className="bg-yellow-500/10 p-3 rounded border border-yellow-500/20">
                <p className="text-xs text-yellow-300">
                  Optimal complexity balances these competing sources of error
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="mathematics" className="space-y-6">
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Mathematical Decomposition
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-accent">Bias-Variance Decomposition</h3>
              <div className="bg-slate-800/50 p-4 rounded-lg border">
                <p className="font-mono text-sm mb-2">Expected Mean Squared Error:</p>
                <p className="font-mono text-center text-base text-accent">
                  E[(y - ŷ)²] = Bias² + Variance + Noise
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-400">Bias²</h4>
                  <div className="bg-slate-800/30 p-3 rounded text-sm font-mono">
                    (E[ŷ] - f(x))²
                  </div>
                  <p className="text-xs opacity-70">
                    Squared difference between expected prediction and true function
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-400">Variance</h4>
                  <div className="bg-slate-800/30 p-3 rounded text-sm font-mono">
                    E[(ŷ - E[ŷ])²]
                  </div>
                  <p className="text-xs opacity-70">
                    Expected squared deviation of predictions from their mean
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-yellow-400">Noise</h4>
                  <div className="bg-slate-800/30 p-3 rounded text-sm font-mono">
                    σ²
                  </div>
                  <p className="text-xs opacity-70">
                    Irreducible error from inherent data uncertainty
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-semibold text-accent">Polynomial Model</h3>
              <div className="bg-slate-800/50 p-4 rounded-lg border">
                <p className="font-mono text-sm mb-2">Model form:</p>
                <p className="font-mono text-center text-base">
                  ŷ = β₀ + β₁x + β₂x² + ... + βₙxⁿ
                </p>
              </div>
              <p className="text-sm opacity-70">
                Higher degree polynomials can fit more complex patterns but may overfit to noise.
                The visualization shows how prediction accuracy changes with polynomial degree.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="practical" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-lg">Model Selection Strategy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-accent">Signs of High Bias</h4>
                <ul className="text-sm space-y-1 opacity-80">
                  <li>• Poor training performance</li>
                  <li>• Training and validation errors both high</li>
                  <li>• Model seems too simple for the data</li>
                  <li>• Consistent systematic errors</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-accent">Solutions for High Bias</h4>
                <ul className="text-sm space-y-1 opacity-80">
                  <li>• Increase model complexity</li>
                  <li>• Add more features</li>
                  <li>• Reduce regularization</li>
                  <li>• Try non-linear models</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-lg">Handling Variance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-accent">Signs of High Variance</h4>
                <ul className="text-sm space-y-1 opacity-80">
                  <li>• Large gap between train/validation error</li>
                  <li>• Model performs well on training data</li>
                  <li>• Performance varies significantly</li>
                  <li>• Sensitive to training data changes</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-accent">Solutions for High Variance</h4>
                <ul className="text-sm space-y-1 opacity-80">
                  <li>• Get more training data</li>
                  <li>• Reduce model complexity</li>
                  <li>• Add regularization</li>
                  <li>• Use ensemble methods</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-lg">Cross-Validation Strategy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm opacity-80 mb-4">
              Use cross-validation to estimate the bias-variance tradeoff for your specific problem:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/30 p-3 rounded">
                <h4 className="font-semibold text-sm mb-2">1. Split Data</h4>
                <p className="text-xs opacity-70">
                  Divide into train/validation/test sets to get unbiased estimates
                </p>
              </div>
              <div className="bg-slate-800/30 p-3 rounded">
                <h4 className="font-semibold text-sm mb-2">2. Train Multiple Models</h4>
                <p className="text-xs opacity-70">
                  Train same architecture on different data subsets
                </p>
              </div>
              <div className="bg-slate-800/30 p-3 rounded">
                <h4 className="font-semibold text-sm mb-2">3. Analyze Variance</h4>
                <p className="text-xs opacity-70">
                  Look at prediction consistency across models
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="examples" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-lg">Degree 1 (Linear)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded">
                <p className="text-sm font-semibold text-red-300 mb-1">High Bias</p>
                <p className="text-xs opacity-80">
                  Linear model cannot capture the sinusoidal true function
                </p>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 p-3 rounded">
                <p className="text-sm font-semibold text-green-300 mb-1">Low Variance</p>
                <p className="text-xs opacity-80">
                  Predictions are consistent across different training sets
                </p>
              </div>
              <p className="text-xs opacity-70">
                <strong>Use case:</strong> When you know the relationship is approximately linear and want stable predictions.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-lg">Degree 15 (High-order)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-green-500/10 border border-green-500/20 p-3 rounded">
                <p className="text-sm font-semibold text-green-300 mb-1">Low Bias</p>
                <p className="text-xs opacity-80">
                  Can fit complex patterns and approximate the true function well
                </p>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded">
                <p className="text-sm font-semibold text-red-300 mb-1">High Variance</p>
                <p className="text-xs opacity-80">
                  Predictions vary dramatically with different training sets
                </p>
              </div>
              <p className="text-xs opacity-70">
                <strong>Use case:</strong> When you have lots of data and the true relationship is very complex.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-lg">Optimal Degree (~3-5)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded">
                <p className="text-sm font-semibold text-blue-300 mb-1">Balanced</p>
                <p className="text-xs opacity-80">
                  Good compromise between fitting the data and generalization
                </p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded">
                <p className="text-sm font-semibold text-yellow-300 mb-1">Minimum Total Error</p>
                <p className="text-xs opacity-80">
                  The sum of bias² + variance + noise is minimized
                </p>
              </div>
              <p className="text-xs opacity-70">
                <strong>Use case:</strong> Most practical machine learning problems benefit from this balance.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-lg">Effect of Data Size</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Small Datasets (20-50 samples)</h4>
                <p className="text-xs opacity-70">
                  High variance dominates. Simple models often perform better.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Large Datasets (100+ samples)</h4>
                <p className="text-xs opacity-70">
                  Variance decreases, can use more complex models safely.
                </p>
              </div>
              <p className="text-xs opacity-70 pt-2">
                <strong>Key insight:</strong> More data typically allows for more complex models without overfitting.
              </p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default BiasVarianceEducation;
