import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, School, User, BookOpen, Building, Linkedin, Mail } from "lucide-react";


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
             <strong>Simulix</strong> is an immersive educational platform that transforms abstract data science and mathematical concepts into interactive, hands-on learning experiences. Designed for students, educators, and professionals alike, the platform bridges the gap between theoretical knowledge and practical understanding by enabling users to manipulate algorithms, observe real-time outcomes, and dissect complex systems through intuitive visualizations.
            </p>
{/*             <p className="opacity-80 leading-relaxed">
              Currently, the project features visualizations for:
            </p>
            <ul className="list-disc pl-6 opacity-80 space-y-2">
              <li>
                <strong>Simulated Annealing- Traveling salesman problem:</strong> An interactive demonstration of how this 
                probabilistic technique can be used to find approximate global optimums for discrete 
                optimization problems like the Traveling Salesman Problem.
              </li>
              <li>
                <strong>Simulated Annealing- Toy example:</strong> A simple, intuitive visualization of simulated annealing applied to a polynomial optimization problem, helping users grasp the fundamental mechanics of the algorithm.
              </li>
              <li>
                <strong>Alias Method:</strong> A visualization of how to efficiently sample from 
                discrete probability distributions with constant-time complexity.
              </li>
               <li>
                <strong>Bootstrapping:</strong> Interactive demonstration of resampling techniques to estimate confidence intervals for population parameters. Users can adjust sample size, bootstrap iterations, and confidence levels to see how distributions stabilize and intervals tighten.
              </li>
               <li>
                <strong>Huber M-Estimator:</strong> Robust Regression- Interactive exploration of iteratively reweighted least squares (IRLS) for outlier-resistant regression. Adjust tuning constant k to see how weights downvote outliers while preserving efficiency for normal data.
              </li>
            </ul> */}
            <p className="opacity-80 leading-relaxed">
              Each simulator allows users to customize parameters and observe in real-time how 
              these algorithms work, making complex concepts more accessible.
            </p>
          </section>
          
         {/* Author info */}
<section className="glass-panel rounded-xl p-8">
  <h2 className="text-2xl font-medium mb-6">Project Information</h2>
  
  <div className="space-y-6">
    {/* Created by */}
    <div className="flex items-start gap-4">
      <div className="w-8 h-8 bg-accent/30 rounded-lg flex items-center justify-center shrink-0 mt-1">
        <User className="h-4 w-4 text-slate-400" />
      </div>
      <div>
        <h3 className="text-lg font-medium flex items-center gap-2">
          Created by
          <a
            href="https://www.linkedin.com/in/divyanshu-lila"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 inline-flex items-center underline hover:text-blue-400"
            title="LinkedIn Profile"
          >
            {/* LinkedIn SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.026-3.061-1.865-3.061-1.865 0-2.151 1.454-2.151 2.959v5.706h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.562 2.838-1.562 3.036 0 3.6 2 3.6 4.59v5.605z" />
            </svg>
          </a>
        </h3>
        <p className="opacity-80">Divyanshu Lila</p>
        <p className="text-sm opacity-60">ID: 2022A3PS1056G</p>
        <p className="text-sm opacity-60 flex items-center gap-1">
          {/* Email Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 7l9 6 9-6" />
          </svg>
          <a
            href="mailto:f20221056@goa.bits-pilani.ac.in"
            className="underline hover:text-blue-400"
          >
            f20221056@goa.bits-pilani.ac.in
          </a>
        </p>
      </div>
    </div>
    
    {/* Under Guidance Of */}
    <div className="flex items-start gap-4">
      <div className="w-8 h-8 bg-accent/30 rounded-lg flex items-center justify-center shrink-0 mt-1">
        <BookOpen className="h-4 w-4 text-slate-400" />
      </div>
      <div>
        <h3 className="text-lg font-medium">Under Guidance Of</h3>
        <p className="opacity-80">Prof. Sravan Danda</p>
      </div>
    </div>
    
    {/* Institution */}
    <div className="flex items-start gap-4">
      <div className="w-8 h-8 bg-accent/30 rounded-lg flex items-center justify-center shrink-0 mt-1">
        <School className="h-4 w-4 text-slate-400" />
      </div>
      <div>
        <h3 className="text-lg font-medium">Institution</h3>
        <p className="opacity-80">BITS Pilani, K.K. Birla Goa Campus</p>
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
            <Link to="/" className="control-btn-primary flex items-center gap-2">
              Available Visualizations
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
