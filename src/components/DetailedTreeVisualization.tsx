import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, TreePine, BarChart3, Target } from 'lucide-react';

interface TreeData {
  tree_index: number;
  decision_nodes: number;
  leaf_nodes: number;
  actual_depth: number;
  decision_path: Array<{
    step: number;
    feature: string;
    threshold: number;
    condition: string;
  }>;
  tree_accuracy: number;
  training_samples: number;
  feature_names: string[];
}

interface DetailedTreeVisualizationProps {
  treeData: TreeData | null;
  totalTrees: number;
  onTreeIndexChange: (index: number) => void;
  maxDepth: number;
  maxFeatures: string;
}

const DetailedTreeVisualization: React.FC<DetailedTreeVisualizationProps> = ({
  treeData,
  totalTrees,
  onTreeIndexChange,
  maxDepth,
  maxFeatures
}) => {
  if (!treeData) {
    return (
      <Card className="glass-panel border-white/10">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-secondary/30 rounded w-3/4 mb-4"></div>
            <div className="h-32 bg-secondary/20 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handlePrevTree = () => {
    const newIndex = Math.max(0, treeData.tree_index - 1);
    onTreeIndexChange(newIndex);
  };

  const handleNextTree = () => {
    const newIndex = Math.min(totalTrees - 1, treeData.tree_index + 1);
    onTreeIndexChange(newIndex);
  };

  const handleFinalPrediction = () => {
    // Simulate navigating to final prediction or showing prediction details
    console.log('Final prediction clicked for tree', treeData.tree_index);
    // You can add toast notification or modal here
  };

  return (
    <Card className="glass-panel border-white/10">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TreePine className="h-5 w-5 text-green-400" />
            Decision Tree #{treeData.tree_index} Analysis
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevTree}
              disabled={treeData.tree_index === 0}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground px-2">
              {treeData.tree_index + 1} / {totalTrees}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextTree}
              disabled={treeData.tree_index === totalTrees - 1}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Tree Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-blue-400 mb-1">
              {treeData.decision_nodes + treeData.leaf_nodes}
            </div>
            <div className="text-xs text-muted-foreground">Total Nodes</div>
          </div>
          
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-green-400 mb-1">
              {treeData.decision_nodes}
            </div>
            <div className="text-xs text-muted-foreground">Decision Nodes</div>
          </div>
          
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-purple-400 mb-1">
              {treeData.leaf_nodes}
            </div>
            <div className="text-xs text-muted-foreground">Leaf Nodes</div>
          </div>
          
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-orange-400 mb-1">
              {treeData.actual_depth}
            </div>
            <div className="text-xs text-muted-foreground">Max Depth</div>
          </div>
          
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-red-400 mb-1">
              {(treeData.tree_accuracy * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">Tree Accuracy</div>
          </div>
        </div>

        {/* Sample Decision Path */}
        <div>
          <h4 className="text-blue-400 text-lg font-semibold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Sample Decision Path
          </h4>
          
          <div className="space-y-3">
            {treeData.decision_path.map((step, index) => (
              <div key={step.step}>
                <div className="bg-secondary/30 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                        {step.step}
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          {step.feature}
                        </div>
                        <div className="text-blue-400 text-sm">
                          {step.condition}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-muted-foreground text-sm">
                        Threshold: <span className="text-orange-400 font-semibold">{step.threshold}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {index < treeData.decision_path.length - 1 && (
                  <div className="flex justify-center py-1">
                    <div className="text-blue-400 text-lg">â†“</div>
                  </div>
                )}
              </div>
            ))}
            
            {treeData.decision_path.length > 0 && (
              <Button
                onClick={handleFinalPrediction}
                className="w-full bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20"
                variant="outline"
              >
                â†’ Final Prediction
              </Button>
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
            <div className="text-xl font-bold text-green-400 mb-1">
              {treeData.tree_accuracy.toFixed(3)}
            </div>
            <div className="text-sm text-muted-foreground">Individual Accuracy</div>
          </div>
          
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
            <div className="text-xl font-bold text-blue-400 mb-1">
              {treeData.training_samples}
            </div>
            <div className="text-sm text-muted-foreground">Training Samples</div>
          </div>
        </div>

        {/* Tree Configuration */}
        <div className="bg-secondary/20 border border-white/10 rounded-lg p-4">
          <div className="text-center text-muted-foreground text-sm">
            <div className="mb-2">
              <span className="text-blue-400 font-semibold">Max Features Strategy:</span> {maxFeatures}
            </div>
            <div>
              <span className="text-green-400 font-semibold">Max Depth Limit:</span> {maxDepth}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailedTreeVisualization;
