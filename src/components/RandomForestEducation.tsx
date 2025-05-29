import React, { useState } from 'react';
import { 
  TreePine, 
  Settings, 
  Split, 
  Activity, 
  BarChart3, 
  Lightbulb,
  Info
} from 'lucide-react';

const RandomForestEducation: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Info className="h-4 w-4" /> },
    { id: 'architecture', label: 'Architecture', icon: <TreePine className="h-4 w-4" /> },
    { id: 'parameters', label: 'Parameters', icon: <Settings className="h-4 w-4" /> },
    { id: 'training', label: 'Training', icon: <Activity className="h-4 w-4" /> },
    { id: 'metrics', label: 'Metrics', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'tips', label: 'Tips', icon: <Lightbulb className="h-4 w-4" /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Header Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <TreePine className="h-6 w-6 text-green-400" />
                <h2 className="text-2xl font-semibold text-white">Random Forest Fundamentals</h2>
              </div>
              <p className="text-gray-400">Understanding the basics of ensemble decision tree learning</p>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">What is a Random Forest?</h3>
                <p className="text-gray-300 leading-relaxed">
                  A Random Forest is an ensemble machine learning algorithm that combines multiple decision trees 
                  to create more accurate and robust predictions. It uses bagging and random feature selection 
                  to reduce overfitting and improve generalization.
                </p>
                <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 p-4 rounded-lg border border-white/10">
                  <p className="text-sm text-gray-300">
                    <strong className="text-green-400">Key Components:</strong> Individual decision trees, bootstrap sampling, 
                    random feature selection, majority voting (classification) or averaging (regression).
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">How It Works</h3>
                <p className="text-gray-300 leading-relaxed">
                  Random Forest builds multiple trees on different subsets of data and features. Each tree 
                  votes on the final prediction, creating a democratic decision-making process that's more 
                  reliable than any single tree.
                </p>
                <div className="bg-gray-800/50 p-4 rounded-lg border border-white/10">
                  <code className="text-sm text-blue-300 font-mono">
                    prediction = majority_vote(tree1, tree2, ..., treeN)
                  </code>
                </div>
              </div>
            </div>

            {/* Ensemble Learning Process */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white">Ensemble Learning Process</h3>
              <p className="text-gray-300">
                The Random Forest algorithm combines bagging with random feature selection to create diverse trees 
                that work together for superior performance compared to individual decision trees.
              </p>

              {/* Three Key Components */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Bootstrap Sampling */}
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 p-6 rounded-lg border border-blue-500/30">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Split className="h-5 w-5 text-blue-400" />
                      <h4 className="font-semibold text-blue-300">Bootstrap Sampling</h4>
                    </div>
                    <p className="text-sm text-gray-300">
                      Creates diverse training sets by sampling with replacement from original data, 
                      ensuring each tree sees different patterns.
                    </p>
                    <div className="text-xs text-blue-400 font-mono">
                      ~63% unique samples per tree
                    </div>
                  </div>
                </div>

                {/* Random Features */}
                <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 p-6 rounded-lg border border-orange-500/30">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-orange-400" />
                      <h4 className="font-semibold text-orange-300">Random Features</h4>
                    </div>
                    <p className="text-sm text-gray-300">
                      At each split, only a random subset of features is considered, 
                      preventing strong features from dominating all trees.
                    </p>
                    <div className="text-xs text-orange-400 font-mono">
                      √(total_features) for classification
                    </div>
                  </div>
                </div>

                {/* Voting System */}
                <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 p-6 rounded-lg border border-green-500/30">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-green-400" />
                      <h4 className="font-semibold text-green-300">Ensemble Voting</h4>
                    </div>
                    <p className="text-sm text-gray-300">
                      Combines predictions from all trees through majority voting (classification) 
                      or averaging (regression) for final output.
                    </p>
                    <div className="text-xs text-green-400 font-mono">
                      Democracy of trees
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'architecture':
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Random Forest Architecture</h2>
              <p className="text-gray-400">Structure and components of the ensemble</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white">Forest Structure</h3>
                <div className="space-y-4">
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-white/10">
                    <h4 className="text-green-400 font-semibold mb-2">Individual Trees</h4>
                    <p className="text-sm text-gray-300">Each tree is a complete decision tree trained on bootstrap sample</p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-white/10">
                    <h4 className="text-blue-400 font-semibold mb-2">Diversity Mechanisms</h4>
                    <p className="text-sm text-gray-300">Bootstrap sampling + random feature selection ensure tree diversity</p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-white/10">
                    <h4 className="text-purple-400 font-semibold mb-2">Aggregation Layer</h4>
                    <p className="text-sm text-gray-300">Combines all tree predictions into final ensemble decision</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white">Key Benefits</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    <span className="text-sm">Reduces overfitting through ensemble averaging</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    <span className="text-sm">Handles missing values and mixed data types</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    <span className="text-sm">Provides feature importance rankings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400">•</span>
                    <span className="text-sm">Scales well to large datasets</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'parameters':
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Key Parameters</h2>
              <p className="text-gray-400">Essential hyperparameters for Random Forest tuning</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-500/10 p-6 rounded-lg border border-blue-500/30">
                <h4 className="text-blue-300 font-semibold mb-3">n_estimators</h4>
                <p className="text-sm text-gray-300 mb-2">Number of trees in the forest</p>
                <div className="text-xs text-blue-400">Default: 100 | Range: 10-1000+</div>
                <p className="text-xs text-gray-400 mt-2">More trees = better performance but slower training</p>
              </div>

              <div className="bg-purple-500/10 p-6 rounded-lg border border-purple-500/30">
                <h4 className="text-purple-300 font-semibold mb-3">max_depth</h4>
                <p className="text-sm text-gray-300 mb-2">Maximum depth of each tree</p>
                <div className="text-xs text-purple-400">Default: None | Range: 1-20</div>
                <p className="text-xs text-gray-400 mt-2">Controls overfitting - deeper trees memorize training data</p>
              </div>

              <div className="bg-teal-500/10 p-6 rounded-lg border border-teal-500/30">
                <h4 className="text-teal-300 font-semibold mb-3">max_features</h4>
                <p className="text-sm text-gray-300 mb-2">Features considered per split</p>
                <div className="text-xs text-teal-400">Default: 'sqrt' | Options: 'sqrt', 'log2', int</div>
                <p className="text-xs text-gray-400 mt-2">Controls randomness and tree diversity</p>
              </div>

              <div className="bg-orange-500/10 p-6 rounded-lg border border-orange-500/30">
                <h4 className="text-orange-300 font-semibold mb-3">min_samples_split</h4>
                <p className="text-sm text-gray-300 mb-2">Minimum samples to split node</p>
                <div className="text-xs text-orange-400">Default: 2 | Range: 2-20</div>
                <p className="text-xs text-gray-400 mt-2">Higher values prevent overfitting on small datasets</p>
              </div>
            </div>
          </div>
        );

      case 'training':
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Training Process & Dataset Overview</h2>
        <p className="text-gray-400">
          How Random Forest learns from data and details about the Breast Cancer Wisconsin dataset used.
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 p-4 rounded-lg border border-blue-500/30 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-2">1</div>
            <div className="text-sm text-gray-300">Bootstrap Sample</div>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 p-4 rounded-lg border border-green-500/30 text-center">
            <div className="text-2xl font-bold text-green-400 mb-2">2</div>
            <div className="text-sm text-gray-300">Select Features</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 p-4 rounded-lg border border-purple-500/30 text-center">
            <div className="text-2xl font-bold text-purple-400 mb-2">3</div>
            <div className="text-sm text-gray-300">Train Tree</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 p-4 rounded-lg border border-orange-500/30 text-center">
            <div className="text-2xl font-bold text-orange-400 mb-2">4</div>
            <div className="text-sm text-gray-300">Repeat N Times</div>
          </div>
        </div>

        <div className="bg-gray-800/50 p-6 rounded-lg border border-white/10">
          <h4 className="text-white font-semibold mb-3">Training Algorithm</h4>
          <ol className="space-y-2 text-sm text-gray-300 list-decimal list-inside">
            <li>Create bootstrap sample from training data (sampling with replacement)</li>
            <li>At each node, randomly select √m features (where m = total features)</li>
            <li>Find best split among selected features using Gini impurity or entropy</li>
            <li>Split node and repeat until stopping criteria met</li>
            <li>Repeat process for all n_estimators trees</li>
          </ol>
        </div>

        {/* DATASET EXPLANATION SECTION */}
        <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-6 rounded-lg border border-white/10 mt-8">
          <h4 className="text-white font-semibold mb-3">About the Dataset</h4>
          <p className="text-gray-300 mb-4">
            This visualization uses the <strong>Breast Cancer Wisconsin (Diagnostic) Dataset</strong>, a widely used dataset in medical machine learning. It contains 569 samples of digitized breast mass images, with 30 numeric features describing characteristics of cell nuclei.
          </p>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li><strong>Samples:</strong> 569 (212 malignant, 357 benign)</li>
            <li><strong>Features:</strong> 30 numeric measurements including radius, texture, smoothness, concavity, and more.</li>
            <li><strong>Target:</strong> Binary classification - malignant (cancerous) or benign (non-cancerous) tumors.</li>
            <li>
              <strong>Source:</strong>
              <a
                href="https://archive.ics.uci.edu/dataset/17/breast+cancer+wisconsin+diagnostic"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline ml-1"
              >
                UCI Machine Learning Repository
              </a>
            </li>
            <li>
              <strong>scikit-learn Dataset:</strong>
              <a
                href="https://scikit-learn.org/stable/modules/generated/sklearn.datasets.load_breast_cancer.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline ml-1"
              >
                load_breast_cancer
              </a>
            </li>
          </ul>
          <p className="text-gray-300 mt-4">
            This dataset is commonly used for benchmarking classification algorithms and provides a real-world example of medical diagnosis using machine learning.
          </p>
        </div>
      </div>
    </div>
  );

      case 'metrics':
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Evaluation Metrics</h2>
              <p className="text-gray-400">Understanding Random Forest performance measures</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-green-400">Classification Metrics</h3>
                <div className="space-y-3">
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-white/10">
                    <h4 className="text-white font-semibold mb-1">Accuracy</h4>
                    <p className="text-xs text-gray-400">Correct predictions / Total predictions</p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-white/10">
                    <h4 className="text-white font-semibold mb-1">Precision & Recall</h4>
                    <p className="text-xs text-gray-400">Quality vs completeness of predictions</p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-white/10">
                    <h4 className="text-white font-semibold mb-1">ROC-AUC</h4>
                    <p className="text-xs text-gray-400">Area under receiver operating characteristic curve</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-400">Special RF Metrics</h3>
                <div className="space-y-3">
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-white/10">
                    <h4 className="text-white font-semibold mb-1">Feature Importance</h4>
                    <p className="text-xs text-gray-400">Mean decrease in impurity across all trees</p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-white/10">
                    <h4 className="text-white font-semibold mb-1">OOB Score</h4>
                    <p className="text-xs text-gray-400">Out-of-bag error estimate without separate validation</p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-white/10">
                    <h4 className="text-white font-semibold mb-1">Tree Diversity</h4>
                    <p className="text-xs text-gray-400">Correlation between tree predictions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'tips':
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Best Practices & Tips</h2>
              <p className="text-gray-400">Optimization strategies for Random Forest</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-green-400">Performance Tips</h3>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    <span>Start with 100-200 trees, increase if overfitting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    <span>Use sqrt(features) for classification, features/3 for regression</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    <span>Limit tree depth on small datasets (5-10 levels)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    <span>Use OOB score for model validation</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-400">Common Pitfalls</h3>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    <span>Too few trees lead to high variance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    <span>Very deep trees still overfit despite ensemble</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    <span>Imbalanced data needs stratified sampling</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    <span>High correlation between trees reduces benefits</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-4">
          Learn About Random Forest
        </h1>
        <p className="text-lg text-gray-400">
          Understand ensemble learning, tree aggregation, and feature importance
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 p-2 bg-gray-800/30 rounded-lg border border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            {tab.icon}
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-gray-900/50 rounded-lg border border-white/10 p-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default RandomForestEducation;
