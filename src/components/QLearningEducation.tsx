
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Target, Route, TrendingUp } from 'lucide-react';

const QLearningEducation: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Q-Learning Algorithm
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p>
            Q-Learning is a model-free reinforcement learning algorithm that learns the quality of actions, 
            telling an agent what action to take under what circumstances.
          </p>
          
          <div className="space-y-2">
            <h4 className="font-medium">Key Concepts:</h4>
            <ul className="list-disc list-inside space-y-1 opacity-80">
              <li><strong>Q-Table:</strong> Stores quality values for state-action pairs</li>
              <li><strong>Learning Rate (α):</strong> How much new information overrides old</li>
              <li><strong>Exploration (ε):</strong> Probability of taking random actions</li>
              <li><strong>Discount Factor (γ):</strong> Importance of future rewards</li>
            </ul>
          </div>

          <div className="bg-accent/10 p-3 rounded-lg">
            <p className="font-mono text-xs">
              Q(s,a) ← Q(s,a) + α[r + γ·max Q(s',a') - Q(s,a)]
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" />
            Maze Environment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p>
            The agent navigates a grid maze from start (S) to goal (G), learning optimal paths 
            while avoiding walls and minimizing steps.
          </p>
          
          <div className="space-y-2">
            <h4 className="font-medium">Environment Details:</h4>
            <ul className="list-disc list-inside space-y-1 opacity-80">
              <li><strong>States:</strong> Each cell position in the maze</li>
              <li><strong>Actions:</strong> Move up, down, left, or right</li>
              <li><strong>Rewards:</strong> +10 for reaching goal, -0.1 per step</li>
              <li><strong>Termination:</strong> Reaching goal or maximum steps</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Route className="h-5 w-5" />
            Policy Learning
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p>
            The algorithm learns a policy (blue arrows) that maps each state to the best action. 
            The Q-values heatmap shows the learned value of each position.
          </p>
          
          <div className="space-y-2">
            <h4 className="font-medium">Visualization Elements:</h4>
            <ul className="list-disc list-inside space-y-1 opacity-80">
              <li><strong>Blue Arrows:</strong> Learned policy directions</li>
              <li><strong>Heatmap:</strong> Maximum Q-values per state</li>
              <li><strong>Yellow Path:</strong> Optimal route from start to goal</li>
              <li><strong>Black Cells:</strong> Walls (obstacles)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Training Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p>
            Monitor the learning progress through reward accumulation, step efficiency, 
            and exploration decay over training episodes.
          </p>
          
          <div className="space-y-2">
            <h4 className="font-medium">Performance Metrics:</h4>
            <ul className="list-disc list-inside space-y-1 opacity-80">
              <li><strong>Episode Rewards:</strong> Total reward per episode</li>
              <li><strong>Steps per Episode:</strong> Efficiency improvement</li>
              <li><strong>Epsilon Decay:</strong> Exploration rate reduction</li>
              <li><strong>Convergence:</strong> Stable optimal behavior</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QLearningEducation;
