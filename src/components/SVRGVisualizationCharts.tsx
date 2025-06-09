import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ScatterChart, Scatter } from 'recharts';
import { SVRGHistory } from '@/utils/svrgOptimizer';
import InfoTooltip from '@/components/InfoTooltip';

interface SVRGVisualizationChartsProps {
  svrgHistory: SVRGHistory;
}

const SVRGVisualizationCharts: React.FC<SVRGVisualizationChartsProps> = ({ svrgHistory }) => {
  // Prepare variance data with parameter information
  const varianceData = svrgHistory.iterations.map((iter, index) => ({
    iteration: iter,
    svrg_variance: svrgHistory.variance[index],
    sgd_variance: svrgHistory.sgd_variance[index],
    grad_norm: svrgHistory.grad_norms[index],
    lambda: svrgHistory.lambda_influence[index],
    zDim: svrgHistory.z_dim_capacity[index]
  }));

  // Prepare correction vectors data with parameter context
  const correctionData = svrgHistory.corrections.slice(-10).map((corrections, batchIndex) => {
    const baseIndex = Math.max(0, svrgHistory.corrections.length - 10);
    const actualIndex = baseIndex + batchIndex;
    
    return corrections.slice(0, 5).map((correction, sampleIndex) => ({
      x: sampleIndex,
      y: correction,
      batch: batchIndex,
      lambda: svrgHistory.lambda_influence[actualIndex] || 0,
      zDim: svrgHistory.z_dim_capacity[actualIndex] || 50
    }));
  }).flat();

  // Prepare snapshot markers with parameter information
  const snapshotMarkers = svrgHistory.snapshots.map((snapshotIteration, index) => ({
    iteration: snapshotIteration,
    epoch: svrgHistory.snapshot_epochs[index] || index + 1,
    lambda: svrgHistory.lambda_influence[snapshotIteration] || 0,
    zDim: svrgHistory.z_dim_capacity[snapshotIteration] || 50
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      return (
        <div className="bg-gray-900 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 font-medium">{`Iteration ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value?.toExponential(2)}`}
            </p>
          ))}
          {data && (
            <div className="mt-2 text-xs text-gray-400 border-t border-gray-600 pt-2">
              <p>λ influence: {data.lambda?.toFixed(1)}</p>
              <p>z_dim capacity: {data.zDim}</p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Parameter-Aware Variance Reduction Plot */}
      <div className="glass-panel p-6 rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold text-accent">Parameter-Aware Variance Reduction</h3>
          <InfoTooltip 
            content={
              <>
                <p className="font-semibold">λ & z_dim Influenced Control Variates:</p>
                <ul className="text-xs mt-1 space-y-1">
                  <li>• <span className="text-purple-400">SVRG</span>: λ-scaled variance-reduced gradients</li>
                  <li>• <span className="text-gray-400">SGD</span>: Baseline (degraded by high λ)</li>
                  <li>• High λ → more aggressive variance reduction</li>
                  <li>• Low z_dim → requires more frequent snapshots</li>
                </ul>
                <p className="mt-2 text-xs">SVRG effectiveness scales with VAE parameter configuration.</p>
              </>
            }
            variant="info"
          />
        </div>
        
        {varianceData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={varianceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="iteration" 
                stroke="#9CA3AF"
                label={{ value: 'Iterations', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
              />
              <YAxis 
                scale="log"
                domain={['dataMin', 'dataMax']}
                stroke="#9CA3AF"
                label={{ value: 'Variance (log)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Parameter-driven snapshot markers */}
              {snapshotMarkers.map((snapshot, index) => (
                <ReferenceLine 
                  key={index}
                  x={snapshot.iteration} 
                  stroke="#8B5CF6" 
                  strokeDasharray="3 3"
                  label={{ 
                    value: `Snapshot #${index + 1} (λ=${snapshot.lambda?.toFixed(0)})`, 
                    position: 'top',
                    style: { fontSize: '10px', fill: '#8B5CF6' }
                  }}
                />
              ))}
              
              <Line 
                type="monotone" 
                dataKey="svrg_variance" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                name="Parameter-Aware SVRG"
                dot={false}
                connectNulls={false}
              />
              <Line 
                type="monotone" 
                dataKey="sgd_variance" 
                stroke="#6B7280" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="SGD Baseline (λ-degraded)"
                dot={false}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Start training to see parameter-aware variance reduction
          </div>
        )}
      </div>

      {/* Parameter-Scaled Gradient Norms */}
      <div className="glass-panel p-6 rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold text-accent">Parameter-Scaled SVRG Gradients</h3>
          <InfoTooltip 
            content={
              <>
                <p className="font-semibold">λ & z_dim Gradient Scaling:</p>
                <p className="text-xs mt-1">Gradient magnitude reflects VAE parameter influence on optimization.</p>
                <p className="text-xs mt-1">Higher λ → increased gradient corrections, Lower z_dim → capacity constraints</p>
              </>
            }
            variant="info"
          />
        </div>
        
        {varianceData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={varianceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="iteration" 
                stroke="#9CA3AF"
                label={{ value: 'Iterations', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
              />
              <YAxis 
                stroke="#9CA3AF"
                label={{ value: 'Gradient Norm', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="grad_norm" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                name="||∇SVRG|| (parameter-scaled)"
                dot={false}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[250px] flex items-center justify-center text-muted-foreground">
            Start training to see parameter-scaled gradient norms
          </div>
        )}
      </div>

      {/* Parameter-Influenced Correction Vectors */}
      <div className="glass-panel p-6 rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold text-accent">Parameter-Influenced Correction Vectors</h3>
          <InfoTooltip 
            content={
              <>
                <p className="font-semibold">λ-Scaled Correction Vectors:</p>
                <code className="text-xs">(∇f_i(x) - ∇f_i(x̃)) × (1 + λ/200)</code>
                <p className="text-xs mt-1">Correction magnitude scales with regularization strength.</p>
                <p className="text-xs mt-1">Higher λ → larger corrections, better variance reduction</p>
              </>
            }
            variant="info"
          />
        </div>
        
        {correctionData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <ScatterChart data={correctionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="x" 
                stroke="#9CA3AF"
                label={{ value: 'Sample Index', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
              />
              <YAxis 
                dataKey="y"
                stroke="#9CA3AF"
                label={{ value: 'Correction Value', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-gray-900 border border-gray-600 rounded-lg p-3 shadow-lg">
                        <p className="text-gray-300 font-medium">λ-Scaled Correction</p>
                        <p className="text-purple-400">Batch: {data.batch}</p>
                        <p className="text-purple-400">Value: {data.y?.toFixed(4)}</p>
                        <div className="mt-1 text-xs text-gray-400 border-t border-gray-600 pt-1">
                          <p>λ = {data.lambda?.toFixed(1)}</p>
                          <p>z_dim = {data.zDim}</p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter 
                dataKey="y" 
                fill="#8B5CF6" 
                name="Parameter-Scaled Corrections"
              />
            </ScatterChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[250px] flex items-center justify-center text-muted-foreground">
            Start training to see parameter-influenced correction vectors
          </div>
        )}
      </div>
    </div>
  );
};

export default SVRGVisualizationCharts;
