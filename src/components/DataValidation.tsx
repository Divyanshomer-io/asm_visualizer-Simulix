
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface DataValidationProps {
  metrics: {
    accuracy: number;
    auc_roc: number;
    recall: number;
    precision: number;
    oob_score?: number;
  };
}

const DataValidation: React.FC<DataValidationProps> = ({ metrics }) => {
  const warnings = [];
  
  if (metrics.accuracy > 0.98) warnings.push("Accuracy too high - possible data leakage");
  if (metrics.auc_roc > 0.99) warnings.push("AUC too high - check for overfitting");
  if (metrics.recall > 0.99) warnings.push("Perfect recall - unrealistic performance");
  if (metrics.precision > 0.99) warnings.push("Perfect precision - check data quality");

  const isHealthy = warnings.length === 0;

  return (
    <Card className="glass-panel border-white/10">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          {isHealthy ? (
            <CheckCircle className="h-5 w-5 text-green-400" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
          )}
          Data Quality Check
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isHealthy ? (
          <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <CheckCircle className="h-6 w-6 text-green-400" />
            <div>
              <p className="text-green-400 font-medium">✅ Metrics look realistic</p>
              <p className="text-sm text-green-300/80">
                No signs of data leakage or overfitting detected
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-yellow-400" />
              <div>
                <p className="text-yellow-400 font-medium">⚠️ Data Quality Warnings</p>
                <p className="text-sm text-yellow-300/80">
                  Some metrics appear unrealistic
                </p>
              </div>
            </div>
            
            <ul className="space-y-2">
              {warnings.map((warning, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-yellow-400 mt-0.5">⚠️</span>
                  <span className="text-yellow-300">{warning}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Performance Metrics Summary */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Accuracy:</span>
              <span className={metrics.accuracy > 0.98 ? 'text-yellow-400' : 'text-green-400'}>
                {metrics.accuracy.toFixed(3)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">AUC:</span>
              <span className={metrics.auc_roc > 0.99 ? 'text-yellow-400' : 'text-green-400'}>
                {metrics.auc_roc.toFixed(3)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Recall:</span>
              <span className={metrics.recall > 0.99 ? 'text-yellow-400' : 'text-green-400'}>
                {metrics.recall.toFixed(3)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Precision:</span>
              <span className={metrics.precision > 0.99 ? 'text-yellow-400' : 'text-green-400'}>
                {metrics.precision.toFixed(3)}
              </span>
            </div>
            {metrics.oob_score !== undefined && (
              <div className="flex justify-between col-span-2">
                <span className="text-muted-foreground">OOB Score:</span>
                <span className="text-blue-400">{metrics.oob_score.toFixed(3)}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataValidation;
