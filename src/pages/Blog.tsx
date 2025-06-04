import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MoveRight, Sparkles, Zap, BookOpen, Users, Target, ArrowRight, MessageSquare, Home } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FeedbackForm from '@/components/FeedbackForm';

const Blog = () => {
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
      {/* Header - Same as Landing page */}
      <header className="w-full glass-panel border-b border-white/5 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container py-6 px-4 md:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="relative">
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
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-lg blur opacity-0 hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              </Link>
              <div className="hidden md:flex items-center gap-2 px-4 py-2 glass-panel rounded-full">
                <BookOpen className="h-4 w-4 text-accent animate-pulse" />
                <span className="text-sm font-medium">
                  <span className="text-accent">Blog</span> & Insights
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="group flex items-center gap-2 px-4 py-2 glass-panel rounded-full hover:border-accent/40 transition-all duration-300 hover:scale-105"
              >
                <Home className="h-4 w-4 text-accent/80 group-hover:text-accent transition-colors" />
                <span className="text-sm font-medium group-hover:text-accent transition-colors">
                  Back to Home
                </span>
              </Link>
              <div className="flex items-center gap-2 text-sm opacity-80">
                <Zap className="h-4 w-4 text-accent" />
                <span className="hidden sm:inline">Interactive Data Science</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container px-4 md:px-8 py-16 md:py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-purple-500/5 rounded-3xl"></div>
        <div className="max-w-4xl mx-auto text-center space-y-8 relative">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-6 py-3 glass-panel rounded-full mb-4">
              <BookOpen className="h-6 w-6 text-accent" />
              <span className="text-lg font-semibold text-accent">Simulix Blog</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gradient-primary leading-tight">
              Interactive Data Science 
              <span className="block bg-gradient-to-r from-accent via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Visualizations for Every Learner
              </span>
            </h1>
            
            <p className="text-xl opacity-80 max-w-3xl mx-auto leading-relaxed">
              Explore our journey, methodology, and vision for making data science education more accessible, 
              interactive, and engaging for learners at every level.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Content with Tabs */}
      <section className="container px-4 md:px-8 pb-16">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="why-simulix" className="w-full">
            <TabsList className="grid w-full grid-cols-5 glass-panel p-2 h-auto">
              <TabsTrigger value="why-simulix" className="text-xs md:text-sm px-2 py-3">
                Why Simulix?
              </TabsTrigger>
              <TabsTrigger value="unique-features" className="text-xs md:text-sm px-2 py-3">
                What Makes Us Unique?
              </TabsTrigger>
              <TabsTrigger value="exploration" className="text-xs md:text-sm px-2 py-3">
                Exploring & Learning
              </TabsTrigger>
              <TabsTrigger value="community" className="text-xs md:text-sm px-2 py-3">
                Teaching & Growing
              </TabsTrigger>
              <TabsTrigger value="get-involved" className="text-xs md:text-sm px-2 py-3">
                Get Involved
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Why Simulix? */}
            <TabsContent value="why-simulix" className="mt-8">
              <div className="glass-panel p-8 rounded-xl space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="h-8 w-8 text-accent" />
                  <h2 className="text-3xl font-bold">Why Simulix?</h2>
                </div>
                
                <h3 className="text-2xl font-semibold text-accent mb-4">
                  Bridging the Gap Between Theory and Practice
                </h3>
                
                <div className="space-y-4 text-lg leading-relaxed opacity-90">
                  <p>
                    Data science and machine learning are reshaping the world, but for many students and beginners, 
                    the leap from textbook theory to practical understanding can be daunting. Concepts like bootstrapping, 
                    simulated annealing, or neural networks often feel abstract—difficult to truly grasp without seeing them in action.
                  </p>
                  
                  <p>
                    Simulix was born out of this challenge. What started as a college project under the mentorship of 
                    <span className="text-accent font-medium"> Prof. Sravan Danda</span> has grown into a comprehensive 
                    learning platform designed to make data science visual, interactive, and accessible. Our mission is simple: 
                    help learners not just read about algorithms, but explore, experiment, and build intuition through hands-on visualizations.
                  </p>
                  
                  <p>
                    Whether you're a student seeking clarity, an educator looking for dynamic teaching tools, or a beginner 
                    curious about the world of data science, Simulix is built for you.
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Tab 2: What Makes Simulix Unique? */}
            <TabsContent value="unique-features" className="mt-8">
              <div className="glass-panel p-8 rounded-xl space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="h-8 w-8 text-accent" />
                  <h2 className="text-3xl font-bold">What Makes Simulix Unique?</h2>
                </div>
                
                <h3 className="text-2xl font-semibold text-accent mb-6">
                  A Platform Designed for Exploration and Understanding
                </h3>
                
                <div className="grid gap-6">
                  <div className="glass-panel p-6 rounded-lg border border-accent/20">
                    <h4 className="text-xl font-semibold mb-3 text-accent">1. Interactive Visualizations</h4>
                    <p className="opacity-90 leading-relaxed">
                      Simulix transforms algorithms and statistical methods into living, interactive experiences. 
                      Every visualization responds instantly to your input—change a parameter, and watch the results 
                      update in real time. This hands-on approach helps you see the cause-and-effect relationships 
                      that underpin data science.
                    </p>
                  </div>
                  
                  <div className="glass-panel p-6 rounded-lg border border-accent/20">
                    <h4 className="text-xl font-semibold mb-3 text-accent">2. Embedded Educational Support</h4>
                    <p className="opacity-90 leading-relaxed">
                      Each tool comes with built-in educational tabs, offering clear explanations, step-by-step guides, 
                      and real-world context. No more getting lost in jargon—Simulix breaks down complex ideas into 
                      approachable lessons.
                    </p>
                  </div>
                  
                  <div className="glass-panel p-6 rounded-lg border border-accent/20">
                    <h4 className="text-xl font-semibold mb-3 text-accent">3. Wide Topic Coverage</h4>
                    <p className="opacity-90 leading-relaxed">
                      From foundational statistics like bootstrapping and the Huber M-Estimator to advanced topics 
                      like simulated annealing and deep reinforcement learning, Simulix covers a broad spectrum of 
                      data science concepts.
                    </p>
                  </div>
                  
                  <div className="glass-panel p-6 rounded-lg border border-accent/20">
                    <h4 className="text-xl font-semibold mb-3 text-accent">4. Designed for All Learners</h4>
                    <p className="opacity-90 leading-relaxed">
                      No coding skills required. Simulix is accessible to everyone, whether you're just starting out 
                      or teaching a classroom of advanced students. The platform's intuitive design supports diverse 
                      learning styles and needs.
                    </p>
                  </div>
                  
                  <div className="glass-panel p-6 rounded-lg border border-accent/20">
                    <h4 className="text-xl font-semibold mb-3 text-accent">5. Community-Driven and Continuously Improving</h4>
                    <p className="opacity-90 leading-relaxed">
                      We listen to our users. Simulix evolves with your feedback, ensuring the platform stays relevant, 
                      effective, and up-to-date with the latest in data science education.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Tab 3: Exploring Visualizations */}
            <TabsContent value="exploration" className="mt-8">
              <div className="glass-panel p-8 rounded-xl space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Zap className="h-8 w-8 text-accent" />
                  <h2 className="text-3xl font-bold">Exploring Visualizations and Learning in Simulix</h2>
                </div>
                
                <h3 className="text-2xl font-semibold text-accent mb-6">
                  A Deep Dive Into the Simulix Experience
                </h3>
                
                <p className="text-lg opacity-90 leading-relaxed mb-6">
                  Simulix isn't just a collection of charts—it's an environment built for active learning. 
                  Here's how we make every concept come alive:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-lg border border-accent/20">
                      <h4 className="text-xl font-semibold mb-3 text-accent">Interactive Visualizations</h4>
                      <p className="opacity-90 leading-relaxed">
                        Every visualization is dynamic. Adjust parameters—like sample size, learning rate, or algorithm 
                        settings—and instantly see the impact. This real-time feedback loop transforms abstract math 
                        into something you can see and understand.
                      </p>
                    </div>
                    
                    <div className="glass-panel p-6 rounded-lg border border-accent/20">
                      <h4 className="text-xl font-semibold mb-3 text-accent">Control Panel</h4>
                      <p className="opacity-90 leading-relaxed">
                        Each visualization features a powerful, user-friendly control panel. Use sliders, input fields, 
                        toggles, and buttons to customize your exploration. Want to see how a neural network responds 
                        to different learning rates? The control panel makes it easy.
                      </p>
                    </div>
                    
                    <div className="glass-panel p-6 rounded-lg border border-accent/20">
                      <h4 className="text-xl font-semibold mb-3 text-accent">Educational Tabs</h4>
                      <p className="opacity-90 leading-relaxed">
                        Alongside every visualization, you'll find educational tabs that break down the theory, methodology, 
                        and practical applications. These guides are written for all levels—whether you're new to data 
                        science or brushing up on advanced topics.
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-lg border border-accent/20">
                      <h4 className="text-xl font-semibold mb-3 text-accent">Tooltips and Info Icons</h4>
                      <p className="opacity-90 leading-relaxed">
                        Never get stuck wondering what something means. Hover over info icons or chart elements to reveal 
                        concise explanations and definitions. Tooltips are strategically placed to provide just-in-time 
                        learning as you explore.
                      </p>
                    </div>
                    
                    <div className="glass-panel p-6 rounded-lg border border-accent/20">
                      <h4 className="text-xl font-semibold mb-3 text-accent">Hover Interactions</h4>
                      <p className="opacity-90 leading-relaxed">
                        Many visualizations highlight key data points or transitions when you hover over them. See which 
                        weights are most active in a neural network, or which bootstrap samples are outliers. These 
                        interactions help you focus on what matters most.
                      </p>
                    </div>
                    
                    <div className="glass-panel p-6 rounded-lg border border-accent/20">
                      <h4 className="text-xl font-semibold mb-3 text-accent">Designed for Experimentation</h4>
                      <p className="opacity-90 leading-relaxed">
                        Simulix encourages you to play, test, and discover. Try different scenarios, compare theory with 
                        simulation, and build your own intuition. This is learning by doing—at its best.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Tab 4: Learning, Teaching, and Growing */}
            <TabsContent value="community" className="mt-8">
              <div className="glass-panel p-8 rounded-xl space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Users className="h-8 w-8 text-accent" />
                  <h2 className="text-3xl font-bold">Learning, Teaching, and Growing with Simulix</h2>
                </div>
                
                <h3 className="text-2xl font-semibold text-accent mb-6">
                  Empowering Students, Educators, and Beginners
                </h3>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="glass-panel p-6 rounded-lg border border-accent/20">
                    <h4 className="text-xl font-semibold mb-4 text-accent">For Students</h4>
                    <p className="opacity-90 leading-relaxed">
                      Simulix turns abstract concepts into visual, interactive experiences. You can experiment freely, 
                      see instant results, and develop a true understanding—no advanced math or programming required.
                    </p>
                  </div>
                  
                  <div className="glass-panel p-6 rounded-lg border border-accent/20">
                    <h4 className="text-xl font-semibold mb-4 text-accent">For Educators</h4>
                    <p className="opacity-90 leading-relaxed">
                      Bring your lectures to life. Use Simulix to demonstrate algorithms in real time, adjust parameters 
                      on the fly, and help students visualize the "why" behind the math. The platform's clarity and 
                      interactivity make it a perfect companion for classroom teaching.
                    </p>
                  </div>
                  
                  <div className="glass-panel p-6 rounded-lg border border-accent/20">
                    <h4 className="text-xl font-semibold mb-4 text-accent">For Beginners</h4>
                    <p className="opacity-90 leading-relaxed">
                      Every visualization is paired with clear explanations and guided learning. Start with the basics, 
                      explore at your own pace, and build confidence as you go.
                    </p>
                  </div>
                </div>
                
                <div className="glass-panel p-6 rounded-lg border border-accent/20 mt-8">
                  <h4 className="text-xl font-semibold mb-4 text-accent">A Community of Learners</h4>
                  <p className="opacity-90 leading-relaxed">
                    Simulix is more than a tool—it's a growing community. Share feedback, suggest new features, or even 
                    contribute content and code. We believe learning is a collaborative journey.
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Tab 5: Get Involved */}
            <TabsContent value="get-involved" className="mt-8">
              <div className="glass-panel p-8 rounded-xl space-y-8">
                <div className="flex items-center gap-3 mb-6">
                  <ArrowRight className="h-8 w-8 text-accent" />
                  <h2 className="text-3xl font-bold">Get Involved</h2>
                </div>
                
                <h3 className="text-2xl font-semibold text-accent mb-6">
                  Ready to Explore?
                </h3>
                
                <p className="text-lg opacity-90 leading-relaxed mb-8">
                  Simulix is constantly evolving, and your participation makes it better. Here's how you can get involved:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="glass-panel p-6 rounded-lg border border-accent/20">
                    <h4 className="text-xl font-semibold mb-3 text-accent">Try the Visualizations</h4>
                    <p className="opacity-90 leading-relaxed mb-4">
                      Dive into our library and start experimenting with data science concepts.
                    </p>
                  </div>
                  
                  <div className="glass-panel p-6 rounded-lg border border-accent/20">
                    <h4 className="text-xl font-semibold mb-3 text-accent">Give Feedback</h4>
                    <p className="opacity-90 leading-relaxed mb-4">
                      Found a bug or have an idea? We value your input and use it to improve the platform.
                    </p>
                  </div>
                  
                  <div className="glass-panel p-6 rounded-lg border border-accent/20">
                    <h4 className="text-xl font-semibold mb-3 text-accent">Contribute</h4>
                    <p className="opacity-90 leading-relaxed mb-4">
                      Interested in coding, writing, or outreach? Join us in building new visualizations and educational content.
                    </p>
                  </div>
                  
                  <div className="glass-panel p-6 rounded-lg border border-accent/20">
                    <h4 className="text-xl font-semibold mb-3 text-accent">Spread the Word</h4>
                    <p className="opacity-90 leading-relaxed mb-4">
                      Share Simulix with classmates, colleagues, or anyone eager to learn.
                    </p>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    to="/" 
                    className="group control-btn-primary flex items-center justify-center gap-2 text-lg px-8 py-4 relative overflow-hidden"
                  >
                    <span className="relative z-10">Start Exploring Visualizations</span>
                    <MoveRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </Link>
                  
                  <button 
                    onClick={() => setShowFeedback(true)}
                    className="group control-btn flex items-center justify-center gap-2 text-lg px-8 py-4 hover:border-accent/40"
                  >
                    <MessageSquare className="h-5 w-5 transition-transform group-hover:scale-110" />
                    <span>Send Feedback</span>
                  </button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Feedback Modal */}
      <FeedbackForm showFeedback={showFeedback} setShowFeedback={setShowFeedback} />

      {/* Footer */}
      <footer className="w-full glass-panel border-t border-white/5 mt-16">
        <div className="container py-4 px-4 md:px-8 text-center opacity-70">
          <p className="text-sm">
            Data Science • Visualizing Algorithms • BITS Pilani, K.K. Birla Goa Campus
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Blog;
