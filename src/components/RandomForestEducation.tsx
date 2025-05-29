
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  TreePine, 
  BarChart3, 
  Target, 
  TrendingUp, 
  ChevronDown, 
  ChevronRight,
  Info,
  Lightbulb,
  Brain
} from 'lucide-react';

const RandomForestEducation: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    algorithm: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const educationalSections = [
    {
      id: 'algorithm',
      title: 'Random Forest Algorithm',
      icon: <TreePine className="h-5 w-5 text-green-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed">
            Random Forest is an ensemble learning method that combines multiple decision trees to create a more robust and accurate model. 
            It uses two key techniques: <strong>bootstrap aggregating (bagging)</strong> and <strong>random feature selection</strong>.
          </p>
          
          <div className="bg-secondary/20 p-4 rounded-lg space-y-2">
            <h4 className="font-medium text-sm">Key Components:</h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
              <li><strong>Bootstrap Sampling:</strong> Each tree is trained on a random sample with replacement</li>
              <li><strong>Feature Randomness:</strong> Each split considers only a random subset of features</li>
              <li><strong>Majority Voting:</strong> Final prediction is the majority vote of all trees</li>
              <li><strong>Out-of-Bag Error:</strong> Built-in validation using unused samples</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'parameters',
      title: 'Parameter Guide',
      icon: <BarChart3 className="h-5 w-5 text-blue-400" />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="p-3 bg-accent/10 rounded-lg">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <Badge variant="outline">n_estimators</Badge>
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Number of trees in the forest. More trees generally improve performance but increase computation time.
                  Typical range: 10-1000.
                </p>
              </div>
              
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <Badge variant="outline">max_depth</Badge>
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Maximum depth of individual trees. Deeper trees can capture more complex patterns but may overfit.
                  Typical range: 3-15.
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <Badge variant="outline">max_features</Badge>
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Number of features to consider for each split. 'sqrt' uses √(total features), 'log2' uses log₂(total features).
                </p>
              </div>
              
              <div className="p-3 bg-teal-500/10 rounded-lg">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <Badge variant="outline">test_size</Badge>
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Proportion of data used for testing. Larger test sets provide more reliable performance estimates.
                  Typical range: 0.2-0.3.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'metrics',
      title: 'Understanding Metrics',
      icon: <Target className="h-5 w-5 text-purple-400" />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <h4 className="font-medium">Accuracy</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  (TP + TN) / (TP + TN + FP + FN)<br/>
                  Overall correctness of the model.
                </p>
              </div>
              
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <h4 className="font-medium">Precision</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  TP / (TP + FP)<br/>
                  Of predicted positives, how many were correct?
                </p>
              </div>
              
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <h4 className="font-medium">Recall (Sensitivity)</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  TP / (TP + FN)<br/>
                  Of actual positives, how many were found?
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <h4 className="font-medium">F1-Score</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  2 × (Precision × Recall) / (Precision + Recall)<br/>
                  Harmonic mean of precision and recall.
                </p>
              </div>
              
              <div className="p-3 bg-red-500/10 rounded-lg">
                <h4 className="font-medium">AUC-ROC</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Area Under the ROC Curve<br/>
                  Measures separability between classes.
                </p>
              </div>
              
              <div className="p-3 bg-gray-500/10 rounded-lg">
                <h4 className="font-medium">Confusion Matrix</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Shows true vs predicted classifications<br/>
                  Diagonal = correct predictions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'interpretation',
      title: 'Chart Interpretation',
      icon: <TrendingUp className="h-5 w-5 text-orange-400" />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <h4 className="font-medium text-sm">Feature Importance</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Shows which features contribute most to predictions. Higher values indicate more important features for the model's decisions.
                </p>
              </div>
              
              <div className="p-3 bg-green-500/10 rounded-lg">
                <h4 className="font-medium text-sm">ROC Curve</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Plots True Positive Rate vs False Positive Rate. A curve closer to the top-left corner indicates better performance.
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <h4 className="font-medium text-sm">Prediction Probabilities</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Shows the model's confidence in its prediction for a sample case. Higher probability indicates more certainty.
                </p>
              </div>
              
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <h4 className="font-medium text-sm">Confusion Matrix</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Green squares show correct predictions, red squares show errors. Larger numbers on the diagonal indicate better performance.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'tips',
      title: 'Optimization Tips',
      icon: <Lightbulb className="h-5 w-5 text-yellow-400" />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <h4 className="font-medium text-sm">🚀 Performance Tips</h4>
                <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                  <li>• Start with 50-100 trees</li>
                  <li>• Use 'sqrt' for max_features</li>
                  <li>• Limit max_depth to prevent overfitting</li>
                  <li>• Increase trees if underfitting</li>
                </ul>
              </div>
              
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <h4 className="font-medium text-sm">⚡ Speed Tips</h4>
                <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                  <li>• Reduce max_depth for faster training</li>
                  <li>• Use smaller max_features values</li>
                  <li>• Consider feature selection</li>
                  <li>• Use parallel processing</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <h4 className="font-medium text-sm">🎯 Accuracy Tips</h4>
                <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                  <li>• Balance your dataset</li>
                  <li>• Try different max_features settings</li>
                  <li>• Use cross-validation</li>
                  <li>• Consider feature engineering</li>
                </ul>
              </div>
              
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <h4 className="font-medium text-sm">🔍 Debugging Tips</h4>
                <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                  <li>• Check feature importance rankings</li>
                  <li>• Examine individual tree predictions</li>
                  <li>• Analyze prediction probabilities</li>
                  <li>• Look for class imbalance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <Card className="glass-panel border-white/10">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-accent" />
          Random Forest Guide
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {educationalSections.map((section) => (
          <div key={section.id} className="border border-white/10 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                {section.icon}
                <span className="font-medium">{section.title}</span>
              </div>
              {expandedSections[section.id] ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            
            {expandedSections[section.id] && (
              <div className="p-4 pt-0 border-t border-white/10">
                {section.content}
              </div>
            )}
          </div>
        ))}
        
        <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Dataset Information</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This visualization uses a synthetic breast cancer dataset similar to the famous Wisconsin Breast Cancer dataset. 
                The model classifies tumors as either <strong>benign</strong> (non-cancerous) or <strong>malignant</strong> (cancerous) 
                based on various cellular features like radius, texture, perimeter, and other morphological characteristics.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RandomForestEducation;
