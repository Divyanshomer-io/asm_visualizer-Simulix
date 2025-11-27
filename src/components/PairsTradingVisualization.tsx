import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ScatterChart, Scatter, ComposedChart, Area, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Activity, BarChart3, Target, Zap } from "lucide-react";
import { PairsTradingParams } from "./PairsTradingControls";
import {
  StockData,
  PairInfo,
  ADFResult,
  BacktestResult,
  ThresholdLevels,
  generateStockData,
  analyzePairs,
  calculateHedgeRatio,
  calculateSpread,
  performADFTest,
  rollingStats,
  computeZScores,
  quantile,
  generateSignals,
  backtest,
  getSignalChangePoints
} from "@/utils/pairsTrading";

interface PairsTradingVisualizationProps {
  params: PairsTradingParams;
  onThresholdsCalculated: (thresholds: ThresholdLevels | null) => void;
  analysisKey: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;
  
  return (
    <div className="bg-slate-900/95 border border-slate-700 rounded-lg p-3 text-white text-xs">
      <p className="font-medium mb-1">{label}</p>
      {payload.map((entry: any, index: number) => (
        <p key={index} style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(3) : entry.value}
        </p>
      ))}
    </div>
  );
};

const PairsTradingVisualization: React.FC<PairsTradingVisualizationProps> = ({
  params,
  onThresholdsCalculated,
  analysisKey
}) => {
  const [stockData, setStockData] = useState<{ training: StockData; testing: StockData } | null>(null);
  const [allPairs, setAllPairs] = useState<PairInfo[]>([]);
  const [selectedPair, setSelectedPair] = useState<PairInfo | null>(null);
  const [adfResult, setAdfResult] = useState<ADFResult | null>(null);
  const [zScores, setZScores] = useState<number[]>([]);
  const [thresholds, setThresholds] = useState<ThresholdLevels | null>(null);
  const [signals, setSignals] = useState<number[]>([]);
  const [backtestResult, setBacktestResult] = useState<BacktestResult | null>(null);
  const [rollingMean, setRollingMean] = useState<number[]>([]);
  const [rollingStd, setRollingStd] = useState<number[]>([]);

  // Initialize stock data
  useEffect(() => {
    const data = generateStockData();
    setStockData(data);
    
    // Analyze all pairs using training data
    const pairs = analyzePairs(data.training);
    setAllPairs(pairs);
  }, []);

  // Run analysis when params change or analysis is triggered
  useEffect(() => {
    if (!stockData) return;

    const currentData = params.period === 'training' ? stockData.training : stockData.testing;
    
    // Calculate hedge ratio and spread for selected pair
    const hedgeRatio = calculateHedgeRatio(
      currentData.prices[params.stockA],
      currentData.prices[params.stockB]
    );
    
    const spread = calculateSpread(
      currentData.prices[params.stockA],
      currentData.prices[params.stockB],
      hedgeRatio
    );
    
    const avgAbsSpread = spread.reduce((a, b) => a + Math.abs(b), 0) / spread.length;
    
    setSelectedPair({
      stockA: params.stockA,
      stockB: params.stockB,
      hedgeRatio,
      avgAbsSpread,
      spread
    });

    // Perform ADF test
    const adf = performADFTest(spread);
    setAdfResult(adf);

    // Calculate rolling statistics
    const { mean, std } = rollingStats(spread, params.rollingWindow);
    setRollingMean(mean);
    setRollingStd(std);

    // Calculate z-scores
    const zs = computeZScores(spread, mean, std);
    setZScores(zs);

    // Calculate thresholds
    const thresh: ThresholdLevels = {
      lowerEntry: quantile(zs, params.lowerQuantile),
      upperEntry: quantile(zs, params.upperQuantile),
      exitLevel: quantile(zs, 0.5)
    };
    setThresholds(thresh);
    onThresholdsCalculated(thresh);

    // Generate signals
    const sigs = generateSignals(zs, thresh.lowerEntry, thresh.upperEntry, thresh.exitLevel);
    setSignals(sigs);

    // Backtest
    const bt = backtest(spread, sigs);
    setBacktestResult(bt);
  }, [stockData, params, analysisKey, onThresholdsCalculated]);

  // Prepare chart data
  const spreadChartData = useMemo(() => {
    if (!selectedPair || !stockData) return [];
    const currentData = params.period === 'training' ? stockData.training : stockData.testing;
    
    return currentData.dates.map((date, i) => ({
      date: date,
      spread: selectedPair.spread[i],
      mean: rollingMean[i],
      upperBand: rollingMean[i] + 2 * rollingStd[i],
      lowerBand: rollingMean[i] - 2 * rollingStd[i]
    })).filter((_, i) => i % 5 === 0); // Downsample for performance
  }, [selectedPair, stockData, params.period, rollingMean, rollingStd]);

  const zScoreChartData = useMemo(() => {
    if (!stockData || zScores.length === 0) return [];
    const currentData = params.period === 'training' ? stockData.training : stockData.testing;
    
    return currentData.dates.map((date, i) => ({
      date: date,
      zScore: zScores[i],
      signal: signals[i]
    })).filter((_, i) => i % 5 === 0);
  }, [stockData, zScores, signals, params.period]);

  const pnlChartData = useMemo(() => {
    if (!backtestResult || !stockData) return [];
    const currentData = params.period === 'training' ? stockData.training : stockData.testing;
    
    return backtestResult.cumulative.map((pnl, i) => ({
      date: currentData.dates[i + 1] || '',
      pnl: pnl
    })).filter((_, i) => i % 5 === 0);
  }, [backtestResult, stockData, params.period]);

  const priceChartData = useMemo(() => {
    if (!stockData) return [];
    const currentData = params.period === 'training' ? stockData.training : stockData.testing;
    
    // Normalize prices for comparison
    const pricesA = currentData.prices[params.stockA];
    const pricesB = currentData.prices[params.stockB];
    const baseA = pricesA[0];
    const baseB = pricesB[0];
    
    return currentData.dates.map((date, i) => ({
      date,
      [params.stockA.replace('.NS', '')]: ((pricesA[i] / baseA) - 1) * 100,
      [params.stockB.replace('.NS', '')]: ((pricesB[i] / baseB) - 1) * 100
    })).filter((_, i) => i % 5 === 0);
  }, [stockData, params]);

  const signalPoints = useMemo(() => {
    if (!stockData || signals.length === 0) return [];
    const currentData = params.period === 'training' ? stockData.training : stockData.testing;
    return getSignalChangePoints(signals, currentData.dates, zScores);
  }, [stockData, signals, zScores, params.period]);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-4">
          <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
          <TabsTrigger value="pairs" className="text-xs">Pairs</TabsTrigger>
          <TabsTrigger value="spread" className="text-xs">Spread</TabsTrigger>
          <TabsTrigger value="zscore" className="text-xs">Z-Score</TabsTrigger>
          <TabsTrigger value="signals" className="text-xs">Signals</TabsTrigger>
          <TabsTrigger value="backtest" className="text-xs">Backtest</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Price Chart */}
            <Card className="glass-panel border-accent/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Normalized Price Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={priceChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fill: '#94a3b8', fontSize: 10 }}
                        tickFormatter={(value) => value.slice(5, 10)}
                      />
                      <YAxis 
                        tick={{ fill: '#94a3b8', fontSize: 10 }}
                        tickFormatter={(value) => `${value.toFixed(0)}%`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line 
                        type="monotone" 
                        dataKey={params.stockA.replace('.NS', '')} 
                        stroke="#10b981" 
                        dot={false}
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey={params.stockB.replace('.NS', '')} 
                        stroke="#f59e0b" 
                        dot={false}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* ADF Test Results */}
            <Card className="glass-panel border-accent/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Stationarity Test (ADF)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {adfResult && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-secondary/30 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">Gamma (γ)</p>
                        <p className="text-xl font-mono">{adfResult.gamma.toFixed(4)}</p>
                      </div>
                      <div className="bg-secondary/30 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">T-Statistic</p>
                        <p className="text-xl font-mono">{adfResult.tStatistic.toFixed(3)}</p>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg border ${adfResult.isStationary ? 'bg-green-500/20 border-green-500/30' : 'bg-red-500/20 border-red-500/30'}`}>
                      <p className="text-sm font-medium">
                        {adfResult.isStationary 
                          ? '✓ Spread appears stationary (mean-reverting)'
                          : '✗ Spread may be non-stationary'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Critical value at 5%: -2.86
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          {backtestResult && selectedPair && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="glass-panel border-accent/20">
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground">Hedge Ratio (β)</p>
                  <p className="text-2xl font-bold">{selectedPair.hedgeRatio.toFixed(3)}</p>
                </CardContent>
              </Card>
              <Card className="glass-panel border-accent/20">
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground">Sharpe Ratio</p>
                  <p className="text-2xl font-bold">{backtestResult.sharpeRatio.toFixed(2)}</p>
                </CardContent>
              </Card>
              <Card className="glass-panel border-accent/20">
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground">Total Trades</p>
                  <p className="text-2xl font-bold">{backtestResult.totalTrades}</p>
                </CardContent>
              </Card>
              <Card className="glass-panel border-accent/20">
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground">Win Rate</p>
                  <p className="text-2xl font-bold">{(backtestResult.winRate * 100).toFixed(1)}%</p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Pairs Selection Tab */}
        <TabsContent value="pairs" className="space-y-4">
          <Card className="glass-panel border-accent/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">All Pair Combinations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-[400px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Stock A</TableHead>
                      <TableHead>Stock B</TableHead>
                      <TableHead>Hedge Ratio</TableHead>
                      <TableHead>Avg |Spread|</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allPairs.slice(0, 15).map((pair, i) => (
                      <TableRow 
                        key={i}
                        className={pair.stockA === params.stockA && pair.stockB === params.stockB ? 'bg-primary/20' : ''}
                      >
                        <TableCell className="font-mono text-sm">{pair.stockA.replace('.NS', '')}</TableCell>
                        <TableCell className="font-mono text-sm">{pair.stockB.replace('.NS', '')}</TableCell>
                        <TableCell className="font-mono text-sm">{pair.hedgeRatio.toFixed(3)}</TableCell>
                        <TableCell className="font-mono text-sm">{pair.avgAbsSpread.toFixed(4)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Spread Tab */}
        <TabsContent value="spread" className="space-y-4">
          <Card className="glass-panel border-accent/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Spread Time Series
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={spreadChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: '#94a3b8', fontSize: 10 }}
                      tickFormatter={(value) => value.slice(5, 10)}
                    />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="upperBand" 
                      stroke="none"
                      fill="rgba(59, 130, 246, 0.1)"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="lowerBand" 
                      stroke="none"
                      fill="rgba(59, 130, 246, 0.1)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="mean" 
                      stroke="#3b82f6" 
                      strokeDasharray="5 5"
                      dot={false}
                      strokeWidth={1}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="spread" 
                      stroke="#10b981" 
                      dot={false}
                      strokeWidth={2}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Z-Score Tab */}
        <TabsContent value="zscore" className="space-y-4">
          <Card className="glass-panel border-accent/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Z-Score with Thresholds
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={zScoreChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: '#94a3b8', fontSize: 10 }}
                      tickFormatter={(value) => value.slice(5, 10)}
                    />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Tooltip content={<CustomTooltip />} />
                    {thresholds && (
                      <>
                        <ReferenceLine y={thresholds.upperEntry} stroke="#ef4444" strokeDasharray="5 5" />
                        <ReferenceLine y={thresholds.lowerEntry} stroke="#22c55e" strokeDasharray="5 5" />
                        <ReferenceLine y={thresholds.exitLevel} stroke="#3b82f6" strokeDasharray="3 3" />
                      </>
                    )}
                    <Line 
                      type="monotone" 
                      dataKey="zScore" 
                      stroke="#f59e0b" 
                      dot={false}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              {thresholds && (
                <div className="flex gap-4 mt-4 text-xs justify-center">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-0.5 bg-green-500"></span> Lower Entry
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-0.5 bg-red-500"></span> Upper Entry
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-0.5 bg-blue-500"></span> Exit Level
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Signals Tab */}
        <TabsContent value="signals" className="space-y-4">
          <Card className="glass-panel border-accent/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Trading Signals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-green-500/20 border border-green-500/30 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Long Entries</p>
                  <p className="text-xl font-bold">{signalPoints.filter(s => s.type === 'long').length}</p>
                </div>
                <div className="bg-red-500/20 border border-red-500/30 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Short Entries</p>
                  <p className="text-xl font-bold">{signalPoints.filter(s => s.type === 'short').length}</p>
                </div>
                <div className="bg-blue-500/20 border border-blue-500/30 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Exit Signals</p>
                  <p className="text-xl font-bold">{signalPoints.filter(s => s.type === 'exit').length}</p>
                </div>
              </div>
              
              <div className="max-h-[250px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Z-Score</TableHead>
                      <TableHead>Signal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {signalPoints.slice(0, 20).map((point, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-mono text-sm">{point.date}</TableCell>
                        <TableCell className="font-mono text-sm">{point.zScore.toFixed(3)}</TableCell>
                        <TableCell>
                          <Badge variant={
                            point.type === 'long' ? 'default' : 
                            point.type === 'short' ? 'destructive' : 'secondary'
                          }>
                            {point.type === 'long' ? '▲ Long' : point.type === 'short' ? '▼ Short' : '○ Exit'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backtest Tab */}
        <TabsContent value="backtest" className="space-y-4">
          <Card className="glass-panel border-accent/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Cumulative PnL
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={pnlChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: '#94a3b8', fontSize: 10 }}
                      tickFormatter={(value) => value.slice(5, 10)}
                    />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={0} stroke="#64748b" />
                    <Line 
                      type="monotone" 
                      dataKey="pnl" 
                      stroke="#10b981" 
                      dot={false}
                      strokeWidth={2}
                      fill="url(#pnlGradient)"
                    />
                    <defs>
                      <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {backtestResult && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="glass-panel border-accent/20">
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground">Sharpe Ratio</p>
                  <p className="text-2xl font-bold text-primary">{backtestResult.sharpeRatio.toFixed(2)}</p>
                </CardContent>
              </Card>
              <Card className="glass-panel border-accent/20">
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground">Max Drawdown</p>
                  <p className="text-2xl font-bold text-red-400">{(backtestResult.maxDrawdown * 100).toFixed(1)}%</p>
                </CardContent>
              </Card>
              <Card className="glass-panel border-accent/20">
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground">Avg Profit/Trade</p>
                  <p className="text-2xl font-bold">{backtestResult.avgProfitPerTrade.toFixed(4)}</p>
                </CardContent>
              </Card>
              <Card className="glass-panel border-accent/20">
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground">Total Trades</p>
                  <p className="text-2xl font-bold">{backtestResult.totalTrades}</p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PairsTradingVisualization;
