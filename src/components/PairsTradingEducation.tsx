import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Activity, Target, BarChart3, BookOpen, Zap } from "lucide-react";

const PairsTradingEducation: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-8">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="cointegration" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Cointegration
          </TabsTrigger>
          <TabsTrigger value="spread" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Spread
          </TabsTrigger>
          <TabsTrigger value="zscore" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Z-Score
          </TabsTrigger>
          <TabsTrigger value="signals" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Signals
          </TabsTrigger>
          <TabsTrigger value="backtest" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Backtest
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Pairs Trading Fundamentals
              </CardTitle>
              <CardDescription>
                Understanding statistical arbitrage through cointegrated pairs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">What is Pairs Trading?</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Pairs trading is a market-neutral strategy that involves simultaneously 
                    buying and selling two related securities. The goal is to profit from 
                    the temporary divergence of their price relationship, betting that they 
                    will converge back to their historical norm.
                  </p>
                  <div className="bg-accent/10 p-3 rounded-lg">
                    <p className="text-sm">
                      <strong>Key Insight:</strong> Unlike correlation, cointegration captures 
                      a long-term equilibrium relationship between two price series.
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">The Trading Pipeline</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs">1</span>
                      <span>Select candidate pairs from same sector</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs">2</span>
                      <span>Test for cointegration (ADF test)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs">3</span>
                      <span>Estimate hedge ratio and compute spread</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs">4</span>
                      <span>Calculate z-scores for entry/exit signals</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs">5</span>
                      <span>Execute trades and manage positions</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cointegration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cointegration & Stationarity</CardTitle>
              <CardDescription>
                Understanding the Engle-Granger approach and ADF test
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Cointegration vs Correlation</h4>
                  <div className="space-y-3">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h5 className="font-medium text-sm">Correlation</h5>
                      <p className="text-xs text-muted-foreground">
                        Measures short-term co-movement. Two stocks can be highly 
                        correlated but drift apart over time.
                      </p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <h5 className="font-medium text-sm">Cointegration</h5>
                      <p className="text-xs text-muted-foreground">
                        Indicates a long-term equilibrium relationship. The spread 
                        between cointegrated series is stationary and mean-reverting.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">ADF Test Intuition</h4>
                  <div className="bg-secondary/30 p-4 rounded-lg font-mono text-xs">
                    <p>ΔS_t = γ × S_{'{t-1}'} + ε_t</p>
                    <p className="mt-2 text-muted-foreground">If γ &lt; 0 and significant → stationary</p>
                  </div>
                  <div className="bg-accent/10 p-3 rounded-lg text-xs">
                    <p><strong>Critical Value (5%):</strong> -2.86</p>
                    <p className="mt-1">If t-statistic &lt; -2.86, reject null hypothesis of unit root.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spread" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Spread Construction</CardTitle>
              <CardDescription>
                Building the tradeable spread using log prices and hedge ratios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Hedge Ratio Estimation</h4>
                  <p className="text-sm text-muted-foreground">
                    The hedge ratio β determines how many units of Stock B to trade 
                    for each unit of Stock A, ensuring the spread is stationary.
                  </p>
                  <div className="bg-secondary/30 p-4 rounded-lg font-mono text-xs space-y-2">
                    <p>log(A_t) = α + β × log(B_t) + ε_t</p>
                    <p className="text-muted-foreground">β = Cov(logA, logB) / Var(logB)</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Spread Formula</h4>
                  <div className="bg-secondary/30 p-4 rounded-lg font-mono text-xs">
                    <p>S_t = log(A_t) - β × log(B_t)</p>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-lg text-xs">
                    <p><strong>Why Log Prices?</strong></p>
                    <p className="text-muted-foreground mt-1">
                      Log prices convert multiplicative relationships to additive ones, 
                      making the spread easier to analyze and trade.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="zscore" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Z-Score Calculation</CardTitle>
              <CardDescription>
                Standardizing the spread for signal generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Rolling Statistics</h4>
                  <div className="bg-secondary/30 p-4 rounded-lg font-mono text-xs space-y-2">
                    <p>μ_t = mean(S_{'{t-n+1}'}, ..., S_t)</p>
                    <p>σ_t = std(S_{'{t-n+1}'}, ..., S_t)</p>
                    <p className="mt-2 border-t border-white/10 pt-2">Z_t = (S_t - μ_t) / σ_t</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Rolling window (typically 60-120 days) adapts to recent market conditions.
                  </p>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Quantile-Based Thresholds</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 bg-green-500/10 p-2 rounded">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Lower Entry: 5th percentile</span>
                    </div>
                    <div className="flex items-center gap-2 bg-red-500/10 p-2 rounded">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm">Upper Entry: 95th percentile</span>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-500/10 p-2 rounded">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Exit Level: 50th percentile (median)</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Signal Generation Logic</CardTitle>
              <CardDescription>
                Entry and exit rules based on z-score thresholds
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Entry Signals</h4>
                  <div className="space-y-3">
                    <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                      <h5 className="font-medium text-green-400 mb-2">▲ Long Spread</h5>
                      <p className="text-xs text-muted-foreground">
                        When Z_t &lt; lower threshold: Spread is unusually low. 
                        Expect it to increase back toward mean.
                      </p>
                      <p className="text-xs mt-2 font-mono">
                        Action: Buy A, Sell β × B
                      </p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                      <h5 className="font-medium text-red-400 mb-2">▼ Short Spread</h5>
                      <p className="text-xs text-muted-foreground">
                        When Z_t &gt; upper threshold: Spread is unusually high. 
                        Expect it to decrease back toward mean.
                      </p>
                      <p className="text-xs mt-2 font-mono">
                        Action: Sell A, Buy β × B
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Exit Signals</h4>
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                    <h5 className="font-medium text-blue-400 mb-2">○ Close Position</h5>
                    <p className="text-xs text-muted-foreground mb-3">
                      When z-score crosses back to the exit level (median), close the position.
                    </p>
                    <div className="space-y-2 text-xs font-mono">
                      <p>Long position: Exit when Z_t ≥ exit_level</p>
                      <p>Short position: Exit when Z_t ≤ exit_level</p>
                    </div>
                  </div>
                  <div className="bg-accent/10 p-3 rounded-lg text-xs">
                    <strong>Risk Management:</strong> Consider stop-losses at extreme z-scores 
                    (e.g., ±4) to protect against regime changes.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backtest" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Backtesting & Performance</CardTitle>
              <CardDescription>
                Evaluating strategy performance with key metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">PnL Calculation</h4>
                  <div className="bg-secondary/30 p-4 rounded-lg font-mono text-xs space-y-2">
                    <p>daily_return_t = position_{'{t-1}'} × (S_t - S_{'{t-1}'})</p>
                    <p className="mt-2 text-muted-foreground">
                      Cumulative PnL = Σ daily_returns
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Position is +1 (short spread), -1 (long spread), or 0 (flat).
                  </p>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Key Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-secondary/20 p-2 rounded">
                      <span className="text-sm">Sharpe Ratio</span>
                      <span className="text-xs font-mono">(μ / σ) × √252</span>
                    </div>
                    <div className="flex justify-between items-center bg-secondary/20 p-2 rounded">
                      <span className="text-sm">Max Drawdown</span>
                      <span className="text-xs text-muted-foreground">Peak-to-trough decline</span>
                    </div>
                    <div className="flex justify-between items-center bg-secondary/20 p-2 rounded">
                      <span className="text-sm">Win Rate</span>
                      <span className="text-xs text-muted-foreground">% profitable days</span>
                    </div>
                    <div className="flex justify-between items-center bg-secondary/20 p-2 rounded">
                      <span className="text-sm">Total Trades</span>
                      <span className="text-xs text-muted-foreground">Round-trip count</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-accent/10 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Interpretation Guidelines</h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p><strong>Sharpe &gt; 1.0:</strong> Good risk-adjusted returns</p>
                    <p><strong>Sharpe &gt; 2.0:</strong> Excellent performance</p>
                  </div>
                  <div>
                    <p><strong>Max DD &lt; 10%:</strong> Well-controlled risk</p>
                    <p><strong>Win Rate &gt; 50%:</strong> Positive expectancy</p>
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

export default PairsTradingEducation;
