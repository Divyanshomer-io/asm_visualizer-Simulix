import React from 'react';
import { Brain, TrendingUp, BarChart3, Target, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const HiLoEducation: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Overview */}
      <div className="glass-panel p-8 rounded-xl">
        <div className="flex items-center gap-3 mb-6">
          <Brain className="h-6 w-6 text-blue-400" />
          <h2 className="text-2xl font-bold text-blue-400">Educational Content</h2>
        </div>
        
        <Tabs defaultValue="basics" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-slate-800/50 border border-slate-600/30">
            <TabsTrigger value="basics" className="flex items-center gap-2 data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-300">
              <Brain className="h-4 w-4" />
              Basics
            </TabsTrigger>
            <TabsTrigger value="parameters" className="flex items-center gap-2 data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-300">
              <Settings className="h-4 w-4" />
              Parameters
            </TabsTrigger>
            <TabsTrigger value="algorithm" className="flex items-center gap-2 data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-300">
              <BarChart3 className="h-4 w-4" />
              Algorithm
            </TabsTrigger>
            <TabsTrigger value="environment" className="flex items-center gap-2 data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-300">
              <TrendingUp className="h-4 w-4" />
              Environment
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2 data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-300">
              <Target className="h-4 w-4" />
              Progress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basics" className="space-y-6">
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Bayesian learning is a statistical approach that updates beliefs based on new evidence. 
                In this Hi-Lo card game, watch how the algorithm learns and adapts its predictions about card probabilities.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-blue-400">The Bayesian Formula:</h3>
              <div className="bg-slate-800/60 p-6 rounded-lg border border-slate-600/30">
                <div className="text-center text-lg font-mono text-blue-300 mb-4">
                  P(θ|data) ∝ P(data|θ) × P(θ)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-blue-400 font-semibold">P(θ|data):</span>
                    <p className="text-gray-300">Posterior belief (updated belief after seeing data)</p>
                  </div>
                  <div>
                    <span className="text-green-400 font-semibold">P(data|θ):</span>
                    <p className="text-gray-300">Likelihood (probability of observing the data)</p>
                  </div>
                  <div>
                    <span className="text-yellow-400 font-semibold">P(θ):</span>
                    <p className="text-gray-300">Prior belief (initial assumption)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-blue-400">Key Concepts:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-600/30">
                  <h5 className="font-semibold text-green-400 mb-2">Beta Distribution</h5>
                  <p className="text-sm text-gray-300">
                    Models our belief about probability using two parameters: α (successes) and β (failures)
                  </p>
                </div>
                <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-600/30">
                  <h5 className="font-semibold text-purple-400 mb-2">Conjugate Prior</h5>
                  <p className="text-sm text-gray-300">
                    Beta distribution is conjugate to binomial likelihood, making updates mathematically elegant
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="parameters" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-blue-400">Parameter Effects</h3>
                
                <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-600/30">
                  <h4 className="font-semibold text-green-400 mb-2">Prior Strength</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• <strong>Low (0.1-1.0):</strong> Weak prior, adapts quickly to data</li>
                    <li>• <strong>Medium (2.0-3.0):</strong> Balanced influence of prior and data</li>
                    <li>• <strong>High (4.0-5.0):</strong> Strong prior, slower adaptation</li>
                  </ul>
                </div>

                <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-600/30">
                  <h4 className="font-semibold text-yellow-400 mb-2">Learning Rate</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• <strong>Low (0.1-0.3):</strong> Conservative updates</li>
                    <li>• <strong>Medium (0.5-0.8):</strong> Balanced learning</li>
                    <li>• <strong>High (1.0-2.0):</strong> Aggressive adaptation</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-blue-400">Deck Configuration</h3>
                
                <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-600/30">
                  <h4 className="font-semibold text-orange-400 mb-2">Number of Decks</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• <strong>Single Deck:</strong> Higher variance, faster depletion</li>
                    <li>• <strong>Multiple Decks:</strong> More stable probabilities</li>
                    <li>• <strong>Many Decks (6-8):</strong> Approximates infinite deck</li>
                  </ul>
                </div>

                <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-600/30">
                  <h4 className="font-semibold text-blue-400 mb-2">Mathematical Insight</h4>
                  <p className="text-sm text-gray-300">
                    The Beta distribution mean μ = α/(α+β) represents our current probability estimate, 
                    while the sum α+β indicates our confidence level.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="algorithm" className="space-y-6">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-blue-400">Bayesian Update Process</h3>
              
              <div className="bg-slate-800/60 p-6 rounded-lg border border-slate-600/30">
                <h4 className="font-semibold text-green-400 mb-4">Update Rules</h4>
                <div className="space-y-4">
                  <div className="bg-slate-900/40 p-4 rounded-lg">
                    <h5 className="font-semibold text-blue-300 mb-2">Correct &quot;Higher&quot; Guess:</h5>
                    <p className="text-sm text-gray-300 font-mono">α_new = α_old + learning_rate</p>
                  </div>
                  <div className="bg-slate-900/40 p-4 rounded-lg">
                    <h5 className="font-semibold text-blue-300 mb-2">Correct &quot;Lower&quot; Guess:</h5>
                    <p className="text-sm text-gray-300 font-mono">β_new = β_old + learning_rate</p>
                  </div>
                  <div className="bg-slate-900/40 p-4 rounded-lg">
                    <h5 className="font-semibold text-red-300 mb-2">Incorrect Guess:</h5>
                    <p className="text-sm text-gray-300">Opposite parameter gets updated (punishment mechanism)</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-600/30">
                  <h4 className="font-semibold text-purple-400 mb-2">True Probability Calculation</h4>
                  <p className="text-sm text-gray-300 mb-2">Based on remaining cards in deck:</p>
                  <p className="text-xs font-mono text-blue-300">
                    P(next &gt; current) = cards_higher / total_remaining
                  </p>
                </div>
                <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-600/30">
                  <h4 className="font-semibold text-orange-400 mb-2">Convergence Property</h4>
                  <p className="text-sm text-gray-300">
                    As more data is observed, the Bayesian estimate converges toward the true probability
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="environment" className="space-y-6">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-blue-400">Game Environment</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-600/30">
                    <h4 className="font-semibold text-green-400 mb-2">State Space</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Current card value (1-13)</li>
                      <li>• Remaining deck composition</li>
                      <li>• Historical game outcomes</li>
                      <li>• Current α and β parameters</li>
                    </ul>
                  </div>
                  
                  <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-600/30">
                    <h4 className="font-semibold text-yellow-400 mb-2">Action Space</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• <strong>Higher:</strong> Bet next card &gt; current</li>
                      <li>• <strong>Lower:</strong> Bet next card &lt; current</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-600/30">
                    <h4 className="font-semibold text-blue-400 mb-2">Reward Structure</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• <strong>+1:</strong> Correct prediction</li>
                      <li>• <strong>0:</strong> Incorrect prediction</li>
                      <li>• Goal: Maximize cumulative score</li>
                    </ul>
                  </div>
                  
                  <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-600/30">
                    <h4 className="font-semibold text-purple-400 mb-2">Information Flow</h4>
                    <p className="text-sm text-gray-300">
                      Each game outcome provides evidence that updates our belief distribution, 
                      creating a feedback loop for continuous learning.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-blue-400">Learning Progress Indicators</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-600/30">
                  <h4 className="font-semibold text-green-400 mb-2">Convergence Metrics</h4>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li>• <strong>Estimate Stability:</strong> Bayesian estimate stabilizing</li>
                    <li>• <strong>Confidence Growth:</strong> α + β increasing over time</li>
                    <li>• <strong>Error Reduction:</strong> |Bayesian - True| decreasing</li>
                  </ul>
                </div>
                
                <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-600/30">
                  <h4 className="font-semibold text-blue-400 mb-2">Performance Tracking</h4>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li>• <strong>Win Rate:</strong> Percentage of correct predictions</li>
                    <li>• <strong>Streak Analysis:</strong> Best and current streaks</li>
                    <li>• <strong>Game History:</strong> Visual pattern of wins/losses</li>
                  </ul>
                </div>
                
                <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-600/30">
                  <h4 className="font-semibold text-yellow-400 mb-2">Strategic Insights</h4>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li>• <strong>Deck Awareness:</strong> Using remaining card information</li>
                    <li>• <strong>Probability Matching:</strong> Aligning decisions with estimates</li>
                    <li>• <strong>Parameter Tuning:</strong> Optimizing learning parameters</li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-800/60 p-6 rounded-lg border border-slate-600/30">
                <h4 className="font-semibold text-blue-400 mb-4">Educational Objectives</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-green-400 mb-2">Understanding Gained:</h5>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• How Bayesian updating works in practice</li>
                      <li>• Effect of prior beliefs on learning</li>
                      <li>• Convergence properties of Bayesian inference</li>
                      <li>• Trade-offs between exploration and exploitation</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-purple-400 mb-2">Skills Developed:</h5>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Statistical reasoning and inference</li>
                      <li>• Parameter sensitivity analysis</li>
                      <li>• Probabilistic decision making</li>
                      <li>• Model interpretation and validation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HiLoEducation;
