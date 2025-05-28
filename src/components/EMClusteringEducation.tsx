
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Target, Zap, BookOpen } from "lucide-react";

const EMClusteringEducation: React.FC = () => {
  return (
    <div className="w-full">
      <Tabs defaultValue="algorithm" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8 bg-secondary/20">
          <TabsTrigger value="algorithm" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            EM Algorithm
          </TabsTrigger>
          <TabsTrigger value="clustering" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Clustering
          </TabsTrigger>
          <TabsTrigger value="convergence" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Convergence
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Applications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="algorithm" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-panel border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">Expectation-Maximization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p className="text-muted-foreground">
                  The EM algorithm is an iterative method for finding maximum likelihood estimates 
                  in models with latent variables, particularly useful for Gaussian Mixture Models.
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-accent">E-Step (Expectation)</h4>
                  <p className="text-muted-foreground">
                    Calculate the probability that each data point belongs to each cluster 
                    (responsibilities) based on current parameters.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-accent">M-Step (Maximization)</h4>
                  <p className="text-muted-foreground">
                    Update cluster parameters (means and covariances) to maximize the 
                    likelihood given the current responsibilities.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">Mathematical Foundation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-semibold text-accent">Responsibility Calculation</h4>
                  <div className="bg-secondary/20 p-3 rounded font-mono text-xs">
                    r(i,k) = N(x_i | μ_k, Σ_k) / Σ_j N(x_i | μ_j, Σ_j)
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-accent">Parameter Updates</h4>
                  <div className="bg-secondary/20 p-3 rounded font-mono text-xs space-y-1">
                    <div>μ_k = Σ_i r(i,k) * x_i / Σ_i r(i,k)</div>
                    <div>Σ_k = Σ_i r(i,k) * (x_i - μ_k)(x_i - μ_k)^T / Σ_i r(i,k)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clustering" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-panel border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">Gaussian Mixture Models</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p className="text-muted-foreground">
                  GMMs assume data comes from a mixture of Gaussian distributions. Each cluster 
                  is represented by a multivariate Gaussian with its own mean and covariance.
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-accent">Cluster Representation</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li><strong>Mean (μ):</strong> Center of the cluster</li>
                    <li><strong>Covariance (Σ):</strong> Shape and orientation</li>
                    <li><strong>Weight (π):</strong> Relative size of the cluster</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-accent">Soft Assignment</h4>
                  <p className="text-muted-foreground">
                    Unlike K-means, EM provides probabilistic cluster assignments, allowing 
                    points to belong to multiple clusters with different probabilities.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">3D vs 2D Visualization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-semibold text-accent">3D Gaussian Surfaces</h4>
                  <p className="text-muted-foreground">
                    Shows the probability density functions as 3D surfaces, with height 
                    representing the likelihood of a point belonging to each cluster.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-accent">2D Contour Evolution</h4>
                  <p className="text-muted-foreground">
                    Displays cluster boundaries as contour lines and shows how cluster 
                    centers move during the iterative optimization process.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-accent">Visual Elements</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Data points colored by true clusters</li>
                    <li>Cluster centers marked with X symbols</li>
                    <li>Confidence ellipses showing uncertainty</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="convergence" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-panel border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">Convergence Criteria</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p className="text-muted-foreground">
                  The algorithm converges when cluster parameters stabilize, indicating 
                  that further iterations won't significantly improve the model.
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-accent">Mean Shift Threshold</h4>
                  <p className="text-muted-foreground">
                    Convergence is detected when the maximum change in cluster means 
                    falls below 1e-4, indicating parameter stability.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-accent">Iteration Limits</h4>
                  <p className="text-muted-foreground">
                    Maximum iteration limits prevent infinite loops in cases where 
                    perfect convergence isn't achieved.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-accent">Local Optima</h4>
                  <p className="text-muted-foreground">
                    EM can converge to local optima. Good initialization and multiple 
                    runs with different starting points can help find better solutions.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">Algorithm Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-semibold text-accent">Guaranteed Improvement</h4>
                  <p className="text-muted-foreground">
                    Each EM iteration is guaranteed to increase (or maintain) the 
                    likelihood function, ensuring monotonic convergence.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-accent">Computational Complexity</h4>
                  <p className="text-muted-foreground">
                    Time complexity is O(n×k×d²×i) where n=samples, k=clusters, 
                    d=dimensions, i=iterations.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-accent">Sensitivity</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Initialization can affect final results</li>
                    <li>Number of clusters must be specified</li>
                    <li>Assumes Gaussian distributions</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-panel border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">Machine Learning</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li><strong>Unsupervised Learning:</strong> Customer segmentation</li>
                  <li><strong>Dimensionality Reduction:</strong> Feature extraction</li>
                  <li><strong>Anomaly Detection:</strong> Outlier identification</li>
                  <li><strong>Semi-supervised Learning:</strong> Label propagation</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="glass-panel border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">Computer Vision</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li><strong>Image Segmentation:</strong> Object boundary detection</li>
                  <li><strong>Background Subtraction:</strong> Motion detection</li>
                  <li><strong>Color Quantization:</strong> Palette reduction</li>
                  <li><strong>Feature Matching:</strong> Object recognition</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="glass-panel border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">Data Science</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li><strong>Market Research:</strong> Consumer behavior analysis</li>
                  <li><strong>Bioinformatics:</strong> Gene expression clustering</li>
                  <li><strong>Finance:</strong> Risk assessment modeling</li>
                  <li><strong>Natural Language:</strong> Topic modeling</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-panel border-white/10">
            <CardHeader>
              <CardTitle className="text-lg">Advanced Techniques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-semibold text-accent">Model Selection</h4>
                  <p className="text-muted-foreground">
                    Use information criteria (AIC, BIC) to determine optimal number of clusters. 
                    Cross-validation can help assess model generalization.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-accent">Regularization</h4>
                  <p className="text-muted-foreground">
                    Add small values to covariance diagonal to prevent singular matrices. 
                    Prior distributions can provide Bayesian regularization.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EMClusteringEducation;
