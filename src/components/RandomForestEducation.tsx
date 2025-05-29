import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TreePine,
  Settings,
  Split,
  Activity,
  Zap,
  Info,
  BarChart2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

export default function RandomForestEducation() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    overview: true,
    parameters: false,
    howitworks: false,
    strengths: false,
    limitations: false,
    tips: false,
  });

  const toggle = (key: string) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <Card className="glass-panel border border-white/5 mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-light tracking-tight">
          <TreePine className="h-6 w-6 text-green-500" />
          Random Forest Education
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">

        {/* Overview */}
        <section>
          <button
            className="flex items-center gap-2 mb-2 text-lg font-semibold text-green-400"
            onClick={() => toggle("overview")}
          >
            {expanded.overview ? <ChevronDown /> : <ChevronRight />}
            <span>What is Random Forest?</span>
          </button>
          {expanded.overview && (
            <div className="pl-8 text-sm text-muted-foreground space-y-3">
              <p>
                <strong>Random Forest</strong> is an ensemble machine learning algorithm that builds multiple decision trees and merges their results to improve accuracy and stability. It is widely used for both classification and regression tasks.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="green">Ensemble</Badge>
                <Badge variant="blue">Bagging</Badge>
                <Badge variant="yellow">Nonlinear</Badge>
                <Badge variant="teal">Feature Importance</Badge>
              </div>
            </div>
          )}
        </section>

        {/* Key Parameters */}
        <section>
          <button
            className="flex items-center gap-2 mb-2 text-lg font-semibold text-blue-400"
            onClick={() => toggle("parameters")}
          >
            {expanded.parameters ? <ChevronDown /> : <ChevronRight />}
            <span>Key Parameters</span>
          </button>
          {expanded.parameters && (
            <div className="pl-8 text-sm text-muted-foreground space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="blue">n_estimators</Badge>
                    <span className="text-xs text-blue-400">Trees</span>
                  </div>
                  <p>
                    Number of trees in the forest. More trees reduce variance but increase computation.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="purple">max_depth</Badge>
                    <span className="text-xs text-purple-400">Tree Depth</span>
                  </div>
                  <p>
                    Maximum depth of each tree. Controls complexity and risk of overfitting.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="teal">max_features</Badge>
                    <span className="text-xs text-teal-400">Features per Split</span>
                  </div>
                  <p>
                    Number of features to consider when looking for the best split. Default is "sqrt" for classification.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="yellow">bootstrap</Badge>
                    <span className="text-xs text-yellow-400">Sampling</span>
                  </div>
                  <p>
                    Whether bootstrap samples are used when building trees. Enables bagging and diversity.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* How It Works */}
        <section>
          <button
            className="flex items-center gap-2 mb-2 text-lg font-semibold text-teal-400"
            onClick={() => toggle("howitworks")}
          >
            {expanded.howitworks ? <ChevronDown /> : <ChevronRight />}
            <span>How Does Random Forest Work?</span>
          </button>
          {expanded.howitworks && (
            <div className="pl-8 text-sm text-muted-foreground space-y-3">
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  <strong>Bagging:</strong> Each tree is trained on a random sample of the data (with replacement).
                </li>
                <li>
                  <strong>Random Feature Selection:</strong> At each split, a random subset of features is considered.
                </li>
                <li>
                  <strong>Tree Growth:</strong> Each tree grows independently, possibly to full depth.
                </li>
                <li>
                  <strong>Ensemble Prediction:</strong> For classification, the majority vote is taken; for regression, the average is used.
                </li>
              </ol>
              <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 p-4 rounded-lg mt-2">
                <span className="font-medium">Result:</span> 
                <span className="ml-2">High accuracy, reduced overfitting, and robust predictions.</span>
              </div>
            </div>
          )}
        </section>

        {/* Strengths */}
        <section>
          <button
            className="flex items-center gap-2 mb-2 text-lg font-semibold text-green-400"
            onClick={() => toggle("strengths")}
          >
            {expanded.strengths ? <ChevronDown /> : <ChevronRight />}
            <span>Strengths</span>
          </button>
          {expanded.strengths && (
            <div className="pl-8 text-sm text-muted-foreground space-y-3">
              <ul className="list-disc list-inside space-y-2">
                <li>Handles missing values and categorical variables well.</li>
                <li>Reduces overfitting compared to single decision trees.</li>
                <li>Provides estimates of feature importance.</li>
                <li>Works well with large datasets and high-dimensional data.</li>
                <li>Can be used for both classification and regression tasks.</li>
              </ul>
            </div>
          )}
        </section>

        {/* Limitations */}
        <section>
          <button
            className="flex items-center gap-2 mb-2 text-lg font-semibold text-red-400"
            onClick={() => toggle("limitations")}
          >
            {expanded.limitations ? <ChevronDown /> : <ChevronRight />}
            <span>Limitations</span>
          </button>
          {expanded.limitations && (
            <div className="pl-8 text-sm text-muted-foreground space-y-3">
              <ul className="list-disc list-inside space-y-2">
                <li>Can be computationally intensive with many trees or large datasets.</li>
                <li>Less interpretable than a single decision tree.</li>
                <li>Predictions can be slow for real-time applications with many trees.</li>
                <li>May not perform well on sparse or highly imbalanced data without tuning.</li>
              </ul>
            </div>
          )}
        </section>

        {/* Tips & Best Practices */}
        <section>
          <button
            className="flex items-center gap-2 mb-2 text-lg font-semibold text-yellow-400"
            onClick={() => toggle("tips")}
          >
            {expanded.tips ? <ChevronDown /> : <ChevronRight />}
            <span>Tips & Best Practices</span>
          </button>
          {expanded.tips && (
            <div className="pl-8 text-sm text-muted-foreground space-y-3">
              <ul className="list-disc list-inside space-y-2">
                <li>Use more trees for greater stability (but watch computation time).</li>
                <li>Limit tree depth to prevent overfitting and improve speed.</li>
                <li>Check feature importance to understand your model and for feature selection.</li>
                <li>Experiment with <span className="text-teal-400 font-medium">max_features</span> and <span className="text-blue-400 font-medium">bootstrap</span> for optimal results.</li>
                <li>Consider using out-of-bag (OOB) error for model validation.</li>
              </ul>
            </div>
          )}
        </section>

        {/* Footer */}
        <div className="pt-6 border-t border-white/10 text-xs text-muted-foreground flex items-center gap-2">
          <Info className="h-4 w-4 text-blue-400" />
          Random Forest is a go-to algorithm for tabular data, offering a strong balance of accuracy and interpretability.
        </div>
      </CardContent>
    </Card>
  );
}
