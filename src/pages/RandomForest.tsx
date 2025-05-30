mport React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import RandomForestControls from '@/components/RandomForestControls';
import RandomForestVisualization from '@/components/RandomForestVisualization';
import RandomForestEducation from '@/components/RandomForestEducation';
import { RandomForestState, RandomForestParams } from '@/utils/randomForest';
import { trainRandomForestModel } from '@/utils/randomForest';
import { toast } from 'sonner';

const RandomForest = () => {
  const [state, setState] = useState<RandomForestState>({
    isTraining: false,
    currentModel: null,
    trainingProgress: 0,
    modelMetrics: null,
    confusion_matrix: null,
    roc_data: null,
    feature_importances: null,
    prediction_probabilities: null,
    tree_data: null,
    selectedTreeIndex: 0,
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

  const handleTrainModel = useCallback(async () => {
    setState(prev => ({ ...prev, isTraining: true, trainingProgress: 0 }));
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
      selectedTreeIndex: 0,
    });
    toast.info('Parameters and model reset');
  }, []);

  const handleTreeIndexChange = useCallback((index: number) => {
    setState(prev => ({ ...prev, selectedTreeIndex: index }));
  }, []);

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
            <Home className="h-4 w-4" />
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
              onTreeIndexChange={handleTreeIndexChange}
            />
            <RandomForestEducation />
          </div>
          
          {/* Control Panel */}
          <div className="lg:col-span-1">
            <RandomForestControls
              params={params}
              state={state}
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
