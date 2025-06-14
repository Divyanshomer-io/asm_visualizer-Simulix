import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MoveRight, Compass, Atom, ChartLine, Code, Dices, BarChart3, Target, Sparkles, Zap, Brain, Network, Spade, Search, BookOpen, Gamepad2, ChevronDown, MapPin } from "lucide-react";
import MobilePopup from "@/components/MobilePopup";
import FeedbackForm from "@/components/FeedbackForm";
import ContributionForm from '@/components/ContributionForm';
import { toast } from 'sonner';

const Landing = () => {
  const [animatedText, setAnimatedText] = useState("Optimization");
  const [showFeedback, setShowFeedback] = useState(false);
  const [showContribution, setShowContribution] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [contributionSubmitted, setContributionSubmitted] = useState(false);
  const keywords = ["Optimization", "Inference", "Regression", "Statistics", "Algorithms", "Visualization"];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedText(prev => {
        const currentIndex = keywords.indexOf(prev);
        return keywords[(currentIndex + 1) % keywords.length];
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const handleFeedbackSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    try {
      const response = await fetch('https://formspree.io/f/mzzgzddo', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        setFeedbackSubmitted(true);
        toast.success('Thank you for your feedback!');
        setTimeout(() => {
          setShowFeedback(false);
          setFeedbackSubmitted(false);
        }, 2000);
      } else {
        toast.error('Failed to send feedback. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to send feedback. Please try again.');
    }
  };

  const closeFeedback = () => {
    setShowFeedback(false);
    setFeedbackSubmitted(false);
  };

  const handleContributionSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const formData = new FormData(form);

  try {
    const response = await fetch('https://formspree.io/f/mzzgzddo', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      setContributionSubmitted(true);
      toast.success('Thank you for your contribution!');
      setTimeout(() => {
        setShowContribution(false);
        setContributionSubmitted(false);
      }, 2000);
    } else {
      toast.error('Failed to send contribution. Please try again.');
    }
  } catch (error) {
    toast.error('Failed to send contribution. Please try again.');
  }
};

const closeContribution = () => {
  setShowContribution(false);
  setContributionSubmitted(false);
};

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToVisualizations = () => {
    document.getElementById('visualizations')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Featured visualizations for the main grid (6 items)
  const featuredVisualizations = [
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
      icon: <Brain className="h-6 w-6" />,
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
  ];

  // Featured games for the games section - ADD NEW GAME HERE
  const featuredGames = [
    {
      id: "qlearning-maze",
      title: "Q-Learning Maze Solver",
      description: "Interactive Q-Learning algorithm visualization with maze editing, real-time training, and policy visualization for reinforcement learning education.",
      path: "/qlearning-maze",
      icon: <Search className="h-6 w-6" />,
      tags: ["Reinforcement Learning", "Q-Learning", "Maze Solving", "Interactive"],
      gradient: "from-teal-500/20 to-cyan-500/20"
    },
    {
      id: "hi-lo-bayesian",
      title: "Hi-Lo Bayesian Visualization",
      description: "Interactive Hi-Lo card game visualization demonstrating Bayesian probability updates and dynamic probability distribution plots for educational reinforcement of Bayesian inference and decision making.",
      path: "/hi-lo-bayesian",
      icon: <Spade className="h-6 w-6" />,
      tags: ["Bayesian Inference", "Probability", "Card Game", "Visualization"],
      gradient: "from-purple-500/20 to-pink-500/20"
    },
    {
      id: "kmeans-game",
      title: "K-Means City Builder",
      description: "Build cities and watch K-means clustering group them in real-time. Learn clustering concepts through interactive city planning and algorithm visualization.",
      path: "/kmeans-game",
      icon: <MapPin className="h-6 w-6" />,
      tags: ["Machine Learning", "Clustering", "K-Means", "City Building", "Interactive"],
      gradient: "from-emerald-500/20 to-blue-500/20"
    },
  ];

  // Featured games for the games section
  const features = [
    {
      icon: <Code className="h-6 w-6" />,
      title: "Interactive Learning",
      description: "Hands-on experience with mathematical concepts through adjustable parameters and real-time visualization.",
      accent: "from-blue-400 to-blue-600"
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Algorithm Exploration",
      description: "Visualize how complex algorithms work with step-by-step processes and intuitive interfaces.",
      accent: "from-purple-400 to-purple-600"
    },
    {
      icon: <ChartLine className="h-6 w-6" />,
      title: "Data Visualization",
      description: "See mathematical concepts come to life with dynamic charts and visual representations of complex data.",
      accent: "from-green-400 to-green-600"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
      {/* Mobile Popup */}
      <MobilePopup />
      
      {/* Enhanced Header with Animation */}
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
              
              <div className="hidden md:flex items-center gap-2 px-4 py-2 glass-panel rounded-full">
                <Sparkles className="h-4 w-4 text-accent animate-pulse" />
                <span className="text-sm font-medium">
                  Advanced <span className="text-accent transition-all duration-500">{animatedText}</span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm opacity-80">
              <Zap className="h-4 w-4 text-accent" />
              <span className="hidden sm:inline">Interactive Data Science</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* Enhanced Hero Section */}
      <section className="container px-4 md:px-8 py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-purple-500/5 rounded-3xl"></div>
        <div className="max-w-4xl mx-auto space-y-8 relative">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gradient-primary leading-tight">
              Explore Data Science Through 
              <span className="block bg-gradient-to-r from-accent via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Interactive Visualizations
              </span>
            </h1>
            
            <p className="text-xl opacity-80 max-w-3xl leading-relaxed">
              Discover and understand complex statistical concepts and algorithms through 
              hands-on, interactive simulations and visualizations designed for deep learning.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link 
              to="/visualizations" 
              className="group control-btn flex items-center justify-center gap-2 text-lg px-8 py-4 hover:border-accent/40"
            >
              <ChartLine className="h-5 w-5 transition-transform group-hover:scale-110 duration-300" />
              <span>Explore Visualizations</span>
            </Link>

            <Link 
              to="/games" 
              className="group control-btn flex items-center justify-center gap-2 text-lg px-8 py-4 hover:border-accent/40"
            >
              <Gamepad2 className="h-5 w-5 transition-transform group-hover:scale-110 duration-300" />
              <span>Explore Games</span>
            </Link>
            
            <Link 
              to="/about" 
              className="group control-btn flex items-center justify-center gap-2 text-lg px-8 py-4 hover:border-accent/40"
            >
              <Atom className="h-5 w-5 transition-transform group-hover:rotate-180 duration-500" />
              <span>About Project</span>
            </Link>

            <Link 
              to="/blog" 
              className="group control-btn flex items-center justify-center gap-2 text-lg px-8 py-4 hover:border-accent/40"
            >
              <BookOpen className="h-5 w-5 transition-transform group-hover:scale-110 duration-300" />
              <span>Blog</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="container px-4 md:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
      </div>
      
      {/* Enhanced Visualizations Section */}
      <section id="visualizations" className="container px-4 md:px-8 py-16">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-3 px-6 py-3 glass-panel rounded-full mb-4">
              <ChartLine className="h-6 w-6 text-accent" />
              <span className="text-lg font-semibold text-accent">Featured Tools</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold">Interactive Visualization Suite</h2>
            <p className="opacity-70 max-w-2xl mx-auto text-lg">
              Explore our most popular interactive modules for learning data science concepts through hands-on simulations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVisualizations.map((visualization, index) => (
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

          {/* Explore More Visualizations Button - Updated with down arrow */}
          <div className="text-center pt-8">
            <Link 
              to="/visualizations"
              className="group control-btn-primary inline-flex items-center justify-center gap-3 text-lg px-10 py-5 relative overflow-hidden"
            >
              <span className="relative z-10">Explore More Visualizations</span>
              <ChevronDown className="h-6 w-6 transition-transform group-hover:translate-y-1 duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-accent/30 to-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="container px-4 md:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
      </div>
      
      {/* Games Section with Updated featuredGames */}
      <section className="container px-4 md:px-8 py-16">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-3 px-6 py-3 glass-panel rounded-full mb-4">
              <Gamepad2 className="h-6 w-6 text-accent" />
              <span className="text-lg font-semibold text-accent">Interactive Games</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold">Educational Gaming Suite</h2>
            <p className="opacity-70 max-w-2xl mx-auto text-lg">
              Learn complex algorithms and statistical concepts through engaging, interactive game-based visualizations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredGames.map((game, index) => (
              <Link 
                key={game.id}
                to={game.path}
                className="group glass-panel p-8 rounded-xl transition-all duration-500 hover:border-primary/40 hover:bg-secondary/30 hover:scale-105 hover:shadow-2xl relative overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${game.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-accent/30 rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent/50 transition-all duration-300 group-hover:scale-110">
                    {game.icon}
                  </div>
                  
                  <h3 className="text-2xl font-semibold mb-4 group-hover:text-primary transition-colors leading-tight">
                    {game.title}
                  </h3>
                  <p className="opacity-70 mb-6 text-base leading-relaxed">
                    {game.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-4 mb-6">
                    {game.tags.map((tag) => (
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
                      Play Game <MoveRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Explore More Games Button - Updated with down arrow */}
          <div className="text-center pt-8">
            <Link 
              to="/games"
              className="group control-btn-primary inline-flex items-center justify-center gap-3 text-lg px-10 py-5 relative overflow-hidden"
            >
              <span className="relative z-10">Explore More Games</span>
              <ChevronDown className="h-6 w-6 transition-transform group-hover:translate-y-1 duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-accent/30 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="container px-4 md:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
      </div>
      
      {/* Enhanced Features Section */}
      <section className="container px-4 md:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-6 py-3 glass-panel rounded-full mb-4">
              <Sparkles className="h-6 w-6 text-accent" />
              <span className="text-lg font-semibold text-accent">Platform Features</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Simulix</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="glass-panel p-6 rounded-xl space-y-4 group hover:scale-105 transition-all duration-500 hover:shadow-xl"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.accent} bg-opacity-20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold group-hover:text-accent transition-colors">
                  {feature.title}
                </h3>
                <p className="opacity-70 leading-relaxed group-hover:opacity-90 transition-opacity">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Project info */}
      <section className="container px-4 md:px-8 py-8">
        <div className="max-w-4xl mx-auto glass-panel p-6 rounded-xl">
          <p className="text-center">
            <span className="opacity-70">Created by </span>
            <span className="font-medium">Divyanshu Lila</span>
          </p>
        </div>
      </section>

      {/* New Navigation Footer */}
      <footer className="w-full border-t border-white/5 mt-8">
        <div className="container py-6 px-4 md:px-8">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 text-center">
            <button
              onClick={scrollToTop}
              className="text-sm font-medium opacity-70 hover:opacity-100 hover:text-accent transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              Home
            </button>
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

      {/* Feedback Modal */}
      <FeedbackForm showFeedback={showFeedback} setShowFeedback={setShowFeedback} />
      {/* Contribution Modal */}
      <ContributionForm showContribution={showContribution} setShowContribution={setShowContribution} />
    </div>
  );
};

export default Landing;
