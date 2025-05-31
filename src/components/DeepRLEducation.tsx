import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Zap, Target, BarChart3, Settings, BookOpen } from 'lucide-react';

const DeepRLEducation: React.FC = () => {
  return (
    <section className="container px-4 md:px-8 py-16 bg-secondary/10">
      <div className="max-w-6xl mx-auto">
        {/* Main Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-light mb-4">
            🧠 Learn About Deep Reinforcement Learning
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Understand how agents learn optimal decision-making through trial and error
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="architecture" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Architecture
            </TabsTrigger>
            <TabsTrigger value="training" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Training
            </TabsTrigger>
            <TabsTrigger value="optimization" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Optimization
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Deep Reinforcement Learning Fundamentals
                </CardTitle>
                <CardDescription>
                  Understanding how AI agents learn through trial and error
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Deep Reinforcement Learning (DRL) combines the decision-making power of reinforcement learning 
                      with the pattern recognition capabilities of deep neural networks. In your visualization, you can 
                      observe an agent (the AI) learning to make optimal decisions in an environment through trial and error.
                    </p>
                    <div className="bg-accent/10 p-3 rounded-lg">
                      <p className="text-sm">
                        <strong>Key Components Visible in Your Dashboard:</strong>
                      </p>
                      <ul className="text-xs mt-2 space-y-1 text-muted-foreground ml-4">
                        <li>• Agent: The neural network (4-24-24-2 architecture) making decisions</li>
                        <li>• Environment: The simulated world where actions are taken</li>
                        <li>• State: 4-dimensional input representing current situation</li>
                        <li>• Actions: Left or Right movements (2 possible choices)</li>
                        <li>• Reward: Feedback signal guiding learning (shown in Training Progress)</li>
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      The agent receives a state (4 input features), processes it through hidden layers (24 neurons each), 
                      and outputs Q-values for each action. The higher Q-value indicates the agent's confidence that the 
                      action will lead to better long-term rewards.
                    </p>
                    <div className="bg-secondary/30 p-3 rounded-lg font-mono text-xs">
                      Q(s,a) ← Q(s,a) + α[r + γ max Q(s',a') - Q(s,a)]
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Q-Learning Update Rule</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    The mathematical heart of your visualization lies in the Q-learning update equation:
                  </p>
                  <div className="bg-accent/10 p-4 rounded-lg mb-4">
                    <div className="text-lg font-mono text-accent text-center">
                      Q(s,a) ← Q(s,a) + α[r + γ max Q(s',a') - Q(s,a)]
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="font-medium">Breaking Down What You See:</p>
                    <ul className="space-y-1 text-muted-foreground text-xs">
                      <li>• Q(s,a): Current Q-value prediction (shown in Q-Value Predictions chart)</li>
                      <li>• α (Learning Rate): Controls how quickly the network updates</li>
                      <li>• r: Immediate reward received</li>
                      <li>• γ (Gamma): Discount factor weighing future vs immediate rewards</li>
                      <li>• max Q(s',a'): Best predicted future Q-value</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Experience Replay Mechanism</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your dashboard shows an Experience Buffer that stores past experiences as tuples:
                    (state, action, reward, next_state, done)
                  </p>
                  <div className="bg-secondary/20 p-4 rounded-lg font-mono text-sm space-y-2">
                    <div className="text-green-400"># How It Works in Your Visualization:</div>
                    <div>Storage: Each interaction gets stored</div>
                    <div>Sampling: Random batches selected (Batch Size: 32)</div>
                    <div>Training: Network learns from diverse experiences</div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    This breaks correlation between consecutive experiences, stabilizing training.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Exploration vs Exploitation Trade-off</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Your Exploration Rate (ε) plot perfectly demonstrates this crucial balance:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                    <h5 className="font-semibold text-blue-400 mb-2">ε = 1.0</h5>
                    <p className="text-xs text-muted-foreground">Pure exploration (random actions)</p>
                  </div>
                  <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-lg">
                    <h5 className="font-semibold text-orange-400 mb-2">ε = 0.5</h5>
                    <p className="text-xs text-muted-foreground">Balanced exploration and exploitation</p>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                    <h5 className="font-semibold text-green-400 mb-2">ε → 0.01</h5>
                    <p className="text-xs text-muted-foreground">Nearly pure exploitation</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="architecture" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Network Structure</CardTitle>
                <CardDescription>
                  Deep Q-Network (DQN) architecture visualization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Layer Configuration</h4>
                    <div className="space-y-3">
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h5 className="font-medium text-sm">Input Layer: 4 neurons</h5>
                        <p className="text-xs text-muted-foreground">
                          Represents environmental state features (position, velocity, etc.)
                        </p>
                      </div>
                      <div className="border-l-4 border-orange-500 pl-4">
                        <h5 className="font-medium text-sm">Hidden Layers: 24 × 2 neurons</h5>
                        <p className="text-xs text-muted-foreground">
                          ReLU activation, processes features into higher-level representations
                        </p>
                      </div>
                      <div className="border-l-4 border-green-500 pl-4">
                        <h5 className="font-medium text-sm">Output Layer: 2 neurons</h5>
                        <p className="text-xs text-muted-foreground">
                          Q-values for each action (Left/Right), linear activation
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">Network Parameters</h4>
                    <div className="bg-secondary/20 p-4 rounded-lg space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span className="text-sm">Total Parameters: 720</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                        <span className="text-sm">Weights: 4×24 + 24×24 + 24×2</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="text-sm">Biases: 24 + 24 + 2</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weight Visualization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  The Layer 1 Weights heatmap reveals learning patterns:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-3">
                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-400 mb-2">Red Regions</h4>
                      <p className="text-xs text-muted-foreground">
                        Positive weights - features that increase Q-values
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-400 mb-2">Blue Regions</h4>
                      <p className="text-xs text-muted-foreground">
                        Negative weights - features that decrease Q-values
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-400 mb-2">Pattern Changes</h4>
                      <p className="text-xs text-muted-foreground">
                        Weights adapt to important state features over time
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="training" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Training Dynamics</CardTitle>
                <CardDescription>
                  Understanding the learning process through visualization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Training Progress Chart</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">1</span>
                        <span>Episode Rewards (blue line): Raw performance per episode</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">2</span>
                        <span>Moving Average (orange line): Smoothed trend showing improvement</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">3</span>
                        <span>Training Loss: Network's prediction error over time</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">Real-time Statistics</h4>
                    <div className="bg-secondary/20 p-4 rounded-lg space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-400">Episodes:</span>
                        <span className="text-sm">Completed training episodes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-400">Avg Reward:</span>
                        <span className="text-sm">Performance over last 10 episodes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400">Exploration Rate:</span>
                        <span className="text-sm">Current ε value</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-purple-400">Memory Buffer:</span>
                        <span className="text-sm">Experience replay utilization</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Training Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Your interface allows real-time adjustments during training:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <strong>Update Speed:</strong>
                    <p className="text-xs text-muted-foreground mt-1">
                      Balances visualization smoothness with training speed
                    </p>
                  </div>
                  <div>
                    <strong>Parameter Tuning:</strong>
                    <p className="text-xs text-muted-foreground mt-1">
                      Live adjustment of learning parameters during training
                    </p>
                  </div>
                  <div>
                    <strong>Start/Stop/Reset:</strong>
                    <p className="text-xs text-muted-foreground mt-1">
                      Full control over the training process
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="optimization" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hyperparameter Tuning Guidelines</CardTitle>
                <CardDescription>
                  Best practices for optimizing your agent's performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-400 mb-2">Learning Rate (α)</h4>
                      <div className="space-y-2 text-xs">
                        <div className="text-red-400">Too high: Unstable learning, oscillating loss</div>
                        <div className="text-yellow-400">Too low: Slow convergence</div>
                        <div className="text-green-400">Recommended: 0.0010 (stable learning)</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-400 mb-2">Epsilon Decay Strategy</h4>
                      <div className="space-y-2 text-xs">
                        <div className="text-red-400">Fast decay (0.99): Quick shift to exploitation</div>
                        <div className="text-yellow-400">Slow decay (0.999): Extended exploration</div>
                        <div className="text-green-400">Balanced: 0.9950 (recommended)</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-orange-400 mb-2">Batch Size Impact</h4>
                      <div className="space-y-2 text-xs">
                        <div className="text-red-400">Small (16): Frequent updates, higher variance</div>
                        <div className="text-yellow-400">Large (128): Stable gradients, slower updates</div>
                        <div className="text-green-400">Optimal: 32 (good compromise)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Debugging Through Visualization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-red-400 mb-3">Warning Signs to Watch:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Q-values exploding: Values increasing without performance improvement</li>
                      <li>• Flat learning curves: No improvement over many episodes</li>
                      <li>• High variance: Wild swings in episode rewards without convergence</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-400 mb-3">Healthy Dashboard Indicators:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Diverse positive/negative weights in heatmap</li>
                      <li>• Decreasing loss with manageable oscillations</li>
                      <li>• Moving average trending upward</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Metrics Interpretation</CardTitle>
                <CardDescription>
                  Understanding what the charts tell us about learning progress
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-blue-400">Training Progress Analysis</h4>
                    <div className="bg-blue-500/10 p-3 rounded-lg text-xs">
                      <div><strong>Variance decrease:</strong> Later episodes show less reward variation</div>
                      <div className="mt-1"><strong>Convergence signs:</strong> Moving average stabilizing</div>
                      <div className="mt-1"><strong>Learning phases:</strong> Exploration → exploitation</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-green-400">Network Health Indicators</h4>
                    <div className="bg-green-500/10 p-3 rounded-lg text-xs">
                      <div><strong>Weight distribution:</strong> Learned feature importance</div>
                      <div className="mt-1"><strong>Q-value balance:</strong> No action consistently dominating</div>
                      <div className="mt-1"><strong>Loss trajectory:</strong> Generally decreasing</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-purple-400">Real-time Adjustments</h4>
                    <div className="bg-purple-500/10 p-3 rounded-lg text-xs">
                      <div><strong>Network size:</strong> 16→64 neurons for complexity</div>
                      <div className="mt-1"><strong>Buffer size:</strong> 500→5000 for memory optimization</div>
                      <div className="mt-1"><strong>Speed control:</strong> Update frequency adjustment</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Insights</CardTitle>
                <CardDescription>
                  Deep understanding of the learning process
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Network Architecture Visualization</h4>
                    <p className="text-sm text-muted-foreground">
                      The Network Architecture panel provides structural insights:
                    </p>
                    <div className="bg-secondary/20 p-4 rounded-lg space-y-2 text-sm">
                      <div><strong>Information flow:</strong> 4 inputs → 24 → 24 → 2 outputs</div>
                      <div><strong>Complexity measure:</strong> 720 total parameters</div>
                      <div><strong>Activation patterns:</strong> Hidden layers learning abstract representations</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">Educational Value</h4>
                    <p className="text-sm text-muted-foreground">
                      This visualization demonstrates that smaller networks (24 neurons) can effectively learn 
                      complex policies when properly trained, making this an excellent educational tool.
                    </p>
                    <div className="bg-accent/10 p-3 rounded-lg">
                      <p className="text-xs">
                        <strong>Key Learning:</strong> This dashboard perfectly illustrates how abstract 
                        mathematical concepts translate into observable learning behaviors, making Deep RL 
                        accessible to learners at all levels.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default DeepRLEducation;
