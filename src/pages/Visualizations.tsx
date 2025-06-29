import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { MoveRight, Search, X, Home, ChartLine, Compass, Atom, BarChart3, Target, TrendingUp, Network, TreePine, Scale, Layers, Settings, Dices, ChevronDown, Sparkles } from "lucide-react";
import FeedbackForm from "@/components/FeedbackForm";
import ContributionForm from "@/components/ContributionForm";

const Visualizations = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [showContribution, setShowContribution] = useState(false);

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

      {/* Enhanced Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-blue-500/5 to-purple-500/5"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-accent/10 to-blue-500/10 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        {/* Content */}
        <div className="relative container px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="relative group inline-block">
              <div className="absolute -inset-1 bg-gradient-to-r from-accent/30 via-blue-500/30 to-purple-500/30 rounded-full blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative inline-flex items-center gap-3 px-8 py-4 glass-panel rounded-full border-2 border-accent/20 group-hover:border-accent/40 transition-all duration-300">
                <ChartLine className="h-6 w-6 text-accent group-hover:scale-110 transition-transform duration-300" />
                <span className="text-lg font-semibold bg-gradient-to-r from-accent via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  All Visualizations
                </span>
                <Sparkles className="h-4 w-4 text-accent/60 group-hover:text-accent transition-colors duration-300" />
              </div>
            </div>

            {/* Main Title */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight">
                <span className="block bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  Complete
                </span>
                <span className="block bg-gradient-to-r from-accent via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Visualization Suite
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground/80 max-w-3xl mx-auto leading-relaxed">
                Explore our comprehensive collection of{" "}
                <span className="text-accent font-semibold">interactive</span>{" "}
                data science and{" "}
                <span className="text-blue-400 font-semibold">machine learning</span>{" "}
                visualizations.
              </p>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <button
                onClick={() => document.getElementById('visualizations-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative inline-flex items-center gap-4 px-10 py-5 text-lg font-semibold rounded-2xl bg-gradient-to-r from-accent/20 via-blue-500/20 to-purple-500/20 border-2 border-accent/30 hover:border-accent/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-accent/30 to-purple-500/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative z-10 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Explore Tools
                </span>
                <ChevronDown className="relative z-10 h-5 w-5 text-accent group-hover:translate-y-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <main id="visualizations-section" className="container px-4 md:px-8 py-16">
        <div className="max-w-6xl mx-auto space-y-12">
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
          
          {/* Visualizations Grid */}
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

          {/* Back to top with animated down arrow */}
          <div className="text-center pt-8">
            <button
              onClick={scrollToTop}
              className="group control-btn-primary inline-flex items-center justify-center gap-3 text-lg px-10 py-5 relative overflow-hidden"
            >
              <span className="relative z-10">Back to Top</span>
              <ChevronDown className="h-6 w-6 transition-transform group-hover:translate-y-1 duration-300 rotate-180" />
              <div className="absolute inset-0 bg-gradient-to-r from-accent/30 to-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </div>
        </div>
      </main>

      {/* New Navigation Footer */}
      <footer className="w-full border-t border-white/5 mt-8">
        <div className="container py-6 px-4 md:px-8">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 text-center">
            <Link
              to="/"
              className="text-sm font-medium opacity-70 hover:opacity-100 hover:text-accent transition-all duration-300 hover:scale-105"
            >
              Home
            </Link>
            <Link
              to="/visualizations"
              className="text-sm font-medium opacity-70 hover:opacity-100 hover:text-accent transition-all duration-300 hover:scale-105"
            >
              All Visualizations
            </Link>
            <Link
              to="/games"
              className="text-sm font-medium opacity-70 hover:opacity-100 hover:text-accent transition-all duration-300 hover:scale-105"
            >
              Games
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium opacity-70 hover:opacity-100 hover:text-accent transition-all duration-300 hover:scale-105"
            >
              About Project
            </Link>
            <Link
              to="/blog"
              className="text-sm font-medium opacity-70 hover:opacity-100 hover:text-accent transition-all duration-300 hover:scale-105"
            >
              Blog
            </Link>
            <button
              onClick={() => setShowFeedback(true)}
              className="text-sm font-medium opacity-70 hover:opacity-100 hover:text-accent transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              Feedback
            </button>
            <button
              onClick={() => setShowContribution(true)}
              className="text-sm font-medium opacity-70 hover:opacity-100 hover:text-accent transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              Contribute
            </button>
          </div>
        </div>
      </footer>

      {/* Original Footer */}
      <footer className="w-full glass-panel border-t border-white/5">
        <div className="container py-4 px-4 md:px-8 text-center opacity-70">
          <p className="text-sm">
            Data Science • Visualizing Algorithms • BITS Pilani, K.K. Birla Goa Campus
          </p>
        </div>
      </footer>

      {/* Forms */}
      <FeedbackForm showFeedback={showFeedback} setShowFeedback={setShowFeedback} />
      <ContributionForm showContribution={showContribution} setShowContribution={setShowContribution} />
    </div>
  );
};

export default Visualizations;
