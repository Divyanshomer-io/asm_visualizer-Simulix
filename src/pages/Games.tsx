import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { MoveRight, Search, X, Home, Gamepad2, Spade, Target, ChevronDown } from "lucide-react";
import FeedbackForm from "@/components/FeedbackForm";
import ContributionForm from '@/components/ContributionForm';

const Games = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [showContribution, setShowContribution] = useState(false);

  const games = [
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
  ];

  // Filter games based on search query
  const filteredGames = useMemo(() => {
    if (!searchQuery.trim()) return games;
    
    const query = searchQuery.toLowerCase();
    return games.filter(game => 
      game.title.toLowerCase().includes(query) ||
      game.description.toLowerCase().includes(query) ||
      game.tags.some(tag => tag.toLowerCase().includes(query))
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
                  <div className="absolute -inset-2 bg-gradient-to-r from-accent/20 via-blue-500/20 to-purple-500/20 rounded-xl blur-xl group-hover:opacity-100 transition-all duration-500"></div>
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
          {/* Enhanced Header Section */}
          <div className="relative">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-cyan-500/5 rounded-3xl blur-3xl"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent rounded-3xl"></div>
            
            {/* Animated Particles */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              <div className="absolute top-10 left-10 w-2 h-2 bg-accent/30 rounded-full animate-pulse"></div>
              <div className="absolute top-20 right-20 w-1 h-1 bg-blue-400/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
              <div className="absolute bottom-10 right-10 w-1 h-1 bg-cyan-400/40 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>

            <div className="relative text-center space-y-8 py-20 px-8">
              {/* Enhanced Badge */}
              <div className="inline-flex items-center gap-3 px-8 py-4 glass-panel rounded-full mb-6 group hover:scale-105 transition-all duration-500 border-2 border-white/10 hover:border-accent/30">
                <div className="relative">
                  <Gamepad2 className="h-7 w-7 text-accent group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-accent/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-accent via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Interactive Games
                </span>
              </div>

              {/* Enhanced Title */}
              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight">
                  <span className="block bg-gradient-to-r from-white via-accent to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
                    Educational
                  </span>
                  <span className="block bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mt-2">
                    Gaming Suite
                  </span>
                </h1>
                
                {/* Enhanced Description */}
                <div className="relative max-w-3xl mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-2xl blur-xl"></div>
                  <p className="relative text-xl md:text-2xl opacity-90 leading-relaxed font-medium">
                    Learn complex algorithms and statistical concepts through 
                    <span className="text-accent font-semibold"> engaging</span>, 
                    <span className="text-blue-400 font-semibold"> interactive </span>
                    game-based visualizations.
                  </p>
                </div>
              </div>

              {/* Interactive Elements */}
              <div className="flex justify-center gap-8 pt-4">
                <div className="w-16 h-1 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full"></div>
                <div className="w-12 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full" style={{ animationDelay: '0.5s' }}></div>
                <div className="w-16 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent rounded-full" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
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
                    {filteredGames.length} game{filteredGames.length !== 1 ? 's' : ''} found
                    {filteredGames.length === 0 && (
                      <span className="block mt-1 text-accent">Try searching for "learning", "bayesian", or "maze"</span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {filteredGames.map((game, index) => (
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

            {/* Coming Soon Card - only show when no search or search doesn't filter it out */}
            {(!searchQuery || "coming soon more games additional concepts algorithms".includes(searchQuery.toLowerCase())) && (
              <div className="glass-panel p-8 rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center text-center space-y-4 min-h-[350px] group hover:border-accent/30 transition-all duration-500">
                <div className="w-16 h-16 bg-accent/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Gamepad2 className="h-8 w-8 opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-2xl font-semibold opacity-70 group-hover:opacity-90 transition-opacity">
                  More Games Coming Soon
                </h3>
                <p className="text-base opacity-50 group-hover:opacity-70 transition-opacity">
                  Additional interactive learning games will be added to expand the educational gaming suite
                </p>
                <div className="flex gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`w-2 h-2 rounded-full bg-accent/30 animate-pulse`} style={{ animationDelay: `${i * 200}ms` }}></div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Show all games with animated down arrow */}
          <div className="text-center pt-8">
            <button
              onClick={scrollToTop}
              className="group control-btn-primary inline-flex items-center justify-center gap-3 text-lg px-10 py-5 relative overflow-hidden"
            >
              <span className="relative z-10">Back to Top</span>
              <ChevronDown className="h-6 w-6 transition-transform group-hover:translate-y-1 duration-300 rotate-180" />
              <div className="absolute inset-0 bg-gradient-to-r from-accent/30 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
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

export default Games;
