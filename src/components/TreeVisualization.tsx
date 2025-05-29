
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TreeData } from '@/utils/randomForest';
import { TreePine, Network } from 'lucide-react';

interface TreeVisualizationProps {
  treeData: TreeData;
  treeIndex: number;
  totalTrees: number;
  maxDepth: number;
  maxFeatures: string;
}

const TreeVisualization: React.FC<TreeVisualizationProps> = ({
  treeData,
  treeIndex,
  totalTrees,
  maxDepth,
  maxFeatures
}) => {
  if (!treeData) {
    return (
      <Card className="glass-panel border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <TreePine className="h-5 w-5 text-green-400" />
            Decision Tree Structure (Tree #{treeIndex})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center space-y-4">
              <Network className="h-16 w-16 mx-auto text-muted-foreground" />
              <div className="text-muted-foreground">
                <p className="text-lg font-medium">Loading Tree Data...</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-panel border-white/10">
      {/* Header */}
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TreePine className="h-5 w-5 text-green-400" />
            Decision Tree #{treeIndex} (WORKING)
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {treeIndex + 1} of {totalTrees}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Tree Structure Analysis */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TreePine className="h-5 w-5 text-green-400" />
            <h4 className="text-accent text-lg font-semibold">Tree Structure Analysis</h4>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Decision Nodes */}
            <div className="bg-blue-500/20 border border-blue-500/40 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {treeData.decision_nodes}
              </div>
              <div className="text-sm text-muted-foreground">Decision Nodes</div>
            </div>
            
            {/* Leaf Nodes */}
            <div className="bg-green-500/20 border border-green-500/40 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {treeData.leaf_nodes}
              </div>
              <div className="text-sm text-muted-foreground">Leaf Nodes</div>
            </div>
            
            {/* Actual Depth */}
            <div className="bg-orange-500/20 border border-orange-500/40 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-400 mb-1">
                {treeData.actual_depth}
              </div>
              <div className="text-sm text-muted-foreground">Actual Depth</div>
            </div>
          </div>
        </div>

        {/* Sample Decision Path */}
        <div>
          <h4 className="text-accent text-lg font-semibold mb-4">Sample Decision Path</h4>
          <div className="space-y-3">
            {treeData.decision_path.length > 0 ? (
              treeData.decision_path.map((step, index) => (
                <div 
                  key={step.step}
                  className="bg-secondary/20 border border-white/10 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-accent text-accent-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                    <div className="text-foreground font-medium">
                      {step.feature} {step.condition}
                    </div>
                  </div>
                  <div className="text-accent text-sm">
                    {index < treeData.decision_path.length - 1 ? '→ Continue' : '→ Prediction'}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-4">
                No decision path data available
              </div>
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-500/20 border border-green-500/40 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {treeData.tree_accuracy.toFixed(3)}
            </div>
            <div className="text-sm text-muted-foreground">Individual Tree Accuracy</div>
          </div>
          
          <div className="bg-blue-500/20 border border-blue-500/40 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {treeData.training_samples}
            </div>
            <div className="text-sm text-muted-foreground">Training Samples Used</div>
          </div>
        </div>

        {/* Tree Configuration */}
        <div className="text-center text-muted-foreground text-sm">
          This tree uses <span className="text-accent font-semibold">{maxFeatures}</span> features per split based on the '<span className="text-green-400">{maxFeatures}</span>' strategy.
        </div>
      </CardContent>
    </Card>
  );
};

export default TreeVisualization;
