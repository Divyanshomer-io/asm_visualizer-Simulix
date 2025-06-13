
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Brain, Target, Route, TrendingUp, Book, Calculator, Settings2 } from 'lucide-react';

const QLearningEducation: React.FC = () => {
  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Book className="h-5 w-5" />
          Educational Content
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {/* Q-Learning Basics */}
          <AccordionItem value="basics">
            <AccordionTrigger className="text-base flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Q-Learning Basics
            </AccordionTrigger>
            <AccordionContent className="space-y-4 text-sm">
              <p>
                Q-Learning is a model-free reinforcement learning algorithm that learns the quality 
                of actions, telling an agent what action to take under what circumstances.
              </p>
              
              <div className="bg-accent/10 p-4 rounded-lg">
                <h4 className="font-medium mb-2">The Q-Learning Formula:</h4>
                <div className="font-mono text-center py-2 bg-background/50 rounded">
                  Q(s,a) ← Q(s,a) + α[r + γ·max Q(s',a') - Q(s,a)]
                </div>
                <div className="mt-3 space-y-1 text-xs">
                  <p><strong>α</strong> = Learning Rate (how much new information overrides old)</p>
                  <p><strong>γ</strong> = Discount Factor (importance of future rewards = 0.9)</p>
                  <p><strong>ε</strong> = Exploration Rate (probability of random actions)</p>
                  <p><strong>r</strong> = Immediate Reward (+10 for goal, -0.1 per step)</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Key Concepts:</h4>
                <ul className="list-disc list-inside space-y-1 opacity-80">
                  <li><strong>Q-Table:</strong> Stores quality values for state-action pairs</li>
                  <li><strong>Policy:</strong> Strategy for choosing actions based on Q-values</li>
                  <li><strong>Exploration vs Exploitation:</strong> Balance between trying new actions and using learned knowledge</li>
                  <li><strong>Temporal Difference:</strong> Learning from prediction errors</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Parameters Guide */}
          <AccordionItem value="parameters">
            <AccordionTrigger className="text-base flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              Parameters Guide
            </AccordionTrigger>
            <AccordionContent className="space-y-4 text-sm">
              <div className="space-y-4">
                <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                  <h4 className="font-medium text-blue-400 mb-2">Learning Rate (α)</h4>
                  <p className="mb-2">Controls how much new information overrides old information.</p>
                  <ul className="text-xs space-y-1 opacity-80">
                    <li>• <strong>High (0.7-1.0):</strong> Fast learning, but may be unstable</li>
                    <li>• <strong>Medium (0.3-0.7):</strong> Balanced learning (recommended)</li>
                    <li>• <strong>Low (0.1-0.3):</strong> Slow but stable learning</li>
                  </ul>
                </div>

                <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                  <h4 className="font-medium text-green-400 mb-2">Exploration Rate (ε)</h4>
                  <p className="mb-2">Probability of taking random actions instead of best known action.</p>
                  <ul className="text-xs space-y-1 opacity-80">
                    <li>• <strong>High (0.7-1.0):</strong> More exploration, slower convergence</li>
                    <li>• <strong>Medium (0.3-0.7):</strong> Balanced exploration-exploitation</li>
                    <li>• <strong>Low (0.0-0.3):</strong> More exploitation, faster convergence</li>
                  </ul>
                  <p className="text-xs mt-2 italic">
                    Note: ε automatically decays during training: ε = max(0.01, initial_ε × 0.98^episode)
                  </p>
                </div>

                <div className="bg-purple-500/10 p-3 rounded-lg border border-purple-500/20">
                  <h4 className="font-medium text-purple-400 mb-2">Training Speed</h4>
                  <ul className="text-xs space-y-1 opacity-80">
                    <li>• <strong>Slow:</strong> Updates every 5 episodes, 200ms delay (detailed observation)</li>
                    <li>• <strong>Medium:</strong> Updates every 10 episodes, 50ms delay (balanced)</li>
                    <li>• <strong>Fast:</strong> Updates every 20 episodes, 10ms delay (quick results)</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Algorithm Steps */}
          <AccordionItem value="algorithm">
            <AccordionTrigger className="text-base flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Algorithm Steps
            </AccordionTrigger>
            <AccordionContent className="space-y-4 text-sm">
              <div className="space-y-3">
                <div className="bg-accent/10 p-3 rounded-lg">
                  <h4 className="font-medium mb-2">Step-by-Step Process:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-xs">
                    <li><strong>Initialize:</strong> Set all Q-values to zero</li>
                    <li><strong>Choose Action:</strong> Use ε-greedy policy (explore vs exploit)</li>
                    <li><strong>Take Action:</strong> Move in chosen direction</li>
                    <li><strong>Observe Reward:</strong> Get +10 for goal, -0.1 for each step</li>
                    <li><strong>Update Q-value:</strong> Apply Q-learning formula</li>
                    <li><strong>Repeat:</strong> Continue until goal reached or max steps</li>
                    <li><strong>Next Episode:</strong> Reset position, decay ε, repeat</li>
                  </ol>
                </div>

                <div className="bg-accent/10 p-3 rounded-lg">
                  <h4 className="font-medium mb-2">Convergence Indicators:</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs opacity-80">
                    <li>Rewards stabilize and increase over episodes</li>
                    <li>Steps per episode decrease and stabilize</li>
                    <li>Exploration rate decays to minimum (0.01)</li>
                    <li>Policy arrows show consistent optimal path</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Environment Details */}
          <AccordionItem value="environment">
            <AccordionTrigger className="text-base flex items-center gap-2">
              <Target className="h-4 w-4" />
              Maze Environment
            </AccordionTrigger>
            <AccordionContent className="space-y-4 text-sm">
              <p>
                The agent navigates a grid maze from start (S) to goal (G), learning optimal paths 
                while avoiding walls and minimizing steps.
              </p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-2">Environment Components:</h4>
                  <ul className="list-disc list-inside space-y-1 opacity-80 text-xs">
                    <li><strong>States:</strong> Each cell position in the maze (row, column)</li>
                    <li><strong>Actions:</strong> Move up, down, left, or right</li>
                    <li><strong>Rewards:</strong> +10 for reaching goal, -0.1 per step taken</li>
                    <li><strong>Termination:</strong> Reaching goal or maximum steps (100)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Visual Elements:</h4>
                  <ul className="list-disc list-inside space-y-1 opacity-80 text-xs">
                    <li><strong>Green Circle (S):</strong> Start position</li>
                    <li><strong>Red Circle (G):</strong> Goal position</li>
                    <li><strong>Black Cells:</strong> Walls (obstacles)</li>
                    <li><strong>Blue Arrows:</strong> Learned policy directions</li>
                    <li><strong>Heatmap:</strong> Maximum Q-values per state</li>
                    <li><strong>Yellow Path:</strong> Optimal route from start to goal</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Training Progress */}
          <AccordionItem value="progress">
            <AccordionTrigger className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Understanding Progress
            </AccordionTrigger>
            <AccordionContent className="space-y-4 text-sm">
              <p>
                Monitor the learning progress through three key metrics that show different 
                aspects of the agent's performance improvement.
              </p>
              
              <div className="space-y-3">
                <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                  <h4 className="font-medium text-blue-400 mb-2">Episode Rewards</h4>
                  <p className="text-xs mb-1">Shows cumulative reward per episode.</p>
                  <ul className="text-xs space-y-1 opacity-80">
                    <li>• <strong>Early Training:</strong> Highly variable, often negative</li>
                    <li>• <strong>Learning Phase:</strong> Gradually increasing trend</li>
                    <li>• <strong>Convergence:</strong> Stable high values (~9.0-10.0)</li>
                  </ul>
                </div>

                <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                  <h4 className="font-medium text-red-400 mb-2">Steps per Episode</h4>
                  <p className="text-xs mb-1">Number of moves to reach the goal.</p>
                  <ul className="text-xs space-y-1 opacity-80">
                    <li>• <strong>Early Training:</strong> High and variable (50-100 steps)</li>
                    <li>• <strong>Learning Phase:</strong> Decreasing trend</li>
                    <li>• <strong>Convergence:</strong> Minimal steps (optimal path length)</li>
                  </ul>
                </div>

                <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                  <h4 className="font-medium text-green-400 mb-2">Exploration Rate (ε)</h4>
                  <p className="text-xs mb-1">Probability of taking random actions.</p>
                  <ul className="text-xs space-y-1 opacity-80">
                    <li>• <strong>Starts High:</strong> Ensures thorough exploration</li>
                    <li>• <strong>Exponential Decay:</strong> ε × 0.98^episode</li>
                    <li>• <strong>Minimum Value:</strong> 0.01 (always some exploration)</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default QLearningEducation;
