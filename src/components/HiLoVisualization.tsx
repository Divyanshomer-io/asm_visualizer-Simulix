
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Area, AreaChart, ReferenceLine } from 'recharts';
import { GameState, GameParams, generateBetaPDF, calculateTrueProbability, getCardName } from '@/utils/hiLoGame';
import InfoTooltip, { HiLoTooltips } from './InfoTooltip';

interface HiLoVisualizationProps {
  state: GameState;
  params: GameParams;
}

const HiLoVisualization: React.FC<HiLoVisualizationProps> = ({ state, params }) => {
  
  // Generate Beta PDF data
  const betaData = generateBetaPDF(state.alpha, state.beta, 100);
  const probabilityData = betaData.x.map((x, i) => ({
    cardValue: x,
    probability: betaData.y[i]
  }));

  // Learning progress data
  const learningData = state.bayesianEstimates.map((estimate, i) => ({
    round: i + 1,
    bayesian: estimate,
    true: state.trueProbabilities[i] || 0
  }));

  // Deck composition data
  const deckComposition = Array.from({ length: 13 }, (_, i) => {
    const cardValue = i + 1;
    const count = state.deck.filter(card => card === cardValue).length;
    return {
      card: getCardName(cardValue),
      count
    };
  });

  const currentTrueProbability = calculateTrueProbability(state.currentCard, state.deck);
  const bayesianEstimate = state.alpha / (state.alpha + state.beta);

  // Convert probabilities to card values for vertical lines
  const bayesianCardValue = bayesianEstimate * 12 + 1;
  const trueCardValue = currentTrueProbability * 12 + 1;

  return (
    <div className="space-y-6">
      {/* Main Probability Distribution */}
      <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-blue-300">Bayesian Probability Distribution</h3>
            <InfoTooltip
              title={HiLoTooltips.betaDistribution.title}
              content={HiLoTooltips.betaDistribution.content}
              variant={HiLoTooltips.betaDistribution.variant}
              side="right"
            />
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-400 rounded"></div>
              <span className="text-slate-300">Current Card: {getCardName(state.currentCard)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded"></div>
              <span className="text-slate-300">Bayesian: {bayesianEstimate.toFixed(3)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400 rounded"></div>
              <span className="text-slate-300">True: {currentTrueProbability.toFixed(3)}</span>
            </div>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={probabilityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis 
                dataKey="cardValue" 
                stroke="rgba(148,163,184,0.8)"
                domain={[1, 13]}
                type="number"
                scale="linear"
                label={{ 
                  value: 'Card Value (1-13)', 
                  position: 'insideBottom', 
                  offset: -10,
                  style: { textAnchor: 'middle', fill: 'rgba(148,163,184,0.8)', fontSize: '12px' }
                }}
              />
              <YAxis 
                stroke="rgba(148,163,184,0.8)"
                label={{ 
                  value: 'Probability Density', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: 'rgba(148,163,184,0.8)', fontSize: '12px' }
                }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(30,41,59,0.95)', 
                  border: '1px solid rgba(148,163,184,0.3)',
                  borderRadius: '8px',
                  color: '#f1f5f9'
                }}
                formatter={(value: number) => [value.toFixed(4), 'Probability Density']}
                labelFormatter={(value) => `Card Value: ${value}`}
              />
              <Area 
                type="monotone" 
                dataKey="probability" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <ReferenceLine 
                x={state.currentCard} 
                stroke="#fb923c" 
                strokeWidth={3}
                label={{ value: "Current", position: "top", fill: "#fb923c" }} 
              />
              <ReferenceLine 
                x={bayesianCardValue} 
                stroke="#22c55e" 
                strokeWidth={2}
                label={{ value: "Bayesian", position: "top", fill: "#22c55e" }} 
              />
              <ReferenceLine 
                x={trueCardValue} 
                stroke="#ef4444" 
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{ value: "True", position: "top", fill: "#ef4444" }} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learning Progress */}
        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg font-semibold text-blue-300">Learning Progress</h3>
            <InfoTooltip
              title={HiLoTooltips.learningProgress.title}
              content={HiLoTooltips.learningProgress.content}
              variant={HiLoTooltips.learningProgress.variant}
              side="right"
            />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={learningData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                <XAxis 
                  dataKey="round" 
                  stroke="rgba(148,163,184,0.8)"
                  label={{ 
                    value: 'Round Number', 
                    position: 'insideBottom', 
                    offset: -10,
                    style: { textAnchor: 'middle', fill: 'rgba(148,163,184,0.8)', fontSize: '11px' }
                  }}
                />
                <YAxis 
                  domain={[0, 1]} 
                  stroke="rgba(148,163,184,0.8)"
                  label={{ 
                    value: 'Probability (0-1)', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle', fill: 'rgba(148,163,184,0.8)', fontSize: '11px' }
                  }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(30,41,59,0.95)', 
                    border: '1px solid rgba(148,163,184,0.3)',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }}
                  formatter={(value: number) => [value.toFixed(3), undefined]}
                  labelFormatter={(value) => `Round: ${value}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="bayesian" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  name="Bayesian Estimate"
                  dot={{ fill: '#22c55e', strokeWidth: 1, r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="true" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="True Probability"
                  dot={{ fill: '#ef4444', strokeWidth: 1, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Deck Composition */}
        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg font-semibold text-blue-300">Remaining Cards</h3>
            <InfoTooltip
              title={HiLoTooltips.deckComposition.title}
              content={HiLoTooltips.deckComposition.content}
              variant={HiLoTooltips.deckComposition.variant}
              side="right"
            />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deckComposition}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                <XAxis 
                  dataKey="card" 
                  stroke="rgba(148,163,184,0.8)"
                  label={{ 
                    value: 'Card Value', 
                    position: 'insideBottom', 
                    offset: -10,
                    style: { textAnchor: 'middle', fill: 'rgba(148,163,184,0.8)', fontSize: '11px' }
                  }}
                />
                <YAxis 
                  stroke="rgba(148,163,184,0.8)"
                  label={{ 
                    value: 'Card Count', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle', fill: 'rgba(148,163,184,0.8)', fontSize: '11px' }
                  }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(30,41,59,0.95)', 
                    border: '1px solid rgba(148,163,184,0.3)',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }}
                  formatter={(value: number) => [value, 'Cards Remaining']}
                  labelFormatter={(value) => `${value}`}
                />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HiLoVisualization;
