
import React from 'react';
import { Brain, Target, Zap, TrendingUp, BarChart3 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const LowRankVAEEducation = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 glass-panel">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="theory">VAE Theory</TabsTrigger>
          <TabsTrigger value="regularization">Regularization</TabsTrigger>
          <TabsTrigger value="implementation">Implementation</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-8">
          <div className="glass-panel p-8 rounded-xl space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Brain className="h-8 w-8 text-accent" />
              <h2 className="text-3xl font-bold">Low-Rank VAE Overview</h2>
            </div>
            
            <div className="space-y-4 text-lg leading-relaxed">
              <p>
                Low-Rank Variational Autoencoders (VAEs) combine the power of variational autoencoders 
                with rank regularization techniques to learn efficient, compressed representations of data. 
                This approach is particularly effective for dimensionality reduction and data compression tasks.
              </p>
              
              <p>
                By enforcing low-rank constraints on the latent representations, these models can discover 
                the most important underlying factors in the data while maintaining reconstruction quality. 
                This leads to more interpretable and structured latent spaces.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="glass-panel p-6 rounded-lg border border-accent/20">
                  <h3 className="text-xl font-semibold mb-3 text-accent">Key Benefits</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Efficient data compression</li>
                    <li>• Structured latent representations</li>
                    <li>• Improved generalization</li>
                    <li>• Noise robustness</li>
                    <li>• Interpretable features</li>
                  </ul>
                </div>
                
                <div className="glass-panel p-6 rounded-lg border border-accent/20">
                  <h3 className="text-xl font-semibold mb-3 text-accent">Applications</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Image compression</li>
                    <li>• Anomaly detection</li>
                    <li>• Data denoising</li>
                    <li>• Feature extraction</li>
                    <li>• Dimensionality reduction</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="theory" className="mt-8">
          <div className="glass-panel p-8 rounded-xl space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Target className="h-8 w-8 text-accent" />
              <h2 className="text-3xl font-bold">VAE Theory</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-accent">Variational Autoencoders</h3>
                <p className="text-lg leading-relaxed mb-4">
                  VAEs are generative models that learn to encode data into a latent space and decode it back. 
                  The key innovation is treating the encoding as a probability distribution rather than a 
                  deterministic mapping.
                </p>
                
                <div className="glass-panel p-6 rounded-lg bg-accent/5 border border-accent/20">
                  <h4 className="text-lg font-semibold mb-3">VAE Loss Function</h4>
                  <p className="font-mono text-sm mb-2">
                    L = Reconstruction Loss + KL Divergence
                  </p>
                  <p className="text-sm opacity-80">
                    Where KL divergence encourages the latent distribution to match a prior (usually standard normal)
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-accent">Encoder-Decoder Architecture</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="glass-panel p-6 rounded-lg border border-accent/20">
                    <h4 className="text-lg font-semibold mb-3">Encoder Network</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Convolutional layers for feature extraction</li>
                      <li>• Maps input to latent mean (μ) and variance (σ²)</li>
                      <li>• Parameterizes posterior distribution q(z|x)</li>
                    </ul>
                  </div>
                  
                  <div className="glass-panel p-6 rounded-lg border border-accent/20">
                    <h4 className="text-lg font-semibold mb-3">Decoder Network</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Transposed convolutions for upsampling</li>
                      <li>• Reconstructs input from latent sample</li>
                      <li>• Parameterizes likelihood p(x|z)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="regularization" className="mt-8">
          <div className="glass-panel p-8 rounded-xl space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="h-8 w-8 text-accent" />
              <h2 className="text-3xl font-bold">Rank Regularization</h2>
            </div>
            
            <div className="space-y-6">
              <p className="text-lg leading-relaxed">
                Rank regularization encourages the latent representations to have low rank, 
                leading to more structured and efficient encodings. Two main approaches are implemented:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-lg border border-blue-400/20">
                  <h3 className="text-xl font-semibold mb-4 text-blue-400">Nuclear Norm Regularization</h3>
                  <div className="space-y-3">
                    <p className="text-sm">
                      The nuclear norm is the sum of singular values of a matrix, serving as a convex 
                      relaxation of the rank function.
                    </p>
                    <div className="bg-blue-400/10 p-3 rounded font-mono text-sm">
                      ||Z||* = Σᵢ σᵢ(Z)
                    </div>
                    <p className="text-sm opacity-80">
                      Where σᵢ are the singular values of the latent matrix Z
                    </p>
                  </div>
                </div>
                
                <div className="glass-panel p-6 rounded-lg border border-purple-400/20">
                  <h3 className="text-xl font-semibold mb-4 text-purple-400">Log-Det Majorizer</h3>
                  <div className="space-y-3">
                    <p className="text-sm">
                      A smooth approximation to the rank function using the log-determinant 
                      of the Gram matrix.
                    </p>
                    <div className="bg-purple-400/10 p-3 rounded font-mono text-sm">
                      L(Z) = Σᵢ σᵢ(Z) / (σᵢ(Z) + ε)
                    </div>
                    <p className="text-sm opacity-80">
                      Provides a differentiable approximation to rank minimization
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="glass-panel p-6 rounded-lg bg-accent/5 border border-accent/20">
                <h4 className="text-lg font-semibold mb-3">Combined Loss Function</h4>
                <div className="font-mono text-sm mb-2">
                  L_total = L_reconstruction + β * L_KL + λ * L_rank
                </div>
                <p className="text-sm opacity-80">
                  The rank regularization term is added to the standard VAE loss with weight λ
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="implementation" className="mt-8">
          <div className="glass-panel p-8 rounded-xl space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="h-8 w-8 text-accent" />
              <h2 className="text-3xl font-bold">Implementation Details</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-accent">Network Architecture</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Encoder</h4>
                    <div className="glass-panel p-4 rounded-lg font-mono text-sm space-y-1">
                      <div>Conv2d(1, 16, 5×5, stride=2)</div>
                      <div>Conv2d(16, 32, 5×5, stride=2)</div>
                      <div>Linear(512, 300)</div>
                      <div>Linear(300, latent_dim) → μ</div>
                      <div>Linear(300, latent_dim) → log σ²</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Decoder</h4>
                    <div className="glass-panel p-4 rounded-lg font-mono text-sm space-y-1">
                      <div>Linear(latent_dim, 300)</div>
                      <div>Linear(300, 512)</div>
                      <div>ConvTranspose2d(32, 16, 5×5, stride=2)</div>
                      <div>ConvTranspose2d(16, 1, 5×5, stride=2)</div>
                      <div>ConvTranspose2d(1, 1, 4×4)</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-accent">Training Process</h3>
                <div className="space-y-4">
                  <div className="glass-panel p-6 rounded-lg border border-accent/20">
                    <h4 className="text-lg font-semibold mb-3">Reparameterization Trick</h4>
                    <p className="text-sm mb-2">
                      To enable backpropagation through the stochastic latent variable:
                    </p>
                    <div className="font-mono text-sm bg-accent/10 p-3 rounded">
                      z = μ + σ ⊙ ε, where ε ~ N(0, I)
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="glass-panel p-4 rounded-lg border border-green-400/20">
                      <h5 className="font-semibold text-green-400 mb-2">Step 1</h5>
                      <p className="text-sm">Encode input to get μ and σ²</p>
                    </div>
                    <div className="glass-panel p-4 rounded-lg border border-blue-400/20">
                      <h5 className="font-semibold text-blue-400 mb-2">Step 2</h5>
                      <p className="text-sm">Sample z using reparameterization</p>
                    </div>
                    <div className="glass-panel p-4 rounded-lg border border-purple-400/20">
                      <h5 className="font-semibold text-purple-400 mb-2">Step 3</h5>
                      <p className="text-sm">Decode z and compute loss</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="applications" className="mt-8">
          <div className="glass-panel p-8 rounded-xl space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="h-8 w-8 text-accent" />
              <h2 className="text-3xl font-bold">Real-World Applications</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-lg border border-accent/20">
                <h3 className="text-xl font-semibold mb-4 text-accent">Image Processing</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                    <div>
                      <strong>Compression:</strong> Efficient lossy compression with controllable quality-size tradeoffs
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                    <div>
                      <strong>Denoising:</strong> Remove noise while preserving important image features
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                    <div>
                      <strong>Inpainting:</strong> Fill missing regions in images with plausible content
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="glass-panel p-6 rounded-lg border border-accent/20">
                <h3 className="text-xl font-semibold mb-4 text-accent">Data Analysis</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                    <div>
                      <strong>Anomaly Detection:</strong> Identify outliers by reconstruction error
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
                    <div>
                      <strong>Feature Learning:</strong> Discover meaningful representations in high-dimensional data
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-pink-400 rounded-full mt-2"></div>
                    <div>
                      <strong>Clustering:</strong> Group similar data points in the latent space
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="glass-panel p-6 rounded-lg border border-accent/20">
                <h3 className="text-xl font-semibold mb-4 text-accent">Medical Imaging</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                    <div>
                      <strong>MRI Reconstruction:</strong> Accelerate scanning by reconstructing from undersampled data
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                    <div>
                      <strong>Pathology Detection:</strong> Identify abnormal patterns in medical scans
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="glass-panel p-6 rounded-lg border border-accent/20">
                <h3 className="text-xl font-semibold mb-4 text-accent">Scientific Computing</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2"></div>
                    <div>
                      <strong>Simulation Data:</strong> Compress and analyze large-scale simulation outputs
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-teal-400 rounded-full mt-2"></div>
                    <div>
                      <strong>Signal Processing:</strong> Extract meaningful patterns from noisy signals
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="glass-panel p-6 rounded-lg bg-accent/5 border border-accent/20 mt-8">
              <h3 className="text-xl font-semibold mb-3 text-accent">Why Low-Rank Matters</h3>
              <p className="text-sm leading-relaxed">
                In many real-world datasets, the underlying structure is much simpler than the raw data suggests. 
                Low-rank constraints help models discover this intrinsic structure, leading to better generalization, 
                more interpretable representations, and efficient storage. This is particularly valuable when working 
                with limited computational resources or when interpretability is crucial.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LowRankVAEEducation;
