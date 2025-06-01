
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Zap } from 'lucide-react';
import RandomForestControls from '@/components/RandomForestControls';
import RandomForestVisualization from '@/components/RandomForestVisualization';
import RandomForestEducation from '@/components/RandomForestEducation';
import { RandomForestState, RandomForestParams, TreeData } from '@/utils/randomForest';
import { trainRandomForestModel } from '@/utils/randomForest';
import { toast } from 'sonner';

const RandomForest = () => {
  // Separate tree index state from main RF state
  const [selectedTreeIndex, setSelectedTreeIndex] = useState(0);
  const [treeData, setTreeData] = useState<TreeData | null>(null);
  const [isLoadingTree, setIsLoadingTree] = useState(false);

  // Main RF state without tree index
  const [state, setState] = useState<Omit<RandomForestState, 'selectedTreeIndex'>>({
    isTraining: false,
    currentModel: null,
    trainingProgress: 0,
    modelMetrics: null,
    confusion_matrix: null,
    roc_data: null,
    feature_importances: null,
    prediction_probabilities: null,
    tree_data: null,
  });

  const [params, setParams] = useState<RandomForestParams>({
    n_estimators: 10,
    max_depth: 5,
    max_features: 'sqrt',
    test_size: 0.2,
    random_state: 42,
  });

  const handleParamChange = useCallback((newParams: Partial<RandomForestParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  }, []);

  // Centralized tree data fetching with cancellation
  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchTreeData = async () => {
      if (params.n_estimators === 0 || !state.currentModel) return;
      
      setIsLoadingTree(true);
      try {
        // Simulate realistic tree data fetch
        await new Promise(resolve => setTimeout(resolve, 300));
        
        if (!abortController.signal.aborted) {
          // Generate mock tree data based on current index
          const mockTreeData: TreeData = {
            tree_index: selectedTreeIndex,
            decision_nodes: Math.floor(Math.random() * 20) + 10,
            leaf_nodes: Math.floor(Math.random() * 15) + 8,
            actual_depth: Math.min(params.max_depth, Math.floor(Math.random() * params.max_depth) + 3),
            decision_path: [
              {
                step: 1,
                feature: `Feature_${Math.floor(Math.random() * 30)}`,
                threshold: parseFloat((Math.random() * 100).toFixed(2)),
                condition: Math.random() > 0.5 ? '<= threshold' : '> threshold'
              },
              {
                step: 2,
                feature: `Feature_${Math.floor(Math.random() * 30)}`,
                threshold: parseFloat((Math.random() * 100).toFixed(2)),
                condition: Math.random() > 0.5 ? '<= threshold' : '> threshold'
              }
            ],
            tree_accuracy: 0.7 + Math.random() * 0.2,
            training_samples: Math.floor(Math.random() * 100) + 500,
            feature_names: Array.from({length: 30}, (_, i) => `Feature_${i}`)
          };
          
          setTreeData(mockTreeData);
        }
      } catch (err) {
        if (!abortController.signal.aborted) {
          console.error('Tree fetch failed:', err);
          toast.error('Failed to load tree data');
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoadingTree(false);
        }
      }
    };

    fetchTreeData();
    
    return () => abortController.abort();
  }, [selectedTreeIndex, params.n_estimators, state.currentModel]);

  const handleTrainModel = useCallback(async () => {
    setState(prev => ({ ...prev, isTraining: true, trainingProgress: 0 }));
    setSelectedTreeIndex(0); // Reset tree index on new training
    toast.info('Training Random Forest model...');
    
    try {
      // Simulate training progress
      const progressInterval = setInterval(() => {
        setState(prev => ({
          ...prev,
          trainingProgress: Math.min(prev.trainingProgress + 10, 90)
        }));
      }, 200);

      const result = await trainRandomForestModel(params);
      
      clearInterval(progressInterval);
      
      setState(prev => ({
        ...prev,
        isTraining: false,
        trainingProgress: 100,
        currentModel: result.model,
        modelMetrics: result.metrics,
        confusion_matrix: result.confusion_matrix,
        roc_data: result.roc_data,
        feature_importances: result.feature_importances,
        prediction_probabilities: result.prediction_probabilities,
        tree_data: result.tree_data,
      }));
      
      toast.success(`Model trained successfully! Accuracy: ${result.metrics.accuracy.toFixed(3)}`);
    } catch (error) {
      setState(prev => ({ ...prev, isTraining: false, trainingProgress: 0 }));
      toast.error('Failed to train model. Please try again.');
      console.error('Training error:', error);
    }
  }, [params]);

  const handleReset = useCallback(() => {
    setParams({
      n_estimators: 10,
      max_depth: 5,
      max_features: 'sqrt',
      test_size: 0.2,
      random_state: 42,
    });
    setState({
      isTraining: false,
      currentModel: null,
      trainingProgress: 0,
      modelMetrics: null,
      confusion_matrix: null,
      roc_data: null,
      feature_importances: null,
      prediction_probabilities: null,
      tree_data: null,
    });
    setSelectedTreeIndex(0);
    setTreeData(null);
    toast.info('Parameters and model reset');
  }, []);

  // Tree index change handler with validation
  const handleTreeIndexChange = useCallback((index: number) => {
    const validIndex = Math.max(0, Math.min(index, params.n_estimators - 1));
    setSelectedTreeIndex(validIndex);
  }, [params.n_estimators]);

  // Train initial model on component mount
  useEffect(() => {
    handleTrainModel();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      {/* Header */}
      <header className="w-full glass-panel border-b border-white/5 mb-8">
        <div className="container py-6 px-4 md:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-light tracking-tight">
              Random Forest Visualizer
              <span className="text-sm ml-3 opacity-70 font-normal">
                Interactive Learning
              </span>
            </h1>
            <p className="text-sm opacity-70">Interactive ensemble learning exploration</p>
          </div>
          <Link to="/" className="control-btn flex items-center gap-2 text-sm">
            <ArrowLeft className="h-4 w-4" />
            Back to Visualizations
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Visualization Area */}
          <div className="lg:col-span-3 space-y-6">
            <RandomForestVisualization 
              state={state}
              params={params}
              selectedTreeIndex={selectedTreeIndex}
              treeData={treeData}
              isLoadingTree={isLoadingTree}
              onTreeIndexChange={handleTreeIndexChange}
            />
            <RandomForestEducation />
          </div>
          
          {/* Control Panel */}
          <div className="lg:col-span-1">
            <RandomForestControls
              params={params}
              state={state}
              selectedTreeIndex={selectedTreeIndex}
              onParamChange={handleParamChange}
              onTreeIndexChange={handleTreeIndexChange}
              onTrain={handleTrainModel}
              onReset={handleReset}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full glass-panel border-t border-white/5 mt-auto">
        <div className="container py-4 px-4 md:px-8 text-center">
          <p className="text-sm opacity-70">
            <span className="inline-block">Applied Statistical Mathematics • Interactive Visualizations</span>
            <span className="mx-2">•</span>
            <span className="inline-block">BITS Pilani, K.K. Birla Goa Campus</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RandomForest;
