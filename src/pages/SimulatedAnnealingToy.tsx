
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Home, Info, RotateCcw, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import ToyVisualizationPanel from "@/components/ToyVisualizationPanel";
import { 
  SimulatedAnnealingToyState, 
  ToySimulationParams, 
  runToySimulation,
  getInitialToyState 
} from "@/utils/simulatedAnnealingToy";

const SimulatedAnnealingToy = () => {
  // Simulation state and parameters
  const [state, setState] = useState<SimulatedAnnealingToyState>(getInitialToyState());
  const [params, setParams] = useState<ToySimulationParams>({
    r: 5,
    maxIterations: 100,
    initialTemperature: 1.0,
    coolingRate: 0.95,
    neighborType: 'Single Bit Flip',
    coolingSchedule: 'Geometric',
    coefficients: [1, -2, 3, -1, 2, -1]
  });
  
  // Animation control
  const [isRunning, setIsRunning] = useState(false);
  const animationRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  
  // Run simulation with current parameters
  const runSimulation = useCallback(() => {
    const result = runToySimulation(params);
    setState(result);
  }, [params]);
  
  // Handle parameter changes
  const handleParamChange = useCallback((key: keyof ToySimulationParams, value: any) => {
    setParams(prev => ({ ...prev, [key]: value }));
  }, []);
  
  // Handle coefficient changes
  const handleCoefficientChange = useCallback((index: number, value: number) => {
    setParams(prev => ({
      ...prev,
      coefficients: prev.coefficients.map((coef, i) => i === index ? value : coef)
    }));
  }, []);
  
  // Handle polynomial degree change
  const handleDegreeChange = useCallback((newDegree: number) => {
    setParams(prev => {
      const newCoefficients = Array(newDegree + 1).fill(0);
      for (let i = 0; i < Math.min(prev.coefficients.length, newDegree + 1); i++) {
        newCoefficients[i] = prev.coefficients[i];
      }
      return { ...prev, coefficients: newCoefficients };
    });
  }, []);
  
  // Reset to defaults
  const handleReset = useCallback(() => {
    setParams({
      r: 5,
      maxIterations: 100,
      initialTemperature: 1.0,
      coolingRate: 0.95,
      neighborType: 'Single Bit Flip',
      coolingSchedule: 'Geometric',
      coefficients: [1, -2, 3, -1, 2, -1]
    });
    setIsRunning(false);
    toast.success("Parameters reset to defaults");
  }, []);
  
  // Toggle animation
  const toggleAnimation = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);
  
  // Animation loop for live updates
  useEffect(() => {
    if (!isRunning) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }
    
    const animate = (timestamp: number) => {
      const elapsed = timestamp - lastFrameTimeRef.current;
      
      if (elapsed > 500) { // Update every 500ms
        lastFrameTimeRef.current = timestamp;
        runSimulation();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, runSimulation]);
  
  // Initial simulation run
  useEffect(() => {
    runSimulation();
  }, [params]);
  
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
        {/* Header */}
        <header className="w-full glass-panel border-b border-white/5 mb-8">
          <div className="container py-6 px-4 md:px-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-light tracking-tight">
                Simulated Annealing
                <span className="text-sm ml-3 opacity-70 font-normal">
                  Toy Example
                </span>
              </h1>
              <p className="text-sm opacity-70">Interactive Polynomial Optimization</p>
            </div>
            <Link to="/" className="control-btn flex items-center gap-2 text-sm">
              <Home className="h-4 w-4" />
              Back to Visualizations
            </Link>
          </div>
        </header>
        
        {/* Main content */}
        <main className="container px-4 md:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Visualization Panel - 3 columns */}
            <div className="lg:col-span-3 space-y-6">
              <ToyVisualizationPanel state={state} params={params} />
            </div>
            
            {/* Controls Panel - 1 column */}
            <div className="space-y-6">
              {/* Animation Controls */}
              <Card className="glass-panel border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 opacity-70" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Control the simulation animation and reset parameters</p>
                      </TooltipContent>
                    </Tooltip>
                    Controls
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Button 
                      onClick={toggleAnimation}
                      className={isRunning ? "control-btn-secondary" : "control-btn-primary"}
                      size="sm"
                    >
                      {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      {isRunning ? "Pause" : "Run"}
                    </Button>
                    <Button onClick={handleReset} variant="outline" size="sm">
                      <RotateCcw className="h-4 w-4" />
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Algorithm Parameters */}
              <Card className="glass-panel border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 opacity-70" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Adjust the core parameters of the simulated annealing algorithm</p>
                      </TooltipContent>
                    </Tooltip>
                    Algorithm Parameters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Bits (r) */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label>Bits (r): {params.r}</Label>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 opacity-50" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Number of bits in the solution representation. Higher values increase the search space exponentially.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Slider
                      value={[params.r]}
                      onValueChange={([value]) => handleParamChange('r', value)}
                      min={1}
                      max={10}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  {/* Max Iterations */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label>Max Iterations: {params.maxIterations}</Label>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 opacity-50" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Maximum number of iterations to run the algorithm. More iterations allow for better exploration.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Slider
                      value={[params.maxIterations]}
                      onValueChange={([value]) => handleParamChange('maxIterations', value)}
                      min={10}
                      max={500}
                      step={10}
                      className="w-full"
                    />
                  </div>
                  
                  {/* Initial Temperature */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label>Initial Temp: {params.initialTemperature.toFixed(1)}</Label>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 opacity-50" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Starting temperature. Higher values allow more exploration early in the search.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Slider
                      value={[params.initialTemperature]}
                      onValueChange={([value]) => handleParamChange('initialTemperature', value)}
                      min={0.1}
                      max={10.0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                  
                  {/* Cooling Rate */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label>Cooling Rate: {params.coolingRate.toFixed(2)}</Label>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 opacity-50" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Rate at which temperature decreases. Values closer to 1 cool more slowly.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Slider
                      value={[params.coolingRate]}
                      onValueChange={([value]) => handleParamChange('coolingRate', value)}
                      min={0.5}
                      max={0.99}
                      step={0.01}
                      className="w-full"
                    />
                  </div>
                  
                  {/* Neighbor Type */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label>Neighbor Type</Label>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 opacity-50" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Controls how neighboring solutions are generated during the search.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <RadioGroup
                      value={params.neighborType}
                      onValueChange={(value) => handleParamChange('neighborType', value)}
                      className="grid grid-cols-1 gap-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Single Bit Flip" id="single" />
                        <Label htmlFor="single" className="text-xs">Single Bit Flip</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Two Bit Flip" id="double" />
                        <Label htmlFor="double" className="text-xs">Two Bit Flip</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Random Walk" id="random" />
                        <Label htmlFor="random" className="text-xs">Random Walk</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {/* Cooling Schedule */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label>Cooling Schedule</Label>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 opacity-50" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Determines how the temperature decreases over time.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <RadioGroup
                      value={params.coolingSchedule}
                      onValueChange={(value) => handleParamChange('coolingSchedule', value)}
                      className="grid grid-cols-1 gap-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Geometric" id="geometric" />
                        <Label htmlFor="geometric" className="text-xs">Geometric</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Linear" id="linear" />
                        <Label htmlFor="linear" className="text-xs">Linear</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Logarithmic" id="logarithmic" />
                        <Label htmlFor="logarithmic" className="text-xs">Logarithmic</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
              
              {/* Polynomial Configuration */}
              <Card className="glass-panel border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 opacity-70" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Configure the polynomial function to optimize</p>
                      </TooltipContent>
                    </Tooltip>
                    Polynomial Function
                  </CardTitle>
                  <CardDescription>
                    f(n) = Σ aᵢ × nᵢ
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Polynomial Degree */}
                  <div className="space-y-2">
                    <Label>Degree: {params.coefficients.length - 1}</Label>
                    <Slider
                      value={[params.coefficients.length - 1]}
                      onValueChange={([value]) => handleDegreeChange(value)}
                      min={0}
                      max={8}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  {/* Coefficient Sliders */}
                  <div className="space-y-3">
                    {params.coefficients.map((coef, index) => (
                      <div key={index} className="space-y-1">
                        <Label className="text-xs">a{index}: {coef}</Label>
                        <Slider
                          value={[coef]}
                          onValueChange={([value]) => handleCoefficientChange(index, value)}
                          min={-5}
                          max={5}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Statistics */}
              <Card className="glass-panel border-white/10">
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Best Value:</span>
                    <span className="font-mono">{state.bestValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Best State:</span>
                    <span className="font-mono">{state.bestState}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accepted Worse:</span>
                    <span className="font-mono">{state.acceptedWorse}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Iteration:</span>
                    <span className="font-mono">{state.currentIteration}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Educational Content */}
          <div className="mt-12 max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="glass-panel rounded-xl border-white/10">
              <AccordionItem value="overview">
                <AccordionTrigger className="px-6 text-lg font-medium">
                  Understanding Simulated Annealing: Toy Example
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 space-y-4">
                  <p className="opacity-80 leading-relaxed">
                    This toy example demonstrates simulated annealing on polynomial optimization problems. 
                    The algorithm searches for the maximum value of a polynomial function by exploring 
                    different binary-encoded solutions and gradually focusing on promising regions.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="space-y-2">
                      <h4 className="font-medium">Key Concepts:</h4>
                      <ul className="space-y-1 text-sm opacity-80">
                        <li>• Binary representation of solutions</li>
                        <li>• Temperature-controlled exploration</li>
                        <li>• Acceptance probability for worse moves</li>
                        <li>• Different neighborhood structures</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Applications:</h4>
                      <ul className="space-y-1 text-sm opacity-80">
                        <li>• Combinatorial optimization</li>
                        <li>• Neural network training</li>
                        <li>• Scheduling problems</li>
                        <li>• Circuit design</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="parameters">
                <AccordionTrigger className="px-6 text-lg font-medium">
                  Parameter Guide
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Temperature Parameters:</h4>
                      <ul className="space-y-2 text-sm opacity-80">
                        <li><strong>Initial Temperature:</strong> Controls initial exploration. Higher values allow more random moves.</li>
                        <li><strong>Cooling Rate:</strong> How quickly temperature decreases. Slower cooling allows better exploration.</li>
                        <li><strong>Cooling Schedule:</strong> Pattern of temperature reduction over time.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Search Parameters:</h4>
                      <ul className="space-y-2 text-sm opacity-80">
                        <li><strong>Bits (r):</strong> Solution representation size. More bits = larger search space.</li>
                        <li><strong>Neighbor Type:</strong> How new solutions are generated from current ones.</li>
                        <li><strong>Max Iterations:</strong> How long the algorithm runs.</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="visualization">
                <AccordionTrigger className="px-6 text-lg font-medium">
                  Understanding the Visualizations
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Function Value Evolution:</h4>
                      <p className="text-sm opacity-80">
                        Shows how the solution quality changes over time. The blue line tracks 
                        current values while the green dashed line shows the best found so far.
                      </p>
                      
                      <h4 className="font-medium mb-2 mt-4">Binary State Representation:</h4>
                      <p className="text-sm opacity-80">
                        Heatmap showing how each bit changes over iterations. Dark regions 
                        represent 0 bits, bright regions represent 1 bits.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Acceptance Probability:</h4>
                      <p className="text-sm opacity-80">
                        Shows the probability of accepting worse solutions. High early 
                        (exploration phase), low later (exploitation phase).
                      </p>
                      
                      <h4 className="font-medium mb-2 mt-4">State Space Exploration:</h4>
                      <p className="text-sm opacity-80">
                        Scatter plot of visited solutions colored by iteration. Shows how 
                        the search focuses over time and explores the solution landscape.
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="w-full glass-panel border-t border-white/5 mt-auto">
          <div className="container py-4 px-4 md:px-8 text-center">
            <p className="text-sm opacity-70">
              <span className="inline-block">Applied Statistical Mathematics • Interactive Visualizations</span>
              <span className="mx-2">•</span>
              <span className="inline-block">BITS Pilani, K.K. Birla Goa Campus</span>
            </p>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
};

export default SimulatedAnnealingToy;
