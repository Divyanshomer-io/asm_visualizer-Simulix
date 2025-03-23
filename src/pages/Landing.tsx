
import React from "react";
import { Link } from "react-router-dom";
import { MoveRight, GraduationCap, User, Code, Lightbulb } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
      {/* Header */}
      <header className="w-full glass-panel border-b border-white/5">
        <div className="container py-6 px-4 md:px-8">
          <h1 className="text-2xl md:text-3xl font-light tracking-tight">
            Simulated Annealing
            <span className="text-sm ml-3 opacity-70 font-normal">
              Algorithm Visualization Project
            </span>
          </h1>
        </div>
      </header>
      
      {/* Hero section */}
      <section className="container px-4 md:px-8 py-16 md:py-24">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gradient-primary">
            Traveling Salesman Problem Solver
          </h1>
          
          <p className="text-xl opacity-80 max-w-3xl">
            An interactive visualization of the Simulated Annealing algorithm applied to the classic Traveling Salesman Problem.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link to="/simulator" className="control-btn-primary flex items-center justify-center gap-2">
              Launch Simulator
              <MoveRight className="h-4 w-4" />
            </Link>
            
            <Link to="/about" className="control-btn flex items-center justify-center gap-2">
              About Project
              <User className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section className="container px-4 md:px-8 py-16 bg-secondary/20 rounded-3xl my-8">
        <div className="max-w-4xl mx-auto space-y-12">
          <h2 className="text-3xl font-semibold text-center">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-6 rounded-xl space-y-4">
              <div className="w-12 h-12 bg-accent/30 rounded-lg flex items-center justify-center">
                <Code className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium">Interactive Canvas</h3>
              <p className="opacity-70">Add cities to the map and see the algorithm find optimal paths in real-time.</p>
            </div>
            
            <div className="glass-panel p-6 rounded-xl space-y-4">
              <div className="w-12 h-12 bg-accent/30 rounded-lg flex items-center justify-center">
                <Lightbulb className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium">Algorithmic Insight</h3>
              <p className="opacity-70">Visualize how simulated annealing converges toward an optimal solution over time.</p>
            </div>
            
            <div className="glass-panel p-6 rounded-xl space-y-4">
              <div className="w-12 h-12 bg-accent/30 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium">Educational Tool</h3>
              <p className="opacity-70">Perfect for understanding heuristic algorithms and optimization problems.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Project info */}
      <section className="container px-4 md:px-8 py-8">
        <div className="max-w-4xl mx-auto glass-panel p-6 rounded-xl">
          <p className="text-center">
            <span className="opacity-70">Created by </span>
            <span className="font-medium">Divyanshu Lila</span>
            <span className="text-sm opacity-50 ml-2">2022A3PS1056G</span>
          </p>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="w-full glass-panel border-t border-white/5 mt-16">
        <div className="container py-4 px-4 md:px-8 text-center opacity-70">
          <p className="text-sm">
            ASM Project • Visualizing Algorithms • BITS Pilani, K.K. Birla Goa Campus
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
