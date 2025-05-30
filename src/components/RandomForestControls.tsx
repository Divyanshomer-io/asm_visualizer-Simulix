import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RandomForestParams, RandomForestState } from '@/utils/randomForest';
import { Play, RotateCcw, TreePine, Settings, BarChart3 } from 'lucide-react';

interface RandomForestControlsProps {
  params: RandomForestParams;
  state: Omit<RandomForestState, 'selectedTreeIndex'>;
  selectedTreeIndex: number;
  onParamChange: (params: Partial<RandomForestParams>) => void;
  onTreeIndexChange: (index: number) => void;
  onTrain: () => void;
  onReset: () => void;
}

const RandomForestControls: React.FC<RandomForestControlsProps> = ({
  params,
  state,
  selectedTreeIndex,
  onParamChange,
  onTreeIndexChange,
  onTrain,
  onReset,
}) => {
  return (
    <div className="space-y-6">
      {/* Model Parameters */}
      <Card className="glass-panel border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="h-5 w-5 text-accent" />
            Model Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Number of Trees */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Number of Trees</label>
              <Badge variant="secondary">{params.n_estimators}</Badge>
            </div>
            <Slider
              value={[params.n_estimators]}
              onValueChange={([value]) => onParamChange({ n_estimators: value })}
              min={1}
              max={100}
              step={1}
              className="w-full"
              disabled={state.isTraining}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1</span>
              <span>100</span>
            </div>
          </div>

          {/* Max Depth */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Max Depth</label>
              <Badge variant="secondary">{params.max_depth}</Badge>
            </div>
            <Slider
              value={[params.max_depth]}
              onValueChange={([value]) => onParamChange({ max_depth: value })}
              min={1}
              max={15}
              step={1}
              className="w-full"
              disabled={state.isTraining}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1</span>
              <span>15</span>
            </div>
          </div>

          {/* Test Size */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Test Size</label>
              <Badge variant="secondary">{(params.test_size * 100).toFixed(0)}%</Badge>
            </div>
            <Slider
              value={[params.test_size]}
              onValueChange={([value]) => onParamChange({ test_size: value })}
              min={0.1}
              max={0.5}
              step={0.05}
              className="w-full"
              disabled={state.isTraining}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>10%</span>
              <span>50%</span>
            </div>
          </div>

          {/* Max Features */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Max Features Strategy</label>
            <div className="grid grid-cols-3 gap-2">
              {(['sqrt', 'log2', 'auto'] as const).map((strategy) => (
                <button
                  key={strategy}
                  onClick={() => onParamChange({ max_features: strategy })}
                  disabled={state.isTraining}
                  className={`px-3 py-2 text-xs rounded-md border transition-all ${
                    params.max_features === strategy
                      ? 'bg-accent/20 border-accent/40 text-accent'
                      : 'bg-secondary/30 border-white/10 hover:bg-secondary/50'
                  }`}
                >
                  {strategy}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card className="glass-panel border-white/10">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <Button 
              onClick={onTrain} 
              disabled={state.isTraining}
              className="w-full bg-accent/20 hover:bg-accent/30 border border-accent/40"
            >
              <Play className="h-4 w-4 mr-2" />
              {state.isTraining ? 'Training...' : 'Train Model'}
            </Button>
            
            <Button 
              onClick={onReset}
              disabled={state.isTraining}
              variant="outline"
              className="w-full"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Parameters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tree Selector */}
      {state.currentModel && (
        <Card className="glass-panel border-white/10">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TreePine className="h-5 w-5 text-green-400" />
              Tree Selector
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Selected Tree</label>
                <Badge variant="secondary">{selectedTreeIndex}</Badge>
              </div>
              <Slider
                value={[selectedTreeIndex]}
                onValueChange={([value]) => onTreeIndexChange(value)}
                min={0}
                max={params.n_estimators - 1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>{params.n_estimators - 1}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Model Metrics */}
      {state.modelMetrics && (
        <Card className="glass-panel border-white/10">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-blue-400" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Accuracy:</span>
                <span className="font-mono">{state.modelMetrics.accuracy.toFixed(3)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Precision:</span>
                <span className="font-mono">{state.modelMetrics.precision.toFixed(3)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Recall:</span>
                <span className="font-mono">{state.modelMetrics.recall.toFixed(3)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">F1-Score:</span>
                <span className="font-mono">{state.modelMetrics.f1_score.toFixed(3)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">AUC-ROC:</span>
                <span className="font-mono">{state.modelMetrics.auc_roc.toFixed(3)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Test Size:</span>
                <span className="font-mono">{state.modelMetrics.test_samples}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RandomForestControls;
