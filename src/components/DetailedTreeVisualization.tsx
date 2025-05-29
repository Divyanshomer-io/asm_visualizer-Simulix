import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  TreePine,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Target,
  Zap,
  Info
} from 'lucide-react';

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
  feature_importances?: number[];
  oob_score?: number;
  max_features?: string;
}

interface RandomForestEducationProps {
  treeData: TreeData | null;
  totalTrees: number;
  currentTreeIndex: number;
  onTreeIndexChange: (index: number) => void;
  finalPrediction?: string;
}

const RandomForestEducation: React.FC<RandomForestEducationProps> = ({
  treeData,
  totalTrees,
  currentTreeIndex,
  onTreeIndexChange,
  finalPrediction = "Not Available"
}) => {
  const [showFinalPrediction, setShowFinalPrediction] = useState(false);

  const handlePreviousTree = (e: React.MouseEvent) => {
    e.preventDefault();
    const newIndex = Math.max(0, currentTreeIndex - 1);
    onTreeIndexChange(newIndex);
  };

  const handleNextTree = (e: React.MouseEvent) => {
    e.preventDefault();
    const newIndex = Math.min(totalTrees - 1, currentTreeIndex + 1);
    onTreeIndexChange(newIndex);
  };

  const handleFinalPrediction = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowFinalPrediction(!showFinalPrediction);
  };

  if (!treeData) {
    return (
      <Card className="glass-panel border border-white/5">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-700 rounded w-1/4"></div>
            <div className="h-32 bg-gray-800 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-panel border border-white/5">
      <CardHeader className="border-b border-white/5">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TreePine className="h-6 w-6 text-green-400" />
            <span>Random Forest Analysis</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePreviousTree}
              disabled={currentTreeIndex === 0}
              aria-label="Previous tree"
              className="hover:bg-white/10"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              Tree {currentTreeIndex + 1} of {totalTrees}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextTree}
              disabled={currentTreeIndex === totalTrees - 1}
              aria-label="Next tree"
              className="hover:bg-white/10"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Tree Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
            <div className="text-2xl font-bold text-blue-400">
              {treeData.decision_nodes + treeData.leaf_nodes}
            </div>
            <div className="text-xs text-muted-foreground">Total Nodes</div>
          </div>
          <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/20">
            <div className="text-2xl font-bold text-green-400">
              {treeData.decision_nodes}
            </div>
            <div className="text-xs text-muted-foreground">Decision Nodes</div>
          </div>
          <div className="bg-purple-500/10 p-3 rounded-lg border border-purple-500/20">
            <div className="text-2xl font-bold text-purple-400">
              {treeData.leaf_nodes}
            </div>
            <div className="text-xs text-muted-foreground">Leaf Nodes</div>
          </div>
          <div className="bg-orange-500/10 p-3 rounded-lg border border-orange-500/20">
            <div className="text-2xl font-bold text-orange-400">
              {treeData.actual_depth}
            </div>
            <div className="text-xs text-muted-foreground">Max Depth</div>
          </div>
          <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/20">
            <div className="text-2xl font-bold text-red-400">
              {(treeData.tree_accuracy * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">Tree Accuracy</div>
          </div>
        </div>

        {/* Decision Path */}
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
            <Target className="h-5 w-5 text-blue-400" />
            Decision Path Analysis
          </h3>
          <div className="space-y-3">
            {treeData.decision_path.map((step) => (
              <div 
                key={step.step}
                className="bg-gray-800/50 p-4 rounded-lg border border-white/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500/10 px-2 py-1 rounded-full text-sm font-medium text-blue-400">
                      Step {step.step}
                    </div>
                    <div>
                      <div className="font-medium">{step.feature}</div>
                      <div className="text-sm text-muted-foreground">
                        {step.condition}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-orange-400">
                    Threshold: {step.threshold.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final Prediction Section */}
        <div>
          <Button
            variant="outline"
            className="w-full bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/30"
            onClick={handleFinalPrediction}
          >
            <Zap className="h-4 w-4 mr-2" />
            {showFinalPrediction ? 'Hide Final Prediction' : 'Show Final Prediction'}
          </Button>
          
          {showFinalPrediction && (
            <div className="mt-4 bg-gray-800/50 p-4 rounded-lg border border-white/10">
              <div className="flex items-center gap-2 text-green-400">
                <BarChart3 className="h-5 w-5" />
                <span className="font-medium">Final Prediction:</span>
                <span>{finalPrediction}</span>
              </div>
              {treeData.oob_score && (
                <div className="mt-2 flex items-center gap-2 text-blue-400">
                  <Info className="h-4 w-4" />
                  <span className="text-sm">OOB Score: {(treeData.oob_score * 100).toFixed(1)}%</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RandomForestEducation;
