import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { MMHistory } from '@/utils/mmOptimizer';
import InfoTooltip from '@/components/InfoTooltip';

interface MMVisualizationChartsProps {
  mmHistory: MMHistory;
}

const MMVisualizationCharts: React.FC<MMVisualizationChartsProps> = ({ mmHistory }) => {
  // Prepare data for objective plot with parameter information
  const objectiveData = mmHistory.iterations.map((iter, index) => ({
    iteration: iter,
    original: mmHistory.f[index],
    surrogate: mmHistory.g[index],
    learningRate: mmHistory.learning_rates[index],
    lambda: mmHistory.lambda_values[index],
    zDim: mmHistory.z_dim_values[index]
  }));

  // Prepare data for gradient norms with parameter scaling
  const gradientData = mmHistory.iterations.map((iter, index) => ({
    iteration: iter,
    grad_f_norm: mmHistory.grad_f_norm[index],
    grad_g_norm: mmHistory.grad_g_norm[index],
    lambda: mmHistory.lambda_values[index],
    zDim: mmHistory.z_dim_values[index]
  }));

  // Detect parameter-driven phase transitions
  const phaseTransitions = [];
  for (let i = 1; i < mmHistory.learning_rates.length; i++) {
    const lr_change = Math.abs(mmHistory.learning_rates[i] - mmHistory.learning_rates[i-1]) / mmHistory.learning_rates[i-1];
    const lambda_change = Math.abs(mmHistory.lambda_values[i] - mmHistory.lambda_values[i-1]);
    
    if (lr_change > 0.1 || lambda_change > 10) { // Parameter-driven transitions
      phaseTransitions.push({
        iteration: mmHistory.iterations[i],
        learningRate: mmHistory.learning_rates[i],
        lambda: mmHistory.lambda_values[i],
        zDim: mmHistory.z_dim_values[i]
      });
    }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      return (
        <div className="bg-gray-900 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 font-medium">{`Iteration ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value?.toFixed(4)}`}
            </p>
          ))}
          {data && (
            <div className="mt-2 text-xs text-gray-400 border-t border-gray-600 pt-2">
              <p>λ = {data.lambda?.toFixed(1)}</p>
              <p>z_dim = {data.zDim}</p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const LearningRateTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      return (
        <div className="bg-gray-900 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 font-medium">{`Iteration ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value?.toFixed(4)}`}
            </p>
          ))}
          {data && (
            <div className="text-yellow-400 text-sm mt-1">
              <p>η = f(x₀)/L</p>
              <p>λ={data.lambda?.toFixed(1)}, z_dim={data.zDim}</p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Parameter-Aware MM Objective Functions Plot */}
      <div className="glass-panel p-6 rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold text-accent">Parameter-Aware MM Dynamics</h3>
          <InfoTooltip 
            content={
              <>
                <p className="font-semibold">Parameter-Integrated MM Surrogate:</p>
                <code className="text-xs">g(x;x₀,λ,z) = log(f(x₀)) + (f(x)-f(x₀))/f(x₀) × reg_scale × latent_cap</code>
                <p className="mt-2 text-xs">Surrogate adapts to λ (regularization strength) and z_dim (latent capacity).</p>
                <p className="mt-1 text-xs">Higher λ → flatter surrogate, Lower z_dim → reduced capacity factor</p>
              </>
            }
            variant="info"
          />
        </div>
        
        {objectiveData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={objectiveData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="iteration" 
                stroke="#9CA3AF"
                label={{ value: 'Iterations', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
              />
              <YAxis 
                stroke="#9CA3AF"
                label={{ value: 'log(f(x))', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
              />
              <Tooltip content={<LearningRateTooltip />} />
              
              {/* Parameter-driven phase transition markers */}
              {phaseTransitions.map((transition, index) => (
                <ReferenceLine 
                  key={index}
                  x={transition.iteration} 
                  stroke="#F59E0B" 
                  strokeDasharray="5 5"
                  label={{ 
                    value: `λ=${transition.lambda?.toFixed(0)}, z=${transition.zDim}`, 
                    position: 'top',
                    style: { fontSize: '10px', fill: '#F59E0B' }
                  }}
                />
              ))}
              
              <Line 
                type="monotone" 
                dataKey="original" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Original f(x)"
                dot={false}
                connectNulls={false}
              />
              <Line 
                type="monotone" 
                dataKey="surrogate" 
                stroke="#F59E0B" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Parameter-Aware Surrogate g(x;x₀,λ,z)"
                dot={false}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Start training to see parameter-aware MM dynamics
          </div>
        )}
      </div>

      {/* Parameter-Influenced Gradient Norms Plot */}
      <div className="glass-panel p-6 rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold text-accent">Parameter-Influenced Gradient Analysis</h3>
          <InfoTooltip 
            content={
              <>
                <p className="font-semibold">λ & z_dim Gradient Scaling:</p>
                <ul className="text-xs mt-1 space-y-1">
                  <li>• <span className="text-red-400">||∇f||</span>: Original objective gradient</li>
                  <li>• <span className="text-green-400">||∇g||</span>: Parameter-scaled surrogate gradient</li>
                  <li>• Higher λ → increased gradient scaling</li>
                  <li>• Lower z_dim → reduced gradient magnitude</li>
                </ul>
              </>
            }
            variant="info"
          />
        </div>
        
        {gradientData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={gradientData}>
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
                label={{ value: 'Gradient Norm (log)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="grad_f_norm" 
                stroke="#EF4444" 
                strokeWidth={2}
                name="||∇f||"
                dot={false}
                connectNulls={false}
              />
              <Line 
                type="monotone" 
                dataKey="grad_g_norm" 
                stroke="#10B981" 
                strokeWidth={2}
                name="||∇g|| (λ,z-scaled)"
                dot={false}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[250px] flex items-center justify-center text-muted-foreground">
            Start training to see parameter-influenced gradient analysis
          </div>
        )}
      </div>
    </div>
  );
};

export default MMVisualizationCharts;
