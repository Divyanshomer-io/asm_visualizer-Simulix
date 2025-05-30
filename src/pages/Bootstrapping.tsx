
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, Pause, RefreshCw, BarChart3, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import BootstrapVisualization from "@/components/BootstrapVisualization";
import BootstrapControls from "@/components/BootstrapControls";
import { generateBootstrapSamples, computeStatistic, generateOriginalData } from "@/utils/bootstrapping";

export interface BootstrapState {
  originalData: number[];
  bootstrapSamples: number[][];
  currentStatValues: number[];
  isRunning: boolean;
  currentIteration: number;
  animationSpeed: number;
  showCI: boolean;
  showNormalFit: boolean;
}

export interface BootstrapParams {
  sampleSize: number;
  numBootstrapSamples: number;
  confidenceLevel: number;
  statistic: 'mean' | 'median';
}

const Bootstrapping = () => {
  const [state, setState] = useState<BootstrapState>({
    originalData: generateOriginalData(),
    bootstrapSamples: [],
    currentStatValues: [],
    isRunning: false,
    currentIteration: 0,
    animationSpeed: 2,
    showCI: true,
    showNormalFit: true,
  });

  const [params, setParams] = useState<BootstrapParams>({
    sampleSize: 50,
    numBootstrapSamples: 500,
    confidenceLevel: 0.95,
    statistic: 'mean',
  });

  const intervalRef = useRef<number | undefined>();

  const generateBootstrapData = () => {
    const samples = generateBootstrapSamples(
      state.originalData,
      params.sampleSize,
      params.numBootstrapSamples
    );
    const statValues = computeStatistic(samples, params.statistic);
    
    setState(prev => ({
      ...prev,
      bootstrapSamples: samples,
      currentStatValues: statValues,
      currentIteration: 0,
    }));
  };

  const handleStartStop = () => {
    if (state.isRunning) {
      // Stop animation
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
      setState(prev => ({ ...prev, isRunning: false }));
    } else {
      // Start animation
      setState(prev => ({ ...prev, isRunning: true }));
      startAnimation();
    }
  };

  const startAnimation = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(() => {
      setState(prev => {
        if (prev.currentIteration >= params.numBootstrapSamples) {
          // Stop animation when we reach the target
          if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = undefined;
          }
          return { ...prev, isRunning: false };
        }
        
        return {
          ...prev,
          currentIteration: prev.currentIteration + 1,
        };
      });
    }, 1000 / state.animationSpeed);
  };

  // Update animation speed when it changes
  useEffect(() => {
    if (state.isRunning) {
      startAnimation();
    }
  }, [state.animationSpeed]);

  // Stop animation when currentIteration reaches the target
  useEffect(() => {
    if (state.currentIteration >= params.numBootstrapSamples && state.isRunning) {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
      setState(prev => ({ ...prev, isRunning: false }));
    }
  }, [state.currentIteration, params.numBootstrapSamples, state.isRunning]);

  const handleReset = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
    setState(prev => ({
      ...prev,
      isRunning: false,
      currentIteration: 0,
    }));
    generateBootstrapData();
  };

  const handleParamsChange = (newParams: Partial<BootstrapParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  const handleStateChange = (newState: Partial<BootstrapState>) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  useEffect(() => {
    generateBootstrapData();
  }, [params.sampleSize, params.numBootstrapSamples, params.statistic]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
      {/* Header */}
      <header className="w-full glass-panel border-b border-white/5 mb-8">
        <div className="container py-6 px-4 md:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-light tracking-tight">
              Bootstrapping Visualization
            </h1>
            <p className="text-sm opacity-70 mt-1">
              Understanding Statistical Inference Through Resampling
            </p>
          </div>
          <Link to="/" className="control-btn flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Visualizations
          </Link>
        </div>
      </header>

      <div className="container px-4 md:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Visualization Area */}
          <div className="lg:col-span-2 space-y-6">
            <BootstrapVisualization
              state={state}
              params={params}
            />
          </div>

          {/* Controls and Information */}
          <div className="space-y-6">
            <BootstrapControls
              state={state}
              params={params}
              onParamsChange={handleParamsChange}
              onStateChange={handleStateChange}
              onStartStop={handleStartStop}
              onReset={handleReset}
            />

            {/* Real-time Statistics */}
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="text-lg">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="opacity-80">Bootstrap Samples:</span>
                  <span className="font-mono">{state.currentIteration}/{params.numBootstrapSamples}</span>
                </div>
                {state.currentStatValues.length > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="opacity-80">Bootstrap {params.statistic}:</span>
                      <span className="font-mono">
                        {(state.currentStatValues.slice(0, state.currentIteration).reduce((a, b) => a + b, 0) / 
                          Math.max(state.currentIteration, 1)).toFixed(3)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-80">Original {params.statistic}:</span>
                      <span className="font-mono">
                        {params.statistic === 'mean' 
                          ? (state.originalData.reduce((a, b) => a + b, 0) / state.originalData.length).toFixed(3)
                          : state.originalData.sort((a, b) => a - b)[Math.floor(state.originalData.length / 2)].toFixed(3)
                        }
                      </span>
                    </div>
                    {state.currentIteration > 10 && (
                      <div className="flex justify-between">
                        <span className="opacity-80">Bootstrap SE:</span>
                        <span className="font-mono">
                          {Math.sqrt(
                            state.currentStatValues.slice(0, state.currentIteration)
                              .reduce((acc, val, _, arr) => {
                                const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
                                return acc + Math.pow(val - mean, 2);
                              }, 0) / (state.currentIteration - 1)
                          ).toFixed(3)}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Educational Content */}
        <div className="mt-12 space-y-6">
          <Accordion type="multiple" className="space-y-4">
            <AccordionItem value="understanding" className="glass-panel rounded-xl px-6">
              <AccordionTrigger className="text-lg font-medium py-4">
                Understanding Bootstrapping
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-4">
                <p className="text-base leading-relaxed">
                  Imagine you surveyed 100 people about their favorite ice cream flavor, but you're worried your results might change if you surveyed another group. 
                  Bootstrapping helps you answer: "How confident can I be in my results?"
                </p>

                <div className="space-y-3">
                  <h4 className="font-medium text-primary">What Are We Doing?</h4>
                  <div className="bg-secondary/20 p-4 rounded-lg">
                    <p><strong>Your Goal:</strong> Guess how much your "average" or "middle value" might change if you could repeat your survey many times—without actually doing it!</p>
                    
                    <p className="mt-2"><strong>How It Works:</strong></p>
                    <ol className="list-decimal pl-6 space-y-1">
                      <li>Start with your original data (like your 100 survey responses)</li>
                      <li><strong>Copy & Shuffle:</strong> Randomly pick people from your data while allowing repeats (like drawing names from a hat and putting them back)</li>
                      <li><strong>Calculate:</strong> Find the average or middle value of this new "shuffled" group</li>
                      <li><strong>Repeat:</strong> Do this 1,000+ times to create many pretend "surveys"</li>
                      <li><strong>Learn:</strong> Look at all your pretend results to see how much they vary</li>
                    </ol>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-primary">Why This Example?</h4>
                  <ul className="list-disc pl-6 space-y-1 opacity-90">
                    <li><strong>No Math Formulas Needed:</strong> Learn by seeing patterns in the visualizations</li>
                    <li><strong>Real-Life Ready:</strong> Works even if your data is messy or uneven</li>
                    <li><strong>Build Intuition:</strong> Watch how more "pretend surveys" make your results clearer</li>
                  </ul>
                </div>

                <div className="bg-accent/10 p-4 rounded-lg">
                  <p className="font-medium text-accent mb-2">💡 Key Insight:</p>
                  <p>Bootstrapping lets you pretend you have thousands of surveys by cleverly reusing your original data. It's like a crystal ball for your statistics!</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="parameters" className="glass-panel rounded-xl px-6">
              <AccordionTrigger className="text-lg font-medium py-4">
                Parameter Guide
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-4">
                <p>Here's what each control does and how it affects the bootstrap process:</p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-primary">Bootstrap Parameters</h4>
                    
                    <div className="bg-secondary/20 p-3 rounded-lg">
                      <p><strong>Sample Size:</strong> How many observations to include in each bootstrap sample</p>
                      <p className="text-sm opacity-80">• Larger samples = more stable estimates but slower computation</p>
                      <p className="text-sm opacity-80">• Typical choice: Same size as original data (maintains sample characteristics)</p>
                      <p className="text-sm opacity-80">• Experiment: Try smaller sizes to see increased variability</p>
                    </div>

                    <div className="bg-secondary/20 p-3 rounded-lg">
                      <p><strong>Number of Bootstrap Samples:</strong> How many bootstrap replications to perform</p>
                      <p className="text-sm opacity-80">• More samples = smoother distribution approximation</p>
                      <p className="text-sm opacity-80">• Common choices: 500-2000 for most applications</p>
                      <p className="text-sm opacity-80">• Rule of thumb: At least 1000 for reliable confidence intervals</p>
                    </div>

                    <div className="bg-secondary/20 p-3 rounded-lg">
                      <p><strong>Confidence Level:</strong> The coverage probability for confidence intervals</p>
                      <p className="text-sm opacity-80">• 95% means the interval should contain the true value 95% of the time</p>
                      <p className="text-sm opacity-80">• Higher confidence = wider intervals</p>
                      <p className="text-sm opacity-80">• Common levels: 90%, 95%, 99%</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-primary">Statistic Options</h4>
                    
                    <div className="bg-secondary/20 p-3 rounded-lg">
                      <p><strong>Mean:</strong> Average value - sensitive to outliers, assumes roughly symmetric distribution</p>
                      <p><strong>Median:</strong> Middle value - robust to outliers, works well with skewed data</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-primary">Display Options</h4>
                    
                    <div className="bg-secondary/20 p-3 rounded-lg">
                      <p><strong>Show Confidence Interval:</strong> Display the percentile-based confidence bounds</p>
                      <p><strong>Show Normal Fit:</strong> Overlay a normal distribution for comparison (tests Central Limit Theorem)</p>
                    </div>
                  </div>

                  <div className="bg-accent/10 p-4 rounded-lg">
                    <p className="font-medium text-accent mb-2">⚡ Quick Start:</p>
                    <p>Try the defaults first, then experiment with different sample sizes to see the effect!</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="visualization" className="glass-panel rounded-xl px-6">
              <AccordionTrigger className="text-lg font-medium py-4">
                Understanding the Visualization
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-4">
                <p>Here's how to interpret each chart as the bootstrap process runs:</p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-primary mb-2">📊 Bootstrap Distribution (Top)</h4>
                    <div className="bg-secondary/20 p-3 rounded-lg space-y-2">
                      <p><strong>What you see:</strong> Histogram of bootstrap statistics with confidence intervals</p>
                      <p><strong>How to read it:</strong></p>
                      <ul className="list-disc pl-6 text-sm space-y-1">
                        <li>Green line = average of all bootstrap statistics</li>
                        <li>Red dashed lines = confidence interval bounds</li>
                        <li>Yellow region = confidence interval coverage</li>
                        <li>Purple line = normal distribution fit (if enabled)</li>
                      </ul>
                      <p className="text-sm opacity-80"><strong>Watch for:</strong> The distribution should become smoother and more stable as more samples are added</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-primary mb-2">📈 Original vs Bootstrap Comparison (Bottom Left)</h4>
                    <div className="bg-secondary/20 p-3 rounded-lg space-y-2">
                      <p><strong>What you see:</strong> Side-by-side comparison of original data and bootstrap statistics</p>
                      <p><strong>How to read it:</strong></p>
                      <ul className="list-disc pl-6 text-sm space-y-1">
                        <li>Gray bars = distribution of original data points</li>
                        <li>Orange bars = distribution of bootstrap statistics</li>
                        <li>Black line = mean of original data</li>
                        <li>Orange dashed line = mean of bootstrap statistics</li>
                      </ul>
                      <p className="text-sm opacity-80"><strong>Key insight:</strong> Bootstrap statistics are typically more concentrated than original data (less variability)</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-primary mb-2">📉 Convergence Analysis (Bottom Right)</h4>
                    <div className="bg-secondary/20 p-3 rounded-lg space-y-2">
                      <p><strong>What you see:</strong> How bias and mean squared error change with sample size</p>
                      <p><strong>How to read it:</strong></p>
                      <ul className="list-disc pl-6 text-sm space-y-1">
                        <li>Blue line = absolute bias (difference from true value)</li>
                        <li>Red line = mean squared error (overall accuracy)</li>
                        <li>Both should generally decrease as sample size increases</li>
                      </ul>
                      <p className="text-sm opacity-80"><strong>Watch for:</strong> Both curves should level off, showing convergence to optimal values</p>
                    </div>
                  </div>
                </div>

                <div className="bg-accent/10 p-4 rounded-lg">
                  <p className="font-medium text-accent mb-2">🎯 Pro Tips:</p>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Compare mean vs median - median is more robust to outliers</li>
                    <li>Watch confidence intervals change with different confidence levels</li>
                    <li>Notice concentration - bootstrap means are less variable than individual data points</li>
                    <li>Normal fit reveals whether the Central Limit Theorem applies to your data</li>
                    <li>Experiment freely - try extreme parameter values to build intuition!</li>
                  </ul>
                </div>

                <div className="bg-secondary/10 p-4 rounded-lg">
                  <p className="font-medium text-secondary mb-2">🔍 What to Look For:</p>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Symmetric vs skewed bootstrap distributions</li>
                    <li>How quickly bias and MSE stabilize</li>
                    <li>Differences between mean and median behavior with the same data</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full glass-panel border-t border-white/5 mt-16">
        <div className="container py-4 px-4 md:px-8 text-center">
          <p className="text-sm opacity-70">
            Bootstrap Visualization • Statistical Resampling • BITS Pilani, K.K. Birla Goa Campus
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Bootstrapping;
