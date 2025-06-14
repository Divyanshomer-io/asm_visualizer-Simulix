
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Area, AreaChart, ReferenceLine } from 'recharts';
import { GameState, GameParams, generateBetaPDF, calculateTrueProbability, getCardName } from '@/utils/hiLoGame';

interface HiLoVisualizationProps {
  state: GameState;
  params: GameParams;
}

const HiLoVisualization: React.FC<HiLoVisualizationProps> = ({ state, params }) => {
  
  // Generate Beta PDF data with error handling
  const betaData = React.useMemo(() => {
    try {
      return generateBetaPDF(state.alpha, state.beta, 100);
    } catch (error) {
      console.error('Error generating Beta PDF:', error);
      return { x: [0, 1], y: [0, 0] };
    }
  }, [state.alpha, state.beta]);

  const probabilityData = betaData.x.map((x, i) => ({
    cardValue: x,
    probability: betaData.y[i] || 0
  }));

  // Learning progress data with safety checks
  const learningData = state.bayesianEstimates.map((estimate, i) => ({
    round: i + 1,
    bayesian: estimate || 0,
    true: state.trueProbabilities[i] || 0
  }));

  // Deck composition data with error handling
  const deckComposition = React.useMemo(() => {
    try {
      return Array.from({ length: 13 }, (_, i) => {
        const cardValue = i + 1;
        const count = state.deck.filter(card => card === cardValue).length;
        return {
          card: getCardName(cardValue),
          count
        };
      });
    } catch (error) {
      console.error('Error calculating deck composition:', error);
      return [];
    }
  }, [state.deck]);

  const currentTrueProbability = React.useMemo(() => {
    try {
      return calculateTrueProbability(state.currentCard, state.deck);
    } catch (error) {
      console.error('Error calculating true probability:', error);
      return 0;
    }
  }, [state.currentCard, state.deck]);

  const bayesianEstimate = state.alpha / (state.alpha + state.beta);

  // Convert probabilities to card values for vertical lines
  const bayesianCardValue = bayesianEstimate * 12 + 1; // Scale to 1-13 range
  const trueCardValue = currentTrueProbability * 12 + 1; // Scale to 1-13 range

  return (
    <div className="space-y-6">
      {/* Main Probability Distribution */}
      <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-blue-300">Bayesian Probability Distribution</h3>
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
                domain={[0, 1]}
                type="number"
                scale="linear"
              />
              <YAxis stroke="rgba(148,163,184,0.8)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(30,41,59,0.95)', 
                  border: '1px solid rgba(148,163,184,0.3)',
                  borderRadius: '8px',
                  color: '#f1f5f9'
                }}
                formatter={(value: number) => [value.toFixed(3), 'Probability']}
              />
              <Area 
                type="monotone" 
                dataKey="probability" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.3}
                strokeWidth={2}
              />
              {/* Current Card Line - Orange */}
              <ReferenceLine 
                x={state.currentCard / 13} 
                stroke="#fb923c" 
                strokeWidth={3}
                label={{ value: "Current", position: "top", fill: "#fb923c" }} 
              />
              {/* Bayesian Estimate Line - Green */}
              <ReferenceLine 
                x={bayesianEstimate} 
                stroke="#22c55e" 
                strokeWidth={2}
                label={{ value: "Bayesian", position: "top", fill: "#22c55e" }} 
              />
              {/* True Probability Line - Red Dotted */}
              <ReferenceLine 
                x={currentTrueProbability} 
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
          <h3 className="text-lg font-semibold text-blue-300 mb-4">Learning Progress</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={learningData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                <XAxis dataKey="round" stroke="rgba(148,163,184,0.8)" />
                <YAxis domain={[0, 1]} stroke="rgba(148,163,184,0.8)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(30,41,59,0.95)', 
                    border: '1px solid rgba(148,163,184,0.3)',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }}
                  formatter={(value: number) => [value.toFixed(3), undefined]}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="bayesian" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  name="Bayesian Estimate"
                />
                <Line 
                  type="monotone" 
                  dataKey="true" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="True Probability"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Deck Composition */}
        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-blue-300 mb-4">Remaining Cards</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deckComposition}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                <XAxis dataKey="card" stroke="rgba(148,163,184,0.8)" />
                <YAxis stroke="rgba(148,163,184,0.8)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(30,41,59,0.95)', 
                    border: '1px solid rgba(148,163,184,0.3)',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }}
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
