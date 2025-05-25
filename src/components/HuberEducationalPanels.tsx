
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";

const HuberEducationalPanels: React.FC = () => {
  const [openPanels, setOpenPanels] = React.useState<{[key: string]: boolean}>({});

  const togglePanel = (panelId: string) => {
    setOpenPanels(prev => ({
      ...prev,
      [panelId]: !prev[panelId]
    }));
  };

  return (
    <div className="space-y-4">
      {/* Panel 1: Understanding Huber M-Estimator */}
      <Card className="glass-panel">
        <Collapsible open={openPanels.huber} onOpenChange={() => togglePanel('huber')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-secondary/50 transition-colors">
              <CardTitle className="text-lg font-semibold flex items-center justify-between">
                Understanding Huber M-Estimator
                {openPanels.huber ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                The Huber M-Estimator is a robust regression method that provides a balance between ordinary least squares and absolute deviation estimation. Unlike standard regression, it reduces the influence of outliers while maintaining high efficiency for normal data.
              </p>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">How It Works:</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Identifies outliers using residuals (prediction errors)</li>
                  <li>• Assigns weights to each data point based on how far they deviate from the fitted line</li>
                  <li>• Iteratively updates parameter estimates using weighted least squares</li>
                  <li>• Converges to a robust estimate that minimizes outlier influence</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Key Benefits:</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• <strong>Robust to outliers:</strong> Automatically reduces influence of anomalous data points</li>
                  <li>• <strong>High efficiency:</strong> Maintains 95% efficiency compared to least squares on clean data</li>
                  <li>• <strong>Automatic detection:</strong> No manual outlier identification required</li>
                  <li>• <strong>Stable convergence:</strong> Reliable estimation even with contaminated data</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Real-World Applications:</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Financial modeling with extreme market events</li>
                  <li>• Sensor data analysis with measurement errors</li>
                  <li>• Medical research with patient variability</li>
                  <li>• Quality control with manufacturing defects</li>
                </ul>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Panel 2: Parameter Guide */}
      <Card className="glass-panel">
        <Collapsible open={openPanels.parameters} onOpenChange={() => togglePanel('parameters')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-secondary/50 transition-colors">
              <CardTitle className="text-lg font-semibold flex items-center justify-between">
                Parameter Guide
                {openPanels.parameters ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Understanding each parameter helps you control the algorithm's behavior and optimize results for your specific data.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Tuning Constant (k):</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>Purpose:</strong> Controls threshold between "normal" and "outlying" residuals</li>
                    <li>• <strong>Standard value:</strong> k = 1.345σ (where σ is the standard deviation)</li>
                    <li>• <strong>Smaller k:</strong> More aggressive outlier rejection, lower efficiency</li>
                    <li>• <strong>Larger k:</strong> Less outlier rejection, approaches ordinary least squares</li>
                    <li>• <strong>Rule of thumb:</strong> Start with k = 1.345, adjust based on outlier tolerance</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Initial Estimate:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>Purpose:</strong> Starting point for the iterative algorithm</li>
                    <li>• <strong>Impact:</strong> Good initial estimates lead to faster convergence</li>
                    <li>• <strong>Strategies:</strong> Use least squares estimate, median, or domain knowledge</li>
                    <li>• <strong>Robustness:</strong> Algorithm usually converges regardless of starting point</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Max Iterations:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>Purpose:</strong> Prevents infinite loops and controls computation time</li>
                    <li>• <strong>Typical range:</strong> 10-50 iterations</li>
                    <li>• <strong>Convergence:</strong> Most problems converge within 10-20 iterations</li>
                    <li>• <strong>Early stopping:</strong> Algorithm stops automatically when estimates stabilize</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Data Format:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>Input:</strong> Comma-separated numerical values</li>
                    <li>• <strong>Requirements:</strong> At least 3 data points for meaningful estimation</li>
                    <li>• <strong>Preprocessing:</strong> No need to remove outliers manually</li>
                    <li>• <strong>Missing values:</strong> Remove or impute before analysis</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Panel 3: Understanding the Visualizations */}
      <Card className="glass-panel">
        <Collapsible open={openPanels.visualizations} onOpenChange={() => togglePanel('visualizations')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-secondary/50 transition-colors">
              <CardTitle className="text-lg font-semibold flex items-center justify-between">
                Understanding the Visualizations
                {openPanels.visualizations ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Each chart provides insights into different aspects of the robust estimation process.
              </p>

              <div className="space-y-4">
                <div className="p-3 bg-secondary/20 rounded-md">
                  <h4 className="font-semibold text-sm mb-2">📈 Convergence Path (Top):</h4>
                  <p className="text-sm text-muted-foreground mb-2"><strong>What you see:</strong> Parameter estimate vs. iteration number</p>
                  <p className="text-sm text-muted-foreground mb-2"><strong>How to interpret:</strong></p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• <strong>Rapid initial movement:</strong> Algorithm quickly moves away from poor starting points</li>
                    <li>• <strong>Gradual convergence:</strong> Estimate stabilizes as algorithm refines the solution</li>
                    <li>• <strong>Horizontal plateau:</strong> Indicates successful convergence to final estimate</li>
                    <li>• <strong>Oscillations:</strong> May indicate numerical issues or poorly conditioned data</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2"><strong>What to look for:</strong> Smooth convergence to a stable value within max iterations</p>
                </div>

                <div className="p-3 bg-secondary/20 rounded-md">
                  <h4 className="font-semibold text-sm mb-2">📊 Data Visualization (Bottom Left):</h4>
                  <p className="text-sm text-muted-foreground mb-2"><strong>What you see:</strong> Scatter plot of data points with fitted regression line</p>
                  <p className="text-sm text-muted-foreground mb-2"><strong>How to interpret:</strong></p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• <strong>Blue line:</strong> Robust regression line estimated by Huber M-Estimator</li>
                    <li>• <strong>Point colors:</strong> May indicate outlier status (red = high influence, blue = normal)</li>
                    <li>• <strong>Line fit:</strong> Should pass through the "center" of the main data cluster</li>
                    <li>• <strong>Outlier handling:</strong> Line should not be pulled toward extreme points</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2"><strong>What to look for:</strong> Line that fits the main data trend while ignoring obvious outliers</p>
                </div>

                <div className="p-3 bg-secondary/20 rounded-md">
                  <h4 className="font-semibold text-sm mb-2">📊 Weights Visualization (Bottom Right):</h4>
                  <p className="text-sm text-muted-foreground mb-2"><strong>What you see:</strong> Bar chart showing weight assigned to each data point</p>
                  <p className="text-sm text-muted-foreground mb-2"><strong>How to interpret:</strong></p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• <strong>Weight = 1.0:</strong> Point treated as normal observation (full weight)</li>
                    <li>• <strong>Weight &lt; 1.0:</strong> Point downweighted due to large residual (potential outlier)</li>
                    <li>• <strong>Weight ≈ 0:</strong> Point effectively ignored (strong outlier)</li>
                    <li>• <strong>Weight pattern:</strong> Should highlight obvious outliers with low weights</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2"><strong>What to look for:</strong> Most points with weight ≈ 1.0, obvious outliers with low weights</p>
                </div>

                <div className="p-3 bg-accent/20 rounded-md">
                  <h4 className="font-semibold text-sm mb-2">🎯 Key Insights:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Convergence + Stable weights = Successful robust estimation</li>
                    <li>• High weights on outliers = Consider adjusting tuning constant</li>
                    <li>• No convergence = Try different initial estimate or increase max iterations</li>
                    <li>• All weights equal = Data may not contain outliers (standard regression sufficient)</li>
                  </ul>
                </div>

                <div className="p-3 bg-primary/20 rounded-md">
                  <h4 className="font-semibold text-sm mb-2">💡 Pro Tips:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Compare results with ordinary least squares to see outlier impact</li>
                    <li>• Experiment with different k values to understand sensitivity</li>
                    <li>• Watch for weight patterns that match your intuition about outliers</li>
                    <li>• Use convergence plot to verify algorithm stability</li>
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

export default HuberEducationalPanels;
