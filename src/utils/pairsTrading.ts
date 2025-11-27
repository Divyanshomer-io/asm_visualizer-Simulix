// Cointegration-based Pairs Trading Utilities

// Mock pharma stock tickers
export const PHARMA_TICKERS = [
  "SUNPHARMA.NS", "DIVISLAB.NS", "CIPLA.NS", "BIOCON.NS", "TORNTPHARM.NS",
  "LUPIN.NS", "ZYDUSLIFE.NS", "AUROPHARMA.NS", "CADILAHC.NS", "IPCA.NS"
];

// Generate mock price data that roughly resembles stock prices
function generateMockPrices(startPrice: number, days: number, volatility: number, drift: number): number[] {
  const prices: number[] = [startPrice];
  for (let i = 1; i < days; i++) {
    const randomReturn = (Math.random() - 0.5) * 2 * volatility + drift;
    prices.push(prices[i - 1] * (1 + randomReturn));
  }
  return prices;
}

// Generate dates array
function generateDates(startDate: Date, days: number): string[] {
  const dates: string[] = [];
  const currentDate = new Date(startDate);
  for (let i = 0; i < days; i++) {
    dates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
    // Skip weekends
    while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }
  return dates;
}

export interface StockData {
  dates: string[];
  prices: Record<string, number[]>;
}

export interface PairInfo {
  stockA: string;
  stockB: string;
  hedgeRatio: number;
  avgAbsSpread: number;
  spread: number[];
}

export interface ADFResult {
  gamma: number;
  tStatistic: number;
  isStationary: boolean;
  regressionData: { x: number; y: number }[];
}

export interface BacktestResult {
  dailyReturns: number[];
  cumulative: number[];
  sharpeRatio: number;
  totalTrades: number;
  avgProfitPerTrade: number;
  maxDrawdown: number;
  winRate: number;
}

export interface ThresholdLevels {
  lowerEntry: number;
  upperEntry: number;
  exitLevel: number;
}

// Generate mock stock data for training and testing periods
export function generateStockData(): { training: StockData; testing: StockData } {
  // Training: 2017-06-01 to 2020-06-01 (~750 trading days)
  // Testing: 2020-06-01 to 2023-06-01 (~750 trading days)
  const trainingDays = 750;
  const testingDays = 750;

  const trainingDates = generateDates(new Date('2017-06-01'), trainingDays);
  const testingDates = generateDates(new Date('2020-06-01'), testingDays);

  const trainingPrices: Record<string, number[]> = {};
  const testingPrices: Record<string, number[]> = {};

  // Base prices for each stock with different characteristics
  const baseConfigs: Record<string, { price: number; volatility: number; drift: number }> = {
    "SUNPHARMA.NS": { price: 450, volatility: 0.02, drift: 0.0003 },
    "DIVISLAB.NS": { price: 1200, volatility: 0.025, drift: 0.0004 },
    "CIPLA.NS": { price: 550, volatility: 0.018, drift: 0.0002 },
    "BIOCON.NS": { price: 350, volatility: 0.022, drift: 0.0001 },
    "TORNTPHARM.NS": { price: 1600, volatility: 0.019, drift: 0.0003 },
    "LUPIN.NS": { price: 800, volatility: 0.021, drift: 0.0001 },
    "ZYDUSLIFE.NS": { price: 380, volatility: 0.023, drift: 0.0002 },
    "AUROPHARMA.NS": { price: 650, volatility: 0.024, drift: 0.0002 },
    "CADILAHC.NS": { price: 420, volatility: 0.020, drift: 0.0003 },
    "IPCA.NS": { price: 900, volatility: 0.017, drift: 0.0004 }
  };

  // Generate correlated pairs - CIPLA and LUPIN will be our cointegrated pair
  PHARMA_TICKERS.forEach(ticker => {
    const config = baseConfigs[ticker];
    trainingPrices[ticker] = generateMockPrices(config.price, trainingDays, config.volatility, config.drift);
    
    // Continue from last training price for testing
    const lastPrice = trainingPrices[ticker][trainingDays - 1];
    testingPrices[ticker] = generateMockPrices(lastPrice, testingDays, config.volatility, config.drift);
  });

  // Make CIPLA and LUPIN more cointegrated by adding common factor
  const commonFactor = generateMockPrices(1, trainingDays, 0.015, 0.0002);
  const testingCommonFactor = generateMockPrices(commonFactor[trainingDays - 1], testingDays, 0.015, 0.0002);
  
  for (let i = 0; i < trainingDays; i++) {
    trainingPrices["CIPLA.NS"][i] *= commonFactor[i];
    trainingPrices["LUPIN.NS"][i] *= commonFactor[i] * 1.45; // Hedge ratio ~1.45
  }
  
  for (let i = 0; i < testingDays; i++) {
    testingPrices["CIPLA.NS"][i] *= testingCommonFactor[i];
    testingPrices["LUPIN.NS"][i] *= testingCommonFactor[i] * 1.45;
  }

  return {
    training: { dates: trainingDates, prices: trainingPrices },
    testing: { dates: testingDates, prices: testingPrices }
  };
}

// Calculate log prices
export function logPrices(prices: number[]): number[] {
  return prices.map(p => Math.log(p));
}

// Calculate hedge ratio using OLS: β = Cov(logA, logB) / Var(logB)
export function calculateHedgeRatio(pricesA: number[], pricesB: number[]): number {
  const logA = logPrices(pricesA);
  const logB = logPrices(pricesB);
  
  const n = logA.length;
  const meanA = logA.reduce((a, b) => a + b, 0) / n;
  const meanB = logB.reduce((a, b) => a + b, 0) / n;
  
  let cov = 0;
  let varB = 0;
  
  for (let i = 0; i < n; i++) {
    cov += (logA[i] - meanA) * (logB[i] - meanB);
    varB += (logB[i] - meanB) ** 2;
  }
  
  return cov / varB;
}

// Calculate spread: S_t = logA_t - β * logB_t
export function calculateSpread(pricesA: number[], pricesB: number[], hedgeRatio: number): number[] {
  const logA = logPrices(pricesA);
  const logB = logPrices(pricesB);
  
  return logA.map((a, i) => a - hedgeRatio * logB[i]);
}

// Analyze all pairs and find the best one
export function analyzePairs(data: StockData): PairInfo[] {
  const pairs: PairInfo[] = [];
  
  for (let i = 0; i < PHARMA_TICKERS.length; i++) {
    for (let j = i + 1; j < PHARMA_TICKERS.length; j++) {
      const stockA = PHARMA_TICKERS[i];
      const stockB = PHARMA_TICKERS[j];
      
      const hedgeRatio = calculateHedgeRatio(data.prices[stockA], data.prices[stockB]);
      const spread = calculateSpread(data.prices[stockA], data.prices[stockB], hedgeRatio);
      const avgAbsSpread = spread.reduce((a, b) => a + Math.abs(b), 0) / spread.length;
      
      pairs.push({
        stockA,
        stockB,
        hedgeRatio,
        avgAbsSpread,
        spread
      });
    }
  }
  
  // Sort by average absolute spread (lower is potentially better for mean reversion)
  return pairs.sort((a, b) => a.avgAbsSpread - b.avgAbsSpread);
}

// Simplified ADF test (educational approximation)
export function performADFTest(spread: number[]): ADFResult {
  const n = spread.length;
  const deltaS: number[] = [];
  const laggedS: number[] = [];
  
  for (let i = 1; i < n; i++) {
    deltaS.push(spread[i] - spread[i - 1]);
    laggedS.push(spread[i - 1]);
  }
  
  // OLS regression: ΔS_t = γ * S_{t-1} + ε
  const m = deltaS.length;
  const meanDelta = deltaS.reduce((a, b) => a + b, 0) / m;
  const meanLag = laggedS.reduce((a, b) => a + b, 0) / m;
  
  let cov = 0;
  let varLag = 0;
  
  for (let i = 0; i < m; i++) {
    cov += (deltaS[i] - meanDelta) * (laggedS[i] - meanLag);
    varLag += (laggedS[i] - meanLag) ** 2;
  }
  
  const gamma = cov / varLag;
  
  // Calculate residuals and standard error
  const residuals = deltaS.map((d, i) => d - gamma * laggedS[i]);
  const sse = residuals.reduce((a, r) => a + r ** 2, 0);
  const mse = sse / (m - 1);
  const seGamma = Math.sqrt(mse / varLag);
  
  const tStatistic = gamma / seGamma;
  
  // Critical value at 5% is approximately -2.86
  const isStationary = tStatistic < -2.86;
  
  // Prepare scatter data for visualization
  const regressionData = laggedS.map((x, i) => ({
    x: x,
    y: deltaS[i]
  }));
  
  return {
    gamma,
    tStatistic,
    isStationary,
    regressionData
  };
}

// Rolling statistics
export function rollingStats(series: number[], window: number): { mean: number[]; std: number[] } {
  const mean: number[] = [];
  const std: number[] = [];
  
  for (let i = 0; i < series.length; i++) {
    if (i < window - 1) {
      mean.push(NaN);
      std.push(NaN);
      continue;
    }
    
    const slice = series.slice(i - window + 1, i + 1);
    const m = slice.reduce((a, b) => a + b, 0) / slice.length;
    const variance = slice.reduce((acc, val) => acc + (val - m) ** 2, 0) / (slice.length - 1);
    
    mean.push(m);
    std.push(Math.sqrt(variance));
  }
  
  return { mean, std };
}

// Compute z-scores
export function computeZScores(spread: number[], mean: number[], std: number[]): number[] {
  return spread.map((s, i) => {
    if (isNaN(mean[i]) || isNaN(std[i]) || std[i] === 0) return NaN;
    return (s - mean[i]) / std[i];
  });
}

// Quantile function
export function quantile(values: number[], q: number): number {
  const validValues = values.filter(v => !isNaN(v));
  const sorted = [...validValues].sort((a, b) => a - b);
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  }
  return sorted[base];
}

// Calculate quantile-based thresholds
export function calculateThresholds(zScores: number[]): ThresholdLevels {
  const validZScores = zScores.filter(z => !isNaN(z));
  
  return {
    lowerEntry: quantile(validZScores, 0.05),
    upperEntry: quantile(validZScores, 0.95),
    exitLevel: quantile(validZScores, 0.5)
  };
}

// Generate trading signals
export function generateSignals(
  zScores: number[],
  lower: number,
  upper: number,
  exit: number
): number[] {
  const signal: number[] = [];
  let position = 0;
  
  for (let i = 0; i < zScores.length; i++) {
    const z = zScores[i];
    
    if (isNaN(z)) {
      signal.push(0);
      continue;
    }
    
    if (position === 0) {
      if (z < lower) position = -1;        // go long spread
      else if (z > upper) position = 1;    // go short spread
    } else if (position === -1 && z >= exit) {
      position = 0; // exit long
    } else if (position === 1 && z <= exit) {
      position = 0; // exit short
    }
    
    signal.push(position);
  }
  
  return signal;
}

// Backtest the strategy
export function backtest(spread: number[], signal: number[]): BacktestResult {
  const dailyReturns: number[] = [];
  
  for (let i = 1; i < spread.length; i++) {
    if (isNaN(spread[i]) || isNaN(spread[i - 1])) {
      dailyReturns.push(0);
      continue;
    }
    const ret = signal[i - 1] * (spread[i] - spread[i - 1]);
    dailyReturns.push(ret);
  }
  
  // Calculate statistics
  const validReturns = dailyReturns.filter(r => r !== 0 || signal.some(s => s !== 0));
  const mean = validReturns.length > 0 
    ? validReturns.reduce((a, b) => a + b, 0) / validReturns.length 
    : 0;
  
  const variance = validReturns.length > 1
    ? validReturns.reduce((acc, val) => acc + (val - mean) ** 2, 0) / (validReturns.length - 1)
    : 0;
  const std = Math.sqrt(variance);
  
  const sharpeRatio = std !== 0 ? (mean / std) * Math.sqrt(252) : 0;
  
  // Count trades
  let trades = 0;
  for (let i = 1; i < signal.length; i++) {
    if (signal[i] !== signal[i - 1] && (signal[i] !== 0 || signal[i - 1] !== 0)) {
      trades++;
    }
  }
  
  // Cumulative PnL
  const cumulative: number[] = [];
  let runningSum = 0;
  for (const ret of dailyReturns) {
    runningSum += ret;
    cumulative.push(runningSum);
  }
  
  // Max drawdown
  let maxDrawdown = 0;
  let peak = cumulative[0] || 0;
  for (const val of cumulative) {
    if (val > peak) peak = val;
    const drawdown = (peak - val) / Math.abs(peak || 1);
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  }
  
  // Win rate
  const winningTrades = dailyReturns.filter(r => r > 0).length;
  const totalActiveDays = dailyReturns.filter(r => r !== 0).length;
  const winRate = totalActiveDays > 0 ? winningTrades / totalActiveDays : 0;
  
  // Average profit per trade
  const totalProfit = cumulative[cumulative.length - 1] || 0;
  const avgProfitPerTrade = trades > 0 ? totalProfit / (trades / 2) : 0;
  
  return {
    dailyReturns,
    cumulative,
    sharpeRatio,
    totalTrades: Math.floor(trades / 2), // Entry + exit = 1 round trip
    avgProfitPerTrade,
    maxDrawdown,
    winRate
  };
}

// Get signal change points for visualization
export function getSignalChangePoints(
  signals: number[],
  dates: string[],
  zScores: number[]
): { date: string; zScore: number; type: 'long' | 'short' | 'exit' }[] {
  const points: { date: string; zScore: number; type: 'long' | 'short' | 'exit' }[] = [];
  
  for (let i = 1; i < signals.length; i++) {
    if (signals[i] !== signals[i - 1]) {
      if (signals[i] === -1) {
        points.push({ date: dates[i], zScore: zScores[i], type: 'long' });
      } else if (signals[i] === 1) {
        points.push({ date: dates[i], zScore: zScores[i], type: 'short' });
      } else if (signals[i] === 0) {
        points.push({ date: dates[i], zScore: zScores[i], type: 'exit' });
      }
    }
  }
  
  return points;
}
