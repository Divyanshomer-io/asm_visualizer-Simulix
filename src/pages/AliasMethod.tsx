
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Home, Play, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Types for the Alias Method visualization
type AliasMethodState = {
  probs: number[];
  probTable: number[];
  aliasTable: number[];
  empiricalFrequencies: number[];
  sampleSize: number;
  isAnimating: boolean;
  highlightedItem: number | null;
};

const AliasMethod = () => {
  // Initial probabilities
  const initialProbs = [0.3, 0.1, 0.1, 0.25, 0.25];
  
  // State for the visualization
  const [state, setState] = useState<AliasMethodState>({
    probs: [...initialProbs],
    probTable: [],
    aliasTable: [],
    empiricalFrequencies: [],
    sampleSize: 1000,
    isAnimating: false,
    highlightedItem: null
  });
  
  // Canvas references
  const originalDistRef = useRef<HTMLCanvasElement>(null);
  const probTableRef = useRef<HTMLCanvasElement>(null);
  const aliasTableRef = useRef<HTMLCanvasElement>(null);
  const empiricalDistRef = useRef<HTMLCanvasElement>(null);
  
  // Function to normalize probabilities
  const normalizeProbs = useCallback((probs: number[]) => {
    const sum = probs.reduce((acc, val) => acc + val, 0);
    if (sum === 0) {
      toast.error("Sum of probabilities cannot be zero");
      return probs.map(() => 1 / probs.length); // Uniform distribution
    }
    return probs.map(p => p / sum);
  }, []);
  
  // Create the alias tables
  const createAliasTables = useCallback((probs: number[]) => {
    const n = probs.length;
    const scaledProbs = probs.map(p => p * n);
    const probTable = new Array(n).fill(0);
    const aliasTable = new Array(n).fill(0);
    
    const small: number[] = [];
    const large: number[] = [];
    
    // Split items into small and large
    for (let i = 0; i < n; i++) {
      if (scaledProbs[i] < 1) {
        small.push(i);
      } else {
        large.push(i);
      }
    }
    
    while (small.length > 0 && large.length > 0) {
      const s = small.pop()!;
      const l = large.pop()!;
      
      probTable[s] = scaledProbs[s];
      aliasTable[s] = l;
      
      scaledProbs[l] -= (1 - scaledProbs[s]);
      
      if (scaledProbs[l] < 1) {
        small.push(l);
      } else {
        large.push(l);
      }
    }
    
    // Handle remaining elements due to floating point errors
    for (const l of large) {
      probTable[l] = 1;
    }
    for (const s of small) {
      probTable[s] = 1;
    }
    
    return { probTable, aliasTable };
  }, []);
  
  // Initialize the state
  useEffect(() => {
    const normalized = normalizeProbs([...initialProbs]);
    const { probTable, aliasTable } = createAliasTables(normalized);
    
    setState(prev => ({
      ...prev,
      probs: normalized,
      probTable,
      aliasTable,
      empiricalFrequencies: new Array(normalized.length).fill(0)
    }));
  }, [createAliasTables, normalizeProbs]);
  
  // Draw bar chart
  const drawBarChart = useCallback((
    canvas: HTMLCanvasElement | null, 
    data: number[], 
    color: string, 
    title: string, 
    maxValue: number = 1.05,
    isAliasTable: boolean = false,
    aliasTable: number[] = [],
    highlightIndex: number | null = null
  ) => {
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw title
    ctx.fillStyle = 'white';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, canvas.width / 2, 20);
    
    // Draw axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.moveTo(40, 40);
    ctx.lineTo(40, canvas.height - 40);
    ctx.lineTo(canvas.width - 40, canvas.height - 40);
    ctx.stroke();
    
    // Y-axis label
    if (!isAliasTable) {
      ctx.save();
      ctx.translate(15, canvas.height / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.fillText(isAliasTable ? '' : 'Probability', 0, 0);
      ctx.restore();
    }
    
    // X-axis label
    ctx.textAlign = 'center';
    ctx.fillText('Item ID', canvas.width / 2, canvas.height - 10);
    
    // Calculate bar width and spacing
    const n = data.length;
    const barWidth = (canvas.width - 80) / n;
    const barPadding = barWidth * 0.1;
    
    // Draw the bars
    for (let i = 0; i < n; i++) {
      const x = 40 + i * barWidth + barPadding / 2;
      const barHeight = isAliasTable ? 
        (canvas.height - 100) : // Full height for alias table
        ((canvas.height - 80) * data[i] / maxValue); // Scaled height for other charts
      const y = canvas.height - 40 - barHeight;
      
      // Highlight selected bar
      if (highlightIndex === i) {
        ctx.fillStyle = 'rgba(255, 215, 0, 0.8)'; // Gold for highlight
      } else {
        ctx.fillStyle = color;
      }
      
      // Draw the bar
      ctx.fillRect(x, y, barWidth - barPadding, barHeight);
      
      // Draw x-axis labels
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText(`${i + 1}`, x + (barWidth - barPadding) / 2, canvas.height - 25);
      
      // Draw alias values for the alias table
      if (isAliasTable) {
        ctx.fillStyle = 'rgba(255, 0, 0, 1)';
        ctx.textAlign = 'center';
        ctx.fillText(`→ ${aliasTable[i] + 1}`, x + (barWidth - barPadding) / 2, y + barHeight / 2);
      }
      
      // Draw bar value
      if (!isAliasTable) {
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(data[i].toFixed(2), x + (barWidth - barPadding) / 2, y - 5);
      }
    }
    
    // Draw expected line for empirical distribution
    if (title.includes("Empirical") && state.probs.length === data.length) {
      ctx.strokeStyle = 'rgba(255, 0, 0, 1)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let i = 0; i < n; i++) {
        const x = 40 + i * barWidth + barWidth / 2;
        const y = canvas.height - 40 - (canvas.height - 80) * state.probs[i] / maxValue;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
      
      // Add a legend
      ctx.fillStyle = color;
      ctx.fillRect(canvas.width - 120, 40, 15, 15);
      ctx.fillStyle = 'white';
      ctx.textAlign = 'left';
      ctx.fillText('Sampled', canvas.width - 100, 52);
      
      ctx.strokeStyle = 'rgba(255, 0, 0, 1)';
      ctx.beginPath();
      ctx.moveTo(canvas.width - 120, 70);
      ctx.lineTo(canvas.width - 105, 70);
      ctx.stroke();
      ctx.fillStyle = 'white';
      ctx.fillText('Expected', canvas.width - 100, 72);
    }
  }, [state.probs]);
  
  // Update the visualizations
  useEffect(() => {
    // Draw the original distribution
    drawBarChart(
      originalDistRef.current,
      state.probs,
      'rgba(54, 162, 235, 0.5)', // Blue
      '1. Original Distribution (P_i)',
      1.05
    );
    
    // Draw the probability table
    drawBarChart(
      probTableRef.current,
      state.probTable,
      'rgba(75, 192, 192, 0.5)', // Green
      '2. Probability Table (Prob[j])',
      1.05
    );
    
    // Draw the alias table
    drawBarChart(
      aliasTableRef.current,
      new Array(state.probs.length).fill(1),
      'rgba(220, 220, 220, 0.3)', // Light gray
      '3. Alias Table (Alias[j])',
      1.05,
      true,
      state.aliasTable
    );
    
    // Draw the empirical distribution
    drawBarChart(
      empiricalDistRef.current,
      state.empiricalFrequencies,
      'rgba(255, 159, 64, 0.5)', // Orange
      '4. Empirical vs. Expected Distribution',
      1.05,
      false,
      [],
      state.highlightedItem
    );
  }, [state, drawBarChart]);
  
  // Sample from the alias method
  const sample = useCallback((size: number = 1): number[] => {
    const { probTable, aliasTable } = state;
    const n = probTable.length;
    const samples: number[] = [];
    
    for (let i = 0; i < size; i++) {
      const bucket = Math.floor(Math.random() * n);
      const coinFlip = Math.random();
      const outcome = coinFlip < probTable[bucket] ? bucket : aliasTable[bucket];
      samples.push(outcome);
    }
    
    return samples;
  }, [state]);
  
  // Handle probability slider changes
  const handleProbChange = (index: number, value: number) => {
    const newProbs = [...state.probs];
    newProbs[index] = value;
    
    const normalizedProbs = normalizeProbs(newProbs);
    const { probTable, aliasTable } = createAliasTables(normalizedProbs);
    
    setState({
      ...state,
      probs: normalizedProbs,
      probTable,
      aliasTable,
      empiricalFrequencies: new Array(normalizedProbs.length).fill(0)
    });
  };
  
  // Handle resample button click
  const handleResample = () => {
    const samples = sample(state.sampleSize);
    const counts: Record<number, number> = {};
    
    samples.forEach(s => {
      counts[s] = (counts[s] || 0) + 1;
    });
    
    const frequencies = state.probs.map((_, i) => (counts[i] || 0) / state.sampleSize);
    
    setState({
      ...state,
      empiricalFrequencies: frequencies,
      highlightedItem: null
    });
    
    toast.success(`Generated ${state.sampleSize} samples`);
  };
  
  // Handle sample one button click
  const handleSampleOne = () => {
    if (state.isAnimating) return;
    
    setState({ ...state, isAnimating: true });
    
    const sample = Math.floor(Math.random() * state.probs.length);
    const coinFlip = Math.random();
    const outcome = coinFlip < state.probTable[sample] ? sample : state.aliasTable[sample];
    
    // Highlight the outcome
    setState(prev => ({
      ...prev,
      isAnimating: true,
      highlightedItem: outcome
    }));
    
    // Reset after animation
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        isAnimating: false,
        highlightedItem: null
      }));
    }, 1000);
    
    toast.success(`Sampled item ${outcome + 1}`);
  };
  
  // Handle reset button click
  const handleReset = () => {
    const normalized = normalizeProbs([...initialProbs]);
    const { probTable, aliasTable } = createAliasTables(normalized);
    
    setState({
      probs: normalized,
      probTable,
      aliasTable,
      empiricalFrequencies: new Array(normalized.length).fill(0),
      sampleSize: 1000,
      isAnimating: false,
      highlightedItem: null
    });
    
    toast.info("Probabilities reset to default");
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
      {/* Header */}
      <header className="w-full glass-panel border-b border-white/5 mb-6">
        <div className="container py-6 px-4 md:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-light tracking-tight">
              Alias Method
              <span className="text-sm ml-3 opacity-70 font-normal">
                Visualization
              </span>
            </h1>
            <p className="text-sm opacity-70">Discrete Probability Sampling</p>
          </div>
          <Link to="/" className="control-btn flex items-center gap-2 text-sm">
            <Home className="h-4 w-4" />
            Back to Visualizations
          </Link>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container px-4 md:px-8 pb-16">
        {/* Improved layout with visualization and controls side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Visualization panel - takes up 2/3 of the space on large screens */}
          <div className="lg:col-span-2 glass-panel p-4 rounded-xl">
            <h2 className="text-xl font-medium mb-4">Alias Method Visualization</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original Distribution Canvas */}
              <div className="glass-panel p-2 rounded-lg">
                <canvas 
                  ref={originalDistRef} 
                  width={350} 
                  height={250} 
                  className="w-full h-auto"
                ></canvas>
              </div>
              
              {/* Probability Table Canvas */}
              <div className="glass-panel p-2 rounded-lg">
                <canvas 
                  ref={probTableRef} 
                  width={350} 
                  height={250} 
                  className="w-full h-auto"
                ></canvas>
              </div>
              
              {/* Alias Table Canvas */}
              <div className="glass-panel p-2 rounded-lg">
                <canvas 
                  ref={aliasTableRef} 
                  width={350} 
                  height={250} 
                  className="w-full h-auto"
                ></canvas>
              </div>
              
              {/* Empirical Distribution Canvas */}
              <div className="glass-panel p-2 rounded-lg">
                <canvas 
                  ref={empiricalDistRef} 
                  width={350} 
                  height={250} 
                  className="w-full h-auto"
                ></canvas>
              </div>
            </div>
          </div>
          
          {/* Controls panel - takes up 1/3 of the space on large screens */}
          <div className="glass-panel p-4 rounded-xl">
            <h2 className="text-xl font-medium mb-4">Controls</h2>
            
            {/* Probability sliders */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-medium">Probability Settings</h3>
              {state.probs.map((prob, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between">
                    <label className="block text-sm opacity-70">
                      P{index + 1}
                    </label>
                    <span className="text-sm font-medium">{prob.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={prob}
                    onChange={(e) => handleProbChange(index, parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
            
            {/* Sample size slider */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <label className="block text-sm opacity-70">
                  Sample Size
                </label>
                <span className="text-sm font-medium">{state.sampleSize}</span>
              </div>
              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                value={state.sampleSize}
                onChange={(e) => setState({ ...state, sampleSize: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
            
            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={handleSampleOne}
                disabled={state.isAnimating}
                className="control-btn-primary w-full flex items-center justify-center gap-2 py-3"
              >
                <Play className="h-4 w-4" />
                Sample One (Animate)
              </button>
              
              <button
                onClick={handleResample}
                className="control-btn w-full flex items-center justify-center gap-2 py-3"
              >
                Resample (Batch)
              </button>
              
              <button
                onClick={handleReset}
                className="control-btn-secondary w-full flex items-center justify-center gap-2 py-3"
              >
                <RotateCcw className="h-4 w-4" />
                Reset Probabilities
              </button>
            </div>
          </div>
        </div>
        
        {/* Description and explanation in collapsible accordion */}
        <div className="glass-panel p-6 rounded-xl mb-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="explanation" className="border-white/10">
              <AccordionTrigger className="text-xl font-medium">
                The Magic of Weighted Chance: Understanding the Alias Method
              </AccordionTrigger>
              <AccordionContent className="text-base opacity-90 space-y-4 pt-4">
                <p>
                  Have you ever wondered how games generate random loot drops with different rarities, or simulate the outcome of a complex dice roll where some results are more likely than others? The 'Alias Method' is a brilliant technique for doing exactly that, super fast!
                </p>
                
                <h3 className="text-lg font-medium mt-6">What is the Alias Method?</h3>
                <p>
                  Imagine you have a mysterious dice with 5 sides, but each side has a different chance of landing up (e.g., side 1 is super rare, side 5 is common). The Alias Method is a clever way to 'roll' this dice perfectly according to those unequal chances, without slowing down your game even if you need to roll it a million times!
                </p>
                
                <h3 className="text-lg font-medium mt-6">The Secret: Two Special Tables</h3>
                <p>
                  Before we start rolling, the Alias Method prepares two secret tables from your desired probabilities. Think of them like a cheat sheet for our weighted dice:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li><strong>The Probability Table:</strong> For each side of our dice, this tells us how much of that side's 'slot' it claims for itself.</li>
                  <li><strong>The Alias Table:</strong> This is the 'backup plan'. If our random pick for a slot doesn't land on that slot's own item, this table tells us which other item to pick instead.</li>
                </ul>
                
                <h3 className="text-lg font-medium mt-6">How to Play: Rolling the Weighted Dice (Sampling)</h3>
                <p>
                  Once the tables are ready, rolling our weighted dice is incredibly simple and fast:
                </p>
                <ol className="list-decimal pl-6 space-y-2 mt-2">
                  <li><strong>Pick a Random Slot:</strong> We randomly choose one of our 5 dice sides (slots).</li>
                  <li><strong>Flip a Virtual Coin:</strong> For that chosen slot, we flip a virtual coin.</li>
                  <li><strong>Decide!</strong>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>If the coin lands on the 'lucky' side (below the Probability Table's value for that slot), we get the item of that slot.</li>
                      <li>Otherwise, if the coin lands on the 'unlucky' side, we get the item specified by the 'Alias Table' for that slot!</li>
                    </ul>
                  </li>
                </ol>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="how-to-use" className="border-white/10">
              <AccordionTrigger className="text-xl font-medium">
                How to Use This Simulator
              </AccordionTrigger>
              <AccordionContent className="text-base opacity-90 space-y-4 pt-4">
                <ul className="list-disc pl-6 space-y-3">
                  <li>
                    <strong>Adjust Item Probabilities (P1-P5 sliders):</strong> Change the likelihood of each item (or dice side) appearing. 
                    Watch how the 'Probability Table' and 'Alias Table' magically reconfigure themselves!
                  </li>
                  <li>
                    <strong>'Sample One (Animate)':</strong> Click this to see a single weighted dice roll in action! 
                    Follow the highlights: first, a random slot is picked, then the 'coin flip' decides, and finally, 
                    the resulting item is briefly highlighted.
                  </li>
                  <li>
                    <strong>'Resample (Batch)':</strong> Click this to quickly simulate thousands of rolls. 
                    Observe how the 'Sampled Frequency' (orange bars) gets closer to the 'Expected Probability' (red line) 
                    as you increase the 'Samples' slider – that's the law of large numbers in action!
                  </li>
                  <li>
                    <strong>'Reset Probabilities':</strong> Go back to the initial weighted dice setup.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="technical" className="border-white/10">
              <AccordionTrigger className="text-xl font-medium">
                Technical Details
              </AccordionTrigger>
              <AccordionContent className="text-base opacity-90 space-y-4 pt-4">
                <h3 className="text-lg font-medium">Construction Algorithm</h3>
                <p>
                  The Alias Method uses a preprocessing step to construct two tables:
                </p>
                <ol className="list-decimal pl-6 space-y-2 mt-2">
                  <li>Scale all probabilities by multiplying by n (number of outcomes).</li>
                  <li>Divide outcomes into two groups: those with scaled probability &lt; 1 ("small") and those with scaled probability ≥ 1 ("large").</li>
                  <li>While both groups have elements:
                    <ul className="list-disc pl-6 mt-2 mb-2">
                      <li>Take one element s from "small" and one element l from "large".</li>
                      <li>Set Prob[s] = scaled probability of s.</li>
                      <li>Set Alias[s] = l.</li>
                      <li>Subtract (1 - scaled probability of s) from the scaled probability of l.</li>
                      <li>If l's new scaled probability is &lt; 1, move it to "small", otherwise keep it in "large".</li>
                    </ul>
                  </li>
                  <li>Any remaining elements in either group are assigned Prob[i] = 1.</li>
                </ol>
                
                <h3 className="text-lg font-medium mt-4">Sampling Algorithm</h3>
                <p>The sampling process is O(1) time complexity per sample:</p>
                <ol className="list-decimal pl-6 space-y-2 mt-2">
                  <li>Generate a random integer j between 0 and n-1.</li>
                  <li>Generate a random real number r between 0 and 1.</li>
                  <li>If r &lt; Prob[j], return j.</li>
                  <li>Otherwise, return Alias[j].</li>
                </ol>
                
                <p className="mt-4">
                  The efficiency comes from the fact that we've pre-computed all the necessary values,
                  allowing each sample to be generated with just two random numbers and a single comparison.
                </p>
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
  );
};

export default AliasMethod;
