
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, School, User, BookOpen, Building } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
      {/* Header */}
      <header className="w-full glass-panel border-b border-white/5 mb-8">
        <div className="container py-6 px-4 md:px-8 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-light tracking-tight">
            About Project
          </h1>
          <Link to="/" className="control-btn flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container px-4 md:px-8 pb-16">
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Project description */}
          <section className="glass-panel rounded-xl p-8 space-y-6">
            <h2 className="text-2xl font-medium">Project Overview</h2>
            <p className="opacity-80 leading-relaxed">
              This project presents an interactive visualization of the Simulated Annealing algorithm
              applied to the Traveling Salesman Problem. It demonstrates how a probabilistic technique
              can be used to find an approximate global optimum for a discrete optimization problem.
            </p>
            <p className="opacity-80 leading-relaxed">
              The simulator allows users to place cities on a map, customize algorithm parameters,
              and observe in real-time how the algorithm evolves to find increasingly better solutions.
            </p>
          </section>
          
          {/* Author info */}
          <section className="glass-panel rounded-xl p-8">
            <h2 className="text-2xl font-medium mb-6">Project Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-accent/30 rounded-lg flex items-center justify-center shrink-0 mt-1">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Student</h3>
                  <p className="opacity-80">Divyanshu Lila</p>
                  <p className="text-sm opacity-60">ID: 2022A3PS1056G</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-accent/30 rounded-lg flex items-center justify-center shrink-0 mt-1">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Under Guidance Of</h3>
                  <p className="opacity-80">Prof. Sravan Danda</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-accent/30 rounded-lg flex items-center justify-center shrink-0 mt-1">
                  <School className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Institution</h3>
                  <p className="opacity-80">BITS Pilani, K.K. Birla Goa Campus</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-accent/30 rounded-lg flex items-center justify-center shrink-0 mt-1">
                  <Building className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Course</h3>
                  <p className="opacity-80">ASM Project - Algorithm Visualization</p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Navigation buttons */}
          <div className="flex justify-center gap-4">
            <Link to="/" className="control-btn flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <Link to="/simulator" className="control-btn-primary flex items-center gap-2">
              Launch Simulator
            </Link>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="w-full glass-panel border-t border-white/5 mt-auto">
        <div className="container py-4 px-4 md:px-8 text-center">
          <p className="text-sm opacity-70">
            ASM Project • Visualizing Algorithms • BITS Pilani, K.K. Birla Goa Campus
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;
