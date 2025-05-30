import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RandomForestState, RandomForestParams, TreeData } from '@/utils/randomForest';
import TreeVisualization from './TreeVisualization';
import DataValidation from './DataValidation';
import DetailedTreeVisualization from './DetailedTreeVisualization';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { BarChart3, TrendingUp, PieChart as PieChartIcon, Target, AlertTriangle, Info } from 'lucide-react';

interface RandomForestVisualizationProps {
  state: Omit<RandomForestState, 'selectedTreeIndex'>;
  params: RandomForestParams;
  selectedTreeIndex: number;
  treeData: TreeData | null;
  isLoadingTree: boolean;
  onTreeIndexChange: (index: number) => void;
}

const RandomForestVisualization: React.FC<RandomForestVisualizationProps> = ({
  state,
  params,
  selectedTreeIndex,
  treeData,
  isLoadingTree,
  onTreeIndexChange,
}) => {
  const chartConfig = {
    importance: {
      label: "Importance",
      color: "hsl(var(--accent))",
    },
    benign: {
      label: "Benign",
      color: "hsl(142, 76%, 36%)",
    },
    malignant: {
      label: "Malignant",
      color: "hsl(346, 87%, 43%)",
    },
    roc: {
      label: "ROC Curve",
      color: "hsl(var(--accent))",
    },
    random: {
      label: "Random",
      color: "hsl(var(--muted-foreground))",
    },
  };

  const featureImportanceData = state.feature_importances?.map(item => ({
    feature: item.feature.length > 15 ? item.feature.substring(0, 15) + '...' : item.feature,
    importance: item.importance,
    fullFeature: item.feature
  })) || [];

  const rocData = state.roc_data ? 
    state.roc_data.fpr.map((fpr, index) => ({
      fpr,
      tpr: state.roc_data!.tpr[index],
      random: fpr // Diagonal reference line
    })) : [];

  const predictionData = state.prediction_probabilities ? [
    { label: 'Benign', probability: state.prediction_probabilities.probabilities[0] },
    { label: 'Malignant', probability: state.prediction_probabilities.probabilities[1] },
  ] : [];

  // FIXED: ROC curve validation with realistic thresholds
  const aucWarning = state.roc_data && state.roc_data.auc > 0.9;
  const aucColor = state.roc_data ? (
    state.roc_data.auc >= 0.9 ? '#ef4444' :  // Red for suspicious
    state.roc_data.auc >= 0.8 ? '#22c55e' :  // Green for excellent
    state.roc_data.auc >= 0.7 ? '#f59e0b' :  // Yellow for good
    '#6b7280'                                // Gray for fair
  ) : '#6b7280';

  if (!state.currentModel) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="glass-panel border-white/10">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-secondary/30 rounded w-3/4 mb-4"></div>
                <div className="h-32 bg-secondary/20 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Data Quality Validation */}
        {state.modelMetrics && (
          <div className="md:col-span-2">
            <DataValidation metrics={state.modelMetrics} />
          </div>
        )}

        {/* Feature Importance */}
        <Card className="glass-panel border-white/10">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-accent" />
              Feature Importance
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-blue-400 cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>
                  <div>
                    <strong>Feature Importance:</strong><br />
                    Shows which input features most influenced the model's predictions. Higher bars mean the feature had a greater impact on the Random Forest's decisions.
                  </div>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64">
              <ResponsiveContainer>
                <BarChart data={featureImportanceData} margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="feature" 
                    angle={-45} 
                    textAnchor="end" 
                    height={80}
                    fontSize={10}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    labelFormatter={(label, payload) => {
                      const item = featureImportanceData.find(d => d.feature === label);
                      return item?.fullFeature || label;
                    }}
                  />
                  <Bar dataKey="importance" fill="var(--color-importance)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Prediction Probabilities */}
        <Card className="glass-panel border-white/10">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-blue-400" />
              Sample Prediction
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-blue-400 cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>
                  <div>
                    <strong>Sample Prediction:</strong><br />
                    Displays the model's predicted class and confidence for a single example.<br /><br />
                    <span style={{ color: '#22c55e' }}>Green:</span> Probability of being Benign<br />
                    <span style={{ color: '#ef4444' }}>Red:</span> Probability of being Malignant<br /><br />
                    <strong>Dataset:</strong><br />
                    This visualization uses the Breast Cancer Wisconsin (Diagnostic) Dataset, which contains 569 samples of breast tumor measurements used to predict whether a tumor is benign or malignant.
                  </div>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={predictionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="probability"
                    nameKey="label"
                    label={({ label, probability }) => `${label}: ${(probability * 100).toFixed(1)}%`}
                  >
                    <Cell fill="var(--color-benign)" />
                    <Cell fill="var(--color-malignant)" />
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            {state.prediction_probabilities && (
              <div className="mt-4 p-3 bg-secondary/20 rounded-lg">
                <div className="text-sm space-y-1">
                  <p><span className="text-muted-foreground">True Label:</span> {state.prediction_probabilities.true_label}</p>
                  <p><span className="text-muted-foreground">Predicted:</span> {state.prediction_probabilities.predicted_label}</p>
                  <p><span className="text-muted-foreground">Confidence:</span> {(state.prediction_probabilities.confidence * 100).toFixed(1)}%</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ROC Curve - FIXED with realistic validation */}
        <Card className="glass-panel border-white/10">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-400" />
              ROC Curve Analysis
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-blue-400 cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>
                  <div>
                    <strong>ROC Curve (Receiver Operating Characteristic):</strong><br />
                    Illustrates the trade-off between true positive rate and false positive rate at various thresholds.<br />
                    The AUC (Area Under Curve) summarizes the model's ability to distinguish between classes (1.0 = perfect, 0.5 = random).
                  </div>
                </TooltipContent>
              </Tooltip>
              {state.roc_data && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-normal text-muted-foreground">
                    (AUC = {state.roc_data.auc.toFixed(3)})
                  </span>
                  {aucWarning && (
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  )}
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64">
              <ResponsiveContainer>
                <LineChart data={rocData} margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="fpr" 
                    domain={[0, 1]}
                    type="number"
                    stroke="hsl(var(--muted-foreground))"
                    label={{ value: 'False Positive Rate', position: 'insideBottom', offset: -10 }}
                  />
                  <YAxis 
                    domain={[0, 1]}
                    stroke="hsl(var(--muted-foreground))"
                    label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft' }}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value: number, name: string) => [
                      `${(value * 100).toFixed(1)}%`,
                      name === 'tpr' ? 'True Positive Rate' : 
                      name === 'random' ? 'Random Classifier' : name
                    ]}
                  />
                  <Line 
                    dataKey="tpr" 
                    stroke={aucColor}
                    strokeWidth={3}
                    dot={false}
                    name={`ROC Curve (AUC = ${state.roc_data?.auc.toFixed(3) || 'N/A'})`}
                  />
                  <Line
                    dataKey="random"
                    stroke="var(--color-random)"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    dot={false}
                    name="Random Classifier"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
            {aucWarning && (
              <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded text-yellow-300 text-xs">
                ⚠️ AUC &gt; 0.9 may indicate overfitting or data leakage
              </div>
            )}
            
            {/* Performance Interpretation */}
            <div className="mt-3 p-3 bg-secondary/20 rounded-lg">
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Performance:</span>
                  <span style={{ color: aucColor }}>
                    {state.roc_data?.auc >= 0.9 ? 'Excellent (Suspicious)' :
                     state.roc_data?.auc >= 0.8 ? 'Excellent' :
                     state.roc_data?.auc >= 0.7 ? 'Good' :
                     state.roc_data?.auc >= 0.6 ? 'Fair' : 'Poor'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className={aucWarning ? 'text-yellow-400' : 'text-green-400'}>
                    {aucWarning ? 'Check for overfitting' : 'Realistic performance'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Confusion Matrix */}
        <Card className="glass-panel border-white/10">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-400" />
              Confusion Matrix
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-blue-400 cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>
                  <div>
                    <strong>Confusion Matrix:</strong><br />
                    Shows how many predictions were correct or incorrect for each class.<br /><br />
                    <strong>Diagonal cells:</strong> Correct predictions<br />
                    <strong>Off-diagonal cells:</strong> Misclassifications<br />
                    Useful for understanding model errors.
                  </div>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              {state.confusion_matrix && (
                <div className="grid grid-cols-2 gap-4 text-center relative">
                  <div className="text-sm text-muted-foreground col-span-2 mb-2">
                    Predicted →
                  </div>
                  <div className="text-sm text-muted-foreground absolute -left-8 top-1/2 transform -rotate-90">
                    Actual →
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">Benign</div>
                    <div className="w-16 h-16 bg-green-500/20 border-2 border-green-500/40 rounded-lg flex items-center justify-center">
                      <span className="font-bold text-lg">{state.confusion_matrix[0][0]}</span>
                    </div>
                    <div className="w-16 h-16 bg-red-500/20 border-2 border-red-500/40 rounded-lg flex items-center justify-center">
                      <span className="font-bold text-lg">{state.confusion_matrix[1][0]}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">Malignant</div>
                    <div className="w-16 h-16 bg-red-500/20 border-2 border-red-500/40 rounded-lg flex items-center justify-center">
                      <span className="font-bold text-lg">{state.confusion_matrix[0][1]}</span>
                    </div>
                    <div className="w-16 h-16 bg-green-500/20 border-2 border-green-500/40 rounded-lg flex items-center justify-center">
                      <span className="font-bold text-lg">{state.confusion_matrix[1][1]}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Tree Structure Visualization */}
        <div className="md:col-span-2">
          <DetailedTreeVisualization
            treeData={treeData}
            totalTrees={params.n_estimators}
            onTreeIndexChange={onTreeIndexChange}
            maxDepth={params.max_depth}
            maxFeatures={params.max_features}
            selectedTreeIndex={selectedTreeIndex}
            isLoadingTree={isLoadingTree}
          />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default RandomForestVisualization;
