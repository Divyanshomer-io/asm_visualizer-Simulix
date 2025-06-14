
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { MoveRight, Search, X, Home, Gamepad2, Spade, Target } from "lucide-react";

const Games = () => {
  const [searchQuery, setSearchQuery] = useState("");

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
              <Gamepad2 className="h-6 w-6 text-accent" />
              <span className="text-lg font-semibold text-accent">Interactive Games</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold">Educational Gaming Suite</h1>
            <p className="opacity-70 max-w-2xl mx-auto text-lg">
              Learn complex algorithms and statistical concepts through engaging, interactive game-based visualizations.
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

export default Games;
