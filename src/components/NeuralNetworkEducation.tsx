
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Zap, Target, BarChart3, Settings, BookOpen } from "lucide-react";

const NeuralNetworkEducation: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto">
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
          <TabsTrigger value="activation" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Activation
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Training
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Metrics
          </TabsTrigger>
          <TabsTrigger value="tips" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Tips
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Neural Network Fundamentals
              </CardTitle>
              <CardDescription>
                Understanding the basics of artificial neural networks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">What is a Neural Network?</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    A neural network is a computational model inspired by biological neural networks. 
                    It consists of interconnected nodes (neurons) organized in layers that process 
                    information by passing signals through weighted connections.
                  </p>
                  <div className="bg-accent/10 p-3 rounded-lg">
                    <p className="text-sm">
                      <strong>Key Components:</strong> Input layer, hidden layers, output layer, 
                      weights, biases, and activation functions.
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">How It Works</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Information flows forward through the network: input features are processed 
                    by hidden layers using weights and activation functions, ultimately producing 
                    an output prediction.
                  </p>
                  <div className="bg-secondary/30 p-3 rounded-lg font-mono text-xs">
                    output = activation(weights × input + bias)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Multi-Layer Perceptron (MLP)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                The MLP is a feedforward neural network with one or more hidden layers. It's capable 
                of learning non-linear relationships through the combination of linear transformations 
                and non-linear activation functions.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                  <h5 className="font-semibold text-blue-400 mb-2">Input Layer</h5>
                  <p className="text-xs text-muted-foreground">
                    Receives raw feature data and passes it to hidden layers
                  </p>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-lg">
                  <h5 className="font-semibold text-orange-400 mb-2">Hidden Layers</h5>
                  <p className="text-xs text-muted-foreground">
                    Transform input through weighted connections and activation functions
                  </p>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                  <h5 className="font-semibold text-green-400 mb-2">Output Layer</h5>
                  <p className="text-xs text-muted-foreground">
                    Produces final predictions or classifications
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="architecture" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Network Architecture Design</CardTitle>
              <CardDescription>
                Understanding how to design effective neural network architectures
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Layer Configuration</h4>
                  <div className="space-y-3">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h5 className="font-medium text-sm">Input Neurons</h5>
                      <p className="text-xs text-muted-foreground">
                        Must match the number of features in your dataset. More features 
                        require more input neurons.
                      </p>
                    </div>
                    <div className="border-l-4 border-orange-500 pl-4">
                      <h5 className="font-medium text-sm">Hidden Layers</h5>
                      <p className="text-xs text-muted-foreground">
                        Start with 1-2 layers. Add more for complex patterns but beware 
                        of overfitting.
                      </p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <h5 className="font-medium text-sm">Neurons per Layer</h5>
                      <p className="text-xs text-muted-foreground">
                        Common rule: start with 2/3 of input size + output size. 
                        Experiment to find optimal.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Design Guidelines</h4>
                  <div className="bg-secondary/20 p-4 rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-sm">Start simple, then increase complexity</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                      <span className="text-sm">More neurons ≠ better performance</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      <span className="text-sm">Watch for overfitting with deep networks</span>
                    </div>
                  </div>
                  <div className="bg-accent/10 p-3 rounded-lg">
                    <p className="text-xs">
                      <strong>Universal Approximation Theorem:</strong> A single hidden layer 
                      with sufficient neurons can approximate any continuous function.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Activation Functions</CardTitle>
              <CardDescription>
                Different activation functions and their characteristics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-400 mb-2">ReLU</h4>
                    <div className="font-mono text-xs bg-secondary/30 p-2 rounded mb-2">
                      f(x) = max(0, x)
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Most popular activation function. Fast to compute and reduces 
                      vanishing gradient problem.
                    </p>
                    <div className="space-y-1 text-xs">
                      <div className="text-green-400">✓ Fast computation</div>
                      <div className="text-green-400">✓ Sparse activation</div>
                      <div className="text-red-400">✗ Dead neurons possible</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-400 mb-2">Sigmoid</h4>
                    <div className="font-mono text-xs bg-secondary/30 p-2 rounded mb-2">
                      f(x) = 1/(1+e^(-x))
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Classic activation function that squashes output between 0 and 1. 
                      Often used in output layers for binary classification.
                    </p>
                    <div className="space-y-1 text-xs">
                      <div className="text-green-400">✓ Smooth gradient</div>
                      <div className="text-green-400">✓ Clear probability interpretation</div>
                      <div className="text-red-400">✗ Vanishing gradients</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-400 mb-2">Tanh</h4>
                    <div className="font-mono text-xs bg-secondary/30 p-2 rounded mb-2">
                      f(x) = tanh(x)
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Zero-centered version of sigmoid. Output range is [-1, 1], 
                      which can help with gradient flow.
                    </p>
                    <div className="space-y-1 text-xs">
                      <div className="text-green-400">✓ Zero-centered</div>
                      <div className="text-green-400">✓ Symmetric around origin</div>
                      <div className="text-red-400">✗ Still has vanishing gradients</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Training Process</CardTitle>
              <CardDescription>
                Understanding how neural networks learn through backpropagation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Forward Propagation</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">1</span>
                      <span>Input data enters the network</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">2</span>
                      <span>Weighted sums calculated for each neuron</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">3</span>
                      <span>Activation functions applied</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">4</span>
                      <span>Output prediction generated</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Backpropagation</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">1</span>
                      <span>Calculate loss (error) from predictions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">2</span>
                      <span>Compute gradients using chain rule</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">3</span>
                      <span>Propagate gradients backward</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">4</span>
                      <span>Update weights and biases</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-accent/10 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Key Parameters</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Learning Rate:</strong> Controls how big steps to take when updating weights. 
                    Too high = unstable training, too low = slow convergence.
                  </div>
                  <div>
                    <strong>Regularization (Alpha):</strong> Prevents overfitting by penalizing large weights. 
                    Higher values = simpler models, lower values = more complex models.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Training Metrics</CardTitle>
              <CardDescription>
                Understanding what the charts tell us about model performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-blue-400">Loss Curve</h4>
                  <p className="text-xs text-muted-foreground">
                    Shows how prediction error decreases over training iterations. 
                    Should generally trend downward.
                  </p>
                  <div className="bg-blue-500/10 p-3 rounded-lg text-xs">
                    <div>Good: Smooth decrease</div>
                    <div>Bad: Fluctuating or increasing</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-green-400">Accuracy</h4>
                  <p className="text-xs text-muted-foreground">
                    Percentage of correct predictions. Should increase as the model learns 
                    the underlying patterns.
                  </p>
                  <div className="bg-green-500/10 p-3 rounded-lg text-xs">
                    <div>Target: {'>'}80% for simple problems</div>
                    <div>Watch: Sudden drops indicate issues</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-purple-400">Weight Distribution</h4>
                  <p className="text-xs text-muted-foreground">
                    Shows how weights are distributed. Healthy networks have weights 
                    centered around zero.
                  </p>
                  <div className="bg-purple-500/10 p-3 rounded-lg text-xs">
                    <div>Good: Bell curve around 0</div>
                    <div>Bad: Extreme values or skewed</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tips" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Practical Tips</CardTitle>
              <CardDescription>
                Best practices for training neural networks effectively
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-green-400">Do's</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>Start with simple architectures and increase complexity gradually</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>Normalize your input data (zero mean, unit variance)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>Use ReLU activation for hidden layers as default</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>Monitor both training and validation metrics</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>Experiment with different learning rates (0.001, 0.01, 0.1)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-red-400">Don'ts</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">✗</span>
                      <span>Don't make the network too complex initially</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">✗</span>
                      <span>Don't ignore data preprocessing and normalization</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">✗</span>
                      <span>Don't use very high learning rates ({'>'}0.1)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">✗</span>
                      <span>Don't train for too long without validation</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">✗</span>
                      <span>Don't ignore weight initialization strategies</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-secondary/20 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Troubleshooting Common Issues</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong className="text-yellow-400">Loss not decreasing:</strong>
                    <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                      <li>• Try lower learning rate</li>
                      <li>• Check data normalization</li>
                      <li>• Verify loss function choice</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-yellow-400">Overfitting:</strong>
                    <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                      <li>• Increase regularization (alpha)</li>
                      <li>• Reduce network complexity</li>
                      <li>• Add more training data</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NeuralNetworkEducation;
