
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { MoveRight, Search, X, Home, ChartLine, Compass, Atom, BarChart3, Target, TrendingUp, Network, TreePine, Scale, Layers, Settings, Dices } from "lucide-react";

const Visualizations = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const visualizations = [
    {
      id: "simulated-annealing",
      title: "Simulated Annealing: Traveling Salesman Problem",
      description: "Interactive exploration of the Traveling Salesman Problem using simulated annealing optimization.",
      path: "/simulator",
      icon: <Compass className="h-6 w-6" />,
      tags: ["Optimization", "Metaheuristics", "Combinatorial"],
      gradient: "from-blue-500/20 to-purple-500/20"
    },
    {
      id: "neural-network",
      title: "Neural Network Visualizer",
      description: "Interactive Multi-Layer Perceptron training with real-time weight visualization, activation functions, and performance metrics.",
      path: "/neural-network",
      icon: <Network className="h-6 w-6" />,
      tags: ["Machine Learning", "Deep Learning", "Neural Networks"],
      gradient: "from-violet-500/20 to-fuchsia-500/20"
    },
    {
      id: "deep-rl",
      title: "Deep Reinforcement Learning",
      description: "Deep Q-Networks with experience replay, epsilon-greedy exploration, and neural weight evolution.",
      path: "/deep-rl",
      icon: <Atom className="h-6 w-6" />,
      tags: ["Machine Learning", "Reinforcement Learning", "Q-Learning"],
      gradient: "from-purple-500/20 to-pink-500/20"
    },
    {
      id: "bootstrapping",
      title: "Bootstrapping",
      description: "Understand statistical inference through resampling techniques and confidence interval construction.",
      path: "/bootstrapping",
      icon: <BarChart3 className="h-6 w-6" />,
      tags: ["Statistics", "Resampling", "Inference"],
      gradient: "from-purple-500/20 to-pink-500/20"
    },
    {
      id: "alias-method",
      title: "Alias Method",
      description: "Visualize how to efficiently sample from discrete probability distributions with the Alias Method.",
      path: "/alias-method",
      icon: <Dices className="h-6 w-6" />,
      tags: ["Probability", "Sampling", "Algorithm"],
      gradient: "from-orange-500/20 to-red-500/20"
    },
    {
      id: "huber-mean",
      title: "Huber M-Estimator",
      description: "Explore robust statistical estimation with the Huber M-estimator using IRLS. See how it handles outliers gracefully.",
      path: "/huber-mean",
      icon: <Target className="h-6 w-6" />,
      tags: ["Robust Statistics", "M-Estimators", "IRLS"],
      gradient: "from-cyan-500/20 to-blue-500/20"
    },
    {
      id: "simulated-annealing-toy",
      title: "Simulated Annealing: Toy Example",
      description: "Learn simulated annealing concepts through polynomial optimization with binary-encoded solutions.",
      path: "/simulated-annealing-toy",
      icon: <Settings className="h-6 w-6" />,
      tags: ["Optimization", "Educational", "Binary Encoding"],
      gradient: "from-green-500/20 to-blue-500/20"
    },
    {
      id: "importance-sampling",
      title: "Importance Sampling",
      description: "Explore Standard and Normalized Importance Sampling techniques with interactive visualizations and parameter controls.",
      path: "/importance-sampling",
      icon: <TrendingUp className="h-6 w-6" />,
      tags: ["Monte Carlo", "Sampling", "Statistics"],
      gradient: "from-indigo-500/20 to-teal-500/20"
    },
    {
      id: "random-forest",
      title: "Random Forest Analyzer",
      description: "Comprehensive ensemble learning visualization with feature importance, ROC curves, confusion matrices, and decision tree exploration.",
      path: "/random-forest",
      icon: <TreePine className="h-6 w-6" />,
      tags: ["Machine Learning", "Ensemble Learning", "Classification"],
      gradient: "from-emerald-500/20 to-green-500/20"
    },
    {
      id: "bias-variance",
      title: "Bias-Variance Tradeoff",
      description: "Explore the fundamental tradeoff between bias and variance in machine learning models through polynomial regression visualization.",
      path: "/bias-variance",
      icon: <Scale className="h-6 w-6" />,
      tags: ["Machine Learning", "Model Selection", "Tradeoff Analysis"],
      gradient: "from-pink-500/20 to-rose-500/20"
    },
    {
      id: "low-rank-vae",
      title: "Low-Rank VAE Compression",
      description: "Real-time Variational Autoencoder training with nuclear norm and log-determinant majorizer regularization for latent space compression.",
      path: "/low-rank-vae",
      icon: <Layers className="h-6 w-6" />,
      tags: ["Deep Learning", "VAE", "Compression", "Regularization"],
      gradient: "from-amber-500/20 to-orange-500/20"
    },
  ];

  // Filter visualizations based on search query
  const filteredVisualizations = useMemo(() => {
    if (!searchQuery.trim()) return visualizations;
    
    const query = searchQuery.toLowerCase();
    return visualizations.filter(viz => 
      viz.title.toLowerCase().includes(query) ||
      viz.description.toLowerCase().includes(query) ||
      viz.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
      {/* Header */}
      <header className="w-full glass-panel border-b border-white/5 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container py-6 px-4 md:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4">
                {/* Logo */}
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-accent/20 via-blue-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <img 
                    src="/social-preview.png" 
                    alt="Simulix Logo" 
                    className="relative h-12 w-12 md:h-14 md:w-14 object-contain transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 filter drop-shadow-lg group-hover:drop-shadow-2xl group-hover:brightness-110"
                    style={{
                      filter: 'drop-shadow(0 4px 12px rgba(56, 189, 248, 0.3)) brightness(1.1)'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                </div>
                
                {/* Simulix Text */}
                <div className="relative">
                  <span
                    className="simulix-logo text-3xl md:text-4xl font-black tracking-tight transition-all duration-500 hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, #fff 0%, #38bdf8 50%, #818cf8 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      filter: 'drop-shadow(0 2px 8px rgba(56, 189, 248, 0.3))',
                    }}
                  >
                    Simulix
                  </span>
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="control-btn flex items-center gap-2 text-sm hover:border-accent/40"
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container px-4 md:px-8 py-16">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-3 px-6 py-3 glass-panel rounded-full mb-4">
              <ChartLine className="h-6 w-6 text-accent" />
              <span className="text-lg font-semibold text-accent">All Visualizations</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold">Complete Visualization Suite</h1>
            <p className="opacity-70 max-w-2xl mx-auto text-lg">
              Explore our comprehensive collection of interactive data science and machine learning visualizations.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative glass-panel rounded-2xl p-1 border-2 border-white/10 group-hover:border-accent/30 transition-all duration-300">
                <div className="relative flex items-center">
                  <div className="absolute left-4 z-10">
                    <Search className="h-5 w-5 text-accent/70 group-hover:text-accent transition-colors duration-300" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, description, or tags..."
                    className="w-full bg-transparent pl-12 pr-12 py-4 text-lg placeholder:text-muted-foreground/60 focus:outline-none focus:placeholder:text-muted-foreground/40 transition-all duration-300"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-4 z-10 p-1 rounded-full hover:bg-accent/20 transition-colors duration-200 group/clear"
                    >
                      <X className="h-4 w-4 text-muted-foreground group-hover/clear:text-accent transition-colors" />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Search results count */}
              {searchQuery && (
                <div className="mt-3 text-center">
                  <span className="text-sm text-muted-foreground">
                    {filteredVisualizations.length} visualization{filteredVisualizations.length !== 1 ? 's' : ''} found
                    {filteredVisualizations.length === 0 && (
                      <span className="block mt-1 text-accent">Try searching for "optimization", "statistics", or "sampling"</span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVisualizations.map((visualization, index) => (
              <Link 
                key={visualization.id}
                to={visualization.path}
                className="group glass-panel p-6 rounded-xl transition-all duration-500 hover:border-primary/40 hover:bg-secondary/30 hover:scale-105 hover:shadow-2xl relative overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${visualization.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-accent/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/50 transition-all duration-300 group-hover:scale-110">
                    {visualization.icon}
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors leading-tight">
                    {visualization.title}
                  </h3>
                  <p className="opacity-70 mb-4 text-sm leading-relaxed">
                    {visualization.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-4 mb-6">
                    {visualization.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="bg-secondary/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium border border-white/10 hover:border-accent/30 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-end">
                    <span className="text-sm flex items-center gap-1 text-primary group-hover:gap-3 transition-all duration-300 font-medium">
                      Launch Tool <MoveRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full glass-panel border-t border-white/5">
        <div className="container py-4 px-4 md:px-8 text-center opacity-70">
          <p className="text-sm">
            Data Science • Visualizing Algorithms • BITS Pilani, K.K. Birla Goa Campus
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Visualizations;
